from fastapi import APIRouter, UploadFile, File
from app.services.document_loader import extract_text_from_pdf
from app.services.chunking import split_text
from app.services.embeddings import create_embeddings
from app.services.store import vector_store
import shutil

router = APIRouter()


@router.post("/upload")
async def upload_document(file: UploadFile = File(...)):

    file_location = f"documents/{file.filename}"

    with open(file_location, "wb") as buffer:
        shutil.copyfileobj(file.file, buffer)

    pages = extract_text_from_pdf(file_location)

    chunks = split_text(pages)

    # create_embeddings expects a list of texts
    chunk_texts = [c["text"] for c in chunks]

    embeddings = create_embeddings(chunk_texts)

    vector_store.add_documents(chunks, embeddings)

    print("Indexed chunks:", len(vector_store.chunks))

    total_text_len = sum(len(p.get("text", "")) for p in pages)

    # derive embedding dimension
    try:
        embedding_dim = int(embeddings.shape[1]) if hasattr(embeddings, "shape") and len(embeddings.shape) > 1 else (len(embeddings[0]) if len(embeddings) > 0 else 0)
    except Exception:
        embedding_dim = 0

    # vector index readiness
    try:
        index_size = int(vector_store.index.ntotal)
    except Exception:
        index_size = 0

    return {
        "filename": file.filename,
        "pages": len(pages),
        "text_length": total_text_len,
        "chunks": len(chunks),
        "embedding_dim": embedding_dim,
        "index_size": index_size,
        "message": "Document indexed successfully",
        "status": "ready" if index_size > 0 else "pending"
    }