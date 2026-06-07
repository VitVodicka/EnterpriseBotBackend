from pydantic import BaseModel


class SummaryModel(BaseModel):
    summary: str
    keywords: list[str]