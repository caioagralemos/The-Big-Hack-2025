/**
 * Database API
 * Simple functions to interact with jobs and evaluations tables
 */

import { API_ENDPOINTS, getHeaders } from './config';
import { 
  Job, 
  Evaluation, 
  CreateJobInput, 
  CreateEvaluationInput,
  DatabaseResponse,
  DatabaseListResponse 
} from './types';

// ===== JOBS API =====

/**
 * Get all jobs
 */
export async function getJobs(): Promise<DatabaseListResponse<Job>> {
  try {
    const response = await fetch(API_ENDPOINTS.jobs, {
      method: 'GET',
      headers: getHeaders(),
    });

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    const data = await response.json();
    return {
      data: data || [],
      error: null,
    };
  } catch (error) {
    console.error('Error fetching jobs:', error);
    return {
      data: [],
      error: error instanceof Error ? error.message : 'Unknown error',
    };
  }
}

/**
 * Get job by ID
 */
export async function getJob(id: string): Promise<DatabaseResponse<Job>> {
  try {
    const response = await fetch(`${API_ENDPOINTS.jobs}?id=eq.${id}`, {
      method: 'GET',
      headers: getHeaders(),
    });

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    const data = await response.json();
    return {
      data: data[0] || null,
      error: null,
    };
  } catch (error) {
    console.error('Error fetching job:', error);
    return {
      data: null,
      error: error instanceof Error ? error.message : 'Unknown error',
    };
  }
}

/**
 * Create new job
 */
export async function createJob(job: CreateJobInput): Promise<DatabaseResponse<Job>> {
  try {
    const response = await fetch(API_ENDPOINTS.jobs, {
      method: 'POST',
      headers: getHeaders(),
      body: JSON.stringify({
        ...job,
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString(),
      }),
    });

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    const data = await response.json();
    return {
      data: data[0] || null,
      error: null,
    };
  } catch (error) {
    console.error('Error creating job:', error);
    return {
      data: null,
      error: error instanceof Error ? error.message : 'Unknown error',
    };
  }
}

/**
 * Update job
 */
export async function updateJob(id: string, updates: Partial<CreateJobInput>): Promise<DatabaseResponse<Job>> {
  try {
    const response = await fetch(`${API_ENDPOINTS.jobs}?id=eq.${id}`, {
      method: 'PATCH',
      headers: getHeaders(),
      body: JSON.stringify({
        ...updates,
        updated_at: new Date().toISOString(),
      }),
    });

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    const data = await response.json();
    return {
      data: data[0] || null,
      error: null,
    };
  } catch (error) {
    console.error('Error updating job:', error);
    return {
      data: null,
      error: error instanceof Error ? error.message : 'Unknown error',
    };
  }
}

/**
 * Delete job
 */
export async function deleteJob(id: string): Promise<DatabaseResponse<boolean>> {
  try {
    const response = await fetch(`${API_ENDPOINTS.jobs}?id=eq.${id}`, {
      method: 'DELETE',
      headers: getHeaders(),
    });

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    return {
      data: true,
      error: null,
    };
  } catch (error) {
    console.error('Error deleting job:', error);
    return {
      data: false,
      error: error instanceof Error ? error.message : 'Unknown error',
    };
  }
}

// ===== EVALUATIONS API =====

/**
 * Get all evaluations
 */
export async function getEvaluations(): Promise<DatabaseListResponse<Evaluation>> {
  try {
    const response = await fetch(API_ENDPOINTS.evaluations, {
      method: 'GET',
      headers: getHeaders(),
    });

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    const data = await response.json();
    return {
      data: data || [],
      error: null,
    };
  } catch (error) {
    console.error('Error fetching evaluations:', error);
    return {
      data: [],
      error: error instanceof Error ? error.message : 'Unknown error',
    };
  }
}

/**
 * Get evaluations by job ID
 */
export async function getEvaluationsByJob(jobId: string): Promise<DatabaseListResponse<Evaluation>> {
  try {
    const response = await fetch(`${API_ENDPOINTS.evaluations}?job_id=eq.${jobId}`, {
      method: 'GET',
      headers: getHeaders(),
    });

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    const data = await response.json();
    return {
      data: data || [],
      error: null,
    };
  } catch (error) {
    console.error('Error fetching evaluations by job:', error);
    return {
      data: [],
      error: error instanceof Error ? error.message : 'Unknown error',
    };
  }
}

/**
 * Get evaluation by ID
 */
export async function getEvaluation(id: string): Promise<DatabaseResponse<Evaluation>> {
  try {
    const response = await fetch(`${API_ENDPOINTS.evaluations}?id=eq.${id}`, {
      method: 'GET',
      headers: getHeaders(),
    });

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    const data = await response.json();
    return {
      data: data[0] || null,
      error: null,
    };
  } catch (error) {
    console.error('Error fetching evaluation:', error);
    return {
      data: null,
      error: error instanceof Error ? error.message : 'Unknown error',
    };
  }
}

/**
 * Create new evaluation
 */
export async function createEvaluation(evaluation: CreateEvaluationInput): Promise<DatabaseResponse<Evaluation>> {
  try {
    const response = await fetch(API_ENDPOINTS.evaluations, {
      method: 'POST',
      headers: getHeaders(),
      body: JSON.stringify({
        ...evaluation,
        timestamp_utc: new Date().toISOString(),
      }),
    });

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    const data = await response.json();
    return {
      data: data[0] || null,
      error: null,
    };
  } catch (error) {
    console.error('Error creating evaluation:', error);
    return {
      data: null,
      error: error instanceof Error ? error.message : 'Unknown error',
    };
  }
}

/**
 * Update evaluation
 */
export async function updateEvaluation(id: string, updates: Partial<CreateEvaluationInput>): Promise<DatabaseResponse<Evaluation>> {
  try {
    const response = await fetch(`${API_ENDPOINTS.evaluations}?id=eq.${id}`, {
      method: 'PATCH',
      headers: getHeaders(),
      body: JSON.stringify(updates),
    });

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    const data = await response.json();
    return {
      data: data[0] || null,
      error: null,
    };
  } catch (error) {
    console.error('Error updating evaluation:', error);
    return {
      data: null,
      error: error instanceof Error ? error.message : 'Unknown error',
    };
  }
}

/**
 * Delete evaluation
 */
export async function deleteEvaluation(id: string): Promise<DatabaseResponse<boolean>> {
  try {
    const response = await fetch(`${API_ENDPOINTS.evaluations}?id=eq.${id}`, {
      method: 'DELETE',
      headers: getHeaders(),
    });

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    return {
      data: true,
      error: null,
    };
  } catch (error) {
    console.error('Error deleting evaluation:', error);
    return {
      data: false,
      error: error instanceof Error ? error.message : 'Unknown error',
    };
  }
}