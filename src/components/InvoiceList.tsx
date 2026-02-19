import { useState, useMemo } from "react";
import { ArrowLeft, Search } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { InvoiceCard } from "./InvoiceCard";
import type { ClientData, Invoice } from "@/services/api";
import { formatCpfCnpj } from "@/lib/utils";

interface InvoiceListProps {
  client: ClientData;
  invoices: Invoice[];
  onBack: () => void;
}

export function InvoiceList({ client, invoices, onBack }: InvoiceListProps) {
  const [filter, setFilter] = useState("");

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

            <div className="relative w-full md:w-72">
              <Search className="absolute left-3 top-2.5 h-4 w-4 text-white/60 pointer-events-none" />
              <Input
                placeholder="Filtrar por número..."
                value={filter}
                onChange={(e) => setFilter(e.target.value)}
                className="pl-10 h-10 bg-white/10 border-white focus:bg-white/20 text-white placeholder:text-white/60 transition-all focus:border-white rounded-xl"
              />
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
  );
}
