import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "./ui/card";
import { Badge } from "./ui/badge";
import { Alert, AlertDescription } from "./ui/alert";
import { 
  CheckCircle2, 
  XCircle, 
  AlertCircle,
  Database,
  Server,
  Zap,
  ExternalLink
} from "lucide-react";

interface SystemStatusCardProps {
  databaseConnected: boolean;
  edgeFunctionReachable: boolean;
  smartReqApiReachable?: boolean;
  candidatesCount?: number;
  evaluationsCount?: number;
}

export function SystemStatusCard({
  databaseConnected,
  edgeFunctionReachable,
  smartReqApiReachable = true,
  candidatesCount = 0,
  evaluationsCount = 0
}: SystemStatusCardProps) {
  
  const allSystemsGo = databaseConnected && edgeFunctionReachable && smartReqApiReachable;
  
  return (
    <Card className={allSystemsGo ? "border-green-200 bg-green-50" : "border-orange-200 bg-orange-50"}>
      <CardHeader>
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            {allSystemsGo ? (
              <CheckCircle2 className="w-5 h-5 text-green-600" />
            ) : (
              <AlertCircle className="w-5 h-5 text-orange-600" />
            )}
            <CardTitle>Stato del Sistema</CardTitle>
          </div>
          {allSystemsGo ? (
            <Badge className="bg-green-600 text-white">Operativo</Badge>
          ) : (
            <Badge className="bg-orange-600 text-white">Attenzione</Badge>
          )}
        </div>
        <CardDescription>
          Verifica lo stato dei servizi collegati
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        {/* Database Status */}
        <div className="flex items-center justify-between p-3 bg-white rounded-lg border">
          <div className="flex items-center gap-3">
            <Database className={`w-5 h-5 ${databaseConnected ? 'text-green-600' : 'text-red-600'}`} />
            <div>
              <p className="font-medium text-sm">Database Supabase</p>
              <p className="text-xs text-gray-500">
                {candidatesCount} candidati, {evaluationsCount} valutazioni
              </p>
            </div>
          </div>
          {databaseConnected ? (
            <CheckCircle2 className="w-5 h-5 text-green-600" />
          ) : (
            <XCircle className="w-5 h-5 text-red-600" />
          )}
        </div>

        {/* Edge Function Status */}
        <div className="flex items-center justify-between p-3 bg-white rounded-lg border">
          <div className="flex items-center gap-3">
            <Server className={`w-5 h-5 ${edgeFunctionReachable ? 'text-green-600' : 'text-red-600'}`} />
            <div>
              <p className="font-medium text-sm">Edge Function</p>
              <p className="text-xs text-gray-500">make-server-2a12511d</p>
            </div>
          </div>
          {edgeFunctionReachable ? (
            <CheckCircle2 className="w-5 h-5 text-green-600" />
          ) : (
            <XCircle className="w-5 h-5 text-red-600" />
          )}
        </div>

        {/* SmartReq API Status */}
        <div className="flex items-center justify-between p-3 bg-white rounded-lg border">
          <div className="flex items-center gap-3">
            <Zap className={`w-5 h-5 ${smartReqApiReachable ? 'text-green-600' : 'text-orange-600'}`} />
            <div>
              <p className="font-medium text-sm">SmartReq AI API</p>
              <p className="text-xs text-gray-500">Valutazione candidati</p>
            </div>
          </div>
          {smartReqApiReachable ? (
            <CheckCircle2 className="w-5 h-5 text-green-600" />
          ) : (
            <AlertCircle className="w-5 h-5 text-orange-600" />
          )}
        </div>

        {/* Warning Messages */}
        {!databaseConnected && (
          <Alert className="border-red-200 bg-red-50">
            <AlertCircle className="h-4 w-4 text-red-600" />
            <AlertDescription className="text-sm">
              <p className="font-semibold mb-1">Database non raggiungibile</p>
              <p>Verifica che le tabelle siano create e la Edge Function sia deployata.</p>
              <a 
                href="https://supabase.com/dashboard/project/evsymppxmhfvfgmkviij/database/tables"
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-1 text-blue-600 hover:underline mt-2 text-xs"
              >
                Vai alle Tabelle
                <ExternalLink className="w-3 h-3" />
              </a>
            </AlertDescription>
          </Alert>
        )}

        {!edgeFunctionReachable && (
          <Alert className="border-red-200 bg-red-50">
            <AlertCircle className="h-4 w-4 text-red-600" />
            <AlertDescription className="text-sm">
              <p className="font-semibold mb-1">Edge Function non raggiungibile</p>
              <p>La function potrebbe non essere deployata o configurata correttamente.</p>
              <a 
                href="https://supabase.com/dashboard/project/evsymppxmhfvfgmkviij/functions"
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-1 text-blue-600 hover:underline mt-2 text-xs"
              >
                Vai alle Edge Functions
                <ExternalLink className="w-3 h-3" />
              </a>
            </AlertDescription>
          </Alert>
        )}

        {!smartReqApiReachable && (
          <Alert className="border-orange-200 bg-orange-50">
            <AlertCircle className="h-4 w-4 text-orange-600" />
            <AlertDescription className="text-sm">
              <p className="font-semibold mb-1">SmartReq API potrebbe essere offline</p>
              <p className="text-xs">
                Le candidature verranno comunque salvate nel database. 
                La valutazione AI potrebbe arrivare in un secondo momento.
              </p>
            </AlertDescription>
          </Alert>
        )}

        {allSystemsGo && (
          <Alert className="border-green-200 bg-green-50">
            <CheckCircle2 className="h-4 w-4 text-green-600" />
            <AlertDescription className="text-sm">
              <p className="font-semibold">✨ Tutti i sistemi sono operativi</p>
              <p className="text-xs mt-1">
                Il sistema è pronto per ricevere candidature e generare valutazioni AI.
              </p>
            </AlertDescription>
          </Alert>
        )}
      </CardContent>
    </Card>
  );
}
