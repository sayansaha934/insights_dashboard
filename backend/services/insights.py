from config import config
import sqlite3
import pandas as pd
import numpy as np
from scipy.stats import zscore


class InsightService:
    def __init__(self):
        pass

    def detect_anomalous_customers(self, z_threshold: float = 2.0):
        """
        Detect customers with anomalous behavior based on negative sentiment tickets.
        """
        conn = sqlite3.connect(config.DB_PATH)

        # Fetch support tickets with sentiment scores
        tickets = self._fetch_support_tickets_with_sentiment(conn)
        conn.close()

        if tickets.empty:
            return []

        # Process and detect anomalies
        tickets = self._label_negative_sentiment(tickets)
        negative_counts = self._count_negative_tickets(tickets)
        anomalies = self._filter_anomalous_customers(negative_counts, z_threshold)

        return anomalies

    def _fetch_support_tickets_with_sentiment(self, conn):
        """
        Fetch support tickets with sentiment scores from the database.
        """
        return pd.read_sql(
            """
            SELECT st.customer_id, c.customer_name, st.sentiment_score
            FROM support_tickets st
            JOIN customers c ON st.customer_id = c.customer_id
            WHERE st.sentiment_score IS NOT NULL
            """,
            conn,
        )

    def _label_negative_sentiment(self, tickets):
        """
        Label tickets with negative sentiment (sentiment score < 0.4).
        """
        tickets["is_negative"] = tickets["sentiment_score"] < 0.4
        return tickets

    def _count_negative_tickets(self, tickets):
        """
        Count the number of negative sentiment tickets per customer.
        """
        return (
            tickets.groupby(["customer_id", "customer_name"])["is_negative"]
            .sum()
            .reset_index()
            .rename(columns={"is_negative": "negative_ticket_count"})
        )

    def _filter_anomalous_customers(self, negative_counts, z_threshold):
        """
        Compute Z-scores for negative ticket counts and filter anomalous customers.
        """
        negative_counts["z_score"] = zscore(negative_counts["negative_ticket_count"])
        anomalies = negative_counts[negative_counts["z_score"] > z_threshold]
        return anomalies.sort_values("z_score", ascending=False).to_dict(orient="records")

    def highlight_trending_products(self, threshold: float = 0.5):
        """
        Highlight products with rapidly increasing or decreasing sales trends.
        """
        conn = sqlite3.connect(config.DB_PATH)

        # Fetch sales and product data
        sales = self._fetch_sales_data(conn)
        products = self._fetch_product_data(conn)
        conn.close()

        if sales.empty:
            return {"rising_trends": [], "falling_trends": []}

        # Process and calculate trends
        sales = self._prepare_sales_data(sales)
        monthly_sales = self._group_sales_by_product_and_month(sales)
        trends = self._calculate_trends(monthly_sales, threshold)

        # Add product names to trends
        trends = self._add_product_names_to_trends(trends, products)

        # Separate rising and falling trends
        rising = [t for t in trends if t["trend"] == "increasing"]
        falling = [t for t in trends if t["trend"] == "decreasing"]

        return {"rising_trends": rising, "falling_trends": falling}

    def _fetch_sales_data(self, conn):
        """
        Fetch sales data with product_id and transaction_date from the database.
        """
        return pd.read_sql(
            """
            SELECT product_id, transaction_date, sale_amount
            FROM sales_transactions
            """,
            conn,
        )

    def _fetch_product_data(self, conn):
        """
        Fetch product details from the database.
        """
        return pd.read_sql(
            """
            SELECT product_id, product_name
            FROM products
            """,
            conn,
        )

    def _prepare_sales_data(self, sales):
        """
        Convert transaction_date to datetime and extract the month.
        """
        sales["transaction_date"] = pd.to_datetime(sales["transaction_date"])
        sales["month"] = sales["transaction_date"].dt.to_period("M").astype(str)
        return sales

    def _group_sales_by_product_and_month(self, sales):
        """
        Group sales data by product and month, summing up sale amounts.
        """
        return sales.groupby(["product_id", "month"])["sale_amount"].sum().reset_index()

    def _calculate_trends(self, monthly_sales, threshold):
        """
        Calculate sales trends (increasing or decreasing) for each product.
        """
        latest_month = monthly_sales["month"].max()
        prev_months = [(pd.Period(latest_month) - i).strftime("%Y-%m") for i in range(1, 4)]
        recent_month = pd.Period(latest_month).strftime("%Y-%m")

        trends = []

        for product_id, group in monthly_sales.groupby("product_id"):
            group = group.set_index("month")
            recent = group.loc[recent_month]["sale_amount"] if recent_month in group.index else 0
            past_avg = (
                group.loc[group.index.isin(prev_months)]["sale_amount"].mean()
                if any(m in group.index for m in prev_months)
                else 0
            )

            # Avoid division by zero
            if past_avg == 0:
                continue

            pct_change = (recent - past_avg) / past_avg

            if pct_change >= threshold:
                trends.append(
                    {
                        "product_id": product_id,
                        "trend": "increasing",
                        "change": round(pct_change, 2),
                    }
                )
            elif pct_change <= -threshold:
                trends.append(
                    {
                        "product_id": product_id,
                        "trend": "decreasing",
                        "change": round(pct_change, 2),
                    }
                )

        return trends

    def _add_product_names_to_trends(self, trends, products):
        """
        Add product names to the trends based on product_id.
        """
        product_names = products.set_index("product_id")["product_name"].to_dict()
        for trend in trends:
            trend["product_name"] = product_names.get(trend["product_id"], "Unknown")
        return trends
