from app.models.introductionModels.CompanyIntroductionModel import CompanyIntroductionModel
from app.models.introductionModels.PositionIntroducitonModel import PositionIntroductionModel
from app.services import fileService
from app.services.gemini.gemini import GeminiService


class CompanyIntentExtractorService:

    def __init__(self, gemini_service: GeminiService | None = None) -> None:
        self.geminiService = gemini_service or GeminiService()

    @staticmethod
    def format_skill_list(skills: list[str]) -> str:
        return "\n".join(f"- {s}" for s in skills) if skills else "Neuvedeno."

    @staticmethod
    def clean_unknown(value: str) -> str:
        return "neuvedeno" if not value or value.strip().lower() == "unknown" else value

    async def extractCompanyIntent(self, jobAd: str, companyIntroduction: CompanyIntroductionModel):
        # from this it will be a part position and company info in a prompt for next sections

        if len(jobAd) < 50:
            return {"error": "Job ad is too short"}

        candidateInfo = await self.geminiService.callGeminiPrompt(jobAd, [], PositionIntroductionModel)


        position_prompt = fileService.FileService().loadDynamicPrompt(
            'app/prompts/position_context.txt',
            PositionName=self.clean_unknown(candidateInfo.PositionName),
            Seniority=self.clean_unknown(candidateInfo.Seniority),
            JobDescription=candidateInfo.JobDescription,
            skills_formatted=self.format_skill_list(candidateInfo.Skills),
            nice_to_have_formatted=self.format_skill_list(candidateInfo.NiceToHaveSkills),
        )

        companyPrompt = fileService.FileService().loadDynamicPrompt(
            'app/prompts/company_info.txt',
            CompanyType=companyIntroduction.CompanyType,
            Industry=companyIntroduction.Industry,
            CompanySize=companyIntroduction.CompanySize,
        )

        return position_prompt+companyPrompt
        