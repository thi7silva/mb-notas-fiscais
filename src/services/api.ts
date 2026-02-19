import { API_CONFIG } from "../config/api.config";
import { zohoService } from "./zoho.service";

interface CreateIdResponse {
  success: boolean;
  idFile: string;
}

export interface ClientData {
  idCRM: string;
  razaoSocial: string;
  nomeFantasia: string;
  cnpjCpf: string;
  limiteDisponivel: number;
  boletoAtraso: number;
  codigoMB: string;
}

export interface ClientSearchResponse {
  success: boolean;
  message: string;
  data: ClientData[];
  total: number;
}

export const apiService = {
  async createProcessingId(): Promise<string> {
    try {
      const data = await zohoService.invokeCustomApi<CreateIdResponse>(
        API_CONFIG.createIDFile,
        "POST",
      );

      if (!data.idFile) {
        console.error("❌ [API] Resposta inválida:", data);
        throw new Error(
          "Falha ao gerar ID de processamento (Resposta inválida nao tem idFile)",
        );
      }

      return data.idFile;
    } catch (error) {
      console.error("Erro ao criar ID:", error);
      throw error;
    }
  },

  async getInitialData<T>(): Promise<T> {
    try {
      const data = await zohoService.invokeCustomApi<T>(
        API_CONFIG.initialData,
        "GET",
      );

      if (!data) {
        throw new Error("Dados iniciais vazios ou inválidos");
      }

      return data;
    } catch (error) {
      console.error("Erro ao obter dados iniciais:", error);
      throw error;
    }
  },

  async upsertBlacklist(payload: {
    data: {
      domains: Array<{
        id?: string | number;
        domain: string;
        descrição?: string;
        status: boolean;
      }>;
    };
  }): Promise<void> {
    try {
      await zohoService.invokeCustomApi(
        API_CONFIG.upsertBlacklist,
        "POST",
        payload,
        true,
      );
    } catch (error) {
      console.error("Erro ao salvar blacklist:", error);
      throw error;
    }
  },

  async reportError(idFile: string): Promise<void> {
    try {
      const payload = {
        idFile,
      };

      await zohoService.invokeCustomApi(
        API_CONFIG.reportError,
        "POST",
        payload,
        true,
      );
    } catch (error) {
      console.error("Erro ao reportar falha no processamento:", error);
    }
  },

  async searchClient(cpfCnpj: string, email: string): Promise<ClientData[]> {
    try {
      const cleanCpfCnpj = cpfCnpj.replace(/\D/g, "");

      const apiConfig = {
        NAME: "consultaCliente",
        PUBLIC_KEY: "J39jfTQGHMzBYRSVaPfwbjatX",
      };

      const params = {
        filter: cleanCpfCnpj,
        email: email,
      };

      // zohoService.invokeCustomApi unwraps response.data, so we get ClientData[] directly
      const data = await zohoService.invokeCustomApi<ClientData[]>(
        apiConfig,
        "GET",
        params,
      );

      return data;
    } catch (error) {
      console.error("Erro ao buscar cliente:", error);
      throw error;
    }
  },
};
