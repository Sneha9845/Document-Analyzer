import asyncio
import os
import logging
from agents.graph import create_analysis_workflow

# Set up logging
logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)

async def test_scalability():
    # 1. Create a large test state
    # We'll use the sample contract text but repeat it to create many clauses
    sample_path = "../sample_contract.txt"
    if not os.path.exists(sample_path):
        logger.error(f"Sample file not found at {sample_path}")
        return

    with open(sample_path, "r") as f:
        text = f.read()

    # Create 15 clauses to exceed the previous 5-clause limit and test parallelization
    sections = []
    for i in range(15):
        sections.append({
            "id": f"clause-{i}",
            "text": f"Clause {i}: {text[:100]}...", # Truncated for token safety in test
            "type": "General"
        })

    state = {
        "document_id": "scale-test-001",
        "document_text": text * 5,
        "metadata": {"filename": "scale_test.txt", "doc_type": "Service Agreement"},
        "sections": sections,
        "risk_findings": [],
        "compliance_check": {"results": []},
        "cross_validation": {"results": []},
        "current_progress": 0
    }

    logger.info(f"Starting scalability test with {len(sections)} clauses...")
    
    workflow = create_analysis_workflow()
    
    # We process starting from risk_detector to skip parser for this specific test
    # But for a full test, we just run the graph
    
    config = {"recursion_limit": 50}
    
    async for output in workflow.astream(state, config=config):
        node_name = list(output.keys())[0]
        data = output[node_name]
        logger.info(f"Node {node_name} completed with status: {data.get('status')}")
        if "risk_findings" in data:
            logger.info(f"Risk findings count: {len(data['risk_findings'])}")
        if "compliance_check" in data:
            logger.info(f"Compliance check count: {len(data['compliance_check']['results'])}")
        if "cross_validation" in data:
            logger.info(f"Validated findings count: {len(data['cross_validation']['results'])}")

    logger.info("Scalability test completed!")

if __name__ == "__main__":
    asyncio.run(test_scalability())
