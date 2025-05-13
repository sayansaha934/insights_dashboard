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

---

✅ You're all set! Access the frontend at `http://localhost:5173`.


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
