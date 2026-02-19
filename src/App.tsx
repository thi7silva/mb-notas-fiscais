import { useEffect, useState } from "react";
import { Toaster } from "sonner";
import { Loader2, CheckCircle2, XCircle, User } from "lucide-react";
import { init, getState, type AppState } from "./zoho";

function App() {
  const [loading, setLoading] = useState(true);
  const [appState, setAppState] = useState<AppState | null>(null);

  useEffect(() => {
    const initializeZoho = async () => {
      try {
        console.log("🚀 [App] Iniciando conexão com Zoho...");
        await init();
        setTimeout(() => {
          const currentState = getState();
          console.log("✅ [App] Estado final:", currentState);
          setAppState(currentState);
          setLoading(false);
        }, 800);
      } catch (error) {
        console.error("❌ [App] Erro ao inicializar:", error);
        setLoading(false);
      }
    };

    initializeZoho();
  }, []);

  if (loading) {
    return (
      <div className="flex min-h-screen flex-col items-center justify-center gap-4 bg-background">
        <div className="relative flex h-16 w-16 items-center justify-center rounded-full bg-primary/10">
          <Loader2 className="h-8 w-8 animate-spin text-primary" />
        </div>
        <div className="space-y-1 text-center">
          <h2 className="text-lg font-semibold tracking-tight">
            Conectando ao Zoho
          </h2>
          <p className="text-sm text-muted-foreground animate-pulse">
            Verificando credenciais e ambiente...
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background p-4 md:p-8 font-sans text-foreground">
      <div className="mx-auto max-w-2xl animate-in fade-in slide-in-from-bottom-4 duration-700">
        <header className="mb-8 text-center space-y-2">
          <h1 className="text-3xl font-bold tracking-tight bg-gradient-to-r from-primary to-primary/60 bg-clip-text text-transparent">
            Diagnóstico de Conexão
          </h1>
          <p className="text-muted-foreground">
            Verificação de integração com o ambiente Zoho Creator
          </p>
        </header>

        <main className="space-y-6">
          {/* Status Card */}
          <div className="rounded-xl border bg-card text-card-foreground shadow-sm overflow-hidden">
            <div className="border-b bg-muted/40 p-4">
              <h3 className="font-semibold flex items-center gap-2">
                Estado da Aplicação
              </h3>
            </div>
            <div className="p-6 grid gap-6">
              <div
                className={`group flex items-center justify-between rounded-lg border p-4 transition-colors ${
                  appState?.online
                    ? "bg-green-500/10 border-green-500/20 hover:bg-green-500/15"
                    : "bg-destructive/10 border-destructive/20 hover:bg-destructive/15"
                }`}
              >
                <div className="space-y-1">
                  <span className="text-xs font-medium uppercase tracking-wider text-muted-foreground">
                    Status da Conexão
                  </span>
                  <div className="flex items-center gap-2">
                    <div
                      className={`h-2.5 w-2.5 rounded-full shadow-sm ${appState?.online ? "bg-green-500 animate-pulse" : "bg-destructive"}`}
                    />
                    <span
                      className={`font-medium ${appState?.online ? "text-green-700 dark:text-green-400" : "text-destructive"}`}
                    >
                      {appState?.online
                        ? "Conectado e Online"
                        : "Desconectado / Offline"}
                    </span>
                  </div>
                </div>
                {appState?.online ? (
                  <CheckCircle2 className="h-8 w-8 text-green-500 transition-transform group-hover:scale-110" />
                ) : (
                  <XCircle className="h-8 w-8 text-destructive transition-transform group-hover:scale-110" />
                )}
              </div>

              {/* User Info Section */}
              {appState?.online && (
                <div className="space-y-3 pt-2">
                  <div className="flex items-center gap-2 text-sm font-medium text-muted-foreground">
                    <User className="h-4 w-4" />
                    Informações do Usuário
                  </div>

                  <div className="rounded-lg border bg-background/50 p-4 shadow-sm space-y-3">
                    <div className="grid grid-cols-1 sm:grid-cols-[120px_1fr] gap-2 sm:gap-4 items-center">
                      <span className="text-sm font-medium text-muted-foreground">
                        Login ID
                      </span>
                      <code className="relative rounded bg-muted px-[0.5rem] py-[0.3rem] font-mono text-sm font-semibold text-foreground break-all">
                        {appState.loginUser || "N/A"}
                      </code>
                    </div>
                  </div>
                </div>
              )}

              {!appState?.online && (
                <div className="rounded-lg border border-yellow-500/20 bg-yellow-500/10 p-4 text-sm text-yellow-700 dark:text-yellow-400">
                  <p className="font-semibold">⚠️ Modo Offline Detectado</p>
                  <p className="mt-1 opacity-90">
                    A aplicação não conseguiu detectar o contexto do Zoho.
                    Certifique-se de que está rodando dentro do widget ou iframe
                    do Zoho Creator, ou que o SDK foi inicializado corretamente.
                  </p>
                </div>
              )}
            </div>
          </div>
        </main>
      </div>
      <Toaster position="bottom-right" richColors />
    </div>
  );
}

export default App;
