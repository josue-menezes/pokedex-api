import { useEffect, useRef } from "react";
import type { Pokemon } from "../types";

interface Props {
  pokemon: Pokemon | null;
  onConfirmar: () => void;
  onCancelar: () => void;
}

export default function ConfirmDialog({ pokemon, onConfirmar, onCancelar }: Props) {
  const ref = useRef<HTMLDialogElement>(null);

  useEffect(() => {
    if (pokemon) ref.current?.showModal();
    else ref.current?.close();
  }, [pokemon]);

  return (
    <dialog ref={ref} className="modal" onCancel={onCancelar}>
      <h3>Excluir pokémon?</h3>
      <p>
        <strong>{pokemon?.nome}</strong> (#{String(pokemon?.codigo ?? "").padStart(3, "0")}) será removido do banco.
      </p>
      <div className="form__acoes">
        <button className="btn btn--neutro" onClick={onCancelar}>
          Cancelar
        </button>
        <button className="btn btn--delete" onClick={onConfirmar}>
          Excluir (DELETE)
        </button>
      </div>
    </dialog>
  );
}
