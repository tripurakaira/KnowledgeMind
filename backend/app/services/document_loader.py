from pypdf import PdfReader


def extract_text_from_pdf(file_path):
    """
    Extract text per page from a PDF and return a list of page dicts:
    [{"page": 1, "text": "..."}, ...]
    """
    reader = PdfReader(file_path)

    pages = []

    for i, page in enumerate(reader.pages):
        page_text = page.extract_text() or ""

        pages.append({
            "page": i + 1,
            "text": page_text,
        })

    return pages