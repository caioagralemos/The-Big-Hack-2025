import { useState } from "react";
import { Button } from "./ui/button";
import { Input } from "./ui/input";
import { Label } from "./ui/label";
import { Card, CardContent } from "./ui/card";
import { Checkbox } from "./ui/checkbox";
import { Progress } from "./ui/progress";
import { Upload, CheckCircle2, Loader2 } from "lucide-react";
import { JobOffer } from "../types/JobOffer";
import { useData } from "../contexts/DataContext";

const creditAgricoleLogo = "/credit-agricole-logo.svg";
import * as pdfjsLib from "pdfjs-dist";

// Configure PDF.js worker
pdfjsLib.GlobalWorkerOptions.workerSrc = `//cdnjs.cloudflare.com/ajax/libs/pdf.js/${pdfjsLib.version}/pdf.worker.min.js`;

interface CandidateApplicationFormProps {
  role: {
    title: string;
  };
  jobOffer?: JobOffer; // Full JobOffer object for API submission
  onSubmit: (data: any) => void;
}

export function CandidateApplicationForm({ role, jobOffer, onSubmit }: CandidateApplicationFormProps) {
  const [step, setStep] = useState<1 | 2>(1);
  const [submitted, setSubmitted] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isParsing, setIsParsing] = useState(false);
  const [submitError, setSubmitError] = useState<string | null>(null);
  const { addEvaluation } = useData(); // Add database operations
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
    cv: null as File | null,
    linkedin: null as File | null, // LinkedIn PDF file
    consent: false,
  });

  const isStep1Valid = formData.name && formData.email && formData.phone;
  const isStep2Valid = formData.cv && formData.consent;

  const handleFileUpload = (field: "cv" | "linkedin", file: File | null) => {
    setFormData({ ...formData, [field]: file });
  };

  // Function to extract text from PDF
  const extractTextFromPDF = async (file: File): Promise<string> => {
    const arrayBuffer = await file.arrayBuffer();
    const pdf = await pdfjsLib.getDocument({ data: arrayBuffer }).promise;
    let fullText = '';

    for (let i = 1; i <= pdf.numPages; i++) {
      const page = await pdf.getPage(i);
      const textContent = await page.getTextContent();
      const pageText = textContent.items
        .map((item: any) => item.str)
        .join(' ');
      fullText += pageText + '\n';
    }

    return fullText.trim();
  };

  const handleSubmit = async () => {
    if (!isStep2Valid) return;
    
    setIsSubmitting(true);
    setIsParsing(true);
    setSubmitError(null);

    try {
      // Parse CV to text
      const cvText = formData.cv ? await extractTextFromPDF(formData.cv) : '';
      
      // Parse LinkedIn PDF if provided
      let linkedinText = '';
      if (formData.linkedin) {
        try {
          linkedinText = await extractTextFromPDF(formData.linkedin);
        } catch (error) {
          console.warn('Could not parse LinkedIn PDF:', error);
        }
      }

      setIsParsing(false);

      // Prepare API payload according to SmartReq documentation
      const payload = {
        name: formData.name,
        phone_number: formData.phone,
        email: formData.email,
        cv: cvText,
        linkedin: linkedinText || undefined,
        job_offer: jobOffer ? {
          id: jobOffer.id,
          title: jobOffer.title,
          description: jobOffer.description,
          company_id: jobOffer.company_id,
          scoring_scale: jobOffer.scoring_scale,
          rubric: jobOffer.rubric,
          eligibility_filters: jobOffer.eligibility_filters,
          weights: jobOffer.weights,
          created_at: jobOffer.created_at,
          updated_at: jobOffer.updated_at,
        } : undefined,
      };

      // Submit to SmartReq API
      const response = await fetch('https://primary-production-6beb.up.railway.app/webhook/smartreq', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(payload),
      });

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({ error: 'Unknown error' }));
        throw new Error(errorData.error || `HTTP error! status: ${response.status}`);
      }

      const result = await response.json();
      console.log('SmartReq API Response:', result);

      // Save evaluation to database if we have job info
      if (jobOffer && result.evaluation_id) {
        try {
          await addEvaluation({
            candidate_id: formData.email,
            job_id: jobOffer.id,
            run_id: result.evaluation_id,
            scoring_scale: jobOffer.scoring_scale,
            rubric: jobOffer.rubric,
            candidate_name: formData.name,
            candidate_phone: formData.phone,
            // Add more fields as they become available from SmartReq
          });
          console.log('Evaluation saved to database successfully');
        } catch (dbError) {
          console.warn('Failed to save evaluation to database:', dbError);
          // Don't fail the whole submission if database save fails
        }
      }

      // Call the original onSubmit callback
      onSubmit(formData);
      setSubmitted(true);
    } catch (error) {
      console.error('Error submitting application:', error);
      setSubmitError(error instanceof Error ? error.message : 'Errore durante l\'invio della candidatura');
    } finally {
      setIsSubmitting(false);
    }
  };

  if (submitted) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center px-6">
        <div className="max-w-md w-full text-center">
          <div
            className="w-20 h-20 rounded-full mx-auto mb-6 flex items-center justify-center"
            style={{ backgroundColor: "#e6f4f1" }}
          >
            <CheckCircle2 className="w-10 h-10" style={{ color: "#006F4E" }} />
          </div>
          <h1 className="text-3xl mb-4" style={{ color: "#006F4E" }}>
            Candidatura Inviata!
          </h1>
          <p className="text-gray-600 mb-6">
            Grazie per il tuo interesse per la posizione di <strong>{role.title}</strong>.
            La tua candidatura è stata ricevuta e il nostro sistema di intelligenza artificiale 
            sta già analizzando il tuo profilo.
          </p>
          <div className="bg-blue-50 border border-blue-100 rounded-lg p-4 mb-4">
            <p className="text-sm text-gray-700 mb-2">
              🤖 <strong>Valutazione AI in corso</strong>
            </p>
            <p className="text-sm text-gray-600">
              Il nostro sistema analizzerà il tuo CV e potrebbe inviarti alcune domande 
              di chiarimento per meglio comprendere la tua esperienza.
            </p>
          </div>
          <div className="bg-green-50 border border-green-100 rounded-lg p-4">
            <p className="text-sm text-gray-700">
              💡 Controlla la tua email e il tuo telefono nei prossimi giorni per aggiornamenti 
              sul processo di selezione.
            </p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white border-b border-gray-200">
        <div className="max-w-3xl mx-auto px-6 py-6">
          <div className="flex items-center gap-3 mb-4">
            <img 
              src={creditAgricoleLogo} 
              alt="Crédit Agricole" 
              className="h-8"
            />
            <div className="border-l border-gray-300 pl-3">
              <p className="text-sm text-gray-600">{role.title}</p>
            </div>
          </div>
          
          {/* Progress */}
          <div className="space-y-2">
            <div className="flex items-center justify-between text-sm">
              <span style={{ color: "#009B9D" }}>Passo {step} di 2</span>
              <span className="text-gray-500">{step === 1 ? "Informazioni" : "Documenti"}</span>
            </div>
            <Progress value={step * 50} style={{ backgroundColor: "#e5e7eb" }} />
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-3xl mx-auto px-6 py-8">
        <Card className="border-0 shadow-lg">
          <CardContent className="p-8">
            {step === 1 ? (
              <div className="space-y-6">
                <div>
                  <h2 className="text-2xl mb-2" style={{ color: "#006F4E" }}>
                    Informazioni di Contatto
                  </h2>
                  <p className="text-gray-600">
                    Inserisci i tuoi dati per iniziare il processo di candidatura
                  </p>
                </div>

                <div className="space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="name">Nome Completo *</Label>
                    <Input
                      id="name"
                      placeholder="Mario Rossi"
                      value={formData.name}
                      onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="email">Email *</Label>
                    <Input
                      id="email"
                      type="email"
                      placeholder="mario.rossi@example.com"
                      value={formData.email}
                      onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="phone">Numero di Telefono *</Label>
                    <Input
                      id="phone"
                      type="tel"
                      placeholder="+39 340 123 4567"
                      value={formData.phone}
                      onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                    />
                    <p className="text-sm text-gray-500">
                      Necessario per il follow-up via WhatsApp
                    </p>
                  </div>


                </div>

                <div className="pt-6">
                  <Button
                    className="w-full"
                    onClick={() => setStep(2)}
                    disabled={!isStep1Valid}
                    style={{ backgroundColor: "#009B9D" }}
                  >
                    Continua al Passo 2
                  </Button>
                </div>
              </div>
            ) : (
              <div className="space-y-6">
                <div>
                  <h2 className="text-2xl mb-2" style={{ color: "#006F4E" }}>
                    Documenti e Consenso
                  </h2>
                  <p className="text-gray-600">
                    Carica il tuo CV e completa la candidatura
                  </p>
                </div>

                <div className="space-y-6">
                  <div className="space-y-2">
                    <Label htmlFor="cv">Curriculum Vitae (CV) *</Label>
                    <div
                      className="border-2 border-dashed rounded-lg p-6 text-center hover:border-gray-400 transition-colors cursor-pointer"
                      style={{ borderColor: formData.cv ? "#009B9D" : "#e5e7eb" }}
                      onClick={() => document.getElementById('cv-upload')?.click()}
                    >
                      <input
                        id="cv-upload"
                        type="file"
                        accept=".pdf,.doc,.docx"
                        className="hidden"
                        onChange={(e) => handleFileUpload("cv", e.target.files?.[0] || null)}
                      />
                      <Upload className="w-8 h-8 mx-auto mb-2 text-gray-400" />
                      <p className="text-sm text-gray-600">
                        {formData.cv ? (
                          <span style={{ color: "#006F4E" }}>✓ {formData.cv.name}</span>
                        ) : (
                          "Clicca per caricare o trascina il file qui"
                        )}
                      </p>
                      <p className="text-xs text-gray-400 mt-1">PDF, DOC, DOCX (Max 10MB)</p>
                    </div>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="linkedin">LinkedIn PDF (Opzionale)</Label>
                    <div
                      className="border-2 border-dashed rounded-lg p-6 text-center hover:border-gray-400 transition-colors cursor-pointer"
                      style={{ borderColor: formData.linkedin ? "#009B9D" : "#e5e7eb" }}
                      onClick={() => document.getElementById('linkedin-upload')?.click()}
                    >
                      <input
                        id="linkedin-upload"
                        type="file"
                        accept=".pdf"
                        className="hidden"
                        onChange={(e) => handleFileUpload("linkedin", e.target.files?.[0] || null)}
                      />
                      <Upload className="w-8 h-8 mx-auto mb-2 text-gray-400" />
                      <p className="text-sm text-gray-600">
                        {formData.linkedin ? (
                          <span style={{ color: "#006F4E" }}>✓ {formData.linkedin.name}</span>
                        ) : (
                          "Clicca per caricare o trascina il file qui"
                        )}
                      </p>
                      <p className="text-xs text-gray-400 mt-1">PDF del profilo LinkedIn (Max 10MB)</p>
                    </div>
                  </div>

                  <div className="pt-4 border-t">
                    <div className="flex items-start gap-3">
                      <Checkbox
                        id="consent"
                        checked={formData.consent}
                        onCheckedChange={(checked: boolean) =>
                          setFormData({ ...formData, consent: checked })
                        }
                      />
                      <div className="space-y-1">
                        <Label
                          htmlFor="consent"
                          className="text-sm cursor-pointer"
                        >
                          Acconsento al trattamento dei miei dati personali *
                        </Label>
                        <p className="text-xs text-gray-500">
                          Accetto che Crédit Agricole tratti i miei dati personali in conformità 
                          con il GDPR per finalità di selezione del personale.
                        </p>
                      </div>
                    </div>
                  </div>
                </div>

                <div className="pt-6 space-y-3">
                  {submitError && (
                    <div className="bg-red-50 border border-red-200 rounded-lg p-4">
                      <p className="text-sm text-red-800">
                        ⚠️ {submitError}
                      </p>
                    </div>
                  )}
                  
                  <div className="flex gap-3">
                    <Button
                      variant="outline"
                      onClick={() => setStep(1)}
                      className="flex-1"
                      disabled={isSubmitting}
                    >
                      Indietro
                    </Button>
                    <Button
                      className="flex-1"
                      onClick={handleSubmit}
                      disabled={!isStep2Valid || isSubmitting}
                      style={{ backgroundColor: "#006F4E" }}
                    >
                      {isSubmitting ? (
                        <>
                          <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                          {isParsing ? 'Analisi PDF...' : 'Invio in corso...'}
                        </>
                      ) : (
                        'Invia Candidatura e Finalizza'
                      )}
                    </Button>
                  </div>
                </div>
              </div>
            )}
          </CardContent>
        </Card>
      </main>

      {/* Footer */}
      <footer className="bg-white border-t border-gray-200 mt-12">
        <div className="max-w-3xl mx-auto px-6 py-4">
          <p className="text-sm text-gray-500 text-center">
            © 2025 Crédit Agricole - Tutti i diritti riservati
          </p>
        </div>
      </footer>
    </div>
  );
}
