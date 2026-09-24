from typing import TypedDict, List, Dict, Optional, Annotated

class AnalysisState(TypedDict):
    # Document Info
    document_id: str
    document_text: str
    filename: str
    metadata: Dict

    # Processed Data
    pages: List[Dict]
    sections: List[Dict]

    # Analysis Findings
    risk_findings: List[Dict]
    compliance_check: Dict
    cross_validation: List[Dict]
    authenticity: Dict  # New: {score: float, is_fake: bool, reasoning: str}
    stamps: List[Dict] # New: [{type: str, page: int, text: str}]

    # Summary & Meta
    summary: str
    confidence_score: float
    negotiation_suggestions: List[Dict]
    status: Annotated[str, lambda x, y: y]
    current_progress: Annotated[int, lambda x, y: y]
    final_report: Dict

    # Graph Control
    next_step: Optional[str]
