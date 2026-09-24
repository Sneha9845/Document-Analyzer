from langchain_groq import ChatGroq
from langchain_core.prompts import ChatPromptTemplate
from .state import AnalysisState
import os

import asyncio

async def compliance_agent(state: AnalysisState):
    """
    Checks clauses against regulatory compliance standards using GPT-4o.
    """
    llm = ChatGroq(
        model="llama-3.1-8b-instant",
        temperature=0,
        api_key=os.getenv("GROQ_API_KEY"),
        max_retries=20
    )

    prompt = ChatPromptTemplate.from_messages([
        ("system", "You are a legal compliance expert. Verify if the following clause complies with standard regulations (GDPR, Labor Law, etc.) based on the document type."),
        ("user", "Document Type: {doc_type}\nClause: {text}")
    ])

    chain = prompt | llm
    
    doc_type = state["metadata"].get("doc_type", "General")
    
    # Concurrency control (Increased for performance)
    semaphore = asyncio.Semaphore(10)

    async def check_section(section):
        async with semaphore:
            response = await chain.ainvoke({"doc_type": doc_type, "text": section["text"]})
            return {
                "clause_id": section["id"],
                "compliance_status": response.content,
                "agent": "Groq Llama3"
            }

    # Analyze all clauses in parallel
    tasks = [check_section(section) for section in state["sections"]]
    compliance_results = await asyncio.gather(*tasks)

    return {
        "compliance_check": {"results": compliance_results},
        "status": f"Compliance check completed for {len(compliance_results)} clauses by Groq Llama3.",
        "current_progress": 60
    }
