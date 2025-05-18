import pandas as pd
import numpy as np
from faker import Faker
import random
from datetime import datetime, timedelta
import os

fake = Faker()
random.seed(42)
np.random.seed(42)

# Output directory
os.makedirs("data", exist_ok=True)

PRODUCTS = [
    {"name": "Wireless Earbuds", "category": "Electronics"},
    {"name": "Smartphone", "category": "Electronics"},
    {"name": "Laptop", "category": "Electronics"},
    {"name": "Gaming Console", "category": "Electronics"},
    {"name": "Bluetooth Speaker", "category": "Electronics"},
    {"name": "Smartwatch", "category": "Electronics"},
    {"name": "4K Monitor", "category": "Electronics"},
    {"name": "Power Bank", "category": "Electronics"},
    {"name": "Wireless Router", "category": "Electronics"},
    {"name": "VR Headset", "category": "Electronics"},
    {"name": "Running Shoes", "category": "Apparel"},
    {"name": "Winter Jacket", "category": "Apparel"},
    {"name": "Casual T-Shirt", "category": "Apparel"},
    {"name": "Jeans", "category": "Apparel"},
    {"name": "Sunglasses", "category": "Apparel"},
    {"name": "Baseball Cap", "category": "Apparel"},
    {"name": "Sports Shorts", "category": "Apparel"},
    {"name": "Formal Shirt", "category": "Apparel"},
    {"name": "Hoodie", "category": "Apparel"},
    {"name": "Leather Belt", "category": "Apparel"},
    {"name": "Organic Coffee", "category": "Food"},
    {"name": "Protein Bars", "category": "Food"},
    {"name": "Gourmet Chocolate", "category": "Food"},
    {"name": "Cooking Oil", "category": "Food"},
    {"name": "Snack Pack", "category": "Food"},
    {"name": "Almond Butter", "category": "Food"},
    {"name": "Instant Noodles", "category": "Food"},
    {"name": "Granola Mix", "category": "Food"},
    {"name": "Green Tea", "category": "Food"},
    {"name": "Bottled Smoothie", "category": "Food"},
    {"name": "Office Chair", "category": "Furniture"},
    {"name": "Study Desk", "category": "Furniture"},
    {"name": "Bookshelf", "category": "Furniture"},
    {"name": "Sofa Set", "category": "Furniture"},
    {"name": "Dining Table", "category": "Furniture"},
    {"name": "Bed Frame", "category": "Furniture"},
    {"name": "Coffee Table", "category": "Furniture"},
    {"name": "TV Stand", "category": "Furniture"},
    {"name": "Shoe Rack", "category": "Furniture"},
    {"name": "Wardrobe", "category": "Furniture"},
    {"name": "Electric Kettle", "category": "Home Appliances"},
    {"name": "Microwave Oven", "category": "Home Appliances"},
    {"name": "Air Purifier", "category": "Home Appliances"},
    {"name": "Vacuum Cleaner", "category": "Home Appliances"},
    {"name": "Water Dispenser", "category": "Home Appliances"},
]


# 1. Customers
def generate_customers(n=100):
    regions = ["North America", "Europe", "Asia-Pacific", "South America", "Africa"]
    industries = [
        "Retail",
        "Technology",
        "Healthcare",
        "Finance",
        "Education",
        "Manufacturing",
        "Hospitality",
        "Transportation",
    ]
    customers = []
    for i in range(1, n + 1):
        customers.append(
            {
                "customer_id": i,
                "customer_name": fake.company(),
                "region": random.choice(regions),
                "join_date": fake.date_between(start_date="-3y", end_date="today"),
                "industry": random.choice(industries),
            }
        )
    df = pd.DataFrame(customers)
    df.to_csv("data/customers.csv", index=False)
    return df


# 2. Products
def generate_products():
    products = []
    for i, product in enumerate(PRODUCTS, start=1):
        cost = round(random.uniform(10, 1000), 2)  # Realistic cost range
        markup = round(random.uniform(1.2, 2.5), 2)  # Realistic markup range
        products.append(
            {
                "product_id": i,
                "product_name": product["name"],
                "category": product["category"],
                "cost_price": cost,
                "sales_price": round(cost * markup, 2),
            }
        )
    df = pd.DataFrame(products)
    df.to_csv("data/products.csv", index=False)
    return df


# 3. Sales Transactions
def generate_sales(customers, products, n=2000, trend_bias=0):
    sales = []
    frequently_bought_together = [
        (1, 2),  # Wireless Earbuds and Smartphone (Electronics)
        (3, 4),  # Laptop and Gaming Console (Electronics)
        (5, 6),  # Bluetooth Speaker and Smartwatch (Electronics)
        (21, 22),  # Organic Coffee and Protein Bars (Food)
        (23, 24),  # Gourmet Chocolate and Cooking Oil (Food)
        (31, 32),  # Office Chair and Study Desk (Furniture)
        (33, 34),  # Bookshelf and Sofa Set (Furniture)
        (47, 48),  # Electric Kettle and Microwave Oven (Home Appliances)
        (49, 50),  # Air Purifier and Vacuum Cleaner (Home Appliances)
    ]
    
    # Assign positive or negative trend to products
    product_ids = products["product_id"].tolist()
    positive_trend_products = set(random.sample(product_ids, int(len(product_ids) * 0.6)))
    negative_trend_products = set(product_ids) - positive_trend_products

    for i in range(1, n + 1):
        customer = random.choice(customers["customer_id"].tolist())
        product = random.choice(products["product_id"].tolist())
        quantity = random.randint(1, 5)
        product_price = products.loc[
            products["product_id"] == product, "sales_price"
        ].values[0]
        # Ensure transaction_date is after customer's join_date
        customer_join_date = customers.loc[
            customers["customer_id"] == customer, "join_date"
        ].values[0]
        transaction_date = fake.date_between(
            start_date=customer_join_date, end_date="today"
        )
        transaction_date = datetime.combine(transaction_date, datetime.min.time())  # Ensure datetime object
        
        # Simulate sales trends with time-based multiplier and trend_bias
        days_since_start = (transaction_date - datetime.strptime("2021-01-01", "%Y-%m-%d")).days
        if product in positive_trend_products:
            trend_multiplier = 1 + (days_since_start / 730) * random.uniform(0, 0.5 + trend_bias)
        else:  # Negative trend
            trend_multiplier = 1 + (days_since_start / 730) * random.uniform(-0.5 + trend_bias, 0)
        
        adjusted_quantity = max(1, round(quantity * trend_multiplier))
        sales.append(
            {
                "transaction_id": i,
                "customer_id": customer,
                "product_id": product,
                "quantity": adjusted_quantity,
                "sale_amount": round(product_price * adjusted_quantity, 2),
                "transaction_date": transaction_date
            }
        )
        # Simulate frequently bought together products
        for pair in frequently_bought_together:
            if product == pair[0] and random.random() < 0.3:  # 30% chance
                paired_product = pair[1]
                paired_product_price = products.loc[
                    products["product_id"] == paired_product, "sales_price"
                ].values[0]
                paired_quantity = max(1, round(adjusted_quantity * random.uniform(0.8, 1.2)))  # Correlated quantity
                paired_transaction_date = transaction_date + timedelta(days=random.randint(0, 2))  # Correlated date
                sales.append(
                    {
                        "transaction_id": n + i,  # Unique transaction ID
                        "customer_id": customer,
                        "product_id": paired_product,
                        "quantity": paired_quantity,
                        "sale_amount": round(paired_product_price * paired_quantity, 2),
                        "transaction_date": paired_transaction_date,
                    }
                )
    df = pd.DataFrame(sales)
    df.to_csv("data/sales_transactions.csv", index=False)
    return df


# 4. Support Tickets
def generate_support_tickets(customers, products, n=500):
    issue_types = [
        "Delivery Delay",
        "Damaged Product",
        "Refund Request",
        "Product Inquiry",
        "Technical Issue",
    ]
    statuses = ["Open", "Closed", "In Progress", "Resolved"]
    tickets = []
    for i in range(1, n + 1):
        customer = random.choice(customers["customer_id"].tolist())
        product = random.choice(products["product_id"].tolist())
        customer_join_date = customers.loc[
            customers["customer_id"] == customer, "join_date"
        ].values[0]
        creation_date = fake.date_between(start_date=customer_join_date, end_date="today")  # Ensure after join date
        status = random.choice(statuses)
        resolution_date = None
        if status in ["Closed", "Resolved"]:
            resolution_date = creation_date + timedelta(days=random.randint(1, 15))
        tickets.append(
            {
                "ticket_id": i,
                "customer_id": customer,
                "product_id": product,
                "issue_type": random.choice(issue_types),
                "status": status,
                "creation_date": creation_date,
                "resolution_date": resolution_date,
                "sentiment_score": round(
                    min(max(np.random.normal(0.5, 0.35), 0), 1), 2
                ),  # Balanced sentiment
            }
        )
    df = pd.DataFrame(tickets)
    df.to_csv("data/support_tickets.csv", index=False)
    return df


# 5. Supplier Data
def generate_suppliers(products, n=20):
    suppliers = []
    for i in range(1, n + 1):
        product = random.choice(products["product_id"].tolist())
        suppliers.append(
            {
                "supplier_id": i,
                "supplier_name": fake.company(),
                "product_id": product,
                "lead_time_days": random.randint(1, 30),
                "reliability_score": round(random.uniform(0.7, 1.0), 2),
            }
        )
    df = pd.DataFrame(suppliers)
    df.to_csv("data/supplier_data.csv", index=False)
    return df


# Run All
if __name__ == "__main__":
    customers_df = generate_customers(n=100)  # 100 customers
    products_df = generate_products()  # 50 products
    generate_sales(customers_df, products_df, n=3000, trend_bias=0.6)  # Adjust trend_bias for positive trends
    generate_support_tickets(customers_df, products_df, n=1500)  # 1500 tickets
    generate_suppliers(products_df, n=20)  # 20 suppliers
    print("✅Synthetic data generated in /data folder.")
