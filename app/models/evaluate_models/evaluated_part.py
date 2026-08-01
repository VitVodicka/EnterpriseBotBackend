from pydantic import BaseModel



class EvaluatedPart(BaseModel):
    evaluated_score: float
    evaluated_reason: str
