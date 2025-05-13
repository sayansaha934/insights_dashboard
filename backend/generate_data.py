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

# 1. Customers
def generate_customers(n=100):
    industries = ['Technology', 'Finance', 'Healthcare', 'Retail', 'Manufacturing']
    regions = ['North', 'South', 'East', 'West', 'Central']
    customers = []
    for i in range(1, n+1):
        customers.append({
            'customer_id': i,
            'customer_name': fake.company(),
            'industry': random.choice(industries),
            'region': random.choice(regions),
            'join_date': fake.date_between(start_date='-3y', end_date='today')
        })
    df = pd.DataFrame(customers)
    df.to_csv("data/customers.csv", index=False)
    return df

# 2. Products
def generate_products(n=30):
    categories = ['Electronics', 'Software', 'Apparel', 'Food', 'Furniture']
    products = []
    for i in range(1, n+1):
        cost = round(random.uniform(10, 1000), 2)
        markup = round(random.uniform(1.2, 2.5), 2)
        products.append({
            'product_id': i,
            'product_name': fake.word().capitalize(),
            'category': random.choice(categories),
            'cost_price': cost,
            'sales_price': round(cost * markup, 2)
        })
    df = pd.DataFrame(products)
    df.to_csv("data/products.csv", index=False)
    return df

# 3. Sales Transactions
def generate_sales(customers, products, n=1000):
    sales = []
    for i in range(1, n+1):
        customer = random.choice(customers['customer_id'].tolist())
        product = random.choice(products['product_id'].tolist())
        quantity = random.randint(1, 10)
        product_price = products.loc[products['product_id'] == product, 'sales_price'].values[0]
        sales.append({
            'transaction_id': i,
            'customer_id': customer,
            'product_id': product,
            'quantity': quantity,
            'sale_amount': round(product_price * quantity, 2),
            'transaction_date': fake.date_between(start_date='-2y', end_date='today')
        })
    df = pd.DataFrame(sales)
    df.to_csv("data/sales_transactions.csv", index=False)
    return df

# 4. Support Tickets
def generate_support_tickets(customers, products, n=500):
    issue_types = ['Login Issue', 'Payment Failure', 'Bug Report', 'Feature Request', 'Product Defect']
    statuses = ['Open', 'Closed', 'In Progress', 'Resolved']
    tickets = []
    for i in range(1, n+1):
        customer = random.choice(customers['customer_id'].tolist())
        product = random.choice(products['product_id'].tolist())
        creation_date = fake.date_between(start_date='-1y', end_date='today')
        resolution_delay = random.randint(1, 30)
        tickets.append({
            'ticket_id': i,
            'customer_id': customer,
            'product_id': product,
            'issue_type': random.choice(issue_types),
            'status': random.choice(statuses),
            'creation_date': creation_date,
            'resolution_date': creation_date + timedelta(days=resolution_delay),
            'sentiment_score': round(random.uniform(0, 1), 2)
        })
    df = pd.DataFrame(tickets)
    df.to_csv("data/support_tickets.csv", index=False)
    return df

# 5. Supplier Data (Optional)
def generate_suppliers(products, n=20):
    suppliers = []
    for i in range(1, n+1):
        product = random.choice(products['product_id'].tolist())
        suppliers.append({
            'supplier_id': i,
            'supplier_name': fake.company(),
            'product_id': product,
            'lead_time_days': random.randint(1, 30),
            'reliability_score': round(random.uniform(0.7, 1.0), 2)
        })
    df = pd.DataFrame(suppliers)
    df.to_csv("data/supplier_data.csv", index=False)
    return df

# Run All
if __name__ == "__main__":
    customers_df = generate_customers()
    products_df = generate_products()
    generate_sales(customers_df, products_df)
    generate_support_tickets(customers_df, products_df)
    generate_suppliers(products_df)
    print("✅ Synthetic data generated in /data folder.")
