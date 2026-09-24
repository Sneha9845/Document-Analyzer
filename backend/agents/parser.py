from .state import AnalysisState
from services.knowledge_graph import LegalKnowledgeGraph
import re
import os
import json
from langchain_groq import ChatGroq

async def parser_agent(state: AnalysisState):
    """
    Identifies document type (Step 6: Text Classification) 
    and extracts important details (Step 5: Information Extraction).
    """
    text = state["document_text"]
    
    # 1. Verification Logic for Methodology 6 (Text Classification)
    # Using LLM for higher precision than regex
    llm = ChatGroq(
        model="llama-3.1-8b-instant",
        temperature=0,
        api_key=os.getenv("GROQ_API_KEY")
    )

    classify_prompt = f"""
    Analyze the following document text and classify it into one of these categories:
    - Non-Disclosure Agreement (NDA)
    - Employment Agreement
    - Rental Agreement
    - Academic Mark Sheet
    - Official Government Certificate
    - Legal Notice
    - Unknown Document

    Text Snippet: {text[:2000]}
    
    Return ONLY the category name.
    """
    
    try:
        response = await llm.ainvoke(classify_prompt)
        doc_type = response.content.strip()
    except:
        doc_type = "Unknown Document"

    # 2. Methodology 5: Information Extraction (Elite Feature)
    extract_prompt = f"""
    Extract the following entities from the document and return as JSON:
    {{
        "parties": ["Name of person or organization"],
        "dates": ["Significant dates found"],
        "obligations": ["Primary obligations or commitments"]
    }}

    Text Snippet: {text[:3000]}
    """
    
    try:
        extract_response = await llm.ainvoke(extract_prompt)
        # Attempt to parse json from response
        extracted_data = json.loads(re.search(r'\{.*\}', extract_response.content, re.S).group())
    except:
        extracted_data = {"parties": [], "dates": [], "obligations": []}

    # 3. Split into clauses/sections (Methodology 1: Rule-Based Logic)
    clauses = re.split(r'\n\s*\d+\.\s+', text)
    processed_clauses = []
    
    for i, c in enumerate(clauses):
        if len(c.strip()) > 20:
            processed_clauses.append({
                "id": f"{state['document_id']}_clause_{i}",
                "text": c.strip(),
                "page": 1,
                "type": "General Segment",
                "doc_id": state["document_id"]
            })

    # 4. Graph Integration
    try:
        kg = LegalKnowledgeGraph()
        kg.add_clause_nodes_batch(processed_clauses)
        kg.close()
    except: pass

    # methodology_meta records which methodologies contributed
    methodology_meta = {
        "classification_method": "Deep Learning (LLM)",
        "extraction_method": "NLP / Information Extraction",
        "segmentation_method": "Rule-Based Regex"
    }

    return {
        "metadata": {
            **state.get("metadata", {}), 
            "doc_type": doc_type,
            "extracted_intelligence": extracted_data,
            "methodologies": methodology_meta
        },
        "sections": processed_clauses,
        "status": f"Phase 5 & 6 (Extraction & Classification) complete for {doc_type}.",
        "current_progress": 25
    }
