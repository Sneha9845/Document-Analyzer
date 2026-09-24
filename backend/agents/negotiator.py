from .state import AnalysisState
from langchain_groq import ChatGroq
from langchain_core.prompts import ChatPromptTemplate
import os

async def negotiation_agent(state: AnalysisState):
    """
    Provides negotiation suggestions and alternative clause language for high-risk findings.
    """
    llm = ChatGroq(
        model="llama-3.1-8b-instant",
        temperature=0.7, # Higher temperature for creative alternatives
        api_key=os.getenv("GROQ_API_KEY"),
        max_retries=20
    )

    prompt = ChatPromptTemplate.from_messages([
        ("system", "You are an expert contract negotiator. For the following high-risk legal finding, provide 3 specific negotiation tactics and alternative 'pro-contractor' or 'balanced' language."),
        ("user", "Finding: {finding}\nOriginal Clause: {clause}")
    ])

    chain = prompt | llm
    
    # Analyze only high-risk findings
    high_risk_findings = [f for f in state.get("cross_validation", {}).get("results", []) if "high" in str(f).lower()]
    
    suggestions = []
    for finding in high_risk_findings[:2]:
        response = await chain.ainvoke({
            "finding": finding["conclusion"],
            "clause": "Placeholder original text" # In real app, map back to sections
        })
        
        suggestions.append({
            "clause_id": finding["clause_id"],
            "suggestions": response.content
        })

    return {
        "negotiation_suggestions": suggestions,
        "status": "Negotiation suggestions generated for high-risk clauses.",
    }
