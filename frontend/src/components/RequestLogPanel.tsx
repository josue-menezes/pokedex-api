import type { RequestLog } from "../types";

const STATUS_TEXTO: Record<number, string> = {
  200: "OK",
  201: "Created",
  204: "No Content",
  400: "Bad Request",
  404: "Not Found",
  500: "Server Error",
};

export default function RequestLogPanel({ logs, onLimpar }: { logs: RequestLog[]; onLimpar: () => void }) {
  return (
    <section className="painel log">
      <div className="painel__cabecalho">
        <h2>Requisições à API</h2>
        {logs.length > 0 && (
          <button className="btn-link" onClick={onLimpar}>
            limpar
          </button>
        )}
      </div>
      {logs.length === 0 ? (
        <p className="log__vazio">As chamadas feitas para a API aparecem aqui.</p>
      ) : (
        <ol className="log__lista">
          {logs.map((l) => {
            const ok = typeof l.status === "number" && l.status < 400;
            return (
              <li key={l.id}>
                <span className={`verbo verbo--${l.metodo.toLowerCase()}`}>{l.metodo}</span>
                <code>{l.url.replace(/^https?:\/\/[^/]+/, "")}</code>
                <span className={`status ${ok ? "status--ok" : "status--erro"}`}>
                  {l.status === "erro" ? "sem resposta" : `${l.status} ${STATUS_TEXTO[l.status] ?? ""}`}
                </span>
                <span className="log__ms">{l.ms} ms</span>
              </li>
            );
          })}
        </ol>
      )}
    </section>
  );
}
