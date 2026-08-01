from app.models.recommendation_models import recommendation_model
from app.services.file_service import FileService
from app.services.gemini.gemini import GeminiService


class RecommendationService:
    def __init__(self):
        self.gemini_service = GeminiService()

    async def recommend(self, job_info: str, evaluated_cvs: tuple):
        recommended_prompt = job_info + FileService().load_dynamic_prompt(
            'app/prompts/recommendation.txt',
            firstcvevaluated=evaluated_cvs[0].model_dump_json(),
            secondcvevaluated=evaluated_cvs[1].model_dump_json(),
        )

        evaluated_candidate = await self.gemini_service.call_gemini_prompt(recommended_prompt, [], recommendation_model.RecommendationModel)

        return evaluated_candidate

        