interface GestaoCategoriasProps {
  mostrar: boolean;
  modoEscuro: boolean;
  setModoEscuro: (v: boolean) => void;
  cores: any;
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
  novaCategoria,
  setNovaCategoria,
  criarCategoria,
  handleLogout,
}: GestaoCategoriasProps) {
  if (!mostrar) return null;

  return (
    <>
      {/* AÇÕES */}
      <div
        style={{
          display: "flex",
          gap: 12,
          marginTop: 16,
          marginBottom: 16,
        }}
      >
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
    </>
  );
}
