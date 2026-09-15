import type { PresetJob, RecommendationResponse } from '../types';


export const PRESET_JOBS: PresetJob[] = [
  {
    id: 'senior-python',
    title: 'Senior Python / AI Backend Engineer',
    category: 'Engineering & AI',
    badge: 'Nejpopulárnější',
    company: {
      company_type: 'B2B SaaS Scale-up',
      industry: 'FinTech & AI Automation',
      company_size: 65,
    },
    jobAd: `Hledáme Senior Python Backend Developera, který nám pomůže stavět AI-powered enterprise platformu pro finanční analýzu.

Požadavky na kandidáta:
- Minimálně 5+ let praxe s vývojem backend systémů v Pythonu (FastAPI, AsyncIO, Pydantic).
- Zkušenost s integrací LLM (Google Gemini, OpenAI) a návrhem asynchronních pipelines.
- Výborná znalost relačních i vektorových databází (PostgreSQL, pgvector, Redis).
- Schopnost navrhovat čistou architekturu, psát automatizované testy (pytest) a pracovat s Dockerem.
- Samostatnost, schopnost mentorovat juniornější kolegy a komunikovat v angličtině (úroveň B2/C1).

Nabízíme:
- Flexibilní pracovní dobu, hybridní režim (kanceláře v Praze / 2 dny remote týdně).
- Budget na vzdělávání a hardware podle vlastního výběru.
- Možnost podílet se na klíčových architektonických rozhodnutích.`,
  },
  {
    id: 'frontend-lead',
    title: 'Lead Frontend Developer (React / TypeScript)',
    category: 'Frontend & UX',
    badge: 'Tech Lead',
    company: {
      company_type: 'Product Enterprise',
      industry: 'E-Commerce Platforms',
      company_size: 280,
    },
    jobAd: `Hledáme zkušeného Lead Frontend Developera pro vedení 4členného týmu a refaktoring klíčových částí naší e-commerce platformy do moderního Reactu a Vite.

Požadavky na kandidáta:
- 6+ let zkušeností s moderním JavaScriptem/TypeScriptem a React ekosystémem.
- Hluboká znalost optimalizace výkonu, SSR/SSG, stavového managementu a testování (Jest/Playwright).
- Zkušenost s vedením týmu, code reviews a nastavováním architektonických standardů.
- Cit pro UI/UX, práci s Design Systémy a přístupností (a11y).
- Dobrá čeština/slovenština i angličtina pro komunikaci s mezinárodními partnery.`,
  },
  {
    id: 'product-manager',
    title: 'Technical Product Manager (B2B SaaS)',
    category: 'Product & Strategy',
    badge: 'Růstová pozice',
    company: {
      company_type: 'Globální Startup',
      industry: 'Enterprise Software & HR Tech',
      company_size: 40,
    },
    jobAd: `Do našeho rostoucího týmu hledáme Technical Product Managera, který propojí business požadavky, feedback od zákazníků a technickou exekuci vývojového týmu.

Požadavky na kandidáta:
- 3+ roky zkušeností v roli Product Ownera nebo Product Managera v B2B softwarové firmě.
- Technický background – schopnost bavit se s inženýry o API, architektuře a datových modelech.
- Zkušenost s datovou analytikou (Mixpanel, Amplitude, SQL) a definováním KPI produktu.
- Skvělé prezentační dovednosti a zkušenost s vedením zákaznických discovery rozhovorů.`,
  },
];

export const DEMO_RECOMMENDATION: RecommendationResponse = {
  recommendation_score: 9.1,
  recommended_candidate_index: 0,
  recommendation_reason:
    'Kandidát 0 (Ing. Petr Svoboda) podstatně lépe splňuje požadavky na Senior backend roli. Má 7+ let doložené praxe s produkčním FastAPI a asynchronní architekturou, zkušenost s LLM pipeline integrací v předchozí firmě a solidní přehled o testování. Kandidát 1 (Jan Dvořák) je talentovaný vývojář s velkým potenciálem, avšak jeho zkušenost odpovídá úrovni mid-level (2.5 roku praxe) a postrádá zkušenosti s architekturou distribuovaných systémů vyžadovanou v zadání.',
  job_info: 'Role: Senior Python / AI Backend Engineer. Společnost: B2B SaaS Scale-up (65 zaměstnanců).',
  extracted_candidates: [
    {
      candidate_name: 'Ing. Petr Svoboda',
      candidate_location: 'Praha, Česká republika',
      job_experience: [
        {
          position: 'Senior Python Engineer & AI Integrator',
          company: 'FinData Cloud s.r.o.',
          duration: '2021 - současnost',
          description: 'Návrh asynchronních mikroslužeb v FastAPI, orchestrace LLM modelů pro extrakci účetních dokladů, optimalizace PostgreSQL databází.',
        },
        {
          position: 'Python Backend Developer',
          company: 'Avast Software',
          duration: '2017 - 2021',
          description: 'Vývoj bezpečnostních skenerů a API v Pythonu, nasazení do Docker/Kubernetes, psaní unit testů v pytest.',
        },
      ],
      education: {
        universities: [
          {
            school_name: 'ČVUT v Praze, FIT',
            field_of_study: 'Softwarové inženýrství',
            degree: 'Ing.',
          },
        ],
      },
      skills: {
        technical_skills: ['Python 3.11+', 'FastAPI', 'AsyncIO', 'PostgreSQL', 'Docker', 'pytest', 'LLM Prompt Engineering', 'Redis'],
        soft_skills: ['Technický leadership', 'Mentoring juniorů', 'Samostatné řešení problémů'],
        languages: ['Čeština (rodilý mluvčí)', 'Angličtina (C1)'],
        certificates: ['AWS Certified Solutions Architect', 'FastAPI Microservices Mastery'],
      },
      projects: {
        projects: [
          {
            project_name: 'DocuAI Extractor',
            description: 'Systém pro paralelní analýzu a sumarizaci smluv s 99.4% přesností.',
          },
        ],
      },
      hobbies: ['Open source přispívání', 'Horská cyklistika', 'Technologické podcasty'],
      references: [
        {
          reference_name: 'Tomáš Král (VP of Engineering, FinData Cloud)',
          contact: 'tomas.kral@example.com',
        },
      ],
    },
    {
      candidate_name: 'Jan Dvořák',
      candidate_location: 'Brno, Česká republika',
      job_experience: [
        {
          position: 'Python & Django Developer',
          company: 'WebSolutions s.r.o.',
          duration: '2023 - současnost',
          description: 'Tvorba backendových API pro e-commerce systémy v Django a Django REST Framework, integrace platebních bran.',
        },
        {
          position: 'Junior Software Tester',
          company: 'TestLab CZ',
          duration: '2022 - 2023',
          description: 'Automatizované testování webových aplikací v Selenium a Pythonu.',
        },
      ],
      education: {
        universities: [
          {
            school_name: 'VUT v Brně, FEKT',
            field_of_study: 'Informační technologie',
            degree: 'Bc.',
          },
        ],
      },
      skills: {
        technical_skills: ['Python', 'Django', 'REST API', 'Git', 'MySQL', 'Docker basics', 'Základy FastAPI'],
        soft_skills: ['Chuť učit se', 'Týmový hráč', 'Komunikativnost'],
        languages: ['Čeština (rodilý mluvčí)', 'Angličtina (B2)'],
        certificates: ['Python Certified Associate Programmer (PCAP)'],
      },
      projects: {
        projects: [
          {
            project_name: 'Personal Portfolio & Tech Blog',
            description: 'Blog postavený na Pythonu a generování statických stránek.',
          },
        ],
      },
      hobbies: ['Šachy', 'Běhání', 'Gamer'],
      references: [
        {
          reference_name: 'Marek Veselý (Team Lead, WebSolutions)',
          contact: 'marek.vesely@example.com',
        },
      ],
    },
  ],
  evaluated_candidates: [
    {
      basic_part: {
        evaluated_score: 9.5,
        evaluated_reason: 'Kandidát má 7+ let relevantních zkušeností s backendem, ideální senioritu a okamžitou připravenost.',
      },
      job_part: {
        evaluated_score: 9.3,
        evaluated_reason: 'Přesná shoda s požadavky: produkční FastAPI, asynchronní architektura, integrace LLM z předchozí práce.',
      },
      skills_part: {
        evaluated_score: 9.2,
        evaluated_reason: 'Kompletní technologický stack: Python, FastAPI, Docker, pytest i cloudové certifikace.',
      },
      education_part: {
        evaluated_score: 9.0,
        evaluated_reason: 'Magisterský titul FIT ČVUT v oboru softwarové inženýrství přímo odpovídá oboru.',
      },
      projects_part: {
        evaluated_score: 8.8,
        evaluated_reason: 'Relevantní projekt DocuAI Extractor prokazuje schopnost pracovat s dokumenty a AI modely.',
      },
      reference_part: {
        evaluated_score: 8.5,
        evaluated_reason: 'Uvedena ověřitelná reference na VP of Engineering z předchozího zaměstnání.',
      },
      hobbies_part: {
        evaluated_score: 7.5,
        evaluated_reason: 'Open source přispívání ukazuje proaktivní přístup k technologiím.',
      },
    },
    {
      basic_part: {
        evaluated_score: 6.8,
        evaluated_reason: 'Kandidát je na úrovni mid-level s celkem 2.5 lety vývojářské praxe, což neodpovídá požadované senioritě 5+ let.',
      },
      job_part: {
        evaluated_score: 6.5,
        evaluated_reason: 'Zkušenosti převážně z Django monolitu; chybí hlubší praxe s FastAPI, asynchronním programováním a LLM modely.',
      },
      skills_part: {
        evaluated_score: 7.0,
        evaluated_reason: 'Dobrý základ v Pythonu, ale chybí pokročilejší enterprise nástroje a zkušenost s architekturou.',
      },
      education_part: {
        evaluated_score: 7.8,
        evaluated_reason: 'Bakalářský titul z VUT FEKT v oboru IT, solidní technický základ.',
      },
      projects_part: {
        evaluated_score: 6.0,
        evaluated_reason: 'Pouze menší osobní portfolio bez komplexnější backendové architektury.',
      },
      reference_part: {
        evaluated_score: 7.5,
        evaluated_reason: 'Reference na současného team leadera k dispozici.',
      },
      hobbies_part: {
        evaluated_score: 6.5,
        evaluated_reason: 'Běžné zájmy bez přímé relevance pro pozici.',
      },
    },
  ],
};

/**
 * Creates minimal valid 1-page PDF blobs for sample testing.
 */
export function createSamplePdfBlob(candidateName: string, roleText: string): Blob {
  const content = `%PDF-1.4
1 0 obj
<< /Type /Catalog /Pages 2 0 R >>
endobj
2 0 obj
<< /Type /Pages /Kids [3 0 R] /Count 1 >>
endobj
3 0 obj
<< /Type /Page /Parent 2 0 R /MediaBox [0 0 612 792] /Contents 4 0 R /Resources << /Font << /F1 5 0 R >> >> >>
endobj
4 0 obj
<< /Length 120 >>
stream
BT
/F1 18 Tf
50 720 Td
(CV: ${candidateName.replace(/[^\x00-\x7F]/g, '')}) Tj
/F1 12 Tf
0 -30 Td
(Role: ${roleText.replace(/[^\x00-\x7F]/g, '')}) Tj
0 -20 Td
(desideo Candidate Evaluation PDF Sample) Tj
ET

endstream
endobj
5 0 obj
<< /Type /Font /Subtype /Type1 /BaseFont /Helvetica >>
endobj
xref
0 6
0000000000 65535 f 
0000000009 00000 n 
0000000058 00000 n 
0000000115 00000 n 
0000000244 00000 n 
0000000414 00000 n 
trailer
<< /Size 6 /Root 1 0 R >>
startxref
494
%%EOF`;

  return new Blob([content], { type: 'application/pdf' });
}

