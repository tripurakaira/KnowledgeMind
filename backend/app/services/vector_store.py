import faiss
import numpy as np


class VectorStore:
    def __init__(self, dimension=384):
        self.index = faiss.IndexFlatL2(dimension)
        # store chunk metadata dicts: {"text":..., "page":...}
        self.chunks = []

    def add_documents(self, chunks, embeddings):
        """
        chunks: list[dict] with keys `text` and `page`
        embeddings: list/array aligned with chunks
        """
        embeddings = np.array(embeddings).astype("float32")

        self.index.add(embeddings)
        self.chunks.extend(chunks)

    def search(self, query_embedding, k=3):

        # No documents indexed yet
        if len(self.chunks) == 0:
            return []

        query_embedding = np.array([query_embedding]).astype("float32")

        distances, indices = self.index.search(query_embedding, k)

        results = []

        for i in indices[0]:
            if 0 <= i < len(self.chunks):
                results.append(self.chunks[i])

        return results