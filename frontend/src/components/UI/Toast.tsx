import { useEffect } from "react";

interface ToastProps {
  mensagem: string;
  tipo?: "sucesso" | "erro";
  onClose: () => void;
}

export default function Toast({
  mensagem,
  tipo = "sucesso",
  onClose,
}: ToastProps) {
  useEffect(() => {
    const timer = setTimeout(onClose, 3000);
    return () => clearTimeout(timer);
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
      {mensagem}
    </div>
  );
}