from qdrant_client import QdrantClient
from qdrant_client.http import models
import os
import logging

logger = logging.getLogger(__name__)

class LegalVectorStore:
    def __init__(self, collection_name="legal_clauses"):
        self.host = os.getenv("QDRANT_HOST", "localhost")
        self.port = int(os.getenv("QDRANT_PORT", 6333))
        self.collection_name = collection_name
        
        logger.info(f"Connecting to Qdrant at {self.host}:{self.port}")
        self.client = QdrantClient(host=self.host, port=self.port)
        self._ensure_collection()

    def _ensure_collection(self):
        """Creates the collection if it doesn't exist."""
        try:
            collections = self.client.get_collections().collections
            exists = any(c.name == self.collection_name for c in collections)
            
            if not exists:
                logger.info(f"Creating collection: {self.collection_name}")
                self.client.create_collection(
                    collection_name=self.collection_name,
                    vectors_config=models.VectorParams(
                        size=768, # Legal-BERT base size
                        distance=models.Distance.COSINE
                    )
                )
        except Exception as e:
            logger.error(f"Error ensuring Qdrant collection: {str(e)}")

    def add_clauses(self, clauses, embeddings, metadata_list):
        """
        Upserts clauses into the vector store.
        """
        points = []
        for i, (text, vector, meta) in enumerate(zip(clauses, embeddings, metadata_list)):
            points.append(models.PointStruct(
                id=hash(text) % (10**10), # Simple unique ID (to be improved)
                vector=vector,
                payload={
                    "text": text,
                    **meta
                }
            ))
            
        self.client.upsert(
            collection_name=self.collection_name,
            points=points
        )
        logger.info(f"Successfully indexed {len(points)} clauses.")

    def search_similar(self, query_vector, limit=5, filter_dict=None):
        """
        Searches for semantically similar clauses.
        """
        search_result = self.client.search(
            collection_name=self.collection_name,
            query_vector=query_vector,
            limit=limit,
            query_filter=models.Filter(**filter_dict) if filter_dict else None
        )
        return search_result
