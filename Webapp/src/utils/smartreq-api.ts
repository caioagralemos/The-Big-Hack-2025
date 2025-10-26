/**
 * SmartReq API Integration
 * Utility functions for interacting with the SmartReq evaluation pipeline
 */

export interface SmartReqPayload {
  name: string;
  phone_number: string;
  email: string;
  cv: string;
  linkedin?: string;
  job_offer: {
    id: string;
    title: string;
    description: string;
    company_id: string;
    scoring_scale: string;
    rubric: string;
    eligibility_filters: string[];
    weights: {
      professional_experience: number;
      technical_skills: number;
      motivation: number;
      education_learning: number;
      soft_skills_behavioral: number;
    };
    created_at: string;
    updated_at: string;
  };
}

export interface SmartReqResponse {
  ok: boolean;
  candidate_id: string;
  evaluation_id: string;
  received: {
    cv: boolean;
    linkedin: boolean;
  };
  next: string;
}

export interface SmartReqError {
  error: string;
}

const SMARTREQ_API_URL = 'https://primary-production-6beb.up.railway.app/webhook/smartreq';

/**
 * Submit candidate evaluation to SmartReq API
 */
export async function submitToSmartReq(payload: SmartReqPayload): Promise<SmartReqResponse> {
  try {
    const response = await fetch(SMARTREQ_API_URL, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(payload),
    });

    if (!response.ok) {
      const errorData: SmartReqError = await response.json().catch(() => ({ 
        error: 'Unknown error occurred' 
      }));
      throw new Error(errorData.error || `HTTP error! status: ${response.status}`);
    }

    const result: SmartReqResponse = await response.json();
    return result;
  } catch (error) {
    console.error('SmartReq API Error:', error);
    throw error;
  }
}

/**
 * Validate weights in job offer (must sum to 1.0)
 */
export function validateJobOfferWeights(weights: SmartReqPayload['job_offer']['weights']): boolean {
  const sum = Object.values(weights).reduce((acc, val) => acc + val, 0);
  return Math.abs(sum - 1.0) < 0.001; // Allow small floating point errors
}

/**
 * Create a default job offer template
 */
export function createDefaultJobOffer(overrides: Partial<SmartReqPayload['job_offer']> = {}): SmartReqPayload['job_offer'] {
  return {
    id: `job_${Date.now()}`,
    title: "Software Engineer",
    description: "We are seeking a talented software engineer to join our team.",
    company_id: "00000000-0000-0000-0000-000000000000",
    scoring_scale: "1–5",
    rubric: "1=Insufficient | 2=Basic | 3=Solid | 4=Strong | 5=Exceptional",
    eligibility_filters: [],
    weights: {
      professional_experience: 0.30,
      technical_skills: 0.35,
      motivation: 0.15,
      education_learning: 0.10,
      soft_skills_behavioral: 0.10,
    },
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString(),
    ...overrides,
  };
}