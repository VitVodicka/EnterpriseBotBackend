from pydantic import BaseModel
from datetime import date

class SchoolModel(BaseModel):
    schoolName:str
    yearFrom:date
    yearTo:int
    otherInfo:str