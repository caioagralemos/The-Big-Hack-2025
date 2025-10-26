import { Button } from "./ui/button";
import { Card, CardContent } from "./ui/card";
import { ArrowRight, Building2, MapPin, Clock } from "lucide-react";
import creditAgricoleLogo from "figma:asset/51571be080406a0b3f76c0cbe126391b2cff8b63.png";

interface CandidateLandingPageProps {
  role: {
    title: string;
    department: string;
    description: string;
    requirements: string;
  };
  onApply: () => void;
}

export function CandidateLandingPage({ role, onApply }: CandidateLandingPageProps) {
  const requirements = role.requirements.split('\n').filter(r => r.trim());

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white border-b border-gray-200">
        <div className="max-w-4xl mx-auto px-6 py-6">
          <div className="flex items-center gap-3">
            <img 
              src={creditAgricoleLogo} 
              alt="Crédit Agricole" 
              className="h-12"
            />
            <div className="border-l border-gray-300 pl-4">
              <h1 className="text-lg" style={{ color: "#006F4E" }}>Opportunità di Carriera</h1>
              <p className="text-sm text-gray-600">Unisciti al nostro team</p>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-4xl mx-auto px-6 py-12">
        <div className="text-center mb-12">
          <div className="inline-block px-4 py-2 rounded-full mb-4" style={{ backgroundColor: "#e6f4f1" }}>
            <span className="text-sm" style={{ color: "#006F4E" }}>
              Posizione Aperta
            </span>
          </div>
          <h1 className="text-4xl mb-4" style={{ color: "#006F4E" }}>
            {role.title}
          </h1>
          <p className="text-xl text-gray-600 max-w-2xl mx-auto">
            {role.description}
          </p>
        </div>

        {/* Requirements Section */}
        <Card className="border-0 shadow-lg mb-8">
          <CardContent className="p-8">
            <h2 className="text-2xl mb-6" style={{ color: "#006F4E" }}>
              Cosa Cerchiamo
            </h2>
            <div className="space-y-3">
              {requirements.map((req, index) => (
                <div key={index} className="flex items-start gap-3">
                  <div
                    className="w-6 h-6 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5"
                    style={{ backgroundColor: "#009B9D" }}
                  >
                    <span className="text-white text-sm">✓</span>
                  </div>
                  <span className="text-gray-700">{req}</span>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* About the Position */}
        <Card className="border-0 shadow-lg mb-12">
          <CardContent className="p-8">
            <h2 className="text-2xl mb-6" style={{ color: "#006F4E" }}>
              Informazioni sulla Posizione
            </h2>
            
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div className="flex items-start gap-4">
                <div 
                  className="w-12 h-12 rounded-lg flex items-center justify-center flex-shrink-0"
                  style={{ backgroundColor: "#e6f4f1" }}
                >
                  <Building2 className="w-6 h-6" style={{ color: "#006F4E" }} />
                </div>
                <div>
                  <h3 className="mb-1" style={{ color: "#006F4E" }}>Azienda</h3>
                  <p className="text-sm text-gray-600">Crédit Agricole</p>
                </div>
              </div>

              <div className="flex items-start gap-4">
                <div 
                  className="w-12 h-12 rounded-lg flex items-center justify-center flex-shrink-0"
                  style={{ backgroundColor: "#e6f4f1" }}
                >
                  <MapPin className="w-6 h-6" style={{ color: "#006F4E" }} />
                </div>
                <div>
                  <h3 className="mb-1" style={{ color: "#006F4E" }}>Sede</h3>
                  <p className="text-sm text-gray-600">Italia</p>
                </div>
              </div>

              <div className="flex items-start gap-4">
                <div 
                  className="w-12 h-12 rounded-lg flex items-center justify-center flex-shrink-0"
                  style={{ backgroundColor: "#e6f4f1" }}
                >
                  <Clock className="w-6 h-6" style={{ color: "#006F4E" }} />
                </div>
                <div>
                  <h3 className="mb-1" style={{ color: "#006F4E" }}>Tipo</h3>
                  <p className="text-sm text-gray-600">Tempo Pieno</p>
                </div>
              </div>
            </div>

            <div className="mt-8 p-6 rounded-lg" style={{ backgroundColor: "#e6f4f1" }}>
              <h3 className="mb-3" style={{ color: "#006F4E" }}>Perché Crédit Agricole?</h3>
              <p className="text-sm text-gray-700 leading-relaxed">
                Unisciti a uno dei principali gruppi bancari internazionali. Offriamo opportunità 
                di crescita professionale, un ambiente di lavoro dinamico e la possibilità di 
                contribuire a progetti innovativi nel settore finanziario. Il tuo talento è il 
                nostro futuro.
              </p>
            </div>
          </CardContent>
        </Card>

        {/* CTA */}
        <div className="text-center">
          <Button
            size="lg"
            onClick={onApply}
            className="gap-2 px-8 py-6 text-lg"
            style={{ backgroundColor: "#ED1C24" }}
          >
            Applica Ora
            <ArrowRight className="w-5 h-5" />
          </Button>
          <p className="text-sm text-gray-500 mt-4">
            Il processo richiederà circa 5 minuti
          </p>
        </div>
      </main>

      {/* Footer */}
      <footer className="bg-white border-t border-gray-200 mt-12">
        <div className="max-w-4xl mx-auto px-6 py-6">
          <p className="text-sm text-gray-500 text-center">
            © 2025 Crédit Agricole - Tutti i diritti riservati
          </p>
        </div>
      </footer>
    </div>
  );
}
