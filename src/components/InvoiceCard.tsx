import { FileText, ExternalLink } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import type { Invoice } from "@/services/api";

interface InvoiceCardProps {
  invoice: Invoice;
}

export function InvoiceCard({ invoice }: InvoiceCardProps) {
  const getLink = (htmlLink: string) => {
    // Regex ajustado para suportar espaços opcionais após href= e aspas simples ou duplas
    const match = htmlLink.match(/href\s*=\s*["']([^"']*)["']/);
    return match ? match[1] : "#";
  };

  const handleOpenLink = () => {
    const link = getLink(invoice.linkVisualizacao);
    if (link && link !== "#") {
      window.open(link, "_blank");
    }
  };

  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat("pt-BR", {
      style: "currency",
      currency: "BRL",
    }).format(value);
  };

  return (
    <Card className="hover:shadow-lg transition-all duration-300 group border-l-4 border-l-primary/50 hover:border-l-primary h-full">
      <CardContent className="p-5 flex flex-col h-full justify-between gap-4">
        <div className="flex items-start justify-between">
          <div className="flex items-center gap-3">
            <div className="p-1.5 bg-primary/10 rounded-lg group-hover:bg-primary/20 transition-colors">
              <FileText className="h-4 w-4 text-primary" />
            </div>
            <div>
              <p className="text-[10px] font-semibold text-muted-foreground uppercase tracking-wider">
                Número
              </p>
              <h3 className="font-bold text-base text-foreground leading-none mt-0.5">
                {invoice.numeroNota}
              </h3>
            </div>
          </div>
        </div>

        <div className="space-y-3">
          <div className="flex justify-between items-center py-2 border-b border-dashed border-border/50">
            <span className="text-xs text-muted-foreground">Emissão</span>
            <span className="text-sm font-medium text-foreground">
              {invoice.dataFaturamento}
            </span>
          </div>

          <div className="flex justify-between items-center">
            <span className="text-xs text-muted-foreground">Valor</span>
            <span className="text-lg font-bold text-primary">
              {formatCurrency(invoice.valorNota)}
            </span>
          </div>
        </div>

        <Button
          onClick={handleOpenLink}
          className="w-full mt-2 gap-2 shadow-sm border-primary text-primary hover:bg-primary hover:text-white transition-all duration-300"
          variant="outline"
          size="sm"
        >
          Visualizar
          <ExternalLink className="h-3.5 w-3.5" />
        </Button>
      </CardContent>
    </Card>
  );
}
