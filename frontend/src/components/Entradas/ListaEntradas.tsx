import { CSSProperties } from "react";
import { useIsMobile } from "../../hooks/useIsMobile";

interface Entrada {
  id: number;
  descricao: string;
  valor: number;
  data?: string;
  mes: number;
  ano: number;
  categoriaId: number;
  categoriaNome: string;
}

interface ListaEntradasProps {
  entradas: Entrada[];
  cores: {
    texto: string;
    textoSuave: string;
    borda: string;
  };
  iniciarEdicao: (e: Entrada) => void;
  excluirEntrada: (id: number) => void;
}

export default function ListaEntradas({
  entradas,
  cores,
  iniciarEdicao,
  excluirEntrada,
}: ListaEntradasProps) {
  const isMobile = useIsMobile();

  return (
    <div>
      {entradas.map((e) => (
        <div
          key={e.id}
          style={{
            display: "grid",
            gridTemplateColumns: isMobile
              ? "1fr auto auto"
              : "2fr 2fr 1fr 1fr auto auto",
            gap: 12,
            padding: "12px 8px",
            borderBottom: `1px solid ${cores.borda}`,
            alignItems: "center",
          }}
        >
          <strong>{e.descricao}</strong>

          {!isMobile && (
            <span style={{ color: cores.textoSuave }}>
              {e.categoriaNome}
            </span>
          )}

          <strong>
            {e.valor.toLocaleString("pt-BR", {
              style: "currency",
              currency: "BRL",
            })}
          </strong>

          {!isMobile && (
            <span style={{ color: cores.textoSuave }}>
              {e.mes}/{e.ano}
            </span>
          )}

          <button
            onClick={() => iniciarEdicao(e)}
            style={{
              background: "#22c55e",
              color: "#fff",
              border: "none",
              borderRadius: 6,
              padding: "6px 10px",
              cursor: "pointer",
            }}
          >
            ✏️
          </button>

          <button
            onClick={() => excluirEntrada(e.id)}
            style={{
              background: "#dc2626",
              color: "#fff",
              border: "none",
              borderRadius: 6,
              padding: "6px 10px",
              cursor: "pointer",
            }}
          >
            ❌
          </button>
        </div>
      ))}
    </div>
  );
}
