import os
import csv
import io
from PyPDF2 import PdfReader
from docx import Document


def extract_text(file_path: str) -> str:
    """Extract text content from a file based on its extension."""
    ext = os.path.splitext(file_path)[1].lower()

    if ext == ".pdf":
        return extract_pdf(file_path)
    elif ext == ".docx":
        return extract_docx(file_path)
    elif ext == ".txt":
        return extract_txt(file_path)
    elif ext == ".csv":
        return extract_csv(file_path)
    else:
        return ""


def extract_pdf(file_path: str) -> str:
    """Pull text from all pages of a PDF."""
    reader = PdfReader(file_path)
    text = []
    for page in reader.pages:
        page_text = page.extract_text()
        if page_text:
            text.append(page_text)
    return "\n".join(text)


def extract_docx(file_path: str) -> str:
    """Pull text from a Word document."""
    doc = Document(file_path)
    return "\n".join([p.text for p in doc.paragraphs if p.text.strip()])


def extract_txt(file_path: str) -> str:
    """Read a plain text file."""
    with open(file_path, "r", encoding="utf-8", errors="ignore") as f:
        return f.read()


def extract_csv(file_path: str) -> str:
    """Convert CSV rows into readable text."""
    with open(file_path, "r", encoding="utf-8", errors="ignore") as f:
        reader = csv.reader(f)
        rows = []
        for row in reader:
            rows.append(" | ".join(row))
        return "\n".join(rows)
