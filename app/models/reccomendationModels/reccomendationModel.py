from pydantic import BaseModel


class RecommendationModel(BaseModel):
    RecommendationScore: float
    RecommendedCandidateIndex: int
    RecommendationReason: str
