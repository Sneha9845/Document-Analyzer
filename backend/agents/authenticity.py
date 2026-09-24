from .state import AnalysisState
from langchain_groq import ChatGroq
from langchain_core.prompts import ChatPromptTemplate
import os
import json
import re

async def authenticity_agent(state: AnalysisState):
    """
    Analyzes document for potential fakeness and detects government stamps.
    """
    text = state["document_text"]
    metadata = state.get("metadata", {})
    stamps = state.get("stamps", [])
    
    doc_type = metadata.get("doc_type", "Unknown")
    
    llm = ChatGroq(
        model="llama-3.1-8b-instant",
        temperature=0,
        api_key=os.getenv("GROQ_API_KEY")
    )
    
    prompt = ChatPromptTemplate.from_messages([
        ("system", f"""You are an expert in document forensics. Analyze the provided document metadata, stamps, and text to determine authenticity.

CONTEXT: Document type is '{doc_type}'.

SPECIFIC TASKS:
1. For EACH stamp in 'Stamps Found', assess whether it is REAL or FAKE based on context, keywords, formatting, and consistency with the document type.
2. For each stamp provide a line in this exact format:
   [STAMP_VERDICT: <stamp_text_found>: REAL|FAKE|SUSPICIOUS (<confidence 0-100>%)] - <one sentence reason>
3. Then give the overall document verdict.
4. Conclude with exactly one of: [VERDICT: REAL] or [VERDICT: FAKE]

IMPORTANT: Every stamp listed in 'Stamps Found' must get its own [STAMP_VERDICT] line."""),
        ("user", "Metadata: {metadata}\nStamps Found: {stamps}\nText Sample: {text_sample}")
    ])

    chain = prompt | llm
    
    # Send a sample of the text (first 2000 chars) to the LLM
    text_sample = text[:2000]
    
    try:
        response = await chain.ainvoke({
            "metadata": json.dumps(metadata),
            "stamps": json.dumps(stamps),
            "text_sample": text_sample
        })
        
        reasoning = response.content

        # Resilient regex verdict extraction
        verdict_match = re.search(r"\[VERDICT:\s*(REAL|FAKE)\]", reasoning, re.I)
        verdict = verdict_match.group(1).upper() if verdict_match else "UNKNOWN"

        # Per-stamp verdict extraction
        # Pattern: [STAMP_VERDICT: <keyword>: REAL|FAKE|SUSPICIOUS (<confidence>%)] - <reason>
        stamp_verdict_pattern = re.compile(
            r"\[STAMP_VERDICT:\s*(.+?):\s*(REAL|FAKE|SUSPICIOUS)\s*\((\d+)%\)\]\s*-?\s*(.*)",
            re.IGNORECASE
        )
        stamp_verdicts = {}
        for m in stamp_verdict_pattern.finditer(reasoning):
            kw   = m.group(1).strip().upper()
            sv   = m.group(2).strip().upper()
            conf = int(m.group(3))
            why  = m.group(4).strip()
            stamp_verdicts[kw] = {"verdict": sv, "confidence": conf, "reason": why}

        # Attach per-stamp verdict to each detected stamp
        annotated_stamps = []
        for s in stamps:
            kw_found = s.get("text_found", "").upper()
            sv_info  = stamp_verdicts.get(kw_found, {})
            # Fallback: match on any key containing the stamp keyword
            if not sv_info:
                for sv_key, sv_val in stamp_verdicts.items():
                    if kw_found in sv_key or sv_key in kw_found:
                        sv_info = sv_val
                        break
            # Final fallback: derive from overall verdict
            if not sv_info:
                sv_info = {
                    "verdict": verdict if verdict != "UNKNOWN" else "SUSPICIOUS",
                    "confidence": int(s.get("confidence", 0.7) * 100),
                    "reason": "Derived from overall document verdict."
                }
            annotated_stamps.append({
                **s,
                "stamp_verdict": sv_info["verdict"],
                "stamp_confidence": sv_info["confidence"],
                "stamp_reason": sv_info["reason"]
            })
        stamps = annotated_stamps
        
        is_fake = (verdict == "FAKE")
        
        # Check for Government or Academic Stamp in the stamps list (Rule-Based Signal)
        govt_stamp_detected = any(s.get("type", "").lower() in ["government", "official", "seal", "university", "registrar"] for s in stamps)
        if any(kw in reasoning.lower() for kw in ["government", "university", "registrar"]) and "stamp" in reasoning.lower() and "found" in reasoning.lower():
            govt_stamp_detected = True

        # Methodology 8: Hybrid Approach Scoring
        # Start at 100, subtracting penalties based on weighted signals
        score = 100.0
        
        # Deep Learning Signal Penalty (Weight: 50%)
        if is_fake:
            score -= 50.0
        elif verdict == "UNKNOWN":
            if "suspicious" in reasoning.lower() or "forgery" in reasoning.lower():
                is_fake = True
                score -= 40.0
            
        # Rule-Based Signal Penalty (Weight: 20-50% depending on doc context)
        if not govt_stamp_detected:
            if "Academic Marks Card" in doc_type: # Less penalty for academic docs (digital seals)
                score -= 10.0
            elif "Certificate" in doc_type: # Medium penalty
                score -= 20.0
            else: # Standard contract penalty
                score -= 30.0
        
        # Define final verdict based on Hybrid score thresholds
        final_verdict = "REAL"
        if score < 40:
            final_verdict = "FAKE"
        elif score < 65:
            final_verdict = "REVIEW" # Borderline cases needing human-in-the-loop

        # Record methodologies used
        hybrid_methodologies = metadata.get("methodologies", {})
        hybrid_methodologies["authenticity_scoring"] = "Hybrid (DL Text + Rule-Based Stamps)"

        authenticity = {
            "score": max(0.0, float(score)),
            "is_fake": (final_verdict == "FAKE"),
            "verdict": final_verdict,
            "govt_stamp": "Found" if govt_stamp_detected else "Not Found",
            "stamps_detail": stamps,   # Each stamp now has stamp_verdict, stamp_confidence, stamp_reason
            "reasoning": reasoning,
            "methodology": "Hybrid Approach (Step 8)"
        }
        
        # Update metadata state
        metadata["methodologies"] = hybrid_methodologies
    except Exception as e:
        authenticity = {
            "score": 0.0,
            "is_fake": False,
            "reasoning": f"Error in authenticity analysis: {str(e)}"
        }

    return {
        "authenticity": authenticity,
        "stamps": stamps,            # Propagate annotated stamps back into state
        "status": "Authenticity and stamp verification complete.",
        "current_progress": 30
    }
