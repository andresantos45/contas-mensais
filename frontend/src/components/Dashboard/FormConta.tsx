interface FormContaProps {
  descricao: string;
  setDescricao: (v: string) => void;
  valor: string;
  setValor: (v: string) => void;
  data: string;
  setData: (v: string) => void;
  categoriaId: string;
  setCategoriaId: (v: string) => void;
  categorias: any[];
  contaEditando: any | null;
  salvandoConta: boolean;
  criarConta: (e: React.FormEvent) => void;
  cores: any;
  cancelarEdicao: () => void;
}

export default function FormConta({
  descricao,
  setDescricao,
  valor,
  setValor,
  data,
  setData,
  categoriaId,
  setCategoriaId,
  categorias,
  contaEditando,
  salvandoConta,
  criarConta,
  cores,
  cancelarEdicao,
}: FormContaProps) {
  return (
    <form
      onSubmit={criarConta}
      style={{
        display: "grid",
        gridTemplateColumns: "repeat(4, minmax(180px, 1fr)) auto",
        gap: 12,
        marginTop: 20,
        alignItems: "end"
      }}
    >
      {/* DESCRIÇÃO */}
      <div>
        <label
          style={{
            color: cores.textoSuave,
            fontSize: 13,
            marginBottom: 6,
            display: "block"
          }}
        >
          Descrição
        </label>
        <input
          value={descricao}
          onChange={e => setDescricao(e.target.value)}
          required
          style={{
            background: "#ffffff",
            color: "#111827",
            border: "1px solid #cbd5f5",
            borderRadius: 8,
            padding: "8px 10px"
          }}
        />
      </div>

      {/* VALOR */}
      <div>
        <label
          style={{
            color: cores.textoSuave,
            fontSize: 13,
            marginBottom: 6,
            display: "block"
          }}
        >
          Valor
        </label>
        <input
          type="number"
          value={valor}
          onChange={e => setValor(e.target.value)}
          required
          style={{
            background: "#ffffff",
            color: "#111827",
            border: "1px solid #cbd5f5",
            borderRadius: 8,
            padding: "8px 10px"
          }}
        />
      </div>

      {/* DATA */}
      <div>
        <label
          style={{
            color: cores.textoSuave,
            fontSize: 13,
            marginBottom: 6,
            display: "block"
          }}
        >
          Data
        </label>
        <input
          type="date"
          value={data}
          onChange={e => setData(e.target.value)}
          required
          style={{
            background: "#ffffff",
            color: "#111827",
            border: "1px solid #cbd5f5",
            borderRadius: 8,
            padding: "8px 10px"
          }}
        />
      </div>

      {/* CATEGORIA */}
      <div>
        <label
          style={{
            color: cores.textoSuave,
            fontSize: 13,
            marginBottom: 6,
            display: "block"
          }}
        >
          Categoria
        </label>
        <select
          value={categoriaId}
          onChange={e => setCategoriaId(e.target.value)}
          required
          style={{
            background: "#ffffff",
            color: "#111827",
            border: "1px solid #cbd5f5",
            borderRadius: 8,
            padding: "8px 10px"
          }}
        >
          <option value="">Selecione</option>
          {categorias.map(cat => (
            <option key={cat.id} value={cat.id}>
              {cat.nome}
            </option>
          ))}
        </select>
      </div>

      {/* BOTÃO SALVAR */}
      <button
        type="submit"
        disabled={salvandoConta}
        style={{
          height: 40,
          background: cores.botao,
          color: "#fff",
          border: "none",
          borderRadius: 8,
          fontWeight: 600
        }}
      >
        {contaEditando ? "💾 Salvar" : "➕ Adicionar"}
      </button>

      {/* BOTÃO CANCELAR */}
      {contaEditando && (
        <button
          type="button"
          onClick={cancelarEdicao}
          style={{ height: 40 }}
        >
          ❌ Cancelar
        </button>
      )}
    </form>
  );
}
