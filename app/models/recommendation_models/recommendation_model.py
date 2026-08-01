from pydantic import BaseModel


class RecommendationModel(BaseModel):
    recommendation_score: float
    recommended_candidate_index: int
    recommendation_reason: str
