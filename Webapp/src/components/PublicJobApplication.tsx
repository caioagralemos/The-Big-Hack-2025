import { useState } from "react";
import { CandidateLandingPage } from "./CandidateLandingPage";
import { CandidateApplicationForm } from "./CandidateApplicationForm";
import { JobOffer } from "../types/JobOffer";

interface PublicJobApplicationProps {
  role: JobOffer;
}

export function PublicJobApplication({ role }: PublicJobApplicationProps) {
  const [showForm, setShowForm] = useState(false);

  const handleSubmit = (data: any) => {
    console.log("Application submitted:", data);
    // Here you would send the data to your backend/Supabase
  };

  // Convert JobOffer to the format expected by CandidateLandingPage
  const roleForLanding = {
    title: role.title,
    department: "", // No longer using department
    description: role.description,
    requirements: role.eligibility_filters.join('\n'),
  };

  const roleForForm = {
    title: role.title,
  };

  if (showForm) {
    return (
      <CandidateApplicationForm
        role={roleForForm}
        jobOffer={role}
        onSubmit={handleSubmit}
      />
    );
  }

  return (
    <CandidateLandingPage
      role={roleForLanding}
      onApply={() => setShowForm(true)}
    />
  );
}
