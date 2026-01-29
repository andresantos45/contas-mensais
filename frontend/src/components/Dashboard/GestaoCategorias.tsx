import { useState } from "react";
import AbaGeral from "./AbaGeral";
import AbaUsuarios from "./AbaUsuarios";

interface GestaoCategoriasProps {
  isAdmin: boolean;
  cores: {
    fundo: string;
    card: string;
    texto: string;
    textoSuave: string;
    borda: string;
    botao: string;
  };

  // 📂 categorias de CONTAS
  categoriasContas: {
    id: number;
    nome: string;
  }[];
  criarCategoriaConta: (e: React.FormEvent) => void;
  excluirCategoriaConta: (id: number) => void;

  // 💰 categorias de ENTRADAS
  categoriasEntradas: {
    id: number;
    nome: string;
  }[];
  criarCategoriaEntrada: (e: React.FormEvent) => void;
  excluirCategoriaEntrada: (id: number) => void;

  // ✏️ input de categoria de CONTAS
  novaCategoriaConta: string;
  setNovaCategoriaConta: (v: string) => void;

  // ✏️ input de categoria de ENTRADAS
  novaCategoriaEntrada: string;
  setNovaCategoriaEntrada: (v: string) => void;
}

export default function GestaoCategorias({
  cores,
  isAdmin,

  categoriasContas,
  criarCategoriaConta,
  excluirCategoriaConta,
  novaCategoriaConta,
  setNovaCategoriaConta,

  categoriasEntradas,
  criarCategoriaEntrada,
  excluirCategoriaEntrada,
  novaCategoriaEntrada,
  setNovaCategoriaEntrada,
}: GestaoCategoriasProps) {
  const [abaAtiva, setAbaAtiva] = useState<
    "geral" | "usuarios" | "categorias" | "entradas"
  >("geral");

  function trocarAba(aba: "geral" | "usuarios" | "categorias" | "entradas") {
    setAbaAtiva(aba);
  }

  if (abaAtiva === "usuarios" && !isAdmin) {
    setAbaAtiva("geral");
  }

  return (
    <>
      {/* ABAS */}
      <div
        style={{
          display: "flex",
          gap: 8,
          marginTop: 16,
          marginBottom: 20,
          flexWrap: "wrap",
        }}
      >
        <button
          onClick={() => trocarAba("geral")}
          style={{
            padding: "6px 14px",
            borderRadius: 8,
            cursor: "pointer",
            fontWeight: 700,
            background: abaAtiva === "geral" ? cores.botao : "transparent",
            color: abaAtiva === "geral" ? "#fff" : cores.texto,
            border: `1px solid ${cores.borda}`,
          }}
        >
          ⚙️ Geral
        </button>

        <button
          onClick={() => trocarAba("categorias")}
          style={{
            padding: "6px 14px",
            borderRadius: 8,
            cursor: "pointer",
            fontWeight: 700,
            background: abaAtiva === "categorias" ? cores.botao : "transparent",
            color: abaAtiva === "categorias" ? "#fff" : cores.texto,
            border: `1px solid ${cores.borda}`,
          }}
        >
          📂 Categorias (Contas)
        </button>

        <button
          onClick={() => trocarAba("entradas")}
          style={{
            padding: "6px 14px",
            borderRadius: 8,
            cursor: "pointer",
            fontWeight: 700,
            background: abaAtiva === "entradas" ? "#22c55e" : "transparent",
            color: abaAtiva === "entradas" ? "#fff" : cores.texto,
            border: `1px solid ${cores.borda}`,
          }}
        >
          💰 Categorias de Entradas
        </button>

        {isAdmin && (
          <button
            onClick={() => trocarAba("usuarios")}
            style={{
              padding: "6px 14px",
              borderRadius: 8,
              cursor: "pointer",
              fontWeight: 700,
              background: abaAtiva === "usuarios" ? "#6366f1" : "transparent",
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
        {abaAtiva === "categorias" && (
          <AbaGeral
  cores={cores}
  categorias={categoriasContas}
  novaCategoria={novaCategoriaConta}
  setNovaCategoria={setNovaCategoriaConta}
  criarCategoria={criarCategoriaConta}
  excluirCategoria={excluirCategoriaConta}
/>
        )}

        {abaAtiva === "entradas" && (
          <AbaGeral
  cores={cores}
  categorias={categoriasEntradas}
  novaCategoria={novaCategoriaEntrada}
  setNovaCategoria={setNovaCategoriaEntrada}
  criarCategoria={criarCategoriaEntrada}
  excluirCategoria={excluirCategoriaEntrada}
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
