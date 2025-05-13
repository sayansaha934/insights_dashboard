## 🚀 How to Generate Data

1. Navigate to the backend directory:
   ```bash
   cd backend
   ```

2. Generate synthetic data:
   ```bash
   python generate_data.py
   ```

3. Ingest generated data into the database:
   ```bash
   python ingest_to_db.py
   ```

---

## 🧩 How to Run the Application

### 🛠️ Backend (FastAPI)

1. Navigate to the backend directory:
   ```bash
   cd backend
   ```

2. Create a `env.json` file and add the following variables:
   ```json
   {
     "DB_PATH": "path/to/your/database.db",
     "PORT": 8000
   }
   ```

3. Install dependencies:
   ```bash
   pip install -r requirements.txt
   ```

4. Start the FastAPI server:
   ```bash
   python main.py
   ```

---

### 💻 Frontend (React + Vite)

1. Navigate to the frontend directory:
   ```bash
   cd frontend
   ```

2. Create a `.env` file and add your backend API URL:
   ```env
   VITE_API_URL=http://localhost:8000
   ```

3. Install dependencies:
   ```bash
   npm install
   ```

4. Start the development server:
   ```bash
   npm run dev
   ```



✅ You're all set! Access the frontend at `http://localhost:5173`.

---
## 🏗️ Architecture & Design Explanation

### 1. Overall Architecture

This is a **full-stack dashboard application** designed to offer contextual business insights using synthetic customer, sales, and support data. The architecture follows a **modular and scalable design** with the following components:

- **Backend**: Python + FastAPI  
- **Frontend**: React + Vite  
- **Database**: SQLite (local, easily replaceable with a managed DB)  
- **AI/ML Features**: Rule-based logic for recommendations and anomaly detection

---

### 2. Data Models

The SQLite database consists of the following core tables:

- **`customers`**: Basic customer info (ID, name, industry, region, etc.)
- **`products`**: Product metadata including category and pricing
- **`sales_transactions`**: Each purchase record linking customers and products
- **`support_tickets`**: Support interactions with sentiment scores

Each table is designed to mimic realistic enterprise CRM and support system data.

---

### 3. API Design (FastAPI)

The backend uses **RESTful APIs** exposed via FastAPI. Key endpoints include:

- `GET /customers` - List all customers
- `GET /customers/{id}` – Fetch detailed customer profile with insights
- `GET /products` - List all products
- `GET /products/{id}` – Fetch product details, performance  and frequently bought together
- `GET /overview` – Dashboard-level statistics  
- `GET /anomalies` – Detect customers with unusual ticket sentiment  
- `GET /trends` – Highlight products with sales spikes or drops  

Responses are JSON-structured and optimized for frontend use with minimal transformation needed.

---

### 4. UI Components (React + Vite)

The frontend is built using **React (with Vite for fast dev builds)** and structured into modular, reusable components:

- **Customer View**: Profile, sales history, ticket sentiment, AI insights  
- **Product View**: Sales and support data, customer relationships, frequently bought together
- **Overview Page**: Key business stats, trend charts, alerts  
- **Reusable charts** using `Recharts`  
- **Insight cards** with visual highlights for trends and risks  

Design follows **dashboard best practices**: clean layout, focused KPIs, visual feedback.

---

### 5. AI/ML Feature Logic

All AI/ML features use **lightweight rule-based or statistical logic**, enabling explainability and fast execution:

- **Recommendations**:  
  - "Frequently bought together" based on co-occurrence in sales transactions.

- **Anomaly Detection**:  
  - Customers with significantly higher proportions of negative sentiment tickets are flagged.

- **Trend Highlighting**:  
  - Products with >X% change in monthly sales (positive or negative) are highlighted as trending up/down.

These rules are implemented using Pandas logic on transaction history.

---

### 6. Synthetic Data Generation Strategy

Data is generated using **Faker** and **custom logic** to ensure realistic variety:

- Customers vary by industry, region, and behavior  
- Product pricing reflects margin variations (used in AI insights)  
- Sales timestamps simulate activity spikes and lulls  
- Support ticket sentiments are sampled from realistic score distributions  

---
## 🔄 Data Pipeline: Table Overview

The application uses synthetic data across four main tables:

---

### 1. `customers`

- Stored with unique `customer_id`.
- Used in customer profiles and segmentation.

---

### 2. `products`

- Used for sales analysis and recommendations.
- Linked to both sales and support data.

---

### 3. `sales_transactions`

- Connects customers and products.
- Drives sales charts, LTV, and product insights.

---

### 4. `support_tickets`

- Contains `sentiment_score`, `status`, and links to products/customers.
- Used for churn risk, sentiment tracking, and anomaly detection.

---

### Data Flow Summary

```text
[ generate_data.py ] → CSV files
     ↓
[ ingest_to_db.py ] → Loads into SQLite
     ↓
[ FastAPI backend ] → Provides APIs
     ↓
[ React frontend ] → Renders dashboards and AI insights
```
---

## ☁️ Cloud Deployment and Scalability

This application is designed to support scalability, fault tolerance, and ease of deployment using modern cloud infrastructure principles. Below is an outline of how the system can be deployed and scaled on **AWS** using managed and serverless services.

---

### 🏗️ Architecture Overview

#### 1. **Frontend**
- **Tech**: React (with Vite or CRA)
- **Deployment**:
  - Host via **AWS S3** with **CloudFront CDN** for global distribution.
  - Alternatively, deploy via **Vercel** or **Netlify** for built-in CI/CD.
- **Scalability**: Auto-scales with user demand due to static assets + CDN.

#### 2. **Backend API**
- **Tech**: FastAPI (Python)
- **Deployment Options**:
  - **AWS Lambda** + **API Gateway** (Serverless)
    - Auto-scales, cost-efficient.
  - **AWS Fargate** (via ECS) for containerized FastAPI service.
  - **Amazon EKS (Kubernetes)** for large-scale orchestration.

#### 3. **Database**
- **Development**: SQLite
- **Production**: 
  - **Amazon RDS (PostgreSQL/MySQL)** - managed database.
  - **Amazon Aurora Serverless** - scales with workload.

#### 4. **AI/ML Insights**
- **Lightweight rules**: Handled within FastAPI.
- **Advanced models**:
  - Hosted on **SageMaker Endpoints**.
  - Or served via **Lambda + S3 stored models**.

#### 5. **Storage**
- Use **Amazon S3** for logs, backups, data exports, or media files.

#### 6. **Monitoring & Alerts**
- **CloudWatch** for metrics and logs.
- Use **SNS** for alerting.
- Optional integration with **Datadog**, **New Relic**, or **Prometheus**.

---

### 🐳 Dockerization

The app is containerized for portability and consistency:

```Dockerfile
FROM python:3.11-slim
WORKDIR /app
COPY requirements.txt .
RUN pip install -r requirements.txt
COPY . .
CMD ["uvicorn", "main:app", "--host", "0.0.0.0", "--port", "8000"]
```

- Containers can be deployed via:
  - **AWS Fargate**
  - **Amazon ECS**
  - **Amazon EKS (Kubernetes)**

---

### 🔁 Data Pipeline Evolution

**Current State**:
- In-memory or SQLite data
- Rule-based insights (FastAPI)

**Future Enhancements**:
- Real-time data ingestion with **Kinesis** or **Kafka**
- Store raw events in **S3 (data lake)**
- Transform using **AWS Glue** or **dbt**
- Use **Redshift** or **Athena** for analytics
- Schedule processing with **AWS Step Functions** or **Apache Airflow (MWAA)**

---

### ✅ Summary Table

| Component        | Scalable Solution (AWS)                  |
|------------------|------------------------------------------|
| Frontend         | S3 + CloudFront / Vercel                 |
| Backend API      | Lambda / Fargate / EKS (FastAPI)         |
| Database         | RDS / Aurora Serverless                  |
| AI/ML Insights   | SageMaker / Lambda                       |
| Object Storage   | Amazon S3                                |
| Monitoring       | CloudWatch, SNS, Datadog                 |
| Data Pipeline    | Kinesis + S3 + Glue + Redshift           |

---
## ⚠️ Challenges & Solutions

- **Data Realism**: Faker-generated data lacked business patterns.  
  ✅ Added logic to mimic seasonality and customer behavior.

- **Sentiment Distribution**: Uniform sentiment scores skewed insights.  
  ✅ Introduced controlled randomization to better simulate real-world support data.

- **Anomaly & Trend Detection**: Hard to define thresholds on synthetic data.  
  ✅ Used rule-based logic with statistical thresholds based on generated averages.
---
## 💡 Additional Considerations

### Enhancing the Dashboard for ContexQ's Clients
- **Personalized Insights**: Tailor dashboards per client segment (e.g., Retail vs. Tech) for more relevant metrics.
- **Role-Based Views**: Allow Sales, Support, and Leadership to see contextual data suited to their goals.
- **Alerts & Notifications**: Integrate real-time alerts for anomalies or churn risks.

### Integrating New Data Sources / AI Features
- **CRM & Social Media**: Pull in engagement data to correlate support sentiment with public perception.
- **Product Usage Metrics**: Use telemetry data (e.g., login frequency, feature usage) to strengthen churn prediction.
- **AI Features**:
  - **Churn Propensity Modeling**
  - **Customer Lifetime Value Prediction**
  - **Smart Ticket Routing** using sentiment and topic analysis

### Solving Specific Business Problems
- **Customer Retention**: Early warning via AI-based churn signals helps preempt loss.
- **Sales Optimization**: Cross-sell recommendations improve revenue per customer.
- **Support Efficiency**: Analyzing ticket trends enables better resource allocation and FAQ generation.


---
