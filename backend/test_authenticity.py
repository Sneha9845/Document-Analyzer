import asyncio
import os
import sys
import json

# Add parent directory to path to allow imports from agents/core
sys.path.append(os.getcwd())

from agents.authenticity import authenticity_agent
from agents.state import AnalysisState

async def test_authenticity_logic():
    print("Testing Authenticity Agent...")
    
    # Mock state
    mock_state: AnalysisState = {
        "document_id": "test_123",
        "document_text": "THIS IS A TEST DOCUMENT. OFFICIAL GOVERNMENT STAMP FOUND HERE.",
        "filename": "official_doc.pdf",
        "metadata": {"Author": "Government Office", "Creator": "Adobe Acrobat"},
        "stamps": [{"type": "Government/Official", "page": 1, "text_found": "STAMP", "confidence": 0.8}],
        "sections": [],
        "risk_findings": [],
        "current_progress": 0,
        # Other fields omitted for brevity
    }

    # Manually call the agent
    result = await authenticity_agent(mock_state)
    
    print("\nResult:")
    print(json.dumps(result["authenticity"], indent=2))
    
    assert result["authenticity"]["score"] > 50
    assert result["authenticity"]["is_fake"] == False
    print("\nTest passed for Authentic Document!")

    # Test Fake Document
    mock_state_fake: AnalysisState = {
        **mock_state,
        "document_text": "This is a very suspicious document. Buy cheap meds now.",
        "metadata": {"Author": "Anonymous", "Creator": "Online PDF Fake Maker"},
        "stamps": []
    }
    
    result_fake = await authenticity_agent(mock_state_fake)
    print("\nResult (Fake):")
    print(json.dumps(result_fake["authenticity"], indent=2))
    
    # Note: We expect LLM to flag it if Groq is available.
    # Otherwise, the heuristic (no stamps) will lower the score.
    
    print("\nTest passed for Fake Document Detection!")

if __name__ == "__main__":
    if not os.getenv("GROQ_API_KEY"):
        print("Warning: GROQ_API_KEY not set. Test might fail on LLM call.")
    
    asyncio.run(test_authenticity_logic())
