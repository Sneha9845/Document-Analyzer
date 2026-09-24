# Document Analyzer

An AI-powered legal document analysis platform that extracts contract text, executes multi-agent risk and compliance assessments, detects governing jurisdictions and official stamps, and streams real-time insights to an interactive web dashboard.

---

## Problem It Solves

Legal contracts, non-disclosure agreements, and commercial leases are frequently lengthy, complex, and filled with dense boilerplate language. Manually auditing documents for hidden liabilities, non-compliant clauses, missing official seals, or unfavorable termination terms is slow, expensive, and error-prone. 

This system automates contract review by extracting document text (including scanned PDFs via OCR), structuring clauses, flagging high-risk language with mitigation advice, verifying governing jurisdictions, and identifying official verification stamps.

---

## Features

- **Multi-Format Document Upload & Parsing**: Supports PDF, TXT, DOC, and DOCX document uploads.
- **Text & Layout Extraction with OCR Fallback**: Utilizes `PyMuPDF` (`fitz`) and `pdfplumber` for structured text and table extraction, falling back to `Tesseract OCR` for scanned pages.
- **Multi-Agent Analysis Workflow (LangGraph)**:
  - **Parser Agent**: Segments contract text into key legal sections and clauses.
  - **Risk Detector Agent**: Identifies high-risk liabilities, cure-period omissions, and unfair indemnification terms.
  - **Compliance Checker Agent**: Validates contract language against legal compliance benchmarks.
  - **Authenticity Checker Agent**: Detects government/official stamps, seals, and digital signature keywords.
  - **Cross-Validator Agent**: Consolidates findings across agents and resolves conflicting ratings.
  - **Confidence Scorer Agent**: Evaluates evaluation clarity and assigns overall confidence scores.
  - **Negotiator Agent**: Generates counter-proposals and actionable clause mitigation strategies.
  - **Summarizer Agent**: Produces concise, structured legal summaries.
- **Real-Time WebSocket Streaming**: Streams live agent updates, progress metrics, and analysis results to the frontend.
- **Asynchronous Task Queue**: Offloads heavy processing jobs using Celery worker tasks backed by Redis.
- **Governing Jurisdiction Detection**: Uses pattern-matching heuristics to identify applicable legal jurisdictions (USA - NY/CA, UK, India, EU).
- **ML Classification Engine**: Employs Scikit-learn TF-IDF pipelines to classify clause types, document categories, and risk levels.
- **Knowledge Graph & Vector Storage**: Connects with Qdrant for semantic similarity searches and Neo4j for mapping clause dependencies.
- **Interactive Web Dashboard**: Built with Next.js and Tailwind CSS, featuring risk distribution charts, entity views, case tables, and detailed clause breakdowns.

---

## How It Works

1. **Upload**: The user uploads a contract file (`.pdf`, `.txt`, `.doc`, `.docx`) through the frontend UI or the REST API endpoint (`/upload`). The document is saved to the server storage and indexed in PostgreSQL.
2. **Text Extraction**: The system processes the document layout. Clean text is parsed directly, while scanned PDF pages trigger Tesseract OCR for text recovery.
3. **Multi-Agent & Rule Checks**:
   - The jurisdiction detector inspects the text for governing legal rules.
   - The LangGraph workflow triggers parallel evaluation agents (Risk, Compliance, Authenticity).
   - Findings converge at the cross-validator, confidence scorer, negotiator, and summarizer nodes.
4. **Result Presentation**: Final risk scores, structured findings, mitigation recommendations, and summaries are saved to PostgreSQL and rendered dynamically on the Next.js dashboard.

---

## Tech Stack

- **Backend**: Python 3.10+, FastAPI, LangGraph, LangChain, Celery, SQLAlchemy, PyMuPDF (`fitz`), `pdfplumber`, `pytesseract` (Tesseract OCR), `scikit-learn`.
- **Frontend**: Next.js 14, React, TypeScript, Tailwind CSS, Lucide React, Recharts, Socket.IO Client / WebSockets.
- **Databases & Infrastructure**:
  - **PostgreSQL**: Relational database for documents, cases, and analysis history.
  - **Redis**: In-memory cache and task message broker for Celery.
  - **Qdrant**: Vector database for storing and querying clause embeddings.
  - **Neo4j**: Graph database for mapping relationships between contract clauses.
- **Observability**: LangSmith tracing integration.
- **Containerization**: Docker & Docker Compose.

---

## Project Structure

```text
Document-Analyzer/
├── backend/                  # FastAPI Application & Analysis Services
│   ├── agents/               # LangGraph multi-agent workflow nodes
│   │   ├── authenticity.py   # Stamp and seal detection agent
│   │   ├── compliance.py     # Legal compliance verification agent
│   │   ├── confidence_scorer.py # Confidence scoring node
│   │   ├── cross_validator.py # Multi-agent finding resolution
│   │   ├── graph.py          # LangGraph state workflow compilation
│   │   ├── negotiator.py     # Clause mitigation & counter-proposal agent
│   │   ├── parser.py         # Document section parsing agent
│   │   ├── risk.py           # Risk finding agent
│   │   ├── state.py          # Typed analysis state dictionary
│   │   └── summarizer.py     # Summary generation agent
│   ├── core/                 # Document parsing & jurisdiction detection
│   │   ├── jurisdiction.py   # Pattern-based jurisdiction detector
│   │   └── pdf_processor.py  # PyMuPDF, pdfplumber & Tesseract OCR pipeline
│   ├── models/               # SQLAlchemy database schemas & sessions
│   │   ├── database.py       # Document, Analysis & ClauseFinding tables
│   │   └── db_utils.py       # Engine initialization & SessionLocal
│   ├── services/             # Specialized database & embedding services
│   │   ├── embeddings.py     # SentenceTransformers (Legal-BERT) wrapper
│   │   ├── knowledge_graph.py# Neo4j graph driver for clause relationships
│   │   └── vector_store.py   # Qdrant client for vector search
│   ├── celery_app.py         # Celery task queue configuration
│   ├── Dockerfile            # Container build recipe for unified app
│   ├── main.py               # FastAPI entry point, REST APIs & WebSockets
│   ├── requirements.txt      # Backend Python dependencies
│   └── tasks.py              # Celery background tasks
├── frontend/                 # Next.js 14 Dashboard Application
│   ├── src/
│   │   ├── app/              # Next.js App Router pages (cases, review, etc.)
│   │   ├── components/       # UI components (AnalysisDashboard, RiskChart, etc.)
│   │   └── lib/              # Socket connection helper
│   ├── Dockerfile            # Frontend container specification
│   ├── package.json          # Node.js dependencies & scripts
│   └── tailwind.config.ts    # Tailwind CSS configuration
├── utils/                    # ML prediction helpers & standalone scripts
│   ├── analyzer.py           # Scikit-learn model loader & document analysis
│   ├── pdf_extractor.py      # PDF text extraction utilities
│   └── preprocessor.py       # Text cleaning & sentence segmentation
├── docs/                     # Documentation directory
├── docker-compose.yml        # Multi-container service orchestrator
├── .env.example              # Environment variables template
└── .gitignore                # Repository ignore rules
```

---

## How to Run with Docker

Ensure Docker and Docker Compose are installed on your system.

1. **Clone the repository**:
   ```bash
   git clone https://github.com/Sneha9845/Document-Analyzer.git
   cd Document-Analyzer
   ```

2. **Set up Environment Variables**:
   ```bash
   cp .env.example .env
   ```
   *(Edit `.env` to supply your API keys and configuration settings)*

3. **Build and Start All Services**:
   ```bash
   docker-compose up --build -d
   ```

4. **Access the Application**:
   - Web Application Dashboard: `http://localhost:8000`
   - FastAPI Interactive API Docs: `http://localhost:8000/docs`
   - Neo4j Browser UI: `http://localhost:7474`
   - Qdrant Vector Dashboard: `http://localhost:6333/dashboard`

5. **View Container Logs**:
   ```bash
   docker-compose logs -f
   ```

6. **Stop Services**:
   ```bash
   docker-compose down
   ```

---

## Environment Variables Needed

Refer to [.env.example](file:///.env.example) for required configuration keys:

```env
# LLM / API Configuration
GROQ_API_KEY

# LangSmith Observability
LANGCHAIN_TRACING_V2
LANGCHAIN_ENDPOINT
LANGCHAIN_API_KEY
LANGCHAIN_PROJECT

# PostgreSQL Database Configuration
POSTGRES_USER
POSTGRES_PASSWORD
POSTGRES_DB
DATABASE_URL

# Qdrant Vector Database
QDRANT_HOST
QDRANT_PORT

# Neo4j Knowledge Graph
NEO4J_URI
NEO4J_USER
NEO4J_PASSWORD

# Redis Cache & Celery Broker
REDIS_URL
```

---

## Models and Datasets Note

> [!NOTE]
> **Datasets and Pre-Trained ML Models are Not Included in this Repository.**
> 
> Raw training datasets (located in `datasets/`) and binary model weights/pickles (located in `models/`) have been excluded via `.gitignore` to keep the codebase lightweight.

### How to Obtain or Generate Models:

1. **Using Custom Trained Models**:
   - Create the target folder structure: `models/default/`.
   - Place your trained Scikit-learn `.pkl` files inside `models/default/`:
     - `clause_classifier.pkl` & `clause_vectorizer.pkl`
     - `risk_classifier.pkl` & `risk_vectorizer.pkl`
     - `doc_classifier.pkl` & `doc_vectorizer.pkl`
2. **Training New Models**:
   - Supply a labeled dataset CSV in `datasets/`.
   - Run a Scikit-learn training script utilizing `utils/preprocessor.py` to fit TF-IDF vectorizers and classifiers, saving the output serialized `.pkl` files to `models/default/`.

---

## Limitations

- **OCR Dependency**: Tesseract OCR must be installed in the operating system / container environment (`tesseract-ocr` binary) for text extraction from scanned PDF images.
- **Stamp Detection Strategy**: Stamp/seal identification relies on keyword heuristics in text and OCR streams rather than deep computer vision object detection.
- **External Service Dependencies**: Vector search (Qdrant) and graph relationship queries (Neo4j) require their corresponding services to be reachable as defined in the configuration.
- **Large Document Processing**: Processing time for multi-page documents varies depending on available system CPU/GPU resources and Celery worker availability.

---

## Author

**Sneha G**  
*MCA Graduate*  
*Bengaluru, India*
