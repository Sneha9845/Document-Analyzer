import asyncio
import os
from core.pdf_processor import LegalPDFProcessor
from services.embeddings import LegalEmbeddings
from agents.parser import parser_agent
import logging

# Set up logging to console
logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)

async def test_pipeline():
    # 1. Initialize services
    processor = LegalPDFProcessor(ocr_enabled=False) # Disable OCR for local test if tesseract not installed
    embedder = LegalEmbeddings()
    
    # 2. Process a sample file if it exists
    sample_path = "../sample_contract.txt" # Using the root sample
    if not os.path.exists(sample_path):
        logger.error(f"Sample file not found at {sample_path}")
        return

    with open(sample_path, "r") as f:
        text = f.read()

    logger.info("Starting test pipeline...")
    
    # 3. Test Parser Agent
    state = {
        "document_text": text,
        "metadata": {"filename": "sample_contract.txt"},
        "document_id": "test-123"
    }
    
    parsed_state = await parser_agent(state)
    logger.info(f"Parser completed. Found {len(parsed_state['sections'])} clauses.")
    logger.info(f"Detected Doc Type: {parsed_state['metadata']['doc_type']}")

    # 4. Test Embeddings on first clause
    if parsed_state["sections"]:
        first_clause = parsed_state["sections"][0]["text"]
        logger.info(f"Generating embedding for clause: {first_clause[:50]}...")
        vector = embedder.get_embeddings(first_clause)
        logger.info(f"Vector size: {len(vector[0])}")

    logger.info("Pipeline test successful!")

if __name__ == "__main__":
    asyncio.run(test_pipeline())
