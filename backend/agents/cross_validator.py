from .state import AnalysisState
import os
import logging
from langchain_groq import ChatGroq

logger = logging.getLogger(__name__)

import asyncio

async def cross_validation_agent(state: AnalysisState):
    """
    Compares findings from Claude (Risk) and GPT-4o (Compliance) and arbitrates disagreements.
    """
    # 1. Fetch results from previous nodes
    risk_findings = state.get("risk_findings", [])
    compliance_results = state.get("compliance_check", {}).get("results", [])
    
    # 2. Concurrency control
    semaphore = asyncio.Semaphore(1) # Lower concurrency for arbitration to avoid prompt exhaustion
    
    arbitrator = ChatGroq(
        model="llama-3.1-8b-instant",
        temperature=0,
        api_key=os.getenv("GROQ_API_KEY"),
        max_retries=20
    )

    async def arbitrate_finding(risk, comp):
        async with semaphore:
            arbitration_prompt = f"""
            Risk Analysis: {risk['analysis']}
            Compliance: {comp['compliance_status']}
            
            Arbitrate these findings. Resolve any conflicts and provide a unified, high-confidence legal finding.
            """
            response = await arbitrator.ainvoke(arbitration_prompt)
            return {
                "clause_id": risk["clause_id"],
                "conclusion": response.content,
                "confidence": "HIGH",
                "cross_validated": True
            }

    # Parallel arbitration
    tasks = []
    for i in range(min(len(risk_findings), len(compliance_results))):
        tasks.append(arbitrate_finding(risk_findings[i], compliance_results[i]))
    
    validated_findings = await asyncio.gather(*tasks)

    return {
        "cross_validation": {"results": validated_findings},
        "status": f"Cross-validation and arbitration completed for {len(validated_findings)} clauses.",
        "current_progress": 80
    }
