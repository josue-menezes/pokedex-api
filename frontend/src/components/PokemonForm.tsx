import { useEffect, useState } from "react";
import type { ErrosCampos, Pokemon } from "../types";
import { TIPOS } from "../tipos";

interface Props {
  editando: Pokemon | null;
  erros: ErrosCampos;
  erroGeral: string;
  enviando: boolean;
  onSalvar: (p: Pokemon) => void;
  onCancelar: () => void;
  onTestarInvalido: () => void;
}

const VAZIO = { nome: "", tipo: "", nivel: "", peso: "", dataDaCaptura: "" };

export default function PokemonForm({ editando, erros, erroGeral, enviando, onSalvar, onCancelar, onTestarInvalido }: Props) {
  const [form, setForm] = useState(VAZIO);

  // Ao clicar em "Editar", preenche o formulário com os dados do pokémon
  useEffect(() => {
    setForm(
      editando
        ? {
            nome: editando.nome,
            tipo: editando.tipo,
            nivel: String(editando.nivel),
            peso: String(editando.peso),
            dataDaCaptura: editando.dataDaCaptura,
          }
        : VAZIO,
    );
  }, [editando]);

  const alterar = (campo: keyof typeof VAZIO) => (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) =>
    setForm({ ...form, [campo]: e.target.value });

  function enviar(e: React.FormEvent) {
    e.preventDefault();
    // A validação de verdade acontece na API (Bean Validation)
    onSalvar({
      nome: form.nome,
      tipo: form.tipo,
      nivel: Number(form.nivel),
      peso: Number(form.peso),
      dataDaCaptura: form.dataDaCaptura,
    });
  }

  const metodo = editando ? "PUT" : "POST";

  return (
    <form className="painel form" onSubmit={enviar} noValidate>
      <div className="painel__cabecalho">
        <h2>{editando ? `Editar #${String(editando.codigo).padStart(3, "0")}` : "Cadastrar pokémon"}</h2>
        <span className={`verbo verbo--${metodo.toLowerCase()}`}>{metodo}</span>
      </div>

      <label>
        Nome
        <input value={form.nome} onChange={alterar("nome")} placeholder="Ex: Squirtle" />
        {erros.nome && <small className="erro">{erros.nome}</small>}
      </label>

      <label>
        Tipo
        <select value={form.tipo} onChange={alterar("tipo")}>
          <option value="">Escolha...</option>
          {Object.keys(TIPOS).map((t) => (
            <option key={t}>{t}</option>
          ))}
          {form.tipo && !TIPOS[form.tipo] && <option>{form.tipo}</option>}
        </select>
        {erros.tipo && <small className="erro">{erros.tipo}</small>}
      </label>

      <div className="duas-colunas">
        <label>
          Nível (1–100)
          <input type="number" value={form.nivel} onChange={alterar("nivel")} placeholder="15" />
          {erros.nivel && <small className="erro">{erros.nivel}</small>}
        </label>
        <label>
          Peso (kg)
          <input type="number" step="0.1" value={form.peso} onChange={alterar("peso")} placeholder="9.0" />
          {erros.peso && <small className="erro">{erros.peso}</small>}
        </label>
      </div>

      <label>
        Data da captura
        <input type="date" value={form.dataDaCaptura} onChange={alterar("dataDaCaptura")} />
        {erros.dataDaCaptura && <small className="erro">{erros.dataDaCaptura}</small>}
      </label>

      {erroGeral && <p className="erro erro--geral">{erroGeral}</p>}

      <div className="form__acoes">
        <button type="submit" className={`btn btn--${metodo.toLowerCase()} btn--grande`} disabled={enviando}>
          {enviando ? "Enviando..." : editando ? "Salvar alterações" : "Cadastrar"}
        </button>
        {editando && (
          <button type="button" className="btn btn--neutro" onClick={onCancelar}>
            Cancelar
          </button>
        )}
      </div>

      {!editando && (
        <button type="button" className="btn-link" onClick={onTestarInvalido}>
          Testar validação: enviar dados inválidos
        </button>
      )}
    </form>
  );
}
