export interface ZohoInitParams {
  scope: string;
  envUrlFragment: string;
  appLinkName: string;
  loginUser: string;
}

export interface UsuarioLogado {
  loginUser: string;
  scope: string;
  appLinkName: string;
  envUrlFragment: string;
}

export async function obterUsuarioLogado(): Promise<UsuarioLogado | null> {
  const zoho = (typeof ZOHO !== "undefined" ? ZOHO : null) as Record<
    string,
    unknown
  > | null;
  const creator = zoho?.CREATOR as Record<string, unknown> | undefined;
  const util = creator?.UTIL as Record<string, unknown> | undefined;

  if (typeof util?.getInitParams !== "function") return null;

  try {
    const response = (await util.getInitParams()) as ZohoInitParams;

    return {
      loginUser: response.loginUser,
      scope: response.scope,
      appLinkName: response.appLinkName,
      envUrlFragment: response.envUrlFragment,
    };
  } catch {
    return null;
  }
}
