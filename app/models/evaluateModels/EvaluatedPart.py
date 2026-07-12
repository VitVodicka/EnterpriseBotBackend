from pydantic import BaseModel



class EvaluatedPart(BaseModel):
    EvaluatedScore: float
    EvaluatedReason: str
