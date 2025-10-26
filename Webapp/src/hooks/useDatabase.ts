/**
 * Database Hook
 * React hook for managing jobs and evaluations data
 */

import { useState, useEffect, useCallback } from 'react';
import { 
  getJobs, 
  getEvaluations, 
  createJob, 
  createEvaluation,
  updateJob,
  updateEvaluation,
  deleteJob,
  deleteEvaluation 
} from '../utils/database/api';
import { 
  Job, 
  Evaluation, 
  CreateJobInput, 
  CreateEvaluationInput 
} from '../utils/database/types';

export interface DatabaseState {
  jobs: Job[];
  evaluations: Evaluation[];
  loading: boolean;
  error: string | null;
}

export function useDatabase(enabled: boolean = true) {
  const [state, setState] = useState<DatabaseState>({
    jobs: [],
    evaluations: [],
    loading: false,
    error: null,
  });

  // Fetch all data
  const fetchData = useCallback(async () => {
    if (!enabled) {
      setState(prev => ({ ...prev, loading: false, error: null }));
      return;
    }

    setState(prev => ({ ...prev, loading: true, error: null }));

    try {
      // Fetch jobs and evaluations in parallel
      const [jobsResponse, evaluationsResponse] = await Promise.all([
        getJobs(),
        getEvaluations(),
      ]);

      if (jobsResponse.error) {
        throw new Error(`Jobs: ${jobsResponse.error}`);
      }

      if (evaluationsResponse.error) {
        throw new Error(`Evaluations: ${evaluationsResponse.error}`);
      }

      setState({
        jobs: jobsResponse.data,
        evaluations: evaluationsResponse.data,
        loading: false,
        error: null,
      });
    } catch (error) {
      console.error('Error fetching database data:', error);
      setState(prev => ({
        ...prev,
        loading: false,
        error: error instanceof Error ? error.message : 'Unknown error',
      }));
    }
  }, [enabled]);

  // Job operations
  const addJob = useCallback(async (jobData: CreateJobInput): Promise<Job | null> => {
    const response = await createJob(jobData);
    if (response.error) {
      setState(prev => ({ ...prev, error: response.error }));
      return null;
    }
    
    if (response.data) {
      setState(prev => ({
        ...prev,
        jobs: [...prev.jobs, response.data!],
      }));
    }
    
    return response.data;
  }, []);

  const editJob = useCallback(async (id: string, updates: Partial<CreateJobInput>): Promise<Job | null> => {
    const response = await updateJob(id, updates);
    if (response.error) {
      setState(prev => ({ ...prev, error: response.error }));
      return null;
    }
    
    if (response.data) {
      setState(prev => ({
        ...prev,
        jobs: prev.jobs.map(job => job.id === id ? response.data! : job),
      }));
    }
    
    return response.data;
  }, []);

  const removeJob = useCallback(async (id: string): Promise<boolean> => {
    const response = await deleteJob(id);
    if (response.error) {
      setState(prev => ({ ...prev, error: response.error }));
      return false;
    }
    
    setState(prev => ({
      ...prev,
      jobs: prev.jobs.filter(job => job.id !== id),
    }));
    
    return true;
  }, []);

  // Evaluation operations
  const addEvaluation = useCallback(async (evaluationData: CreateEvaluationInput): Promise<Evaluation | null> => {
    const response = await createEvaluation(evaluationData);
    if (response.error) {
      setState(prev => ({ ...prev, error: response.error }));
      return null;
    }
    
    if (response.data) {
      setState(prev => ({
        ...prev,
        evaluations: [...prev.evaluations, response.data!],
      }));
    }
    
    return response.data;
  }, []);

  const editEvaluation = useCallback(async (id: string, updates: Partial<CreateEvaluationInput>): Promise<Evaluation | null> => {
    const response = await updateEvaluation(id, updates);
    if (response.error) {
      setState(prev => ({ ...prev, error: response.error }));
      return null;
    }
    
    if (response.data) {
      setState(prev => ({
        ...prev,
        evaluations: prev.evaluations.map(evaluation => evaluation.id === id ? response.data! : evaluation),
      }));
    }
    
    return response.data;
  }, []);

  const removeEvaluation = useCallback(async (id: string): Promise<boolean> => {
    const response = await deleteEvaluation(id);
    if (response.error) {
      setState(prev => ({ ...prev, error: response.error }));
      return false;
    }
    
    setState(prev => ({
      ...prev,
      evaluations: prev.evaluations.filter(evaluation => evaluation.id !== id),
    }));
    
    return true;
  }, []);

  // Clear error
  const clearError = useCallback(() => {
    setState(prev => ({ ...prev, error: null }));
  }, []);

  // Load data on mount and when enabled changes
  useEffect(() => {
    fetchData();
  }, [fetchData]);

  return {
    // State
    jobs: state.jobs,
    evaluations: state.evaluations,
    loading: state.loading,
    error: state.error,
    
    // Actions
    refetch: fetchData,
    clearError,
    
    // Job operations
    addJob,
    editJob,
    removeJob,
    
    // Evaluation operations
    addEvaluation,
    editEvaluation,
    removeEvaluation,
  };
}