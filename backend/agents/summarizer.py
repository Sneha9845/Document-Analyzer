from .state import AnalysisState
from langchain_groq import ChatGroq
from langchain_core.prompts import ChatPromptTemplate
import os
import json

async def summary_agent(state: AnalysisState):
    """
    Generates a high-level executive summary of the legal analysis.
    """
    llm = ChatGroq(
        model="llama-3.1-8b-instant",
        temperature=0,
        api_key=os.getenv("GROQ_API_KEY"),
        max_retries=20
    )

    doc_type = state.get("metadata", {}).get("doc_type", "document")
    findings_str = str(state.get("cross_validation", {}).get("results", []))
    authenticity = state.get("authenticity", {})
    verdict = authenticity.get("verdict", "UNKNOWN")
    stamp_status = authenticity.get("govt_stamp", "Not Checked")
    text_sample = state["document_text"][:2000]

    prompt = ChatPromptTemplate.from_messages([
        ("system", f"You are a legal summarizer for non-experts. Your goal is to provide two summaries for the following document text. \n\nCONTEXT: The document has been identified as a '{doc_type}'. \n\nFORMAT:\n1. Start with '[PLAIN ENGLISH INTERPRETATION]'. \n2. YOUR FIRST LINE MUST BE: 'This is a {doc_type}. It is likely {verdict}. We found {stamp_status} Government Stamp.' \n3. Follow with a 2-3 sentence explanation for an uneducated person.\n4. Then add '[PROFESSIONAL LEGAL SUMMARY]' followed by a formal executive analysis.\n\nDOCUMENT TEXT: {{text_sample}}"),
        ("user", "Analysis data to include: {analysis_results}")
    ])

    chain = prompt | llm
    
    response = await chain.ainvoke({
        "analysis_results": f"Findings: {findings_str}\nAuthenticity: {json.dumps(authenticity)}",
        "text_sample": text_sample
    })

    return {
        "summary": response.content,
        "status": "Plain English and Professional summaries generated.",
        "current_progress": 100
    }
