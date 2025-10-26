import { useState } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter } from "./ui/dialog";
import { Button } from "./ui/button";
import { Input } from "./ui/input";
import { Label } from "./ui/label";
import { Textarea } from "./ui/textarea";

import { JobOffer, JobOfferWeights } from "../types/JobOffer";
import { Alert, AlertDescription } from "./ui/alert";
import { AlertCircle } from "lucide-react";

interface AddRoleDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onAddRole: (role: JobOffer) => void;
}

export function AddRoleDialog({ open, onOpenChange, onAddRole }: AddRoleDialogProps) {
  const [formData, setFormData] = useState({
    title: "",
    description: "",
    requirements: "",
    jobKey: "",
    weights: {
      professional_experience: 0.30,
      technical_skills: 0.35,
      motivation: 0.15,
      education_learning: 0.10,
      soft_skills_behavioral: 0.10,
    } as JobOfferWeights,
  });

  const [weightsError, setWeightsError] = useState<string | null>(null);

  const validateWeights = (weights: JobOfferWeights): boolean => {
    const sum = weights.professional_experience + weights.technical_skills + 
                weights.motivation + weights.education_learning + weights.soft_skills_behavioral;
    
    if (Math.abs(sum - 1.0) > 0.001) {
      setWeightsError(`La somma dei pesi deve essere 1.0 (attualmente: ${sum.toFixed(3)})`);
      return false;
    }
    setWeightsError(null);
    return true;
  };

  const handleWeightChange = (dimension: keyof JobOfferWeights, value: string) => {
    const numValue = parseFloat(value) || 0;
    const newWeights = {
      ...formData.weights,
      [dimension]: numValue,
    };
    setFormData({ ...formData, weights: newWeights });
    validateWeights(newWeights);
  };

  const handleSubmit = () => {
    if (!validateWeights(formData.weights)) {
      return;
    }

    const newRole = new JobOffer({
      id: crypto.randomUUID(),
      company_id: "credit-agricole",
      job_key: formData.jobKey || formData.title.toLowerCase().replace(/\s+/g, '-'),
      title: formData.title,
      description: formData.description,
      eligibility_filters: formData.requirements.split('\n').filter(r => r.trim()),
      weights: formData.weights,
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
    });

    onAddRole(newRole);
    onOpenChange(false);
    
    // Reset form
    setFormData({
      title: "",
      description: "",
      requirements: "",
      jobKey: "",
      weights: {
        professional_experience: 0.30,
        technical_skills: 0.35,
        motivation: 0.15,
        education_learning: 0.10,
        soft_skills_behavioral: 0.10,
      },
    });
    setWeightsError(null);
  };

  const weightsSum = formData.weights.professional_experience + formData.weights.technical_skills + 
                     formData.weights.motivation + formData.weights.education_learning + 
                     formData.weights.soft_skills_behavioral;

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Aggiungi Nuovo Ruolo</DialogTitle>
          <DialogDescription>
            Crea una nuova posizione aperta e imposta i criteri di valutazione
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-4 py-4">
          <div className="space-y-2">
            <Label htmlFor="title">Titolo del Ruolo *</Label>
            <Input
              id="title"
              placeholder="es. Senior Backend Engineer"
              value={formData.title}
              onChange={(e) => setFormData({ ...formData, title: e.target.value })}
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="jobKey">Job Key (opzionale)</Label>
            <Input
              id="jobKey"
              placeholder="es. senior-backend-engineer"
              value={formData.jobKey}
              onChange={(e) => setFormData({ ...formData, jobKey: e.target.value })}
            />
            <p className="text-xs text-gray-500">
              Se vuoto, verrà generato automaticamente dal titolo
            </p>
          </div>

          <div className="space-y-2">
            <Label htmlFor="description">Descrizione del Ruolo *</Label>
            <Textarea
              id="description"
              placeholder="Descrivi le responsabilità principali e l'impatto del ruolo..."
              value={formData.description}
              onChange={(e) => setFormData({ ...formData, description: e.target.value })}
              rows={4}
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="requirements">Requisiti Chiave / Filtri di Idoneità *</Label>
            <Textarea
              id="requirements"
              placeholder="Elenca i requisiti principali (uno per riga)..."
              value={formData.requirements}
              onChange={(e) => setFormData({ ...formData, requirements: e.target.value })}
              rows={4}
            />
          </div>

          <div className="pt-4 border-t">
            <div className="flex items-center justify-between mb-4">
              <h4>Pesi per Dimensione (Devono sommare 1.0)</h4>
              <span className={`text-sm ${Math.abs(weightsSum - 1.0) <= 0.001 ? 'text-green-600' : 'text-red-600'}`}>
                Somma: {weightsSum.toFixed(3)}
              </span>
            </div>
            
            {weightsError && (
              <Alert variant="destructive" className="mb-4">
                <AlertCircle className="h-4 w-4" />
                <AlertDescription>{weightsError}</AlertDescription>
              </Alert>
            )}

            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="profExp">Esperienza Professionale</Label>
                <Input
                  id="profExp"
                  type="number"
                  min="0"
                  max="1"
                  step="0.01"
                  value={formData.weights.professional_experience}
                  onChange={(e) => handleWeightChange('professional_experience', e.target.value)}
                />
                <p className="text-xs text-gray-500">{(formData.weights.professional_experience * 100).toFixed(0)}%</p>
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="techSkills">Competenze Tecniche</Label>
                <Input
                  id="techSkills"
                  type="number"
                  min="0"
                  max="1"
                  step="0.01"
                  value={formData.weights.technical_skills}
                  onChange={(e) => handleWeightChange('technical_skills', e.target.value)}
                />
                <p className="text-xs text-gray-500">{(formData.weights.technical_skills * 100).toFixed(0)}%</p>
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="motivation">Motivazione</Label>
                <Input
                  id="motivation"
                  type="number"
                  min="0"
                  max="1"
                  step="0.01"
                  value={formData.weights.motivation}
                  onChange={(e) => handleWeightChange('motivation', e.target.value)}
                />
                <p className="text-xs text-gray-500">{(formData.weights.motivation * 100).toFixed(0)}%</p>
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="eduLearn">Istruzione e Apprendimento</Label>
                <Input
                  id="eduLearn"
                  type="number"
                  min="0"
                  max="1"
                  step="0.01"
                  value={formData.weights.education_learning}
                  onChange={(e) => handleWeightChange('education_learning', e.target.value)}
                />
                <p className="text-xs text-gray-500">{(formData.weights.education_learning * 100).toFixed(0)}%</p>
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="softSkills">Competenze Trasversali</Label>
                <Input
                  id="softSkills"
                  type="number"
                  min="0"
                  max="1"
                  step="0.01"
                  value={formData.weights.soft_skills_behavioral}
                  onChange={(e) => handleWeightChange('soft_skills_behavioral', e.target.value)}
                />
                <p className="text-xs text-gray-500">{(formData.weights.soft_skills_behavioral * 100).toFixed(0)}%</p>
              </div>
            </div>
          </div>
        </div>

        <DialogFooter>
          <Button variant="outline" onClick={() => onOpenChange(false)}>
            Annulla
          </Button>
          <Button
            onClick={handleSubmit}
            disabled={!formData.title || !formData.description || !formData.requirements || weightsError !== null}
            style={{ backgroundColor: "#006F4E" }}
          >
            Crea Ruolo
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
