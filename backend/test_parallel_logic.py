import asyncio
import time
import logging
from typing import Dict, List

# Mocking the AnalysisState and Agent logic for pure parallelization test
class MockAnalysisState(dict):
    pass

async def mock_agent_logic(section: Dict, delay: float = 1.0):
    """Simulates an LLM call with a delay."""
    await asyncio.sleep(delay)
    return {
        "clause_id": section["id"],
        "analysis": f"Mock analysis for {section['id']}",
        "agent": "MockLLM"
    }

async def run_parallel_test(num_clauses: int, concurrency_limit: int):
    sections = [{"id": f"clause-{i}", "text": "Sample text"} for i in range(num_clauses)]
    semaphore = asyncio.Semaphore(concurrency_limit)

    async def wrapped_logic(section):
        async with semaphore:
            return await mock_agent_logic(section)

    start_time = time.time()
    tasks = [wrapped_logic(s) for s in sections]
    results = await asyncio.gather(*tasks)
    end_time = time.time()

    total_time = end_time - start_time
    print(f"--- Parallelization Test Results ---")
    print(f"Clauses: {num_clauses}")
    print(f"Concurrency Limit: {concurrency_limit}")
    print(f"Total Time: {total_time:.2f} seconds")
    print(f"Expected time (if parallel): ~{1.0 * (num_clauses // concurrency_limit + (1 if num_clauses % concurrency_limit else 0)):.1f}s")
    
    return results

if __name__ == "__main__":
    print("Testing scalability logic (15 clauses, limit 10)...")
    asyncio.run(run_parallel_test(15, 10))
