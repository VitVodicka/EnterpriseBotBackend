from pydantic import BaseModel


class StandardModel(BaseModel):
    name: str
    otherInfo: str = ""
