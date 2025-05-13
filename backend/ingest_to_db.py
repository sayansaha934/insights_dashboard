import sqlite3
import pandas as pd
import os

# Ensure 'data' folder exists
DATA_DIR = 'data'
DB_PATH = 'database.db'

# 1. Connect to SQLite DB (creates one if it doesn't exist)
conn = sqlite3.connect(DB_PATH)
cursor = conn.cursor()

# 2. Read all CSVs into DataFrames
customers_df = pd.read_csv(os.path.join(DATA_DIR, 'customers.csv'))
products_df = pd.read_csv(os.path.join(DATA_DIR, 'products.csv'))
sales_df = pd.read_csv(os.path.join(DATA_DIR, 'sales_transactions.csv'))
support_df = pd.read_csv(os.path.join(DATA_DIR, 'support_tickets.csv'))
suppliers_df = pd.read_csv(os.path.join(DATA_DIR, 'supplier_data.csv'))

# 3. Write DataFrames to SQLite
customers_df.to_sql('customers', conn, if_exists='replace', index=False)
products_df.to_sql('products', conn, if_exists='replace', index=False)
sales_df.to_sql('sales_transactions', conn, if_exists='replace', index=False)
support_df.to_sql('support_tickets', conn, if_exists='replace', index=False)
suppliers_df.to_sql('supplier_data', conn, if_exists='replace', index=False)