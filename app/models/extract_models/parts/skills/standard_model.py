from pydantic import BaseModel


class StandardModel(BaseModel):
    name: str
    other_info: str = ""
