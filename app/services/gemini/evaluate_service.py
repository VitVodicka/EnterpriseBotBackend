
from app.helper.file_convertor_helper import FileConvertorHelper
from app.models.evaluate_models.evaluated_model import EvaluatedModel
from app.models.extract_models.extracted_model import ExtractedModel
from app.services.file_service import FileService
from app.services.gemini.gemini import GeminiService


class EvaluateService:
    def __init__(self):
        self.gemini_service = GeminiService()

    async def evaluate_cvs(self, extracted_cvs: tuple[ExtractedModel, ExtractedModel], job_info: str) -> tuple[EvaluatedModel, EvaluatedModel]:
        evaluate_prompt_cv1 = job_info + FileService().load_dynamic_prompt(
            'app/prompts/evaluate.txt',
            cv=extracted_cvs[0].model_dump_json(),
        )

        evaluate_prompt_cv2 = job_info + FileService().load_dynamic_prompt(
            'app/prompts/evaluate.txt',
            cv=extracted_cvs[1].model_dump_json(),
        )

        evaluated_cv1 = await self.gemini_service.call_gemini_prompt(evaluate_prompt_cv1, [], EvaluatedModel)
        evaluated_cv2 = await self.gemini_service.call_gemini_prompt(evaluate_prompt_cv2, [], EvaluatedModel)

        print("evaluated_cv1:", evaluated_cv1)
        print("evaluated_cv2:", evaluated_cv2)

        return (evaluated_cv1, evaluated_cv2)
        
        
       