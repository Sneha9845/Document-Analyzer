from langgraph.graph import StateGraph, END
from .state import AnalysisState

# Import actual node functions
from .parser import parser_agent
from .authenticity import authenticity_agent
from .risk import risk_agent
from .compliance import compliance_agent
from .cross_validator import cross_validation_agent
from .summarizer import summary_agent
from .confidence_scorer import confidence_scorer
from .negotiator import negotiation_agent

# Build the workflow
def create_analysis_workflow():
    workflow = StateGraph(AnalysisState)
    
    # Add Nodes
    workflow.add_node("parser", parser_agent)
    workflow.add_node("authenticity_checker", authenticity_agent)
    workflow.add_node("risk_detector", risk_agent)
    workflow.add_node("compliance_checker", compliance_agent)
    workflow.add_node("cross_validator", cross_validation_agent)
    workflow.add_node("confidence_scorer", confidence_scorer)
    workflow.add_node("negotiator", negotiation_agent)
    workflow.add_node("summarizer", summary_agent)
    
    # Define Edges (Optimized for Parallel Execution)
    workflow.set_entry_point("parser")
    
    # After parser, run Risk, Compliance, and Authenticity in parallel
    workflow.add_edge("parser", "risk_detector")
    workflow.add_edge("parser", "compliance_checker")
    workflow.add_edge("parser", "authenticity_checker")
    
    # All analysis agents converge at cross_validator
    workflow.add_edge("risk_detector", "cross_validator")
    workflow.add_edge("compliance_checker", "cross_validator")
    workflow.add_edge("authenticity_checker", "cross_validator")
    
    workflow.add_edge("cross_validator", "confidence_scorer")
    workflow.add_edge("confidence_scorer", "negotiator")
    workflow.add_edge("negotiator", "summarizer")
    workflow.add_edge("summarizer", END)
    
    return workflow.compile()
