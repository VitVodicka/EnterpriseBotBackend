from datetime import date
from pydantic import BaseModel


class CertificateModel(BaseModel):
    name: str
    date: date | None = None
    otherInfo: str = ""
