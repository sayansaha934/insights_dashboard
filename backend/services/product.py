from config import config
import sqlite3
import pandas as pd
import numpy as np

class ProductService:
    def __init__(self):
        pass

    def get_products(self, search=None):
        """
        Fetch a list of products from the database.
        Optionally filter by a search term matching product_name or category.
        """
        conn = sqlite3.connect(config.DB_PATH)
        query = """
        SELECT * FROM products
        WHERE (product_name LIKE ? OR category LIKE ?)
        """
        params = [f"%{search}%", f"%{search}%"] if search else ["%", "%"]

        df = pd.read_sql(query, conn, params=params)
        conn.close()
        return df.to_dict(orient="records")

    def get_product_profile(self, product_id: str):
        """
        Fetch detailed profile information for a specific product.
        Includes product details, sales summary, support summary, charts, and related data.
        """
        with sqlite3.connect(config.DB_PATH) as conn:
            product_info = self._fetch_product_details(conn, product_id)
            if not product_info:
                return {"error": "Product not found"}

            sales_summary, sales_over_time = self._fetch_sales_data(conn, product_id)
            top_customers = self._fetch_top_customers(conn, product_id)
            support_summary, sentiment_over_time, support_status_breakdown = self._fetch_support_data(conn, product_id)
            frequently_bought_together = self.get_frequently_bought_together(product_id)

            return {
                "product": product_info,
                "sales_summary": sales_summary,
                "support_summary": support_summary,
                "charts": {
                    "sales_over_time": sales_over_time,
                    "sentiment_over_time": sentiment_over_time,
                    "support_status_breakdown": support_status_breakdown,
                },
                "top_customers": top_customers,
                "frequently_bought_together": frequently_bought_together,
            }

    def _fetch_product_details(self, conn, product_id):
        """
        Fetch basic product details from the database.
        """
        product = pd.read_sql(
            "SELECT * FROM products WHERE product_id = ?",
            conn,
            params=(product_id,),
        )
        if product.empty:
            return None
        return product.iloc[0].apply(
            lambda x: x.item() if isinstance(x, np.generic) else x
        ).to_dict()

    def _fetch_sales_data(self, conn, product_id):
        """
        Fetch sales data for a specific product and calculate sales summary.
        """
        sales = pd.read_sql(
            """
            SELECT sale_amount, transaction_date, customer_id
            FROM sales_transactions
            WHERE product_id = ?
            """,
            conn,
            params=(product_id,),
        )
        sales["transaction_date"] = pd.to_datetime(sales["transaction_date"], errors="coerce")
        sales["month"] = sales["transaction_date"].dt.to_period("M").astype(str)

        total_sales = len(sales)
        total_revenue = sales["sale_amount"].sum() if total_sales else 0
        avg_sale_value = sales["sale_amount"].mean() if total_sales else 0

        sales_over_time = (
            sales.groupby("month")["sale_amount"]
            .sum()
            .reset_index()
            .rename(columns={"month": "date", "sale_amount": "amount"})
            .to_dict(orient="records")
        )
        sales_over_time = [
            {k: (v.item() if isinstance(v, np.generic) else v) for k, v in d.items()}
            for d in sales_over_time
        ]

        return {
            "total_sales": int(total_sales),
            "total_revenue": round(float(total_revenue), 2),
            "avg_sale_value": round(float(avg_sale_value), 2),
        }, sales_over_time

    def _fetch_top_customers(self, conn, product_id):
        """
        Fetch the top customers for a specific product based on purchase count.
        """
        top_customers_query = """
        SELECT st.customer_id, c.customer_name, COUNT(*) AS purchase_count
        FROM sales_transactions st
        JOIN customers c ON st.customer_id = c.customer_id
        WHERE st.product_id = ?
        GROUP BY st.customer_id, c.customer_name
        HAVING COUNT(*) > 1
        ORDER BY purchase_count DESC
        LIMIT 5
        """
        top_customers = pd.read_sql(top_customers_query, conn, params=(product_id,))
        return [
            {k: (v.item() if isinstance(v, np.generic) else v) for k, v in d.items()}
            for d in top_customers.to_dict(orient="records")
        ]

    def _fetch_support_data(self, conn, product_id):
        """
        Fetch support ticket data for a specific product and calculate support summary.
        """
        support = pd.read_sql(
            """
            SELECT sentiment_score, status, creation_date
            FROM support_tickets
            WHERE product_id = ?
            """,
            conn,
            params=(product_id,),
        )
        support["creation_date"] = pd.to_datetime(support["creation_date"], errors="coerce")
        support["month"] = support["creation_date"].dt.to_period("M").astype(str)

        total_issues = len(support)
        avg_sentiment = support["sentiment_score"].mean() if total_issues else None
        open_issues = (support["status"].str.lower() == "open").sum()  # Fix: Ensure case-insensitive comparison

        sentiment_over_time = (
            support.groupby("month")["sentiment_score"]
            .mean()
            .reset_index()
            .rename(columns={"month": "date", "sentiment_score": "score"})
            .to_dict(orient="records")
        )
        sentiment_over_time = [
            {k: (v.item() if isinstance(v, np.generic) else v) for k, v in d.items()}
            for d in sentiment_over_time
        ]

        support_status_breakdown = (
            support["status"]
            .value_counts()
            .reset_index()
            .rename(columns={"index": "status", "status": "count"})
            .to_dict(orient="records")
        )
        support_status_breakdown = [
            {k: (v.item() if isinstance(v, np.generic) else v) for k, v in d.items()}
            for d in support_status_breakdown
        ]

        return {
            "total_issues": int(total_issues),
            "avg_sentiment": round(float(avg_sentiment), 2) if avg_sentiment is not None else None,
            "open_issues": int(open_issues),  # Corrected open_issues calculation
        }, sentiment_over_time, support_status_breakdown

    def get_frequently_bought_together(self, product_id: str, top_n=5):
        """
        Fetch products frequently bought together with a specific product.
        """
        conn = sqlite3.connect(config.DB_PATH)

        # Step 1: Find customers who bought this product
        customers = pd.read_sql(
            """
            SELECT DISTINCT customer_id
            FROM sales_transactions
            WHERE product_id = ?
            """,
            conn,
            params=(product_id,),
        )

        if customers.empty:
            conn.close()
            return []

        customer_ids = customers["customer_id"].tolist()

        # Step 2: Get other products they bought
        placeholders = ",".join("?" * len(customer_ids))
        co_purchases = pd.read_sql(
            f"""
            SELECT product_id
            FROM sales_transactions
            WHERE customer_id IN ({placeholders})
            AND product_id != ?
            """,
            conn,
            params=customer_ids + [product_id],
        )

        if co_purchases.empty:
            conn.close()
            return []

        # Step 3: Count and rank
        recommended = (
            co_purchases["product_id"]
            .value_counts()
            .head(top_n)
            .reset_index()
            .rename(columns={"index": "product_id", "product_id": "purchase_count"})
        )

        # Step 4: Get product details
        placeholders = ",".join("?" * len(recommended["product_id"]))
        product_details = pd.read_sql(
            f"""
            SELECT product_id, product_name, category, sales_price
            FROM products
            WHERE product_id IN ({placeholders})
            """,
            conn,
            params=recommended["product_id"].tolist(),
        )

        conn.close()

        # Merge counts with product details
        result = pd.merge(recommended, product_details, on="product_id")

        return result.to_dict(orient="records")