FROM python:3.11-slim

WORKDIR /app

# Copy project files
COPY . /app

# Install dependencies
RUN pip install --upgrade pip && \
    pip install -r requirements.txt

EXPOSE 8000

# CMD to run the FastAPI app
CMD ["python", "main.py"]
