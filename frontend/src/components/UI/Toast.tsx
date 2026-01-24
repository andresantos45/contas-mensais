import { useEffect } from "react";

interface ToastProps {
  mensagem: string;
  tipo?: "sucesso" | "erro";
  onClose: () => void;
  acao?: {
    texto: string;
    onClick: () => void;
  };
}

export default function Toast({
  mensagem,
  tipo = "sucesso",
  onClose,
  acao,
}: ToastProps) {
  useEffect(() => {
    const timer = window.setTimeout(onClose, 3000);
return () => window.clearTimeout(timer);
  }, [onClose]);

  return (
    <div
      style={{
        position: "fixed",
        bottom: 24,
        right: 24,
        padding: "12px 16px",
        borderRadius: 10,
        background: tipo === "sucesso" ? "#16a34a" : "#dc2626",
        color: "#ffffff",
        fontWeight: 600,
        boxShadow: "0 10px 30px rgba(0,0,0,0.25)",
        zIndex: 2000,
        maxWidth: 320,
      }}
    >
      <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
  <span>{mensagem}</span>

  {acao && (
    <button
      onClick={acao.onClick}
      style={{
        background: "transparent",
        border: "none",
        color: "#bbf7d0",
        fontWeight: 700,
        cursor: "pointer",
        padding: 0,
      }}
    >
      {acao.texto}
    </button>
  )}
</div>
    </div>
  );
}
