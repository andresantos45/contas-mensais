interface AbaGeralProps {
  cores: {
  fundo: string;
  card: string;
  texto: string;
  textoSuave: string;
  borda: string;
  botao: string;
};
  categorias: { id: number; nome: string }[];
  novaCategoria: string;
  setNovaCategoria: (v: string) => void;
  criarCategoria: (e: React.FormEvent) => void;
  excluirCategoria: (id: number) => void;
}

export default function AbaGeral({
  cores,
  categorias,
  novaCategoria,
  setNovaCategoria,
  criarCategoria,
  excluirCategoria,
}: AbaGeralProps) {
  return (
    <>
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
              display: "block",
            }}
          >
            Nova categoria
          </label>

          <input
            value={novaCategoria}
            onChange={(e) => setNovaCategoria(e.target.value)}
            placeholder="Ex: Alimentação"
            required
            style={{
              background: cores.card,
              color: cores.texto,
              border: `1px solid ${cores.borda}`,
              borderRadius: 8,
              padding: "8px 10px",
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
          categorias.map((categoria) => (
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