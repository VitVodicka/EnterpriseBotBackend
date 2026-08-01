from pydantic import BaseModel

from app.models.evaluate_models.evaluated_part import EvaluatedPart

class EvaluatedModel(BaseModel):
    basic_part: EvaluatedPart
    education_part: EvaluatedPart
    job_part: EvaluatedPart
    skills_part: EvaluatedPart
    reference_part: EvaluatedPart
    projects_part: EvaluatedPart
    hobbies_part: EvaluatedPart