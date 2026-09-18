export interface CompanyIntroduction {
  company_type: string;
  industry: string;
  company_size: number;
}

export interface EvaluatedPart {
  evaluated_score: number;
  evaluated_reason: string;
}

export interface CandidateEvaluation {
  basic_part: EvaluatedPart;
  education_part: EvaluatedPart;
  job_part: EvaluatedPart;
  skills_part: EvaluatedPart;
  reference_part: EvaluatedPart;
  projects_part: EvaluatedPart;
  hobbies_part: EvaluatedPart;
}

export interface JobExperienceItem {
  position?: string;
  company?: string;
  duration?: string;
  description?: string;
}

export interface EducationItem {
  school_name?: string;
  field_of_study?: string;
  degree?: string;
}

export interface ExtractedCandidate {
  candidate_name: string;
  candidate_location?: string | null;
  job_experience?: JobExperienceItem[];
  education?: {
    universities?: EducationItem[];
    high_schools?: EducationItem[];
    courses?: EducationItem[];
  };
  skills?: {
    technical_skills?: string[];
    soft_skills?: string[];
    languages?: string[];
    certificates?: string[];
  };
  projects?: {
    projects?: Array<{ project_name?: string; description?: string }>;
  };
  hobbies?: string[];
  references?: Array<{ reference_name?: string; contact?: string }>;
}

export interface RecommendationResponse {
  recommendation_score: number;
  recommended_candidate_index: number;
  recommendation_reason: string;
  evaluated_candidates?: CandidateEvaluation[];
  extracted_candidates?: ExtractedCandidate[];
  job_info?: string;
}

export interface RecruiterFeedback {
  timeSavedMinutes?: string;
  willingnessToPay: 'yes' | 'maybe' | 'no';
  priceRange: string;
  featureRequests: string[];
  wantsReservation?: 'reserve' | 'updates_only' | 'not_interested' | '';
  comments: string;
  recruiterEmail?: string;
  companyName?: string;
  submittedAt: string;
}

export interface PresetJob {
  id: string;
  title: string;
  category: string;
  badge: string;
  company: CompanyIntroduction;
  jobAd: string;
}

