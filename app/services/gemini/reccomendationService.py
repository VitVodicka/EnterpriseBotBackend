from app.models.reccomendationModels import reccomendationModel
from app.services import fileService
from app.services.gemini.gemini import GeminiService


class RecommendationService():
    def __init__(self):
        self.geminiService = GeminiService()
        pass

    async def recommend(self, jobInfo:str, evaluatedCVs: tuple):
        recommanded_prompt = jobInfo + fileService.FileService().loadDynamicPrompt(
            'app/prompts/recommendation.txt',
            firstcvevaluated=evaluatedCVs[0].model_dump_json(),
            secondcvevaluated=evaluatedCVs[1].model_dump_json(),

        )

        evaluatedCandidate = await self.geminiService.callGeminiPrompt(recommanded_prompt, [], reccomendationModel.RecommendationModel)
        
        return evaluatedCandidate

        