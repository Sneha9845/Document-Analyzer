import fitz  # PyMuPDF
import pdfplumber
import pytesseract
from PIL import Image
import io
import logging

logger = logging.getLogger(__name__)

class LegalPDFProcessor:
    def __init__(self, ocr_enabled=True):
        self.ocr_enabled = ocr_enabled

    def extract_text_and_layout(self, pdf_path):
        """
        Extracts text with layout awareness and detects potential stamps.
        """
        full_text = ""
        pages_info = []
        stamps = []
        metadata = {}
        page_count = 0

        try:
            if pdf_path.lower().endswith('.txt'):
                with open(pdf_path, 'r', encoding='utf-8') as f:
                    full_text = f.read()
                
                pages_info.append({
                    "page_number": 1,
                    "text": full_text,
                    "has_tables": False,
                    "tables": []
                })
                page_count = 1
                metadata = {"format": "Plain Text"}
                
                # Check for stamps in text file
                stamp_keywords = [
                    "STAMP", "SEAL", "OFFICIAL", "GOVERNMENT", "CERTIFIED",
                    "TEHSILDAR", "MAGISTRATE", "REVENUE", "COLLECTOR",
                    "UNIVERSITY", "REGISTRAR", "CONTROLLER", "EXAMINATION",
                    "COUNCIL", "PROVISIONAL", "PASSED", "MARK SHEET",
                    "DIGITALLY SIGNED", "OFFICIAL SEAL", "तहसीलदार"
                ]
                for kw in stamp_keywords:
                    if full_text and kw.upper() in full_text.upper():
                        stamps.append({
                            "type": "Government/Official",
                            "page": 1,
                            "text_found": kw,
                            "confidence": 0.8
                        })
                        break

                return {
                    "full_text": full_text,
                    "pages": pages_info,
                    "metadata": metadata,
                    "stamps": stamps,
                    "page_count": page_count
                }

            # 1. Metadata extraction with PyMuPDF
            doc = fitz.open(pdf_path)
            metadata = doc.metadata
            page_count = len(doc)

            # 2. Detailed extraction
            with pdfplumber.open(pdf_path) as pdf:
                pdf_pages = pdf.pages or []
                for i, page in enumerate(pdf_pages):
                    text = page.extract_text() or ""
                    tables = page.extract_tables() or []
                    
                    # Handle empty/scanned pages with OCR if enabled
                    if not text or len(text.strip()) < 50:
                        if self.ocr_enabled:
                            logger.info(f"Page {i+1} appears to be scanned. Running OCR...")
                            text = self._run_ocr(doc[i])
                        else:
                            logger.warning(f"Page {i+1} might be scanned but OCR is disabled.")

                    # Stamp Detection Heuristic: Text-based (OCR)
                    stamp_keywords = [
                        "STAMP", "SEAL", "OFFICIAL", "GOVERNMENT", "CERTIFIED",
                        "TEHSILDAR", "MAGISTRATE", "REVENUE", "COLLECTOR",
                        "UNIVERSITY", "REGISTRAR", "CONTROLLER", "EXAMINATION",
                        "COUNCIL", "PROVISIONAL", "PASSED", "MARK SHEET",
                        "DIGITALLY SIGNED", "OFFICIAL SEAL", "तहसीलदार"
                    ]
                    for kw in stamp_keywords:
                        if text and kw.upper() in text.upper():
                            stamps.append({
                                "type": "Government/Official",
                                "page": i + 1,
                                "text_found": kw,
                                "confidence": 0.8
                            })
                            break

                    pages_info.append({
                        "page_number": i + 1,
                        "text": text,
                        "has_tables": len(tables) > 0,
                        "tables": tables
                    })
                    full_text += f"\n--- Page {i+1} ---\n{text}"

            return {
                "full_text": full_text,
                "pages": pages_info,
                "metadata": metadata,
                "stamps": stamps,
                "page_count": page_count
            }

        except Exception as e:
            logger.error(f"Error processing PDF {pdf_path}: {str(e)}")
            raise e

    def _run_ocr(self, page_obj):
        """
        Convert PDF page to image and run Tesseract OCR.
        """
        pix = page_obj.get_pixmap()
        img_data = pix.tobytes("png")
        img = Image.open(io.BytesIO(img_data))
        return pytesseract.image_to_string(img)

# Example usage (for internal testing)
if __name__ == "__main__":
    import sys
    if len(sys.argv) > 1:
        processor = LegalPDFProcessor()
        data = processor.extract_text_and_layout(sys.argv[1])
        print(f"Extracted {len(data['full_text'])} characters from {data['page_count']} pages.")
