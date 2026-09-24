from .state import AnalysisState
import logging
import re

logger = logging.getLogger(__name__)

async def confidence_scorer(state: AnalysisState):
    """
    Upgraded confidence scoring engine.
    Factors:
    - LLM Agreement (Cross-Validation)
    - Key Risk Words Frequency (Risk Intensity)
    - Text Length/Complexity (Quality Heuristic)
    """
    findings = state.get("cross_validation", {}).get("results", [])
    overall_score = 0
    
    if not findings:
        return {"confidence_score": 0.0, "status": "No findings to score."}

    # Intensity keywords (High impact)
    intensity_keywords = ["critical", "severe", "breach", "liability", "termination", "exclusive"]

    for finding in findings:
        # 1. Base score from cross-validation
        base_score = 0.85 if finding.get("cross_validated") else 0.6
        
        # 2. Score adjustment based on intensity/clarity
        text = finding.get("conclusion", "").lower()
        keyword_match = sum(1 for word in intensity_keywords if word in text)
        intensity_boost = min(0.1, keyword_match * 0.02)
        
        # 3. Penalty for very short conclusions (lack of detail)
        length_penalty = 0
        if len(text.split()) < 10:
            length_penalty = 0.1
            
        final_finding_score = min(1.0, base_score + intensity_boost - length_penalty)
        finding["confidence_metric"] = final_finding_score
        overall_score += final_finding_score

    avg_score = overall_score / len(findings)

    return {
        "confidence_score": avg_score,
        "status": f"Advanced confidence scoring completed. Global score: {avg_score:.2f}",
        "current_progress": 90
    }
