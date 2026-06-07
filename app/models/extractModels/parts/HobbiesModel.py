

from pydantic import BaseModel


class HobbiesModel(BaseModel):
    hobbies: list[str]