from langchain_text_splitters import RecursiveCharacterTextSplitter


def split_text(pages: list[dict]):
    """
    Split each page's text into chunks and preserve page metadata.

    Input: pages = [{"page": 1, "text": "..."}, ...]
    Output: chunks = [{"text": "...", "page": 1}, ...]
    """
    splitter = RecursiveCharacterTextSplitter(
        chunk_size=500,
        chunk_overlap=100
    )

    all_chunks = []

    for p in pages:
        page_num = p.get("page")
        page_text = p.get("text", "")

        if not page_text.strip():
            continue

        splits = splitter.split_text(page_text)

        for s in splits:
            all_chunks.append({
                "text": s,
                "page": page_num,
            })

    return all_chunks