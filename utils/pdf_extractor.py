"""
Utility: PDF and document text extraction
"""

import os
import io


def extract_text(file_path: str) -> str:
    """Extract text from PDF, DOCX, or TXT files."""
    ext = os.path.splitext(file_path)[1].lower()

    if ext == '.pdf':
        return _extract_pdf(file_path)
    elif ext == '.docx':
        return _extract_docx(file_path)
    elif ext in ('.txt', '.text'):
        return _extract_txt(file_path)
    else:
        raise ValueError(f"Unsupported file type: {ext}")


def _extract_pdf(file_path: str) -> str:
    """Extract text from PDF using pdfplumber (better) or PyPDF2 fallback."""
    text = ""
    try:
        import pdfplumber
        with pdfplumber.open(file_path) as pdf:
            for page in pdf.pages:
                page_text = page.extract_text()
                if page_text:
                    text += page_text + "\n"
        if text.strip():
            return text.strip()
    except Exception:
        pass

    # Fallback to PyPDF2
    try:
        import PyPDF2
        with open(file_path, 'rb') as f:
            reader = PyPDF2.PdfReader(f)
            for page in reader.pages:
                t = page.extract_text()
                if t:
                    text += t + "\n"
    except Exception as e:
        raise RuntimeError(f"Could not extract text from PDF: {e}")

    return text.strip()


def _extract_docx(file_path: str) -> str:
    """Extract text from DOCX file."""
    try:
        from docx import Document
        doc = Document(file_path)
        paragraphs = [p.text for p in doc.paragraphs if p.text.strip()]
        return "\n".join(paragraphs)
    except Exception as e:
        raise RuntimeError(f"Could not extract text from DOCX: {e}")


def _extract_txt(file_path: str) -> str:
    """Read plain text file."""
    encodings = ['utf-8', 'latin-1', 'cp1252']
    for enc in encodings:
        try:
            with open(file_path, 'r', encoding=enc) as f:
                return f.read().strip()
        except UnicodeDecodeError:
            continue
    raise RuntimeError("Could not decode text file.")
