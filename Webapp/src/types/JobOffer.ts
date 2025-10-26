export type JobOfferWeights = {
  professional_experience: number;
  technical_skills: number;
  motivation: number;
  education_learning: number;
  soft_skills_behavioral: number;
};

export class JobOffer {
  id: string;           // uuid or key
  company_id: string;
  job_key: string;
  title: string;
  description: string;
  scoring_scale: string;
  rubric: string;
  eligibility_filters: string[];
  weights: JobOfferWeights;
  created_at?: string;
  updated_at?: string;

  constructor(init: {
    id: string;
    company_id: string;
    job_key: string;
    title: string;
    description: string;
    scoring_scale?: string;
    rubric?: string;
    eligibility_filters?: string[];
    weights?: JobOfferWeights;
    created_at?: string;
    updated_at?: string;
  }) {
    this.id = init.id;
    this.company_id = init.company_id;
    this.job_key = init.job_key;
    this.title = init.title;
    this.description = init.description;
    this.scoring_scale = init.scoring_scale ?? '1–5';
    this.rubric = init.rubric ?? '1=Insufficient | 2=Basic | 3=Solid | 4=Strong | 5=Exceptional';
    this.eligibility_filters = init.eligibility_filters ?? [];
    this.weights = init.weights ?? {
      professional_experience: 0.30,
      technical_skills: 0.35,
      motivation: 0.15,
      education_learning: 0.10,
      soft_skills_behavioral: 0.10
    };
    this.created_at = init.created_at;
    this.updated_at = init.updated_at;
  }

  weightsSumIsValid(): boolean {
    const w = this.weights;
    const sum = w.professional_experience + w.technical_skills + w.motivation + w.education_learning + w.soft_skills_behavioral;
    return Math.abs(sum - 1.0) <= 0.001;
  }
}
