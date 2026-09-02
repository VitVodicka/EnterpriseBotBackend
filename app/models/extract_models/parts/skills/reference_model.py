from datetime import date

from pydantic import BaseModel

class ReferenceModel(BaseModel):
    from_: str
    reference_date: date | None = None
    text: str = ""
    other_info: str = ""