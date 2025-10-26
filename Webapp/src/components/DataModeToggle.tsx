import { useData, DataMode } from '../contexts/DataContext';
import { Button } from './ui/button';
import { Badge } from './ui/badge';
import { Database, Presentation, Loader2, AlertCircle, CheckCircle, Settings2 } from 'lucide-react';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from './ui/dialog';

export function DataModeToggle() {
  const { mode, setMode, jobs, evaluations, loading, error } = useData();

  const stats = {
    jobs: jobs.length,
    evaluations: evaluations.length,
  };

  // Icona di stato
  const StatusIcon = () => {
    if (mode === 'demo') {
      return <Presentation className="w-3 h-3" />;
    }
    if (loading) {
      return <Loader2 className="w-3 h-3 animate-spin" />;
    }
    if (error) {
      return <AlertCircle className="w-3 h-3 text-red-600" />;
    }
    return <CheckCircle className="w-3 h-3 text-green-600" />;
  };

  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button
          variant="ghost"
          size="sm"
          className="gap-2 text-gray-600 hover:text-gray-900"
        >
          <Settings2 className="w-4 h-4" />
          <StatusIcon />
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[500px]">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Database className="w-5 h-5" style={{ color: '#009B9D' }} />
            Configurazione Sorgente Dati
          </DialogTitle>
          <DialogDescription>
            Scegli tra dati demo per testing o connessione al database Supabase
          </DialogDescription>
        </DialogHeader>
        
        <div className="space-y-4 py-4">
          <div className="flex gap-2">
            <Button
              variant={mode === 'demo' ? 'default' : 'outline'}
              onClick={() => setMode('demo')}
              className="flex-1"
              style={mode === 'demo' ? { backgroundColor: '#009B9D' } : {}}
            >
              <Presentation className="w-4 h-4 mr-2" />
              Modalità Demo
            </Button>
            <Button
              variant={mode === 'live' ? 'default' : 'outline'}
              onClick={() => setMode('live')}
              className="flex-1"
              style={mode === 'live' ? { backgroundColor: '#006F4E' } : {}}
            >
              <Database className="w-4 h-4 mr-2" />
              Database Live
            </Button>
          </div>

          {mode === 'live' && (
            <div className="pt-2 border-t">
              {loading ? (
                <div className="flex items-center gap-2 text-sm text-gray-600">
                  <Loader2 className="w-4 h-4 animate-spin" />
                  <span>Connessione al database...</span>
                </div>
              ) : error ? (
                <div className="p-3 bg-red-50 rounded-lg">
                  <div className="flex items-center gap-2">
                    <AlertCircle className="w-4 h-4 text-red-600" />
                    <span className="text-sm text-red-800">Errore di connessione</span>
                  </div>
                  <p className="text-xs text-red-600 mt-1">{error}</p>
                </div>
              ) : (
                <div className="space-y-2">
                  <div className="flex items-center gap-2 text-sm">
                    <CheckCircle className="w-4 h-4 text-green-600" />
                    <span className="text-gray-700">Connesso a Supabase</span>
                  </div>
                  <div className="flex items-center gap-4 text-sm pl-6">
                    <div className="flex items-center gap-1">
                      <Badge variant="secondary" className="bg-blue-100">
                        {stats.jobs}
                      </Badge>
                      <span className="text-gray-600">jobs</span>
                    </div>
                    <div className="flex items-center gap-1">
                      <Badge variant="secondary" className="bg-green-100">
                        {stats.evaluations}
                      </Badge>
                      <span className="text-gray-600">evaluations</span>
                    </div>
                  </div>
                </div>
              )}
            </div>
          )}

          {mode === 'demo' && (
            <div className="pt-2 border-t">
              <p className="text-sm text-gray-600">
                📊 Utilizzando dati di esempio per la presentazione
              </p>
              <div className="flex items-center gap-4 text-sm mt-2">
                <div className="flex items-center gap-1">
                  <Badge variant="secondary" className="bg-blue-100">
                    {stats.jobs}
                  </Badge>
                  <span className="text-gray-600">jobs</span>
                </div>
                <div className="flex items-center gap-1">
                  <Badge variant="secondary" className="bg-green-100">
                    {stats.evaluations}
                  </Badge>
                  <span className="text-gray-600">valutazioni</span>
                </div>
              </div>
            </div>
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
}
