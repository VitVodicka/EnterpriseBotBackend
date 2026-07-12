from pydantic import BaseModel

from .EvaluatedPart import EvaluatedPart


class EvaluatedModel(BaseModel):
    BasicPart: EvaluatedPart
    EducationPart: EvaluatedPart
    JobPart: EvaluatedPart
    SkillsPart: EvaluatedPart
    RefferencePart: EvaluatedPart
    ProjectsPart: EvaluatedPart
    HobbiesPart: EvaluatedPart