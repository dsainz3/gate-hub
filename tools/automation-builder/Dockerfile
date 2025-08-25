FROM python:3.12-slim
RUN apt-get update && apt-get install -y --no-install-recommends git && rm -rf /var/lib/apt/lists/*
WORKDIR /app
COPY requirements.txt .
RUN pip install --no-cache-dir -r requirements.txt
COPY automation_builder ./automation_builder
EXPOSE 8000
CMD ["uvicorn", "automation_builder.main:app", "--host", "0.0.0.0", "--port", "8000"]
