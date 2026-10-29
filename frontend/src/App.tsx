import { useCallback, useEffect, useState } from "react";
import * as api from "./api";
import ConfirmDialog from "./components/ConfirmDialog";
import Pokebola from "./components/Pokebola";
import PokemonCard from "./components/PokemonCard";
import PokemonForm from "./components/PokemonForm";
import RequestLogPanel from "./components/RequestLogPanel";
import type { ErrosCampos, Pokemon, RequestLog } from "./types";

type Aviso = { tipo: "ok" | "erro"; texto: string } | null;

export default function App() {
  const [pokemons, setPokemons] = useState<Pokemon[]>([]);
  const [carregando, setCarregando] = useState(true);
  const [acordando, setAcordando] = useState(false);
  const [erroLista, setErroLista] = useState("");
  const [filtro, setFiltro] = useState<number | null>(null);
  const [buscaCodigo, setBuscaCodigo] = useState("");

  const [editando, setEditando] = useState<Pokemon | null>(null);
  const [excluindo, setExcluindo] = useState<Pokemon | null>(null);
  const [erros, setErros] = useState<ErrosCampos>({});
  const [erroGeral, setErroGeral] = useState("");
  const [enviando, setEnviando] = useState(false);

  const [logs, setLogs] = useState<RequestLog[]>([]);
  const [aviso, setAviso] = useState<Aviso>(null);
  const [destacado, setDestacado] = useState<number | null>(null);

  // Cada requisição feita pelo api.ts aparece no painel de log
  useEffect(() => {
    api.aoRegistrarRequisicao((log) => setLogs((atual) => [log, ...atual].slice(0, 30)));
  }, []);

  // Some com o aviso depois de alguns segundos
  useEffect(() => {
    if (!aviso) return;
    const t = setTimeout(() => setAviso(null), 3500);
    return () => clearTimeout(t);
  }, [aviso]);

  // GET /pokedex
  const carregar = useCallback(async () => {
    setCarregando(true);
    setErroLista("");
    setFiltro(null);
    // O Render gratuito "dorme": se demorar, avisa que está acordando
    const timer = setTimeout(() => setAcordando(true), 3000);
    try {
      const res = await api.listar();
      if (res.status === 200 && res.dados) setPokemons(res.dados);
      else setErroLista("A API respondeu com erro ao listar os pokémons.");
    } catch {
      setErroLista("Não foi possível conectar com a API. Tente novamente em alguns segundos.");
    } finally {
      clearTimeout(timer);
      setAcordando(false);
      setCarregando(false);
    }
  }, []);

  useEffect(() => {
    carregar();
  }, [carregar]);

  // GET /pokedex/{codigo}
  async function buscar(e: React.FormEvent) {
    e.preventDefault();
    const codigo = Number(buscaCodigo);
    if (!codigo) return;
    setCarregando(true);
    setErroLista("");
    try {
      const res = await api.buscarPorCodigo(codigo);
      if (res.status === 200 && res.dados) {
        setPokemons([res.dados]);
        setFiltro(codigo);
      } else {
        setPokemons([]);
        setFiltro(codigo);
        setErroLista(res.texto || "Pokémon não encontrado!");
      }
    } catch {
      setErroLista("Não foi possível conectar com a API.");
    } finally {
      setCarregando(false);
    }
  }

  function limparErros() {
    setErros({});
    setErroGeral("");
  }

  // POST /pokedex  ou  PUT /pokedex/{codigo}
  async function salvar(p: Pokemon) {
    limparErros();
    setEnviando(true);
    try {
      const res = editando?.codigo ? await api.atualizar(editando.codigo, p) : await api.cadastrar(p);
      if (res.status === 201 && res.dados) {
        const salvo = res.dados as Pokemon;
        setAviso({ tipo: "ok", texto: editando ? `${salvo.nome} atualizado!` : `${salvo.nome} cadastrado!` });
        setEditando(null);
        await carregar();
        setDestacado(salvo.codigo ?? null);
        setTimeout(() => setDestacado(null), 2500);
      } else if (res.status === 400 && res.dados && typeof res.dados === "object") {
        // Erros do Bean Validation: { campo: mensagem }
        const dados = res.dados as unknown as Record<string, string>;
        if (dados.erro) setErroGeral(dados.erro);
        else setErros(dados);
      } else {
        // 400 vindo do BO (ex: data futura) ou pokémon não encontrado
        setErroGeral(res.texto || "Não foi possível salvar.");
      }
    } catch {
      setErroGeral("Não foi possível conectar com a API.");
    } finally {
      setEnviando(false);
    }
  }

  // Envia um JSON com todos os campos errados para mostrar o Bean Validation
  function testarInvalido() {
    setEditando(null);
    salvar({ nome: "", tipo: "", nivel: 150, peso: -2, dataDaCaptura: "2099-01-01" });
  }

  // DELETE /pokedex/{codigo}
  async function confirmarExclusao() {
    const alvo = excluindo;
    setExcluindo(null);
    if (!alvo?.codigo) return;
    try {
      const res = await api.excluir(alvo.codigo);
      if (res.status === 204) {
        setAviso({ tipo: "ok", texto: `${alvo.nome} excluído.` });
        if (editando?.codigo === alvo.codigo) setEditando(null);
        await carregar();
      } else {
        setAviso({ tipo: "erro", texto: res.texto || "Não foi possível excluir." });
      }
    } catch {
      setAviso({ tipo: "erro", texto: "Não foi possível conectar com a API." });
    }
  }

  function editar(p: Pokemon) {
    limparErros();
    setEditando(p);
    window.scrollTo({ top: 0, behavior: "smooth" });
  }

  return (
    <>
      <header className="topo">
        <div className="topo__conteudo">
          <Pokebola tamanho={40} />
          <div>
            <h1>Pokédex</h1>
            <p>Front-end em React consumindo a API Java (Spring Boot + Oracle)</p>
          </div>
        </div>
      </header>

      {aviso && <div className={`aviso aviso--${aviso.tipo}`}>{aviso.texto}</div>}

      <main className="layout">
        <div className="coluna-lateral">
          <PokemonForm
            editando={editando}
            erros={erros}
            erroGeral={erroGeral}
            enviando={enviando}
            onSalvar={salvar}
            onCancelar={() => {
              setEditando(null);
              limparErros();
            }}
            onTestarInvalido={testarInvalido}
          />
          <RequestLogPanel logs={logs} onLimpar={() => setLogs([])} />
        </div>

        <section className="painel lista">
          <div className="painel__cabecalho lista__cabecalho">
            <h2>
              {filtro ? `Busca pelo código ${filtro}` : "Pokémons cadastrados"}
              {!filtro && <span className="contador">{pokemons.length}</span>}
            </h2>
            <form className="busca" onSubmit={buscar}>
              <input
                type="number"
                min={1}
                value={buscaCodigo}
                onChange={(e) => setBuscaCodigo(e.target.value)}
                placeholder="Código"
                aria-label="Buscar por código"
              />
              <button className="btn btn--get" type="submit">Buscar</button>
              {filtro && (
                <button className="btn btn--neutro" type="button" onClick={() => { setBuscaCodigo(""); carregar(); }}>
                  Ver todos
                </button>
              )}
            </form>
          </div>

          {carregando ? (
            <div className="estado">
              <span className="pokebola pokebola--girando" />
              <p>{acordando ? "Acordando o servidor do Render... (pode levar até 50 segundos)" : "Carregando..."}</p>
            </div>
          ) : erroLista ? (
            <div className="estado estado--erro">
              <p>{erroLista}</p>
              <button className="btn btn--neutro" onClick={carregar}>Tentar novamente</button>
            </div>
          ) : pokemons.length === 0 ? (
            <div className="estado">
              <p>Nenhum pokémon cadastrado ainda. Use o formulário ao lado!</p>
            </div>
          ) : (
            <div className="grade">
              {pokemons.map((p) => (
                <PokemonCard
                  key={p.codigo}
                  pokemon={p}
                  destacado={destacado === p.codigo}
                  onEditar={editar}
                  onExcluir={setExcluindo}
                />
              ))}
            </div>
          )}
        </section>
      </main>

      <footer className="rodape">
        CP6 · Domain Driven Design Using Java · Josué Menezes — RM 569220
      </footer>

      <ConfirmDialog pokemon={excluindo} onConfirmar={confirmarExclusao} onCancelar={() => setExcluindo(null)} />
    </>
  );
}
