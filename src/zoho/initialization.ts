import { conectarZoho, isConectado } from "./connection";
import { obterUsuarioLogado } from "./user";

export interface AppState {
  online: boolean;
  loginUser: string | null;
}

const state: AppState = {
  online: false,
  loginUser: null,
};

export async function init(): Promise<void> {
  if (typeof ZOHO === "undefined") {
    iniciarModoOffline();
    return;
  }

  const conectado = await conectarZoho();

  if (conectado) {
    await iniciarModoOnline();
  } else {
    iniciarModoOffline();
  }
}

async function iniciarModoOnline(): Promise<void> {
  state.online = true;

  const usuario = await obterUsuarioLogado();
  if (usuario) {
    state.loginUser = usuario.loginUser;
  }
}

function iniciarModoOffline(): void {
  state.online = false;
}

export function getState(): AppState {
  return { ...state };
}

export function isOnline(): boolean {
  return state.online && isConectado();
}
