import type { Pokemon } from "../types";
import { corDoTipo } from "../tipos";

interface Props {
  pokemon: Pokemon;
  destacado: boolean;
  onEditar: (p: Pokemon) => void;
  onExcluir: (p: Pokemon) => void;
}

const formatarData = (iso: string) => iso.split("-").reverse().join("/");

export default function PokemonCard({ pokemon, destacado, onEditar, onExcluir }: Props) {
  const cor = corDoTipo(pokemon.tipo);
  return (
    <article className={`card ${destacado ? "card--destacado" : ""}`} style={{ "--cor": cor } as React.CSSProperties}>
      <div className="card__topo">
        <span className="card__codigo">#{String(pokemon.codigo).padStart(3, "0")}</span>
        <span className="card__tipo">{pokemon.tipo}</span>
      </div>
      <div className="card__inicial" aria-hidden>{pokemon.nome.charAt(0).toUpperCase()}</div>
      <h3 className="card__nome">{pokemon.nome}</h3>
      <dl className="card__dados">
        <div><dt>Nível</dt><dd>{pokemon.nivel}</dd></div>
        <div><dt>Peso</dt><dd>{pokemon.peso} kg</dd></div>
        <div><dt>Captura</dt><dd>{formatarData(pokemon.dataDaCaptura)}</dd></div>
      </dl>
      <div className="card__acoes">
        <button className="btn btn--put" onClick={() => onEditar(pokemon)}>Editar</button>
        <button className="btn btn--delete" onClick={() => onExcluir(pokemon)}>Excluir</button>
      </div>
    </article>
  );
}
