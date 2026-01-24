import { useState, useEffect } from "react";

export default function DashboardHeader({
  textoPeriodo,
  cores,
  exportando,
  exportarExcel,
  exportarPDF,
  setMostrarCategorias,
  handleLogout,
  isAdmin, // 👈 ADICIONE
}) {
  const [mostrarModalSair, setMostrarModalSair] = useState(false);

  useEffect(() => {
  function handleKeyDown(event) {
    if (event.key === "Escape") {
      setMostrarModalSair(false);
    }
  }

  if (mostrarModalSair) {
    window.addEventListener("keydown", handleKeyDown);
  }

  return () => {
    window.removeEventListener("keydown", handleKeyDown);
  };
}, [mostrarModalSair]);

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

{/* 🔐 BOTÃO ADMIN — SOMENTE PARA ADMIN */}
{isAdmin && (
  <button
    onClick={() => window.location.href = "/admin/usuarios"}
    style={{
      background: "#6366f1",
      color: "#fff",
      padding: "10px 16px",
      border: "none",
      borderRadius: 10,
      cursor: "pointer",
      fontWeight: 700,
    }}
  >
    👥 Usuários
  </button>
)}

<button
  onClick={() => setMostrarModalSair(true)}
  style={{
    background: "#ef4444",
    color: "#fff",
    padding: "10px 16px",
    border: "none",
    borderRadius: 10,
    cursor: "pointer",
    fontWeight: 700,
  }}
>
  ⏻ Sair
</button>
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
  
{mostrarModalSair && (
  <div
  onClick={() => setMostrarModalSair(false)}
    style={{
      position: "fixed",
      inset: 0,
      background: "rgba(0,0,0,0.6)",
      display: "flex",
      alignItems: "center",
      justifyContent: "center",
      zIndex: 999,
    }}
  >
    <div
    onClick={e => e.stopPropagation()}
      style={{
        background: cores.card,
        color: cores.texto,
        padding: 24,
        borderRadius: 16,
        width: "90%",
        maxWidth: 360,
        boxShadow: "0 20px 40px rgba(0,0,0,0.4)",
      }}
    >
      <h3 style={{ marginTop: 0, marginBottom: 12 }}>
        Confirmar saída
      </h3>

      <p style={{ fontSize: 14, color: cores.textoSuave }}>
        Tem certeza que deseja sair da aplicação?
      </p>

      <div
        style={{
          display: "flex",
          justifyContent: "flex-end",
          gap: 12,
          marginTop: 20,
        }}
      >
        <button
          onClick={() => setMostrarModalSair(false)}
          style={{
            background: "transparent",
            color: cores.textoSuave,
            border: "none",
            cursor: "pointer",
            fontWeight: 600,
          }}
        >
          Cancelar
        </button>

        <button
          onClick={handleLogout}
          style={{
            background: "#ef4444",
            color: "#fff",
            padding: "8px 16px",
            border: "none",
            borderRadius: 8,
            cursor: "pointer",
            fontWeight: 700,
          }}
        >
          Sair
        </button>
      </div>
    </div>
  </div>
)}


  </>
);
}