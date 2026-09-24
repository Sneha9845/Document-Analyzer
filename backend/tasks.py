import asyncio
from celery_app import celery_app
from agents.graph import create_analysis_workflow
import logging

logger = logging.getLogger(__name__)

@celery_app.task(name="analyze_document_task")
def analyze_document_task(file_id, text, metadata):
    """
    Celery task to run the LangGraph analysis workflow.
    """
    logger.info(f"Starting async analysis for file_id: {file_id}")
    
    workflow = create_analysis_workflow()
    
    state = {
        "document_id": file_id,
        "document_text": text,
        "metadata": metadata,
        "sections": [],
        "risk_findings": [],
        "current_progress": 0
    }
    
    # Run the graph synchronously within the Celery worker
    final_state = asyncio.run(workflow.ainvoke(state))
    
    logger.info(f"Analysis complete for file_id: {file_id}")
    return {"file_id": file_id, "status": "Complete", "summary": final_state.get("summary")}
