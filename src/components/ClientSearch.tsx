import { useState } from "react";
import { Search, ArrowRight, Loader2 } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { apiService } from "@/services/api";
import type { ClientData } from "@/services/api";
import { InvoiceList } from "./InvoiceList";
import { getState } from "@/zoho";
import { toast } from "sonner";
import { validateCpfCnpj } from "@/lib/validation";

type SearchMode = "codigoMB" | "cnpj";

export function ClientSearch() {
  const [searchMode, setSearchMode] = useState<SearchMode>("codigoMB");
  const [searchTerm, setSearchTerm] = useState("");
  const [loading, setLoading] = useState(false);
  const [isValid, setIsValid] = useState(false);
  const [selectedClient, setSelectedClient] = useState<ClientData | null>(null);

  const formatCpfCnpj = (value: string) => {
    const v = value.replace(/\D/g, "");
    if (v.length <= 11) {
      return v
        .replace(/(\d{3})(\d)/, "$1.$2")
        .replace(/(\d{3})(\d)/, "$1.$2")
        .replace(/(\d{3})(\d{1,2})$/, "$1-$2");
    } else {
      return v
        .replace(/^(\d{2})(\d)/, "$1.$2")
        .replace(/^(\d{2})\.(\d{3})(\d)/, "$1.$2.$3")
        .replace(/\.(\d{3})(\d)/, ".$1/$2")
        .replace(/(\d{4})(\d)/, "$1-$2")
        .slice(0, 18);
    }
  };

  const validateCodigoMB = (value: string) => {
    const clean = value.trim();
    return clean.length >= 1 && clean.length <= 3;
  };

  const handleSearch = async () => {
    if (!searchTerm || !isValid) {
      toast.warning(
        searchMode === "codigoMB"
          ? "Por favor, informe um Código MB válido (até 3 caracteres)."
          : "Por favor, informe um CPF ou CNPJ válido.",
      );
      return;
    }

    try {
      setLoading(true);
      const userEmail =
        getState().loginUser || "thiago@albatechsolutions.com.br";

      const result = await apiService.searchClient(searchTerm, userEmail);

      if (Array.isArray(result) && result.length > 0) {
        // Encontra o cliente que corresponde ao termo buscado
        const match =
          searchMode === "codigoMB"
            ? result.find(
                (c) =>
                  c.codigoMB.toUpperCase() === searchTerm.trim().toUpperCase(),
              )
            : result.find((c) => c.cnpjCpf === searchTerm.replace(/\D/g, ""));

        if (!match) {
          toast.info("Nenhum cliente encontrado.");
          return;
        }

        toast.success(`Cliente encontrado: ${match.razaoSocial}`);
        try {
          const invoices = await apiService.getInvoices(match.codigoMB);
          setSelectedClient({ ...match, notas: invoices });
        } catch {
          toast.error(
            "Erro ao carregar notas fiscais, mas cliente encontrado.",
          );
          setSelectedClient(match);
        }
      } else {
        toast.info("Nenhum cliente encontrado.");
      }
    } catch {
      toast.error("Erro ao buscar cliente. Verifique o console.");
    } finally {
      setLoading(false);
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter" && !loading && isValid) handleSearch();
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const raw = e.target.value;
    if (searchMode === "codigoMB") {
      // Alphanumeric, max 3 chars
      const clean = raw.slice(0, 3);
      setSearchTerm(clean);
      setIsValid(validateCodigoMB(clean));
    } else {
      const formatted = formatCpfCnpj(raw);
      setSearchTerm(formatted);
      setIsValid(validateCpfCnpj(formatted));
    }
  };

  const handleModeChange = (mode: SearchMode) => {
    setSearchMode(mode);
    setSearchTerm("");
    setIsValid(false);
  };

  if (selectedClient) {
    return (
      <InvoiceList
        client={selectedClient}
        invoices={selectedClient.notas || []}
        onBack={() => setSelectedClient(null)}
      />
    );
  }

  return (
    /* ── Mobile: full-screen vertical ── Desktop: centered card ── */
    <div className="flex min-h-screen flex-col bg-background bg-[radial-gradient(#e5e7eb_1px,transparent_1px)] bg-size-[20px_20px] md:items-center md:justify-center md:p-4">
      <div className="flex w-full flex-1 flex-col overflow-hidden md:max-w-4xl md:flex-row md:flex-none md:rounded-2xl md:shadow-2xl">
        {/* ── Header colorido (visível só no mobile como topo) / Painel branding no desktop ── */}
        <div className="relative flex flex-col bg-primary px-6 py-8 md:w-5/12 md:p-10 lg:p-12">
          {/* Decoração */}
          <div className="absolute inset-0 opacity-10 bg-[radial-gradient(#fff_1px,transparent_1px)] bg-size-[20px_20px]" />
          <div className="absolute -left-10 -top-10 h-32 w-32 rounded-full bg-white/10 blur-2xl" />
          <div className="absolute -right-10 -bottom-10 h-32 w-32 rounded-full bg-white/10 blur-2xl" />

          {/* Mobile: row com logo + texto lado a lado para ser compacto */}
          <div className="relative z-10 flex items-center gap-4 md:flex-col md:items-start md:justify-center md:flex-1">
            <img
              src="https://melhorbocado.com.br/wp-content/uploads/2023/12/logo.png"
              alt="Melhor Bocado"
              className="h-12 w-auto object-contain md:h-16"
            />
            <div>
              <h1 className="text-xl font-bold text-white md:text-3xl lg:text-4xl">
                Minhas Notas
              </h1>
              <p className="hidden text-primary-foreground/80 text-sm md:mt-2 md:block md:text-base">
                Consulte e baixe suas notas fiscais de forma rápida e segura.
              </p>
            </div>
          </div>

          <p className="relative z-10 mt-4 hidden text-xs text-primary-foreground/50 md:block">
            Melhor Bocado | A melhor parte do seu dia!
          </p>
        </div>

        {/* ── Área do formulário ── */}
        <div className="flex flex-1 flex-col items-center justify-center bg-transparent px-6 py-8 md:w-7/12 md:bg-white md:p-10 lg:p-12">
          <div className="w-full max-w-sm space-y-6">
            {/* Título — oculto no mobile (o header já comunica o contexto) */}
            <div className="hidden space-y-1 text-center md:block">
              <h2 className="text-2xl font-bold tracking-tight text-foreground">
                Buscar Notas Fiscais
              </h2>
              <p className="text-sm text-muted-foreground">
                {searchMode === "codigoMB"
                  ? "Informe o Código MB para acessar"
                  : "Informe o CPF ou CNPJ para acessar"}
              </p>
            </div>

            {/* Subtítulo no mobile */}
            <p className="text-center text-sm text-muted-foreground md:hidden">
              {searchMode === "codigoMB"
                ? "Informe o Código MB para acessar"
                : "Informe o CPF ou CNPJ para acessar"}
            </p>

            <div className="space-y-4">
              {/* Toggle de modo de busca */}
              <div className="flex rounded-xl border border-muted-foreground/20 bg-muted/40 p-1">
                <button
                  type="button"
                  onClick={() => handleModeChange("codigoMB")}
                  className={`flex-1 rounded-lg py-2 text-sm font-medium transition-all ${
                    searchMode === "codigoMB"
                      ? "bg-white text-primary shadow-sm"
                      : "text-muted-foreground hover:text-foreground"
                  }`}
                >
                  Código MB
                </button>
                <button
                  type="button"
                  onClick={() => handleModeChange("cnpj")}
                  className={`flex-1 rounded-lg py-2 text-sm font-medium transition-all ${
                    searchMode === "cnpj"
                      ? "bg-white text-primary shadow-sm"
                      : "text-muted-foreground hover:text-foreground"
                  }`}
                >
                  CPF / CNPJ
                </button>
              </div>

              {/* Campo de busca */}
              <div className="relative group">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-muted-foreground transition-colors group-focus-within:text-primary" />
                <Input
                  key={searchMode}
                  type="text"
                  placeholder={
                    searchMode === "codigoMB" ? "Ex: A12" : "000.000.000-00"
                  }
                  className={`h-12 border-muted-foreground/30 pl-10 text-base shadow-sm transition-all focus-visible:border-primary focus-visible:ring-primary/20 ${
                    isValid
                      ? "border-green-500 focus-visible:border-green-500 focus-visible:ring-green-500/20"
                      : ""
                  }`}
                  value={searchTerm}
                  onChange={handleChange}
                  onKeyDown={handleKeyDown}
                  maxLength={searchMode === "codigoMB" ? 3 : 18}
                  autoFocus
                />
              </div>

              {/* Botão */}
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
