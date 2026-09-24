from fastapi import FastAPI, WebSocket, WebSocketDisconnect, UploadFile, File, Depends, Response
from fastapi.staticfiles import StaticFiles
from fastapi.responses import HTMLResponse, FileResponse
from fastapi.middleware.cors import CORSMiddleware
from sqlalchemy.orm import Session
import logging
import uuid
import os

from models.db_utils import get_db, init_db
from models.database import Document, Analysis
from core.pdf_processor import LegalPDFProcessor
from agents.graph import create_analysis_workflow
# Configure LangSmith Observability
os.environ["LANGCHAIN_TRACING_V2"] = os.getenv("LANGCHAIN_TRACING_V2", "true")
os.environ["LANGCHAIN_ENDPOINT"] = os.getenv("LANGCHAIN_ENDPOINT", "https://api.smith.langchain.com")
os.environ["LANGCHAIN_API_KEY"] = os.getenv("LANGCHAIN_API_KEY", "")
os.environ["LANGCHAIN_PROJECT"] = os.getenv("LANGCHAIN_PROJECT", "Elite_Legal_Analyzer")

logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)

# Initialize DB on startup
try:
    init_db()
except Exception as e:
    logger.warning(f"Database initialization skipped or failed: {e}")

app = FastAPI(title="Elite Legal Document Analyzer API")

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)


processor = LegalPDFProcessor()
workflow = create_analysis_workflow()

ATTORNEYS = ["Sarah Chen", "Marcus Liu", "James Park", "Emily Roberts", "David Wilson", "Elena Rodriguez"]
import random



@app.post("/upload")
async def upload_document(file: UploadFile = File(...), db: Session = Depends(get_db)):
    if not file.filename.lower().endswith(('.pdf', '.txt', '.doc', '.docx')):
        from fastapi import HTTPException
        raise HTTPException(status_code=400, detail="Invalid file type. Only PDF, TXT, DOC, DOCX allowed.")
    
    file_id_uuid = uuid.uuid4()
    file_id = str(file_id_uuid)
    file_path = f"uploads/{file_id}_{file.filename}"
    
    os.makedirs("uploads", exist_ok=True)
    content = await file.read()
    with open(file_path, "wb") as f:
        f.write(content)
    
    # Save to database
    db_doc = Document(
        id=file_id_uuid,
        filename=file.filename,
        document_type="General Contract", # Default, updated during analysis
        attorney_name=random.choice(ATTORNEYS)
    )
    db.add(db_doc)
    db.commit()
    db.refresh(db_doc)
        
    return {"file_id": file_id, "filename": file.filename, "path": file_path}

from core.jurisdiction import JurisdictionDetector
juris_detector = JurisdictionDetector()

def get_document_text(file_id: str) -> str:
    upload_dir = "uploads"
    if not os.path.exists(upload_dir):
        raise Exception("Uploads directory not found.")
    matched_files = [f for f in os.listdir(upload_dir) if f.startswith(file_id)]
    if not matched_files:
        raise Exception(f"Document {file_id} not found.")
        
    file_path = os.path.join(upload_dir, matched_files[0])
    if file_path.endswith('.pdf'):
        return processor.extract_text(file_path)
    else:
        with open(file_path, "r", encoding="utf-8") as f:
            return f.read()

@app.post("/analyze_async/{file_id}")
async def analyze_document_async(file_id: str):
    logger.info(f"Triggering async analysis for: {file_id}")
    try:
        text = get_document_text(file_id)

        detected_jurisdiction = juris_detector.detect(text)
        metadata = {
            "filename": "contract.pdf",
            "jurisdiction": detected_jurisdiction
        }

        task = analyze_document_task.delay(file_id, text, metadata)
        return {"task_id": task.id, "status": "Processing"}
    except Exception as e:
        logger.error(f"Error triggering task: {str(e)}")
        return {"error": str(e)}

@app.get("/task_status/{task_id}")
async def get_task_status(task_id: str):
    from celery.result import AsyncResult
    task_result = AsyncResult(task_id)
    return {
        "task_id": task_id,
        "status": task_result.status,
        "result": task_result.result if task_result.status == "SUCCESS" else None
    }

@app.get("/api/documents/cases")
async def get_cases(db: Session = Depends(get_db)):
    try:
        # Join documents with their latest analysis
        # For simplicity in this version, we'll just get all documents and their associated analysis
        results = db.query(Document, Analysis).outerjoin(Analysis, Document.id == Analysis.document_id).order_by(Document.uploaded_at.desc()).all()
        
        cases = []
        for doc, analysis in results:
            cases.append({
                "id": str(doc.id),
                "name": doc.filename,
                "type": doc.document_type or "General Contract",
                "status": "Completed" if analysis else "Pending",
                "risk": analysis.risk_level if analysis else "N/A",
                "risk_score": analysis.overall_risk_score if analysis else 0,
                "attorney": doc.attorney_name or "System AI",
                "deadline": doc.uploaded_at.strftime("%b %d, %Y"),
                "pages": doc.page_count or 0,
                "progress": 100 if analysis else 0
            })
        return cases
    except Exception as e:
        logger.error(f"Error fetching cases: {e}")
        return []

@app.websocket("/ws/analyze/{file_id}")
async def stream_analysis(websocket: WebSocket, file_id: str):
    await websocket.accept()
    logger.info(f"Analysis started for: {file_id}")
    
    # Manually get DB session for WebSocket
    from models.db_utils import SessionLocal
    db = SessionLocal()

    try:
        # 1. Process Document
        upload_dir = "uploads"
        matched_files = [f for f in os.listdir(upload_dir) if f.startswith(file_id)]
        if not matched_files:
            raise Exception(f"Document {file_id} not found.")
        file_path = os.path.join(upload_dir, matched_files[0])
        
        # Use the processor to get full layout info
        doc_data = processor.extract_text_and_layout(file_path)
        text = doc_data["full_text"]
        
        detected_jurisdiction = juris_detector.detect(text)

        # 2. Initialize State
        state = {
            "document_id": file_id,
            "document_text": text,
            "filename": matched_files[0],
            "metadata": {
                **doc_data["metadata"],
                "jurisdiction": detected_jurisdiction
            },
            "stamps": doc_data["stamps"],
            "sections": [],
            "risk_findings": [],
            "current_progress": 0
        }

        # 3. Stream Graph Updates
        final_state = state
        async for output in workflow.astream(state):
            # output is a dict like {'node_name': {state_updates}}
            node_name = list(output.keys())[0]
            data = output[node_name]
            final_state.update(data)
            
            await websocket.send_json({
                "agent": node_name,
                "status": data.get("status", "Processing..."),
                "progress": data.get("current_progress", 0),
                "data": {k: v for k, v in data.items() if k not in ["status", "current_progress"]}
            })

        # 4. Persist Analysis to DB
        try:
            from models.database import ClauseFinding, Analysis, Document
            
            # Create Analysis record
            analysis_id = uuid.uuid4()
            db_analysis = Analysis(
                id=analysis_id,
                document_id=uuid.UUID(file_id),
                overall_risk_score=final_state.get("confidence_score", 0.0),
                risk_level="High" if final_state.get("risk_findings") else "Low",
                summary=final_state.get("summary", ""),
                confidence_score=final_state.get("confidence_score", 0.0)
            )
            db.add(db_analysis)
            
            # Update document type if detected
            doc_record = db.query(Document).filter(Document.id == uuid.UUID(file_id)).first()
            if doc_record and final_state.get("metadata", {}).get("doc_type"):
                doc_record.document_type = final_state["metadata"]["doc_type"]

            # Save Findings
            for finding in final_state.get("risk_findings", []):
                db_finding = ClauseFinding(
                    analysis_id=analysis_id,
                    clause_type=finding.get("clause", "General"),
                    clause_text=finding.get("text", ""),
                    risk_level=finding.get("severity", "Medium"),
                    explanation=finding.get("explanation", ""),
                    page_number=finding.get("page", 1)
                )
                db.add(db_finding)
            
            db.commit()
            logger.info(f"Persisted analysis for {file_id}")
        except Exception as db_err:
            logger.error(f"Failed to persist analysis: {db_err}")
            db.rollback()

        await websocket.send_json({"agent": "System", "status": "Complete", "progress": 100})

    except Exception as e:
        logger.error(f"Error in streaming analysis: {str(e)}")
        await websocket.send_json({"error": str(e)})
    finally:
        db.close() # Close the manual session
        await websocket.close()


# Unified Frontend: Serve static files from the build directory
# We check if the dir exists (it will be created by the build step)
# This MUST be at the end of the file so it doesn't intercept /api routes
STATIC_DIR = os.path.join(os.getcwd(), "static")
if os.path.exists(STATIC_DIR):
    app.mount("/_next", StaticFiles(directory=os.path.join(STATIC_DIR, "_next")), name="next_static")
    
    @app.get("/")
    async def serve_index():
        index_path = os.path.join(STATIC_DIR, "index.html")
        if os.path.exists(index_path):
            return FileResponse(index_path)
        return HTMLResponse("Frontend build not found. Running in API-only mode.", status_code=404)

    @app.get("/{full_path:path}")
    async def serve_static(full_path: str):
        # API routes take precedence (already defined above)
        
        # 1. Try exact file path
        file_path = os.path.join(STATIC_DIR, full_path)
        if os.path.isfile(file_path):
            return FileResponse(file_path)
            
        # 2. Try adding .html (for Next.js static export paths)
        html_path = f"{file_path}.html"
        if os.path.isfile(html_path):
            return FileResponse(html_path)

        # 3. Try index.html in the directory
        dir_index = os.path.join(file_path, "index.html")
        if os.path.isfile(dir_index):
            return FileResponse(dir_index)
            
        # 4. Default to root index.html for client-side routing fallback
        index_path = os.path.join(STATIC_DIR, "index.html")
        if os.path.exists(index_path):
            return FileResponse(index_path)
        
        return HTMLResponse("Frontend build not found.", status_code=404)
