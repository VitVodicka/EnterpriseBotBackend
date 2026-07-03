from datetime import date
from pydantic import BaseModel
from datetime import date


class CertificateModel(BaseModel):
    name: str
    date: date 
    otherInfo: str = ""
