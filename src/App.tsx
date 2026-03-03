import { useEffect } from "react";
import { Toaster } from "sonner";
import { init, getState } from "./zoho";
import { ClientSearch } from "./components/ClientSearch";

function App() {
  useEffect(() => {
    const initializeZoho = async () => {
      try {
        console.log("🚀 [App] Iniciando conexão com Zoho...");
        await init();
        const currentState = getState();
        console.log("✅ [App] Estado final:", currentState);
      } catch (error) {
        console.error("❌ [App] Erro ao inicializar:", error);
      }
    };

    initializeZoho();
  }, []);

  return (
    <>
      <ClientSearch />
      <Toaster position="bottom-right" richColors />
    </>
  );
}

export default App;
