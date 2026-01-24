import { useNavigate } from "react-router-dom";
import { useState } from "react";
import AbaGeral from "./AbaGeral";
import AbaUsuarios from "./AbaUsuarios";

interface GestaoCategoriasProps {
  isAdmin: boolean;
  modoEscuro: boolean;
  setModoEscuro: (v: boolean) => void;
  cores: {
    fundo: string;
    card: string;
    texto: string;
    textoSuave: string;
    borda: string;
    botao: string;
  };
  categorias: {
    id: number;
    nome: string;
  }[];
  excluirCategoria: (id: number) => void;
  novaCategoria: string;
  setNovaCategoria: (v: string) => void;
  criarCategoria: (e: React.FormEvent) => void;
}

export default function GestaoCategorias({
  modoEscuro,
  setModoEscuro,
  cores,
  categorias,
  excluirCategoria,
  novaCategoria,
  setNovaCategoria,
  criarCategoria,

  isAdmin,
}: GestaoCategoriasProps) {
  const navigate = useNavigate();
  const [abaAtiva, setAbaAtiva] = useState<"geral" | "usuarios">("geral");

  return (
    <>
      {/* ABAS */}
      <div
        style={{
          display: "flex",
          gap: 8,
          marginTop: 16,
          marginBottom: 20,
        }}
      >
        <button
          onClick={() => setAbaAtiva("geral")}
          style={{
            padding: "6px 14px",
            borderRadius: 8,
            cursor: "pointer",
            fontWeight: 700,
            background: abaAtiva === "geral" ? cores.botao : "transparent",
            boxShadow:
              abaAtiva === "geral" ? "0 6px 20px rgba(0,0,0,0.25)" : "none",
            color: abaAtiva === "geral" ? "#fff" : cores.texto,
            border: `1px solid ${cores.borda}`,
          }}
        >
          ⚙️ Geral
        </button>

        {isAdmin && (
          <button
            onClick={() => {
              if (!isAdmin) return;
              setAbaAtiva("usuarios");
            }}
            style={{
              padding: "6px 14px",
              borderRadius: 8,
              cursor: "pointer",
              fontWeight: 700,
              background: abaAtiva === "usuarios" ? "#6366f1" : cores.card,
              color: abaAtiva === "usuarios" ? "#fff" : cores.texto,
              border: `1px solid ${cores.borda}`,
            }}
          >
            👥 Usuários
          </button>
        )}
      </div>

      <div
        key={abaAtiva}
        style={{
          animation: "fadeSlide 0.25s ease",
        }}
      >
        {abaAtiva === "geral" && (
          <AbaGeral
            cores={cores}
            categorias={categorias}
            novaCategoria={novaCategoria}
            setNovaCategoria={setNovaCategoria}
            criarCategoria={criarCategoria}
            excluirCategoria={excluirCategoria}
          />
        )}

        {abaAtiva === "usuarios" && isAdmin && <AbaUsuarios cores={cores} />}
      </div>
      <style>
        {`
@keyframes fadeSlide {
  from {
    opacity: 0;
    transform: translateY(6px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}
`}
      </style>
    </>
  );
}
