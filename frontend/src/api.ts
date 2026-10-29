import type { Pokemon, RequestLog } from "./types";

// Endereço da API Java no Render (pode trocar no .env.local)
export const API_URL = (import.meta.env.VITE_API_URL ?? "https://pokedex-api-pepl.onrender.com") + "/pokedex";

type Metodo = RequestLog["metodo"];

export interface Resposta<T> {
  status: number;
  dados: T | null;
  texto: string;
}

let logId = 0;
let ouvinteLog: ((log: RequestLog) => void) | null = null;

/** O App se inscreve aqui para receber cada requisição no painel de log. */
export function aoRegistrarRequisicao(fn: (log: RequestLog) => void) {
  ouvinteLog = fn;
}

/** Faz a requisição, mede o tempo e registra no log. */
async function requisitar<T>(metodo: Metodo, caminho = "", corpo?: Pokemon): Promise<Resposta<T>> {
  const url = API_URL + caminho;
  const inicio = performance.now();
  try {
    const res = await fetch(url, {
      method: metodo,
      headers: corpo ? { "Content-Type": "application/json" } : undefined,
      body: corpo ? JSON.stringify(corpo) : undefined,
    });
    const texto = await res.text();
    let dados: T | null = null;
    try {
      dados = texto ? (JSON.parse(texto) as T) : null;
    } catch {
      dados = null; // resposta em texto puro (ex: "Pokémon não encontrado!")
    }
    ouvinteLog?.({ id: ++logId, metodo, url, status: res.status, ms: Math.round(performance.now() - inicio) });
    return { status: res.status, dados, texto };
  } catch (erro) {
    ouvinteLog?.({ id: ++logId, metodo, url, status: "erro", ms: Math.round(performance.now() - inicio) });
    throw erro;
  }
}

export const listar = () => requisitar<Pokemon[]>("GET");
export const buscarPorCodigo = (codigo: number) => requisitar<Pokemon>("GET", `/${codigo}`);
export const cadastrar = (p: Pokemon) => requisitar<Pokemon>("POST", "", p);
export const atualizar = (codigo: number, p: Pokemon) => requisitar<Pokemon>("PUT", `/${codigo}`, p);
export const excluir = (codigo: number) => requisitar<string>("DELETE", `/${codigo}`);
