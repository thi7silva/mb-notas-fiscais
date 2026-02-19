/* eslint-disable @typescript-eslint/no-explicit-any */

// Declara globalmente para evitar erros de TS,
// embora o ideal fosse ter types definidos.
declare const ZOHO: any;

interface ZohoApiConfig {
  NAME: string;
  PUBLIC_KEY: string;
}

export const zohoService = {
  /**
   * Verifica se o SDK do Zoho está disponível
   */
  isSDKAvailable(): boolean {
    return (
      typeof ZOHO !== "undefined" &&
      ZOHO.CREATOR &&
      ZOHO.CREATOR.DATA &&
      typeof ZOHO.CREATOR.DATA.invokeCustomApi === "function"
    );
  },

  /**
   * Extrai os dados de uma resposta da API (tratamento robusto)
   */
  extractData<T>(response: any): T {
    let data = response.data || response.result || response;

    // Parse se vier como string
    if (typeof data === "string") {
      try {
        data = JSON.parse(data);
      } catch {
        // Mantém como string se não for JSON válido
      }
    }

    return data as T;
  },

  /**
   * Chama uma Custom API do Zoho Creator
   * Suporta envio via Query Params (GET/POST) ou Payload (POST)
   */
  async invokeCustomApi<T>(
    endpointConfig: ZohoApiConfig,
    method: "GET" | "POST",
    data?: Record<string, unknown> | string,
    usePayload: boolean = false,
  ): Promise<T> {
    return new Promise((resolve, reject) => {
      if (!this.isSDKAvailable()) {
        console.warn("SDK Zoho não disponível, retornando mock/erro");
        reject(new Error("SDK do Zoho não está disponível"));
        return;
      }

      const { NAME: apiName, PUBLIC_KEY: publicKey } = endpointConfig;

      if (!apiName || !publicKey) {
        reject(
          new Error("Configuração de API inválida (Nome ou Key faltando)"),
        );
        return;
      }

      const config: any = {
        api_name: apiName,
        http_method: method,
        public_key: publicKey,
      };

      if (usePayload && method === "POST") {
        config.payload = data || {};
      } else {
        let queryString = "";
        if (data && typeof data === "object") {
          const pairs = [];
          for (const key in data) {
            if (Object.prototype.hasOwnProperty.call(data, key)) {
              const value = (data as Record<string, unknown>)[key];
              pairs.push(
                encodeURIComponent(key) +
                  "=" +
                  encodeURIComponent(String(value)),
              );
            }
          }
          queryString = pairs.join("&");
        } else if (typeof data === "string") {
          queryString = data;
        }

        if (queryString) {
          config.query_params = queryString;
        }
      }

      ZOHO.CREATOR.DATA.invokeCustomApi(config)
        .then((response: any) => {
          const extracted = this.extractData<T>(response);

          if (
            extracted &&
            typeof extracted === "object" &&
            "success" in extracted &&
            (extracted as any).success === false
          ) {
            const msg = (extracted as any).message || "Erro na resposta da API";
            reject(new Error(msg));
            return;
          }

          resolve(extracted);
        })
        .catch((error: any) => {
          let errorMsg = error;
          try {
            errorMsg = JSON.stringify(error);
          } catch {
            errorMsg = String(error);
          }
          console.error(`⚡ [CustomAPI] Error: ${errorMsg}`);
          reject(error);
        });
    });
  },
};
