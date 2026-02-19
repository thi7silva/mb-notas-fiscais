import { useEffect, useState } from "react";
import { Toaster } from "sonner";
import { Loader2 } from "lucide-react";
import { init, getState } from "./zoho";
import { ClientSearch } from "./components/ClientSearch";

function App() {
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const initializeZoho = async () => {
      try {
        console.log("🚀 [App] Iniciando conexão com Zoho...");
        await init();
        setTimeout(() => {
          const currentState = getState();
          console.log("✅ [App] Estado final:", currentState);
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
    <>
      <ClientSearch />
      <Toaster position="bottom-right" richColors />
    </>
  );
}

export default App;
