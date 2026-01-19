interface DashboardFiltrosProps {
  mesBusca: number;
  setMesBusca: (mes: number) => void;
  anoBusca: number;
  setAnoBusca: (ano: number) => void;
}

export default function DashboardFiltros({
  mesBusca,
  setMesBusca,
  anoBusca,
  setAnoBusca,
}: DashboardFiltrosProps) {
  return (
    <div
      style={{
        display: "flex",
        alignItems: "center",
        gap: 16,
        marginTop: 32,
        marginBottom: 12,
        flexWrap: "wrap",
      }}
    >
      {/* FILTRO MÊS */}
      <select
        value={mesBusca}
        onChange={e => setMesBusca(Number(e.target.value))}
        style={{
          background: "#ffffff",
          color: "#111827",
          border: "1px solid #cbd5f5",
          borderRadius: 8,
          padding: "6px 10px",
          fontWeight: 500,
        }}
      >
        <option value={0}>Ano inteiro</option>
        {[
          "Janeiro", "Fevereiro", "Março", "Abril", "Maio", "Junho",
          "Julho", "Agosto", "Setembro", "Outubro", "Novembro", "Dezembro"
        ].map((nome, index) => (
          <option key={index + 1} value={index + 1}>
            {nome}
          </option>
        ))}
      </select>

      {/* FILTRO ANO */}
      <input
        type="number"
        value={anoBusca}
        onChange={e => setAnoBusca(Number(e.target.value))}
        style={{
          width: 90,
          background: "#ffffff",
          color: "#111827",
          border: "1px solid #cbd5f5",
          borderRadius: 8,
          padding: "6px 8px",
          fontWeight: 500,
        }}
      />

      {/* TÍTULO */}
      <h2 style={{ margin: 0 }}>
        Contas do período
      </h2>
    </div>
  );
}