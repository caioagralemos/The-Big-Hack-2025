// TypeScript (works as JS with JSDoc if you strip types)

export type Confidence = 'Low' | 'Med' | 'High';

export type Dimension = {
  name: string;
  score: 1|2|3|4|5;
  confidence?: Confidence;
  justification?: string;
  data_sources?: string[];
};

export type Section = {
  name: string;
  dimensions: Dimension[];
  section_score: number;     // mean of dimension scores (decimals allowed)
  questions: string[];       // 0..n
  notes: string[];           // candidate answers after WhatsApp
};

export type EligibilityFlag = { rule: string; ok: boolean };

export class Evaluation {
  candidate_id: string;
  job_id: string;
  run_id: string;
  scoring_scale: string;
  rubric: string;
  timestamp_utc: string;

  sections: Map<string, Section>;
  pillar_weights: Record<string, number>;
  pillar_scores: Record<string, number>;
  total_score: number;
  confidence_overall: Confidence;
  eligibility_filters: EligibilityFlag[];

  constructor(init: Partial<Evaluation> & { candidate_id: string; job_id: string; run_id: string }) {
    this.candidate_id = init.candidate_id;
    this.job_id = init.job_id;
    this.run_id = init.run_id;
    this.scoring_scale = init.scoring_scale ?? '1–5';
    this.rubric = init.rubric ?? '1=Insufficient | 2=Basic | 3=Solid | 4=Strong | 5=Exceptional';
    this.timestamp_utc = init.timestamp_utc ?? new Date().toISOString();

    this.sections = init.sections instanceof Map ? init.sections : new Map();
    this.pillar_weights = init.pillar_weights ?? {};
    this.pillar_scores = init.pillar_scores ?? {};
    this.total_score = init.total_score ?? 0;
    this.confidence_overall = (init.confidence_overall as Confidence) ?? 'Med';
    this.eligibility_filters = init.eligibility_filters ?? [];
  }

  static calcSectionScore(dimensions: Dimension[]): number {
    if (!dimensions.length) return 0;
    const sum = dimensions.reduce((a,d)=>a + d.score, 0);
    return Math.round((sum / dimensions.length) * 100) / 100; // 2 decimals
  }

  setSection(name: string, dimensions: Dimension[], questions: string[] = [], notes: string[] = []) {
    const section_score = Evaluation.calcSectionScore(dimensions);
    this.sections.set(name, { name, dimensions, section_score, questions, notes });
  }

  calcTotalFromWeights() {
    let total = 0;
    for (const [sectionName, weight] of Object.entries(this.pillar_weights)) {
      const sec = this.sections.get(sectionName);
      if (sec) total += (weight ?? 0) * sec.section_score;
    }
    this.total_score = Math.round(total * 10000) / 10000; // 4 decimals
    return this.total_score;
  }
}