from config import config
import sqlite3
import pandas as pd
import numpy as np


class CustomerService:
    def __init__(self):
        # Initialize the CustomerService class
        pass

    def get_customers(self, search=None):
        """
        Fetch a list of customers from the database.
        Optionally filter by a search term matching customer_name, region, or industry.
        """
        conn = sqlite3.connect(config.DB_PATH)
        query = """
        SELECT * FROM customers
        WHERE (customer_name LIKE ? OR region LIKE ? OR industry LIKE ?)
        """
        params = (
            [f"%{search}%", f"%{search}%", f"%{search}%"] if search else ["%", "%", "%"]
        )

        df = pd.read_sql(query, conn, params=params)
        conn.close()
        return df.to_dict(orient="records")

    def get_customer_profile(self, customer_id: str):
        """
        Fetch detailed profile information for a specific customer.
        Includes customer details, sales summary, support summary, charts, and AI insights.
        """
        conn = sqlite3.connect(config.DB_PATH)

        # Fetch data from various sources
        customer = self._fetch_customer_details(conn, customer_id)
        sales = self._fetch_sales_data(conn, customer_id)
        tickets = self._fetch_support_tickets(conn, customer_id)
        max_ltv = self.generate_max_ltv_threshold(conn)

        # Process data into summaries and insights
        sales_summary = self._calculate_sales_summary(sales, max_ltv)
        support_summary = self._calculate_support_summary(tickets)
        charts = self._generate_charts(sales, tickets)
        top_category = self._determine_top_category(conn, sales)
        ai_insights = self._generate_ai_insights(sales, tickets, sales_summary, support_summary, top_category)

        conn.close()

        # Return the aggregated customer profile
        return {
            "customer": customer,
            "sales_summary": sales_summary,
            "support_summary": support_summary,
            "ai_insights": ai_insights,
            "charts": charts,
        }

    def _fetch_customer_details(self, conn, customer_id):
        """
        Fetch basic customer details from the database.
        """
        customer = pd.read_sql(
            "SELECT * FROM customers WHERE customer_id = ?",
            conn,
            params=(str(customer_id),),
        )
        return {
            k: v.item() if hasattr(v, "item") else v
            for k, v in customer.iloc[0].to_dict().items()
        }

    def _fetch_sales_data(self, conn, customer_id):
        """
        Fetch sales transaction data for a specific customer.
        """
        sales = pd.read_sql(
            """
            SELECT transaction_date, sale_amount, product_id
            FROM sales_transactions
            WHERE customer_id = ?
            """,
            conn,
            params=(str(customer_id),),
        )
        # Convert transaction_date to datetime and extract month
        sales["transaction_date"] = pd.to_datetime(sales["transaction_date"])
        sales["month"] = sales["transaction_date"].dt.to_period("M").astype(str)
        return sales

    def _fetch_support_tickets(self, conn, customer_id):
        """
        Fetch support ticket data for a specific customer.
        """
        tickets = pd.read_sql(
            """
            SELECT creation_date, sentiment_score, status
            FROM support_tickets
            WHERE customer_id = ?
            """,
            conn,
            params=(str(customer_id),),
        )
        # Convert creation_date to datetime and extract month
        tickets["creation_date"] = pd.to_datetime(tickets["creation_date"])
        tickets["month"] = tickets["creation_date"].dt.to_period("M").astype(str)
        # Normalize the status column
        tickets["status"] = tickets["status"].str.strip().str.lower()
        return tickets

    def _calculate_sales_summary(self, sales, max_ltv):
        """
        Calculate sales summary metrics such as total purchases, total spent,
        average order value, and lifetime value (LTV) score.
        """
        total_purchases = len(sales)
        total_spent = sales["sale_amount"].sum()
        avg_order_value = sales["sale_amount"].mean() if total_purchases else 0

        # Calculate purchase frequency and customer lifespan
        if total_purchases > 1:
            first_purchase = sales["transaction_date"].min()
            last_purchase = sales["transaction_date"].max()
            customer_lifespan_in_years = max((last_purchase - first_purchase).days / 365, 1)
            purchase_frequency = total_purchases / customer_lifespan_in_years
        else:
            customer_lifespan_in_years = 1
            purchase_frequency = total_purchases

        # Calculate LTV using the formula
        ltv_score = avg_order_value * purchase_frequency * customer_lifespan_in_years

        # Ensure max_ltv is valid
        max_ltv = max(max_ltv, 1)  # Avoid division by zero or invalid max_ltv

        # Normalize LTV score between 0 and 1
        normalized_ltv_score = min(1.0, ltv_score / max_ltv)

        return {
            "total_purchases": int(total_purchases),
            "total_spent": float(total_spent),
            "avg_order_value": float(round(avg_order_value, 2)) if avg_order_value else None,
            "ltv_score": float(round(normalized_ltv_score, 2)),
        }

    def _calculate_support_summary(self, tickets):
        """
        Calculate support summary metrics such as total tickets,
        average sentiment score, and number of open issues.
        """
        total_tickets = len(tickets)
        avg_sentiment = tickets["sentiment_score"].mean() if total_tickets else None
        open_issues = (tickets["status"] == "open").sum()
        return {
            "total_tickets": int(total_tickets),
            "avg_sentiment": float(round(avg_sentiment, 2)) if avg_sentiment else None,
            "open_issues": int(open_issues),
        }

    def _generate_charts(self, sales, tickets):
        """
        Generate data for charts such as sales over time, sentiment over time,
        and support ticket status breakdown.
        """
        # Sales over time chart
        sales_over_time = (
            sales.groupby("month")["sale_amount"]
            .sum()
            .reset_index()
            .rename(columns={"month": "date", "sale_amount": "amount"})
            .to_dict(orient="records")
        )
        # Sentiment over time chart
        sentiment_over_time = (
            tickets.groupby("month")["sentiment_score"]
            .mean()
            .reset_index()
            .rename(columns={"month": "date", "sentiment_score": "score"})
            .to_dict(orient="records")
        )
        # Support ticket status breakdown chart
        support_status_breakdown = (
            tickets["status"]
            .value_counts()
            .reset_index()
            .rename(columns={"index": "status", "status": "count"})
            .to_dict(orient="records")
        )
        return {
            "sales_over_time": [
                {k: (v.item() if isinstance(v, np.generic) else v) for k, v in d.items()}
                for d in sales_over_time
            ],
            "sentiment_over_time": [
                {k: (v.item() if isinstance(v, np.generic) else v) for k, v in d.items()}
                for d in sentiment_over_time
            ],
            "support_status_breakdown": [
                {k: (v.item() if isinstance(v, np.generic) else v) for k, v in d.items()}
                for d in support_status_breakdown
            ],
        }

    def _determine_top_category(self, conn, sales):
        """
        Determine the top product category for a customer based on high-margin products.
        """
        if sales.empty:
            return None
        product_ids = sales["product_id"].astype(str).unique().tolist()
        placeholders = ",".join("?" * len(product_ids))
        category_df = pd.read_sql(
            f"""
            SELECT product_id, category, sales_price, cost_price
            FROM products
            WHERE product_id IN ({placeholders})
            """,
            conn,
            params=product_ids,
        )
        # Calculate profit margin
        category_df["margin"] = category_df["sales_price"] - category_df["cost_price"]
        high_margin = category_df[category_df["margin"] > 500]
        return high_margin["category"].value_counts().idxmax() if not high_margin.empty else None

    def _generate_ai_insights(self, sales, tickets, sales_summary, support_summary, top_category):
        """
        Generate AI-driven insights based on sales and support data.
        """
        ai_insights = []
        # Insight: High volume of low sentiment tickets
        if support_summary["avg_sentiment"] is not None and support_summary["avg_sentiment"] < 0.4 and support_summary["total_tickets"] > 3:
            ai_insights.append("Customer has a high volume of low sentiment support tickets.")
        # Insight: Risk of churn based on reduced recent activity
        if not sales.empty:
            recent_sales = sales[sales["transaction_date"] >= pd.Timestamp.now() - pd.Timedelta(days=30)]
            if len(recent_sales) < sales_summary["total_purchases"] / 4:
                ai_insights.append("Risk of churn detected based on recent activity drop.")
        # Insight: Frequent purchases of high-margin products
        if top_category:
            ai_insights.append(f"Frequently purchases high-margin products in '{top_category}'.")
        return ai_insights
    def generate_max_ltv_threshold(self, conn):
        """
        Compute the 95th percentile of LTV scores across all customers
        to use as the normalization threshold.
        """

        # Fetch full sales data
        sales_df = pd.read_sql(
            """
            SELECT customer_id, transaction_date, sale_amount
            FROM sales_transactions
            """,
            conn,
        )

        # Preprocess dates
        sales_df["transaction_date"] = pd.to_datetime(sales_df["transaction_date"])

        # Compute LTV per customer using the same logic as in your per-customer method
        def compute_ltv(group):
            total_purchases = len(group)
            avg_order_value = group["sale_amount"].mean()

            if total_purchases > 1:
                first = group["transaction_date"].min()
                last = group["transaction_date"].max()
                lifespan = max((last - first).days / 365, 1)
                freq = total_purchases / lifespan
            else:
                lifespan = 1
                freq = total_purchases

            return avg_order_value * freq * lifespan

        # Group by customer and compute LTV
        ltv_per_customer = sales_df.groupby("customer_id").apply(compute_ltv)

        # Return the 95th percentile (or any other quantile you want)
        return ltv_per_customer.quantile(0.95)

