// Mesmo formato do PokemonTO da API Java
export interface Pokemon {
  codigo?: number;
  nome: string;
  tipo: string;
  nivel: number;
  peso: number;
  dataDaCaptura: string; // aaaa-mm-dd
}

// Registro de cada requisição feita (painel "Requisições")
export interface RequestLog {
  id: number;
  metodo: "GET" | "POST" | "PUT" | "DELETE";
  url: string;
  status: number | "erro";
  ms: number;
}

// Erros do Bean Validation: { campo: mensagem }
export type ErrosCampos = Partial<Record<keyof Pokemon, string>>;
