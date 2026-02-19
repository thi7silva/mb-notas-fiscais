import { useState } from "react";
import { Search, ArrowRight, Loader2 } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { apiService } from "@/services/api";
import { getState } from "@/zoho";
import { toast } from "sonner";
import { validateCpfCnpj } from "@/lib/validation";

export function ClientSearch() {
  const [searchTerm, setSearchTerm] = useState("");
  const [loading, setLoading] = useState(false);
  const [isValid, setIsValid] = useState(false);

  const formatCpfCnpj = (value: string) => {
    const v = value.replace(/\D/g, "");

    if (v.length <= 11) {
      // CPF: 000.000.000-00
      return v
        .replace(/(\d{3})(\d)/, "$1.$2")
        .replace(/(\d{3})(\d)/, "$1.$2")
        .replace(/(\d{3})(\d{1,2})$/, "$1-$2");
    } else {
      // CNPJ: 00.000.000/0000-00
      return v
        .replace(/^(\d{2})(\d)/, "$1.$2")
        .replace(/^(\d{2})\.(\d{3})(\d)/, "$1.$2.$3")
        .replace(/\.(\d{3})(\d)/, ".$1/$2")
        .replace(/(\d{4})(\d)/, "$1-$2")
        .slice(0, 18);
    }
  };

  const handleSearch = async () => {
    if (!searchTerm || !isValid) {
      toast.warning("Por favor, informe um CPF ou CNPJ válido.");
      return;
    }

    try {
      setLoading(true);
      const userEmail =
        getState().loginUser || "thiago@albatechsolutions.com.br"; // Fallback for dev/offline
      console.log("🔍 Buscando cliente:", searchTerm, "Email:", userEmail);

      const result = await apiService.searchClient(searchTerm, userEmail);
      console.log("✅ Resultado da busca:", result);

      if (Array.isArray(result) && result.length > 0) {
        toast.success(`Cliente encontrado: ${result[0].razaoSocial}`);
        // TODO: Handle selection/navigation
      } else {
        toast.info("Nenhum cliente encontrado.");
      }
    } catch (error) {
      console.error("❌ Erro na busca:", error);
      toast.error("Erro ao buscar cliente. Verifique o console.");
    } finally {
      setLoading(false);
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter" && !loading && isValid) {
      handleSearch();
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const formatted = formatCpfCnpj(e.target.value);
    setSearchTerm(formatted);
    setIsValid(validateCpfCnpj(formatted));
  };

  return (
    <div className="flex min-h-screen items-center justify-center bg-background bg-[radial-gradient(#e5e7eb_1px,transparent_1px)] bg-size-[20px_20px] p-4">
      <div className="flex w-full max-w-4xl overflow-hidden rounded-2xl bg-card shadow-2xl md:flex-row flex-col">
        {/* Lado Esquerdo - Branding (Decorativo) */}
        <div className="relative flex w-full flex-col bg-primary p-8 md:w-5/12 lg:p-12">
          {/* Pattern e Shapes */}
          <div className="absolute inset-0 opacity-10 bg-[radial-gradient(#fff_1px,transparent_1px)] bg-size-[20px_20px]"></div>
          <div className="absolute -left-12 -top-12 h-40 w-40 rounded-full bg-white/10 blur-2xl"></div>
          <div className="absolute -right-12 -bottom-12 h-40 w-40 rounded-full bg-white/10 blur-2xl"></div>

          <div className="relative z-10 flex flex-1 flex-col justify-center">
            <h1 className="text-3xl font-bold text-white md:text-3xl lg:text-4xl">
              Minhas Notas
            </h1>
            <p className="mt-4 text-primary-foreground/90 text-sm md:text-base">
              Consulte e baixe suas notas fiscais de forma rápida e segura.
            </p>
          </div>

          <div className="relative z-10 mt-8 hidden text-xs text-primary-foreground/60 md:block">
            Sistema Integrado Melhor Bocado
          </div>
        </div>

        {/* Lado Direito - Formulário */}
        <div className="relative flex w-full flex-col items-center justify-center bg-white p-8 md:w-7/12 lg:p-12">
          <div className="w-full max-w-sm space-y-8">
            {/* Logo Centralizado */}
            <div className="flex justify-center">
              <img
                src="https://melhorbocado.com.br/wp-content/uploads/2023/12/logo.png"
                alt="Melhor Bocado"
                className="h-16 object-contain"
              />
            </div>

            <div className="space-y-2 text-center">
              <h2 className="text-2xl font-bold tracking-tight text-foreground">
                Buscar Notas Fiscais
              </h2>
              <p className="text-sm text-muted-foreground">
                Informe o CPF ou CNPJ para acessar
              </p>
            </div>

            <div className="space-y-4">
              <div className="relative group">
                <Search className="absolute left-3 top-3.5 h-5 w-5 text-muted-foreground transition-colors group-focus-within:text-primary" />
                <Input
                  type="text"
                  placeholder="000.000.000-00"
                  className={`h-12 border-muted-foreground/30 pl-10 text-lg shadow-sm transition-all focus-visible:border-primary focus-visible:ring-primary/20 ${isValid ? "border-green-500 focus-visible:border-green-500 focus-visible:ring-green-500/20" : ""}`}
                  value={searchTerm}
                  onChange={handleChange}
                  onKeyDown={handleKeyDown}
                  maxLength={18}
                  autoFocus
                />
              </div>

              <Button
                onClick={handleSearch}
                disabled={loading || !isValid}
                className="h-12 w-full text-base font-semibold shadow-md transition-all hover:scale-[1.02] hover:shadow-lg active:scale-[0.98] disabled:opacity-50 disabled:hover:scale-100"
                size="lg"
              >
                {loading ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Buscando...
                  </>
                ) : (
                  <>
                    Consultar
                    <ArrowRight className="ml-2 h-4 w-4" />
                  </>
                )}
              </Button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
