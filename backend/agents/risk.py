from langchain_groq import ChatGroq
from langchain_core.prompts import ChatPromptTemplate
from .state import AnalysisState
from services.knowledge_graph import LegalKnowledgeGraph
import os
import json

import asyncio

async def risk_agent(state: AnalysisState):
    """
    Analyzes clauses for legal risks using Groq.
    """
    llm = ChatGroq(
        model="llama-3.1-8b-instant",
        temperature=0,
        api_key=os.getenv("GROQ_API_KEY"),
        max_retries=20
    )

    prompt = ChatPromptTemplate.from_messages([
        ("system", "You are an elite legal risk assessor. Analyze the following contract clause and identify potential risks, their severity (Low, Medium, High, Critical), and provide a recommendation. Use the provided graph context to understand relationships, modifiers, or overrides that may affect risk."),
        ("user", "Clause Type: {type}\nClause Text: {text}\n\nGraph Context (Related Clauses):\n{context}")
    ])

    chain = prompt | llm
    
    # Concurrency control (Increased for performance)
    semaphore = asyncio.Semaphore(10)

    kg = LegalKnowledgeGraph()

    async def analyze_section(section):
        async with semaphore:
            # Fetch context from Neo4j
            context = kg.get_clause_context(section["id"])
            if not context:
                context = "None"
                
            response = await chain.ainvoke({
                "type": section["type"], 
                "text": section["text"],
                "context": context
            })
            return {
                "clause_id": section["id"],
                "analysis": response.content,
                "agent": "Groq Llama3"
            }

    # Analyze all clauses in parallel
    tasks = [analyze_section(section) for section in state["sections"]]
    findings = await asyncio.gather(*tasks)
    kg.close()

    return {
        "risk_findings": findings,
        "status": f"Risk detection completed for {len(findings)} clauses by Groq.",
        "current_progress": 40
    }
