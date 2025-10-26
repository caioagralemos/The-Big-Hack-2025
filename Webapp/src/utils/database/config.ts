/**
 * Database Configuration
 * Simple PostgreSQL connection for jobs and evaluations tables
 */

// Database connection settings
export const DATABASE_CONFIG = {
  // API endpoint for Supabase REST API
  supabaseUrl: 'https://evsymppxmhfvfgmkviij.supabase.co',
  supabaseKey: 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImV2c3ltcHB4bWhmdmZnbWt2aWlqIiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc2MTM4NDU0OSwiZXhwIjoyMDc2OTYwNTQ5fQ.NIsjmggybDcuZvZSSqvt7tIloC4gxdeTr3FPCwNoxII',
  
  // Table names
  tables: {
    jobs: 'jobs',
    evaluations: 'evaluations'
  }
};

// API endpoints
export const API_ENDPOINTS = {
  jobs: `${DATABASE_CONFIG.supabaseUrl}/rest/v1/jobs`,
  evaluations: `${DATABASE_CONFIG.supabaseUrl}/rest/v1/evaluations`,
};

// Request headers for Supabase REST API
export const getHeaders = () => ({
  'Content-Type': 'application/json',
  'apikey': DATABASE_CONFIG.supabaseKey,
  'Authorization': `Bearer ${DATABASE_CONFIG.supabaseKey}`,
  'Prefer': 'return=representation', // Return the created/updated record
});