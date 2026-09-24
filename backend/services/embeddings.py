from sentence_transformers import SentenceTransformer
import numpy as np
import logging

logger = logging.getLogger(__name__)

class LegalEmbeddings:
    def __init__(self, model_name="nlpaueb/legal-bert-base-uncased"):
        logger.info(f"Loading Legal-BERT model: {model_name}")
        self.model = SentenceTransformer(model_name)

    def get_embeddings(self, text):
        """
        Generate embeddings for a single string or list of strings.
        """
        if isinstance(text, str):
            text = [text]
        
        embeddings = self.model.encode(text)
        return embeddings.tolist()

    def semantic_check(self, text1, text2):
        """
        Check cosine similarity between two texts.
        """
        emb1 = np.array(self.get_embeddings(text1))
        emb2 = np.array(self.get_embeddings(text2))
        
        # Reshape if necessary
        if emb1.ndim == 2: emb1 = emb1[0]
        if emb2.ndim == 2: emb2 = emb2[0]
        
        norm1 = np.linalg.norm(emb1)
        norm2 = np.linalg.norm(emb2)
        
        if norm1 == 0 or norm2 == 0:
            return 0.0
            
        return np.dot(emb1, emb2) / (norm1 * norm2)

# Example usage
if __name__ == "__main__":
    embedder = LegalEmbeddings()
    v = embedder.get_embeddings("This is a liability clause.")
    print(f"Generated embedding vector of size: {len(v[0])}")
