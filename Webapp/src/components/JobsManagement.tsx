/**
 * Jobs Management Component
 * Component for managing job postings
 */

import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from './ui/card';
import { Button } from './ui/button';
import { Input } from './ui/input';
import { Label } from './ui/label';
import { Textarea } from './ui/textarea';
import { Badge } from './ui/badge';
import { Plus, Edit, Trash2, Briefcase, Users } from 'lucide-react';
import { useData, Job, CreateJobInput } from '../contexts/DataContext';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from './ui/dialog';

export function JobsManagement() {
  const { jobs, evaluations, loading, error, addJob, editJob, removeJob } = useData();
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [editingJob, setEditingJob] = useState<Job | null>(null);
  const [formData, setFormData] = useState<CreateJobInput>({
    title: '',
    description: '',
    weights: {
      professional_experience: 0.30,
      technical_skills: 0.35,
      motivation: 0.15,
      education_learning: 0.10,
      soft_skills_behavioral: 0.10,
    },
  });

  const resetForm = () => {
    setFormData({
      title: '',
      description: '',
      weights: {
        professional_experience: 0.30,
        technical_skills: 0.35,
        motivation: 0.15,
        education_learning: 0.10,
        soft_skills_behavioral: 0.10,
      },
    });
    setEditingJob(null);
  };

  const handleEdit = (job: Job) => {
    setEditingJob(job);
    setFormData({
      title: job.title,
      description: job.description || '',
      job_key: job.job_key || '',
      company_id: job.company_id || '',
      scoring_scale: job.scoring_scale,
      rubric: job.rubric,
      eligibility_filters: job.eligibility_filters || [],
      weights: job.weights,
    });
    setIsDialogOpen(true);
  };

  const handleSubmit = async () => {
    try {
      if (editingJob) {
        await editJob(editingJob.id, formData);
      } else {
        await addJob(formData);
      }
      setIsDialogOpen(false);
      resetForm();
    } catch (error) {
      console.error('Error saving job:', error);
    }
  };

  const handleDelete = async (jobId: string) => {
    if (window.confirm('Sei sicuro di voler eliminare questo job?')) {
      await removeJob(jobId);
    }
  };

  const getJobEvaluationCount = (jobId: string) => {
    return evaluations.filter(evaluation => evaluation.job_id === jobId).length;
  };

  if (loading) {
    return (
      <Card>
        <CardContent className="p-6">
          <div className="text-center">Caricamento jobs...</div>
        </CardContent>
      </Card>
    );
  }

  if (error) {
    return (
      <Card>
        <CardContent className="p-6">
          <div className="text-center text-red-600">Errore: {error}</div>
        </CardContent>
      </Card>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="text-2xl font-bold">Gestione Jobs</h2>
        <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
          <DialogTrigger asChild>
            <Button onClick={() => resetForm()}>
              <Plus className="w-4 h-4 mr-2" />
              Nuovo Job
            </Button>
          </DialogTrigger>
          <DialogContent className="max-w-2xl">
            <DialogHeader>
              <DialogTitle>
                {editingJob ? 'Modifica Job' : 'Nuovo Job'}
              </DialogTitle>
              <DialogDescription>
                {editingJob ? 'Modifica le informazioni del job' : 'Crea un nuovo job posting'}
              </DialogDescription>
            </DialogHeader>
            
            <div className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="title">Titolo *</Label>
                <Input
                  id="title"
                  placeholder="es. Senior React Developer"
                  value={formData.title}
                  onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="description">Descrizione</Label>
                <Textarea
                  id="description"
                  placeholder="Descrizione del job..."
                  value={formData.description}
                  onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                  rows={4}
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="job_key">Job Key</Label>
                  <Input
                    id="job_key"
                    placeholder="react-dev-2025"
                    value={formData.job_key || ''}
                    onChange={(e) => setFormData({ ...formData, job_key: e.target.value })}
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="company_id">Company ID</Label>
                  <Input
                    id="company_id"
                    placeholder="UUID dell'azienda"
                    value={formData.company_id || ''}
                    onChange={(e) => setFormData({ ...formData, company_id: e.target.value })}
                  />
                </div>
              </div>

              <div className="space-y-4">
                <Label>Pesi di Valutazione (devono sommare a 1.0)</Label>
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="professional_experience">Esperienza Professionale</Label>
                    <Input
                      id="professional_experience"
                      type="number"
                      step="0.01"
                      min="0"
                      max="1"
                      value={formData.weights.professional_experience}
                      onChange={(e) => setFormData({
                        ...formData,
                        weights: { ...formData.weights, professional_experience: parseFloat(e.target.value) }
                      })}
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="technical_skills">Competenze Tecniche</Label>
                    <Input
                      id="technical_skills"
                      type="number"
                      step="0.01"
                      min="0"
                      max="1"
                      value={formData.weights.technical_skills}
                      onChange={(e) => setFormData({
                        ...formData,
                        weights: { ...formData.weights, technical_skills: parseFloat(e.target.value) }
                      })}
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="motivation">Motivazione</Label>
                    <Input
                      id="motivation"
                      type="number"
                      step="0.01"
                      min="0"
                      max="1"
                      value={formData.weights.motivation}
                      onChange={(e) => setFormData({
                        ...formData,
                        weights: { ...formData.weights, motivation: parseFloat(e.target.value) }
                      })}
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="education_learning">Educazione/Apprendimento</Label>
                    <Input
                      id="education_learning"
                      type="number"
                      step="0.01"
                      min="0"
                      max="1"
                      value={formData.weights.education_learning}
                      onChange={(e) => setFormData({
                        ...formData,
                        weights: { ...formData.weights, education_learning: parseFloat(e.target.value) }
                      })}
                    />
                  </div>

                  <div className="space-y-2 col-span-2">
                    <Label htmlFor="soft_skills_behavioral">Soft Skills/Comportamentali</Label>
                    <Input
                      id="soft_skills_behavioral"
                      type="number"
                      step="0.01"
                      min="0"
                      max="1"
                      value={formData.weights.soft_skills_behavioral}
                      onChange={(e) => setFormData({
                        ...formData,
                        weights: { ...formData.weights, soft_skills_behavioral: parseFloat(e.target.value) }
                      })}
                    />
                  </div>
                </div>

                <div className="text-sm text-gray-600">
                  Totale: {Object.values(formData.weights).reduce((sum, val) => sum + val, 0).toFixed(2)}
                  {Object.values(formData.weights).reduce((sum, val) => sum + val, 0) !== 1.0 && (
                    <span className="text-red-600 ml-2">⚠️ Deve essere 1.0</span>
                  )}
                </div>
              </div>

              <div className="flex gap-2 pt-4">
                <Button
                  onClick={handleSubmit}
                  disabled={Object.values(formData.weights).reduce((sum, val) => sum + val, 0) !== 1.0 || !formData.title}
                  className="flex-1"
                >
                  {editingJob ? 'Aggiorna' : 'Crea'} Job
                </Button>
                <Button variant="outline" onClick={() => setIsDialogOpen(false)}>
                  Annulla
                </Button>
              </div>
            </div>
          </DialogContent>
        </Dialog>
      </div>

      <div className="grid gap-4">
        {jobs.length === 0 ? (
          <Card>
            <CardContent className="p-6">
              <div className="text-center text-gray-500">
                <Briefcase className="w-12 h-12 mx-auto mb-4 text-gray-300" />
                <p>Nessun job trovato</p>
                <p className="text-sm">Crea il tuo primo job per iniziare</p>
              </div>
            </CardContent>
          </Card>
        ) : (
          jobs.map((job) => (
            <Card key={job.id}>
              <CardHeader>
                <div className="flex items-center justify-between">
                  <CardTitle className="flex items-center gap-2">
                    <Briefcase className="w-5 h-5" />
                    {job.title}
                  </CardTitle>
                  <div className="flex items-center gap-2">
                    <Badge variant="secondary" className="flex items-center gap-1">
                      <Users className="w-3 h-3" />
                      {getJobEvaluationCount(job.id)}
                    </Badge>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => handleEdit(job)}
                    >
                      <Edit className="w-4 h-4" />
                    </Button>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => handleDelete(job.id)}
                      className="text-red-600 hover:text-red-700"
                    >
                      <Trash2 className="w-4 h-4" />
                    </Button>
                  </div>
                </div>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  {job.description && (
                    <p className="text-gray-600">{job.description}</p>
                  )}
                  
                  <div className="grid grid-cols-2 gap-4 text-sm">
                    <div>
                      <span className="font-medium">Scala di Valutazione:</span> {job.scoring_scale}
                    </div>
                    <div>
                      <span className="font-medium">Creato:</span> {new Date(job.created_at).toLocaleDateString('it-IT')}
                    </div>
                  </div>

                  <div className="space-y-2">
                    <span className="font-medium text-sm">Pesi di Valutazione:</span>
                    <div className="grid grid-cols-3 gap-2 text-xs">
                      <div>Prof. Exp: {(job.weights.professional_experience * 100).toFixed(0)}%</div>
                      <div>Tech Skills: {(job.weights.technical_skills * 100).toFixed(0)}%</div>
                      <div>Motivation: {(job.weights.motivation * 100).toFixed(0)}%</div>
                      <div>Education: {(job.weights.education_learning * 100).toFixed(0)}%</div>
                      <div>Soft Skills: {(job.weights.soft_skills_behavioral * 100).toFixed(0)}%</div>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))
        )}
      </div>
    </div>
  );
}