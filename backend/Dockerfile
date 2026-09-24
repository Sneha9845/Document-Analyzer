# Stage 1: Build the Frontend
FROM node:20-bookworm-slim AS frontend-builder
WORKDIR /build
COPY frontend/package.json frontend/package-lock.json* ./
RUN npm install
COPY frontend .
RUN npm run build

# Stage 2: Final Backend Image
FROM python:3.10-slim
ENV PIP_RETRIES=10
ENV PIP_TIMEOUT=120
ENV PIP_NO_CACHE_DIR=1

RUN apt-get update && apt-get install -y --no-install-recommends \
    tesseract-ocr \
    poppler-utils \
    build-essential \
    libpq-dev \
    && rm -rf /var/lib/apt/lists/*

WORKDIR /app

# Install CPU-only torch first
RUN pip install --retries 10 --timeout 120 torch==2.4.0 --extra-index-url https://download.pytorch.org/whl/cpu

COPY backend/requirements.txt .
RUN pip install --retries 10 --timeout 120 -r requirements.txt
RUN python -m spacy download en_core_web_sm

# Copy the entire backend
COPY backend .

# Copy build files from frontend stage to backend static dir
COPY --from=frontend-builder /build/out /app/static

RUN mkdir -p /app/uploads /app/logs

EXPOSE 8000

CMD ["uvicorn", "main:app", "--host", "0.0.0.0", "--port", "8000"]
