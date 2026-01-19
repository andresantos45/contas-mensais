export default function DashboardHeader({
  textoPeriodo,
  cores,
  exportando,
  exportarExcel,
  exportarPDF,
  setMostrarCategorias,
  mesBusca,
  setMesBusca,
  anoBusca,
  setAnoBusca
}) {
  return (
  <>
    {/* CABEÇALHO */}
    <div
      style={{
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        gap: 8,
        marginBottom: 20,
      }}
    >
      <h1
        style={{
          fontSize: 34,
          fontWeight: 800,
          margin: 0,
          letterSpacing: 0.5,
        }}
      >
        Contas Mensais
      </h1>

      <p
        style={{
          fontSize: 14,
          color: cores.textoSuave,
          margin: 0,
        }}
      >
        {textoPeriodo}
      </p>

          </div>

    {/* PESQUISA — MÊS / ANO (NO LUGAR CERTO) */}
    <div
      style={{
        display: "flex",
        justifyContent: "center",
        gap: 12,
        marginBottom: 20,
        flexWrap: "wrap",
      }}
    >
      <select
        value={mesBusca}
        onChange={e => setMesBusca(Number(e.target.value))}
        style={{
          background: cores.card,
          color: cores.texto,
          border: `1px solid ${cores.borda}`,
          borderRadius: 8,
          padding: "8px 12px",
          minWidth: 160,
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

      <input
        type="number"
        value={anoBusca}
        onChange={e => setAnoBusca(Number(e.target.value))}
        style={{
          width: 90,
          background: cores.card,
          color: cores.texto,
          border: `1px solid ${cores.borda}`,
          borderRadius: 8,
          padding: "8px 12px",
          textAlign: "center",
        }}
      />
    </div>

    {/* AÇÕES — LADO DIREITO */}
<div
  style={{
    display: "flex",
    flexDirection: "column",
    alignItems: "flex-end",
    gap: 12,
    marginBottom: 24,
  }}
>
  {/* CONFIGURAÇÕES */}
  <button
    onClick={() => setMostrarCategorias(prev => !prev)}
    style={{
      background: cores.botao,
      color: "#fff",
      padding: "10px 16px",
      border: "none",
      borderRadius: 10,
      cursor: "pointer",
      fontWeight: 700,
    }}
  >
    ⚙️ Configurações
  </button>

  {/* EXPORTAÇÕES */}
  <div style={{ display: "flex", gap: 12 }}>
    <button
      onClick={exportarExcel}
      disabled={exportando === "excel"}
      style={{
        background: exportando === "excel" ? "#64748b" : "#16a34a",
        color: "#fff",
        padding: "10px 16px",
        border: "none",
        borderRadius: 8,
        cursor: exportando === "excel" ? "not-allowed" : "pointer",
        fontWeight: 600,
      }}
    >
      {exportando === "excel"
        ? "⏳ Exportando..."
        : "⬇️ Exportar Excel"}
    </button>

    <button
      onClick={exportarPDF}
      disabled={exportando !== null}
      style={{
        background: "#dc2626",
        color: "#fff",
        padding: "10px 16px",
        border: "none",
        borderRadius: 8,
        cursor: exportando ? "not-allowed" : "pointer",
        fontWeight: 600,
        opacity: exportando ? 0.6 : 1,
      }}
    >
      📄 Exportar PDF
    </button>
  </div>
</div>

  </>
);
}