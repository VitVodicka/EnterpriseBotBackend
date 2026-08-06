import io
import os

# GEMINI_API_KEY musí být nastavený DŘÍV, než se poprvé importuje app.core.config
# (Settings se validuje hned při importu modulu -> bez klíče by import appky spadl).
os.environ.setdefault("GEMINI_API_KEY", "test-key-for-pytest")

import pytest
from pypdf import PdfWriter


def make_fake_pdf(num_pages: int) -> bytes:
    """Pomocná funkce - vytvoří validní PDF s daným počtem prázdných stránek."""
    writer = PdfWriter()
    for _ in range(num_pages):
        writer.add_blank_page(width=200, height=200)
    buffer = io.BytesIO()
    writer.write(buffer)
    return buffer.getvalue()


@pytest.fixture
def valid_company_introduction() -> str:
    return '{"company_type": "s.r.o.", "industry": "IT", "company_size": 10}'


@pytest.fixture
def pdf_1_page() -> bytes:
    return make_fake_pdf(1)


@pytest.fixture
def pdf_5_pages() -> bytes:
    return make_fake_pdf(5)


@pytest.fixture
def pdf_6_pages() -> bytes:
    return make_fake_pdf(6)
