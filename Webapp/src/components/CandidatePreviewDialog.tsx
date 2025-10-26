import { Dialog, DialogContent, DialogTitle, DialogDescription } from "./ui/dialog";
import { JobOffer } from "../types/JobOffer";
import { PublicJobApplication } from "./PublicJobApplication";
import { VisuallyHidden } from "@radix-ui/react-visually-hidden";

interface CandidatePreviewDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  role: JobOffer;
}

export function CandidatePreviewDialog({ open, onOpenChange, role }: CandidatePreviewDialogProps) {
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-[95vw] max-h-[95vh] overflow-y-auto p-0">
        <VisuallyHidden>
          <DialogTitle>Anteprima Candidato - {role.title}</DialogTitle>
          <DialogDescription>
            Visualizza l'esperienza che il candidato vedrà quando applica a questa posizione
          </DialogDescription>
        </VisuallyHidden>
        <div className="relative">
          <div className="absolute top-4 right-4 z-10 bg-yellow-100 border border-yellow-300 px-3 py-2 rounded-lg shadow-sm">
            <p className="text-sm text-yellow-800">
              👁️ <strong>Modalità Anteprima</strong> - Questo è ciò che vede il candidato
            </p>
          </div>
          <PublicJobApplication role={role} />
        </div>
      </DialogContent>
    </Dialog>
  );
}
