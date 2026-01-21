import { useState } from "react";


type VariacaoTipo = "positivo" | "negativo" | "neutro";

interface DashboardCardProps {
  titulo: string;
  valorPrincipal: React.ReactNode;
  subtitulo?: React.ReactNode;
  tooltip?: string; // 👈 ADICIONE AQUI
  corBorda?: string;
  variacao?: VariacaoTipo;
}

export default function DashboardCard({
  titulo,
  valorPrincipal,
  subtitulo,
  tooltip, // 👈 ADICIONE AQUI
  corBorda = "#334155",
  variacao = "neutro",
}: DashboardCardProps) {

  const coresVariacao = {
  positivo: {
    borda: "#22c55e",
    valor: "#22c55e",
  },
  negativo: {
    borda: "#ef4444",
    valor: "#ef4444",
  },
  neutro: {
    borda: corBorda,
    valor: "#e5e7eb",
  },
};

const variacaoAtual = coresVariacao[variacao as VariacaoTipo];
const [hover, setHover] = useState(false);
const [showTooltip, setShowTooltip] = useState(false);
    const iconeVariacao =
  variacao === "positivo"
    ? "▲"
    : variacao === "negativo"
    ? "▼"
    : null;
  return (
    <div
  onMouseEnter={() => setHover(true)}
  onMouseLeave={() => setHover(false)}
  style={{
    background: "#020617",
    padding: 20,
    borderRadius: 16,
    border: `1px solid ${variacaoAtual.borda}`,
    height: 140,
    display: "flex",
    flexDirection: "column",
    transition: "all 0.25s ease",
    transform: hover ? "translateY(-2px)" : "translateY(0)",
    boxShadow: hover
      ? "0 10px 25px rgba(0,0,0,0.25)"
      : "none",
  }}
>
      <span style={{ fontSize: 14, opacity: 0.7, color: "#94a3b8" }}>
        {titulo}
      </span>

      <div
  style={{
    flex: 1,
    display: "flex",
    flexDirection: "column",
    justifyContent: "center", // ✅ centraliza SÓ o valor
    alignItems: "flex-start",
    gap: 6, // 👈 espaçamento controlado
  }}
>
  <strong
  style={{
    fontSize: 26,
    color: variacaoAtual.valor,
    display: "flex",
    alignItems: "center",
    gap: 6,
    transition: "color 0.25s ease", // 👈 AQUI
  }}
>
  {iconeVariacao && (
    <span style={{ fontSize: 14, opacity: 0.85 }}>
  {iconeVariacao}
</span>
  )}

  {valorPrincipal}
</strong>

  {subtitulo && (
  <div
    style={{ position: "relative", width: "fit-content" }}
    onMouseEnter={() => setShowTooltip(true)}
    onMouseLeave={() => setShowTooltip(false)}
  >
    <span style={{ fontSize: 13, opacity: 0.6, color: "#94a3b8", cursor: "help" }}>
      {subtitulo}
    </span>

    {tooltip && showTooltip && (
      <div
        style={{
          position: "absolute",
          bottom: "125%",
          left: "0",
          background: "#020617",
          color: "#e5e7eb",
          padding: "6px 10px",
          borderRadius: 6,
          fontSize: 12,
          whiteSpace: "nowrap",
          boxShadow: "0 8px 20px rgba(0,0,0,0.35)",
          zIndex: 10,
        }}
      >
        {tooltip}
      </div>
    )}
  </div>
)}
</div>
    </div>
  );
}