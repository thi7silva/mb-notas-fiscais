import { useState, useMemo, useEffect } from "react";
import { ArrowLeft, Search, HelpCircle, Loader2, CalendarDays } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog";
import { InvoiceCard } from "./InvoiceCard";
import type { ClientData, Invoice } from "@/services/api";
import { apiService } from "@/services/api";
import { formatCpfCnpj } from "@/lib/utils";
import { toast } from "sonner";

interface InvoiceListProps {
  client: ClientData;
  invoices: Invoice[];
  onBack: () => void;
}

export function InvoiceList({ client, invoices: invoicesProp, onBack }: InvoiceListProps) {
  const [invoices, setInvoices] = useState<Invoice[]>(invoicesProp);
  const [filter, setFilter] = useState("");
  const [refreshing, setRefreshing] = useState(false);
  const [dialogOpen, setDialogOpen] = useState(false);
  const [consultaData, setConsultaData] = useState("");
  const [consultaLoading, setConsultaLoading] = useState(false);
  const [consultaResult, setConsultaResult] = useState<{ success: boolean; message: string } | null>(null);

  useEffect(() => {
    setInvoices(invoicesProp);
  }, [invoicesProp]);

  const refreshInvoices = async () => {
    setRefreshing(true);
    try {
      const updated = await apiService.getInvoices(client.codigoMB);
      setInvoices(updated || []);
      toast.success("Notas fiscais atualizadas.");
    } catch {
      toast.error("Erro ao atualizar notas fiscais.");
    } finally {
      setRefreshing(false);
    }
  };

  const handleConsultaNota = async () => {
    if (!consultaData) {
      toast.warning("Informe a data para consulta.");
      return;
    }

    // Converte dd/MM/yyyy para yyyyMMdd
    const parts = consultaData.split("/");
    if (parts.length !== 3 || parts[2].length !== 4) {
      toast.warning("Data inválida. Use o formato dd/MM/yyyy.");
      return;
    }
    const dataFormatada = `${parts[2]}${parts[1].padStart(2, "0")}${parts[0].padStart(2, "0")}`;

    setConsultaLoading(true);
    setConsultaResult(null);
    try {
      const result = await apiService.consultaNotaFiscal(client.codigoMB, dataFormatada);
      setConsultaResult(result);
      if (result.success) {
        await refreshInvoices();
      }
    } catch {
      setConsultaResult({ success: false, message: "Erro inesperado ao consultar." });
    } finally {
      setConsultaLoading(false);
    }
  };

  const handleDataChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    let v = e.target.value.replace(/\D/g, "");
    if (v.length > 2) v = v.slice(0, 2) + "/" + v.slice(2);
    if (v.length > 5) v = v.slice(0, 5) + "/" + v.slice(5);
    setConsultaData(v.slice(0, 10));
  };

  const filteredAndSortedInvoices = useMemo(() => {
    return invoices
      .filter((invoice) =>
        invoice.numeroNota.toLowerCase().includes(filter.toLowerCase()),
      )
      .sort((a, b) => {
        // Parse dates dd/MM/yyyy
        const [dayA, monthA, yearA] = a.dataFaturamento.split("/").map(Number);
        const [dayB, monthB, yearB] = b.dataFaturamento.split("/").map(Number);
        const dateA = new Date(yearA, monthA - 1, dayA);
        const dateB = new Date(yearB, monthB - 1, dayB);
        return dateB.getTime() - dateA.getTime();
      });
  }, [invoices, filter]);

  return (
    <>
    <div className="flex min-h-screen justify-center bg-background bg-[radial-gradient(#e5e7eb_1px,transparent_1px)] bg-size-[20px_20px] p-4">
      <div className="w-full max-w-7xl space-y-8">
        {/* Compact Header with Primary Background */}
        <div className="bg-primary text-primary-foreground p-6 rounded-3xl shadow-lg relative overflow-hidden">
          {/* Background decoration */}
          <div className="absolute top-0 right-0 w-64 h-64 bg-white/10 rounded-full blur-3xl -mr-32 -mt-32 pointer-events-none"></div>
          <div className="absolute bottom-0 left-0 w-48 h-48 bg-white/5 rounded-full blur-2xl -ml-24 -mb-24 pointer-events-none"></div>

          <div className="flex flex-col md:flex-row items-center justify-between gap-6 relative z-10">
            <div className="flex items-center gap-5 w-full md:w-auto">
              <Button
                variant="ghost"
                size="icon"
                onClick={onBack}
                className="rounded-full h-10 w-10 text-primary-foreground hover:bg-white/20 hover:text-white transition-colors shrink-0"
                title="Voltar para busca"
              >
                <ArrowLeft className="h-5 w-5" />
              </Button>

              <div className="flex items-center gap-4">
                <div className="flex flex-col">
                  <h1 className="text-xl md:text-2xl font-bold text-white tracking-tight leading-tight">
                    {client.razaoSocial}
                  </h1>
                  <p className="text-white/80 font-medium text-sm flex items-center gap-2 mt-1">
                    {client.codigoMB} • {formatCpfCnpj(client.cnpjCpf)}
                  </p>
                </div>
              </div>
            </div>

            <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3 w-full md:w-auto">
              <div className="relative w-full md:w-72">
                <Search className="absolute left-3 top-2.5 h-4 w-4 text-white/60 pointer-events-none" />
                <Input
                  placeholder="Filtrar por número..."
                  value={filter}
                  onChange={(e) => setFilter(e.target.value)}
                  className="pl-10 h-10 bg-white/10 border-white focus:bg-white/20 text-white placeholder:text-white/60 transition-all focus:border-white rounded-xl"
                />
              </div>
              <Button
                variant="ghost"
                onClick={() => { setDialogOpen(true); setConsultaResult(null); setConsultaData(""); }}
                className="h-10 text-white/90 hover:bg-white/20 hover:text-white border border-white/30 rounded-xl text-sm font-medium whitespace-nowrap"
                disabled={refreshing}
              >
                {refreshing ? (
                  <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                ) : (
                  <HelpCircle className="h-4 w-4 mr-2" />
                )}
                {refreshing ? "Atualizando..." : "Não encontrou sua nota?"}
              </Button>
            </div>
          </div>
        </div>

        {/* Content */}
        <div>
          {filteredAndSortedInvoices.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
              {filteredAndSortedInvoices.map((invoice) => (
                <InvoiceCard key={invoice.idNota} invoice={invoice} />
              ))}
            </div>
          ) : (
            <div className="flex flex-col items-center justify-center py-20 bg-card rounded-3xl border border-dashed text-center">
              <div className="bg-muted/50 p-4 rounded-full mb-4">
                <Search className="h-8 w-8 text-muted-foreground" />
              </div>
              <h3 className="text-lg font-semibold text-foreground">
                Nenhuma nota fiscal encontrada
              </h3>
              <p className="text-muted-foreground max-w-sm mt-2">
                Não encontramos nenhuma nota fiscal correspondente aos seus
                critérios de busca.
              </p>
            </div>
          )}
        </div>
      </div>
    </div>

    <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
      <DialogContent className="max-w-md">
        <DialogHeader>
          <DialogTitle>Não encontrou sua nota fiscal?</DialogTitle>
          <DialogDescription>
            Informe a data de faturamento para que possamos consultar no sistema.
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-4 mt-2">
          <div className="space-y-1.5">
            <label className="text-sm font-medium text-foreground">
              Data de faturamento
            </label>
            <div className="relative">
              <CalendarDays className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground pointer-events-none" />
              <Input
                placeholder="dd/MM/yyyy"
                value={consultaData}
                onChange={handleDataChange}
                maxLength={10}
                className="pl-9"
                onKeyDown={(e) => { if (e.key === "Enter" && !consultaLoading) handleConsultaNota(); }}
              />
            </div>
          </div>

          {consultaResult && (
            <div className={`rounded-xl p-4 text-sm ${consultaResult.success ? "bg-green-50 text-green-800 border border-green-200" : "bg-red-50 text-red-800 border border-red-200"}`}>
              {consultaResult.message}
            </div>
          )}

          <Button
            onClick={handleConsultaNota}
            disabled={consultaLoading || !consultaData}
            className="w-full"
          >
            {consultaLoading ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Consultando...
              </>
            ) : (
              "Consultar"
            )}
          </Button>
        </div>
      </DialogContent>
    </Dialog>
    </>
  );
}
