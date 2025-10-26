import { useState } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "./ui/dialog";
import { Button } from "./ui/button";
import { Input } from "./ui/input";
import { Label } from "./ui/label";
import { Copy, Check, Mail, MessageCircle } from "lucide-react";
import { JobOffer } from "../types/JobOffer";

interface ShareRoleDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  role: JobOffer | null;
}

export function ShareRoleDialog({ open, onOpenChange, role }: ShareRoleDialogProps) {
  const [copied, setCopied] = useState(false);
  
  const applicationUrl = `${window.location.origin}/apply/${role?.id}`;

  const handleCopy = () => {
    navigator.clipboard.writeText(applicationUrl);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleShareEmail = () => {
    const subject = encodeURIComponent(`Candidatura: ${role?.title}`);
    const body = encodeURIComponent(
      `Ciao,\n\nTi invito a candidarti per la posizione di ${role?.title} presso Crédit Agricole.\n\nPuoi inviare la tua candidatura al seguente link:\n${applicationUrl}\n\nCordiali saluti`
    );
    window.open(`mailto:?subject=${subject}&body=${body}`);
  };

  const handleShareWhatsApp = () => {
    const text = encodeURIComponent(
      `Candidati per la posizione di ${role?.title} presso Crédit Agricole: ${applicationUrl}`
    );
    window.open(`https://wa.me/?text=${text}`);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-md">
        <DialogHeader>
          <DialogTitle>Condividi Ruolo</DialogTitle>
          <DialogDescription>
            Condividi il link di candidatura per: <strong>{role?.title}</strong>
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-4 py-4">
          <div className="space-y-2">
            <Label>Link di Candidatura</Label>
            <div className="flex gap-2">
              <Input
                value={applicationUrl}
                readOnly
                className="flex-1"
              />
              <Button
                size="icon"
                variant="outline"
                onClick={handleCopy}
                style={{ color: copied ? "#10b981" : undefined }}
              >
                {copied ? <Check className="w-4 h-4" /> : <Copy className="w-4 h-4" />}
              </Button>
            </div>
          </div>

          <div className="pt-4 space-y-2">
            <Label>Condividi tramite</Label>
            <div className="grid grid-cols-2 gap-3">
              <Button
                variant="outline"
                onClick={handleShareEmail}
                className="gap-2"
              >
                <Mail className="w-4 h-4" />
                Email
              </Button>
              <Button
                variant="outline"
                onClick={handleShareWhatsApp}
                className="gap-2"
                style={{ borderColor: "#009B9D", color: "#009B9D" }}
              >
                <MessageCircle className="w-4 h-4" />
                WhatsApp
              </Button>
            </div>
          </div>

          <div className="pt-4 bg-gray-50 p-4 rounded-lg">
            <p className="text-sm text-gray-600">
              I candidati che visiteranno questo link vedranno la descrizione del ruolo e 
              potranno inviare la loro candidatura direttamente.
            </p>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
