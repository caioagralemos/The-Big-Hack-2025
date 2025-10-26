import { createContext, useContext, useState, ReactNode } from 'react';
import { useDatabase } from '../hooks/useDatabase';
import { Job, Evaluation, CreateJobInput, CreateEvaluationInput } from '../utils/database/types';

export type DataMode = 'demo' | 'live';

interface DataContextType {
  mode: DataMode;
  setMode: (mode: DataMode) => void;
  jobs: Job[];
  evaluations: Evaluation[];
  loading: boolean;
  error: string | null;
  refetch: () => void;
  clearError: () => void;
  
  // Job operations
  addJob: (job: CreateJobInput) => Promise<Job | null>;
  editJob: (id: string, updates: Partial<CreateJobInput>) => Promise<Job | null>;
  removeJob: (id: string) => Promise<boolean>;
  
  // Evaluation operations
  addEvaluation: (evaluation: CreateEvaluationInput) => Promise<Evaluation | null>;
  editEvaluation: (id: string, updates: Partial<CreateEvaluationInput>) => Promise<Evaluation | null>;
  removeEvaluation: (id: string) => Promise<boolean>;
}

const DataContext = createContext<DataContextType | undefined>(undefined);

export function DataProvider({ children }: { children: ReactNode }) {
  const [mode, setMode] = useState<DataMode>('demo');
  
  // Use database hook only when in live mode
  const database = useDatabase(mode === 'live');

  const value: DataContextType = {
    mode,
    setMode,
    jobs: mode === 'live' ? database.jobs : [],
    evaluations: mode === 'live' ? database.evaluations : [],
    loading: mode === 'live' ? database.loading : false,
    error: mode === 'live' ? database.error : null,
    refetch: database.refetch,
    clearError: database.clearError,
    
    // Job operations
    addJob: database.addJob,
    editJob: database.editJob,
    removeJob: database.removeJob,
    
    // Evaluation operations
    addEvaluation: database.addEvaluation,
    editEvaluation: database.editEvaluation,
    removeEvaluation: database.removeEvaluation,
  };

  return <DataContext.Provider value={value}>{children}</DataContext.Provider>;
}

export function useData() {
  const context = useContext(DataContext);
  if (!context) {
    throw new Error('useData must be used within a DataProvider');
  }
  return context;
}

// Re-export types for convenience
export type { Job, Evaluation, CreateJobInput, CreateEvaluationInput };
