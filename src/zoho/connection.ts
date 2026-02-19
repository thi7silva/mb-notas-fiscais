declare global {
  interface Window {
    ZOHO: unknown;
  }
  const ZOHO: unknown;
}

export async function conectarZoho(): Promise<boolean> {
  if (typeof ZOHO === "undefined") return false;

  const zoho = ZOHO as Record<string, unknown>;
  const creator = zoho.CREATOR as Record<string, unknown> | undefined;
  const util = creator?.UTIL as Record<string, unknown> | undefined;

  if (typeof util?.getWidgetParams === "function") {
    try {
      await util.getWidgetParams();
      return true;
    } catch {
      return await tentarInitExplicito();
    }
  }

  return await tentarInitExplicito();
}

async function tentarInitExplicito(): Promise<boolean> {
  const zoho = ZOHO as Record<string, unknown>;
  const creator = zoho.CREATOR as Record<string, unknown> | undefined;

  if (typeof creator?.init === "function") {
    try {
      await creator.init();
      return true;
    } catch {
      return false;
    }
  }

  return false;
}

export function isConectado(): boolean {
  if (typeof ZOHO === "undefined") return false;
  const zoho = ZOHO as Record<string, unknown>;
  return !!zoho.CREATOR;
}
