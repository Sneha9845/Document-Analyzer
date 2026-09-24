from neo4j import GraphDatabase
import os
import logging

logger = logging.getLogger(__name__)

class LegalKnowledgeGraph:
    def __init__(self):
        self.uri = os.getenv("NEO4J_URI", "bolt://localhost:7687")
        self.user = os.getenv("NEO4J_USER", "neo4j")
        self.password = os.getenv("NEO4J_PASSWORD", "password")
        
        logger.info(f"Connecting to Neo4j at {self.uri}")
        try:
            self.driver = GraphDatabase.driver(self.uri, auth=(self.user, self.password))
            self.driver.verify_connectivity()
        except Exception as e:
            logger.error(f"Failed to connect to Neo4j: {str(e)}")
            self.driver = None

    def close(self):
        if self.driver:
            self.driver.close()

    def add_clause_node(self, clause_id, text, clause_type, page):
        """Creates a Clause node in the graph."""
        if not self.driver: return
        query = """
        MERGE (c:Clause {id: $id})
        SET c.text = $text, c.type = $type, c.page = $page
        """
        with self.driver.session() as session:
            session.run(query, id=clause_id, text=text, type=clause_type, page=page)

    def add_relationship(self, source_id, target_id, rel_type):
        """
        Creates a relationship between two clauses.
        rel_type can be MODIFIES, REFERENCES, OVERRIDES, EXCEPTS.
        """
        if not self.driver: return
        query = f"""
        MATCH (a:Clause {{id: $source_id}}), (b:Clause {{id: $target_id}})
        MERGE (a)-[r:{rel_type}]->(b)
        """
        with self.driver.session() as session:
            session.run(query, source_id=source_id, target_id=target_id)

    def find_modifying_clauses(self, clause_id):
        """Finds all clauses that modify or override the given clause."""
        if not self.driver: return []
        query = """
        MATCH (c:Clause {id: $id})<-[:MODIFIES|OVERRIDES|EXCEPTS]-(modifier)
        RETURN modifier.id as id, modifier.text as text, modifier.type as type
        """
        with self.driver.session() as session:
            result = session.run(query, id=clause_id)
            return [record.data() for record in result]

    def add_clause_nodes_batch(self, nodes_data):
        """Creates Clause nodes in the graph in batch using UNWIND."""
        if not self.driver: return
        query = """
        UNWIND $nodes AS node
        MERGE (c:Clause {id: node.id})
        SET c.text = node.text, c.type = node.type, c.page = node.page, c.doc_id = node.doc_id
        """
        with self.driver.session() as session:
            session.run(query, nodes=nodes_data)

    def add_relationships_batch(self, relationships_data):
        """Creates relationships between clauses in batch."""
        if not self.driver: return
        rel_types = set([r["rel_type"] for r in relationships_data])
        with self.driver.session() as session:
            for rt in rel_types:
                batch = [{"source_id": r["source_id"], "target_id": r["target_id"]} for r in relationships_data if r["rel_type"] == rt]
                query = f"""
                UNWIND $batch AS rel
                MATCH (a:Clause {{id: rel.source_id}}), (b:Clause {{id: rel.target_id}})
                MERGE (a)-[r:{rt}]->(b)
                """
                session.run(query, batch=batch)

    def get_clause_context(self, clause_id):
        """Fetches the immediate modifying/related clauses as context for RAG."""
        if not self.driver: return ""
        query = """
        MATCH (c:Clause {id: $id})-[r]-(neighbor:Clause)
        RETURN type(r) as rel_type, neighbor.id as id, neighbor.text as text
        """
        with self.driver.session() as session:
            result = session.run(query, id=clause_id)
            context_lines = []
            for record in result:
                context_lines.append(f"[{record['rel_type']}] Related ({record['id']}): {record['text']}")
            return "\n".join(context_lines)
