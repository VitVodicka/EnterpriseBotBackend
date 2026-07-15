
from app.models.introductionModels.PositionIntroducitonModel import PositionIntroductionModel
from app.services.gemini.gemini import GeminiService


class CompanyIntentExtractorService:
    def __init__(self, gemini_service: GeminiService | None = None) -> None:
        self.geminiService = gemini_service or GeminiService()

    async def extractCompanyIntent(self, jobAd: str):
         #first form job ad  what position they are looking for
        if(len(jobAd) <50):
            return {"error": "Job ad is too short"}
        
        candidateInfo= await self.geminiService.callGeminiPrompt(jobAd, [], PositionIntroductionModel)
        print(candidateInfo)

        #second from their requirments build a prompt

        
        pass

    