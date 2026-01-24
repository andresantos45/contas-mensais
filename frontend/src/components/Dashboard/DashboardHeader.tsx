interface DashboardHeaderProps {
  textoPeriodo: string;
  cores: any;
  exportando: "excel" | "pdf" | null;
  exportarExcel: () => void;
  exportarPDF: () => void;
  abrirConfiguracoes: () => void;
  onLogout: () => void;
}

export default function DashboardHeader({
  textoPeriodo,
  cores,
  exportando,
  exportarExcel,
  exportarPDF,
  abrirConfiguracoes,
  onLogout,
}: DashboardHeaderProps) {

 const botaoHeaderBase: React.CSSProperties = {
    padding: "10px 16px",
    borderRadius: 10,
    border: "none",
    cursor: "pointer",
    fontWeight: 700,
    display: "flex",
    alignItems: "center",
    gap: 8,
    transition: "transform .15s ease, box-shadow .15s ease, filter .15s ease",
  };

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

      {/* AÇÕES — LADO DIREITO */}
      <div
        style={{
          display: "flex",
          flexDirection: "column",
          alignItems: window.innerWidth < 640 ? "stretch" : "flex-end",
          gap: 12,
          marginBottom: 24,
        }}
      >
        {/* CONFIGURAÇÕES + SAIR */}
        <div
          style={{
            display: "flex",
            gap: 12,
            flexDirection: window.innerWidth < 640 ? "column" : "row",
          }}
        >
          <div style={{ display: "flex", gap: 12 }}>
            <button
              onClick={abrirConfiguracoes}
              style={{
                ...botaoHeaderBase,
                background: cores.botao,
                color: "#fff",
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.transform = "scale(1.05)";
                e.currentTarget.style.boxShadow = "0 8px 24px rgba(0,0,0,.35)";
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.transform = "scale(1)";
                e.currentTarget.style.boxShadow = "none";
              }}
            >
              ⚙️ Configurações
            </button>

            <button
  onClick={() => {
    const confirmar = window.confirm("Deseja realmente sair?");
    if (confirmar) {
      onLogout();
    }
  }}
  style={{
    ...botaoHeaderBase,
    background: "#dc2626",
    color: "#fff",
  }}
>
  ⏻ Sair
</button>
          </div>
        </div>

        {/* EXPORTAÇÕES */}
        <div
          style={{
            display: "flex",
            gap: 12,
            flexDirection: window.innerWidth < 640 ? "column" : "row",
          }}
        >
          <button
            onClick={exportarExcel}
            disabled={exportando === "excel"}
            style={{
              background: exportando === "excel" ? "#64748b" : "#16a34a",
              color: "#fff",
              padding: "10px 16px",
              width: window.innerWidth < 640 ? "100%" : "auto",
              border: "none",
              borderRadius: 8,
              cursor: exportando === "excel" ? "not-allowed" : "pointer",
              fontWeight: 600,
            }}
          >
            {exportando === "excel" ? "⏳ Exportando..." : "⬇️ Exportar Excel"}
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
