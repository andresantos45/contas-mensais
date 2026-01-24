import { useNavigate } from "react-router-dom";

interface GestaoCategoriasProps {
  isAdmin: boolean;
  mostrar: boolean;
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
  handleLogout: () => void;
}

export default function GestaoCategorias({
  mostrar,
  modoEscuro,
  setModoEscuro,
  cores,
  categorias,
  excluirCategoria,
  novaCategoria,
  setNovaCategoria,
  criarCategoria,
  handleLogout,
   isAdmin,
}: GestaoCategoriasProps) {
  if (!mostrar) return null;

  const navigate = useNavigate();
  const role = localStorage.getItem("role");

  return (
    <>
      {/* AÇÕES */}
      <div
  style={{
    display: "flex",
    gap: 12,
    marginTop: 16,
    marginBottom: 16,
    flexWrap: "wrap",
  }}
>
  {/* 🌗 TEMA */}
  <button
    onClick={() => setModoEscuro(!modoEscuro)}
    style={{
      background: cores.card,
      color: cores.texto,
      border: `1px solid ${cores.borda}`,
      padding: "8px 14px",
      borderRadius: 8,
      cursor: "pointer",
      fontWeight: 600,
    }}
  >
    🌓 Tema
  </button>

  {/* 👥 USUÁRIOS — SOMENTE ADMIN */}
  {localStorage.getItem("role") === "admin" && (
    <button
      onClick={() => navigate("/admin/usuarios")}
      style={{
        background: "#6366f1",
        color: "#fff",
        border: "none",
        padding: "8px 14px",
        borderRadius: 8,
        cursor: "pointer",
        fontWeight: 600,
      }}
    >
      👥 Usuários
    </button>
  )}

{isAdmin && (
  <button
    onClick={() => window.location.href = "/admin/usuarios"}
    style={{
      background: "#6366f1",
      color: "#fff",
      border: "none",
      padding: "8px 14px",
      borderRadius: 8,
      cursor: "pointer",
      fontWeight: 600,
    }}
  >
    👥 Gerenciar usuários
  </button>
)}

  {/* 🚪 SAIR */}
  <button
    onClick={handleLogout}
    style={{
      background: "#dc2626",
      color: "#fff",
      border: "none",
      padding: "8px 14px",
      borderRadius: 8,
      cursor: "pointer",
      fontWeight: 600,
    }}
  >
    🚪 Sair
  </button>
</div>

      {/* FORMULÁRIO — CRIAR CATEGORIA */}
      <form
        onSubmit={criarCategoria}
        style={{
          display: "flex",
          gap: 12,
          marginTop: 12,
          alignItems: "end",
        }}
      >
        <div>
          <label
            style={{
              color: cores.textoSuave,
              fontSize: 13,
              marginBottom: 4,
              display: "block"
            }}
          >
            Nova categoria
          </label>

          <input
            value={novaCategoria}
            onChange={e => setNovaCategoria(e.target.value)}
            placeholder="Ex: Alimentação"
            required
            style={{
              background: cores.card,
              color: cores.texto,
              border: `1px solid ${cores.borda}`,
              borderRadius: 8,
              padding: "8px 10px"
            }}
          />
        </div>

        <button type="submit" style={{ height: 40 }}>
          ➕ Criar categoria
        </button>
       </form>

      {/* LISTA DE CATEGORIAS */}
      <div style={{ marginTop: 20 }}>
        {categorias.length === 0 ? (
          <p style={{ color: cores.textoSuave }}>
            Nenhuma categoria cadastrada.
          </p>
        ) : (
          categorias.map(categoria => (
            <div
              key={categoria.id}
              style={{
                display: "flex",
                justifyContent: "space-between",
                alignItems: "center",
                padding: "8px 12px",
                border: `1px solid ${cores.borda}`,
                borderRadius: 8,
                marginBottom: 8,
              }}
            >
              <span>{categoria.nome}</span>

              <button
                onClick={() => excluirCategoria(categoria.id)}
                style={{
                  background: "#dc2626",
                  color: "#fff",
                  border: "none",
                  borderRadius: 6,
                  padding: "6px 10px",
                  cursor: "pointer",
                  fontSize: 12,
                }}
              >
                🗑️ Excluir
              </button>
            </div>
          ))
        )}
      </div>
    </>
  );
}
