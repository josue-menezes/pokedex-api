// Tipos de pokémon e a cor de cada um
export const TIPOS: Record<string, string> = {
  Normal: "#9ca3af",
  Fogo: "#f97316",
  Água: "#3b82f6",
  Planta: "#22c55e",
  Elétrico: "#eab308",
  Gelo: "#67e8f9",
  Lutador: "#b45309",
  Venenoso: "#a855f7",
  Terra: "#ca8a04",
  Voador: "#818cf8",
  Psíquico: "#ec4899",
  Inseto: "#84cc16",
  Pedra: "#a16207",
  Fantasma: "#6d28d9",
  Dragão: "#4f46e5",
  Sombrio: "#374151",
  Metálico: "#64748b",
  Fada: "#f9a8d4",
};

export const corDoTipo = (tipo: string) => TIPOS[tipo] ?? "#9ca3af";
