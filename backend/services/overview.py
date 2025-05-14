from config import config
import sqlite3
import pandas as pd
import numpy as np


class OverViewService:
    def __init__(self):
        pass

    def get_overview(self):
        """
        Fetch an overview of sales, customers, products, and support data.
        """
        conn = sqlite3.connect(config.DB_PATH)

        # Fetch and process data for each section
        sales_overview = self._get_sales_overview(conn)
        customer_overview = self._get_customer_overview(conn)
        product_overview = self._get_product_overview(conn)
        support_overview = self._get_support_overview(conn)

        conn.close()

        # Combine all sections into the final JSON response
        return {
            "sales_overview": sales_overview,
            "customer_overview": customer_overview,
            "product_overview": product_overview,
            "support_overview": support_overview,
        }

    def _get_sales_overview(self, conn):
        """
        Fetch and process sales data for the overview.
        """
        sales = pd.read_sql("SELECT sale_amount, transaction_date FROM sales_transactions", conn)
        sales["transaction_date"] = pd.to_datetime(sales["transaction_date"])
        sales["month"] = sales["transaction_date"].dt.to_period("M").astype(str)

        total_sales = len(sales)
        total_revenue = float(sales["sale_amount"].sum())
        avg_sale_value = float(sales["sale_amount"].mean()) if total_sales else 0.0

        # Sales trend (last 6 months)
        sales_trend = (
            sales.groupby("month")["sale_amount"]
            .sum()
            .reset_index()
            .rename(columns={"month": "date", "sale_amount": "amount"})
            .sort_values("date")
            .tail(6)
            .to_dict(orient="records")
        )
        sales_trend = [
            {k: (v.item() if isinstance(v, np.generic) else v) for k, v in d.items()}
            for d in sales_trend
        ]

        return {
            "total_sales": total_sales,
            "total_revenue": round(total_revenue, 2),
            "avg_sale_value": round(avg_sale_value, 2),
            "sales_trend": sales_trend,
        }

    def _get_customer_overview(self, conn):
        """
        Fetch and process customer data for the overview.
        """
        customers = pd.read_sql("SELECT customer_id, join_date FROM customers", conn)
        customers["join_date"] = pd.to_datetime(customers["join_date"])
        customers["join_month"] = customers["join_date"].dt.to_period("M").astype(str)

        total_customers = len(customers)
        current_month = str(pd.Timestamp.now().to_period("M"))
        new_customers_this_month = int((customers["join_month"] == current_month).sum())

        # Top 5 customers by purchase volume
        top_customers_query = """
            SELECT st.customer_id, c.customer_name, COUNT(*) AS purchase_count, SUM(st.sale_amount) AS total_spent
            FROM sales_transactions st
            JOIN customers c ON st.customer_id = c.customer_id
            GROUP BY st.customer_id, c.customer_name
            ORDER BY total_spent DESC
            LIMIT 5
        """
        top_customers = pd.read_sql(top_customers_query, conn).to_dict(orient="records")
        top_customers = [
            {k: (v.item() if isinstance(v, np.generic) else v) for k, v in d.items()}
            for d in top_customers
        ]

        return {
            "total_customers": total_customers,
            "new_customers_this_month": new_customers_this_month,
            "top_customers": top_customers,
        }

    def _get_product_overview(self, conn):
        """
        Fetch and process product data for the overview.
        """
        products = pd.read_sql("SELECT * FROM products", conn)
        total_products = int(len(products))
        avg_product_price = float(products["sales_price"].mean()) if total_products else 0.0

        # Best-selling product
        top_products_query = """
            SELECT p.product_id, p.product_name, COUNT(*) AS sales_count, SUM(st.sale_amount) AS revenue
            FROM sales_transactions st
            JOIN products p ON st.product_id = p.product_id
            GROUP BY p.product_id, p.product_name
            ORDER BY revenue DESC
            LIMIT 1
        """
        best_selling_product = pd.read_sql(top_products_query, conn).to_dict(orient="records")
        best_selling_product = [
            {k: (v.item() if isinstance(v, np.generic) else v) for k, v in d.items()}
            for d in best_selling_product
        ]

        # Most problematic product
        most_issues_query = """
            SELECT p.product_id, p.product_name, COUNT(*) AS issue_count
            FROM support_tickets st
            JOIN products p ON st.product_id = p.product_id
            GROUP BY p.product_id, p.product_name
            ORDER BY issue_count DESC
            LIMIT 1
        """
        most_problematic_product = pd.read_sql(most_issues_query, conn).to_dict(orient="records")
        most_problematic_product = [
            {k: (v.item() if isinstance(v, np.generic) else v) for k, v in d.items()}
            for d in most_problematic_product
        ]

        return {
            "total_products": total_products,
            "avg_product_price": round(avg_product_price, 2),
            "best_selling_product": best_selling_product,
            "most_problematic_product": most_problematic_product,
        }

    def _get_support_overview(self, conn):
        """
        Fetch and process support ticket data for the overview.
        """
        support = pd.read_sql("SELECT sentiment_score, status, creation_date FROM support_tickets", conn)
        total_tickets = int(len(support))
        avg_sentiment = float(support["sentiment_score"].mean()) if total_tickets else None

        # Support ticket status breakdown
        support_status_counts = support["status"].value_counts().reset_index()
        support_status_counts.columns = ["status", "count"]
        support_status_breakdown = support_status_counts.to_dict(orient="records")
        support_status_breakdown = [
            {k: (v.item() if isinstance(v, np.generic) else v) for k, v in d.items()}
            for d in support_status_breakdown
        ]

        # Sentiment trend over last 6 months
        support["creation_date"] = pd.to_datetime(support["creation_date"])
        support["month"] = support["creation_date"].dt.to_period("M").astype(str)
        sentiment_trend = (
            support.groupby("month")["sentiment_score"]
            .mean()
            .reset_index()
            .rename(columns={"month": "date", "sentiment_score": "score"})
            .sort_values("date")
            .tail(6)
            .to_dict(orient="records")
        )
        sentiment_trend = [
            {k: (v.item() if isinstance(v, np.generic) else v) for k, v in d.items()}
            for d in sentiment_trend
        ]

        return {
            "total_tickets": total_tickets,
            "avg_sentiment": round(avg_sentiment, 2) if avg_sentiment is not None else None,
            "support_status_breakdown": support_status_breakdown,
            "sentiment_trend": sentiment_trend,
        }