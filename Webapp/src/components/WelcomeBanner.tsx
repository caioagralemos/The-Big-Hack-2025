import { useState, useEffect } from "react";
import { Alert, AlertDescription, AlertTitle } from "./ui/alert";
import { Button } from "./ui/button";
import { X, Rocket, ExternalLink, CheckCircle, ArrowRight, Settings } from "lucide-react";

export function WelcomeBanner() {
  const [isVisible, setIsVisible] = useState(false);
  const [isDismissed, setIsDismissed] = useState(false);

  useEffect(() => {
    // Check if banner was previously dismissed
    const dismissed = localStorage.getItem('welcome-banner-dismissed');
    if (!dismissed) {
      setIsVisible(true);
    } else {
      setIsDismissed(true);
    }
  }, []);

  const handleDismiss = () => {
    localStorage.setItem('welcome-banner-dismissed', 'true');
    setIsVisible(false);
    setIsDismissed(true);
  };

  if (!isVisible || isDismissed) {
    return null;
  }

  return (
    <Alert className="border-blue-300 bg-gradient-to-r from-blue-50 to-cyan-50 relative mb-6">
      <Button
        variant="ghost"
        size="sm"
        className="absolute top-2 right-2"
        onClick={handleDismiss}
      >
        <X className="w-4 h-4" />
      </Button>
      
      <div className="flex gap-3">
        <Rocket className="w-6 h-6 text-blue-600 flex-shrink-0 mt-1" />
        <div className="flex-1">
          <AlertTitle className="text-lg mb-2 pr-8">
            👋 Benvenuto nel Sistema di Reclutamento AI!
          </AlertTitle>
          <AlertDescription className="space-y-4">
            <p className="text-sm text-gray-700">
              Questa è la dashboard completa per gestire candidature e valutazioni AI. 
              Prima di iniziare, assicurati che il sistema sia configurato correttamente.
            </p>

            <div className="bg-white rounded-lg p-4 space-y-3">
              <p className="font-semibold text-sm flex items-center gap-2">
                <CheckCircle className="w-4 h-4 text-green-600" />
                Setup Rapido in 3 Step:
              </p>
              
              <ol className="space-y-2 text-sm ml-6">
                <li className="flex items-start gap-2">
                  <span className="font-bold text-blue-600 flex-shrink-0">1.</span>
                  <div>
                    <span className="font-medium">Vai alla tab</span>{" "}
                    <span className="bg-cyan-100 px-2 py-0.5 rounded text-xs font-mono">
                      🔧 Test Connessione
                    </span>
                  </div>
                </li>
                <li className="flex items-start gap-2">
                  <span className="font-bold text-blue-600 flex-shrink-0">2.</span>
                  <div>
                    Clicca{" "}
                    <span className="bg-green-100 px-2 py-0.5 rounded text-xs font-semibold">
                      Esegui Test Completo
                    </span>
                  </div>
                </li>
                <li className="flex items-start gap-2">
                  <span className="font-bold text-blue-600 flex-shrink-0">3.</span>
                  <div>
                    Se ci sono ❌ errori, segui i link per risolverli
                  </div>
                </li>
              </ol>
            </div>

            <div className="flex flex-wrap gap-2">
              <Button
                size="sm"
                onClick={() => {
                  // Navigate to debug tab
                  const debugTab = document.querySelector('[value="debug"]') as HTMLElement;
                  if (debugTab) debugTab.click();
                  handleDismiss();
                }}
                style={{ backgroundColor: '#009B9D' }}
              >
                <ArrowRight className="w-3 h-3 mr-1" />
                Vai ai Test
              </Button>
              
              <Button size="sm" variant="outline" disabled>
                Database Setup
                <Settings className="w-3 h-3 ml-1" />
              </Button>

              <Button size="sm" variant="outline" disabled>
                API Config
                <Settings className="w-3 h-3 ml-1" />
              </Button>
            </div>

            <p className="text-xs text-gray-500 pt-2 border-t border-blue-100">
              💡 <strong>Tip:</strong> Consulta <code className="bg-gray-100 px-1 rounded">/docs/QUICK_START.md</code> per la guida completa.
              Questo banner apparirà solo una volta.
            </p>
          </AlertDescription>
        </div>
      </div>
    </Alert>
  );
}
