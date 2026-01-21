interface DashboardCardProps {
  titulo: string;
  valorPrincipal: React.ReactNode;
  subtitulo?: React.ReactNode;
  corBorda?: string;
}

export default function DashboardCard({
  titulo,
  valorPrincipal,
  subtitulo,
  corBorda = "#334155",
}: DashboardCardProps) {
  return (
    <div
      style={{
        background: "#020617",
        padding: 20,
        borderRadius: 16,
        border: `1px solid ${corBorda}`,
        height: 140, // altura fixa e consistente
        display: "flex",
        flexDirection: "column",
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
  <strong style={{ fontSize: 26, color: "#e5e7eb" }}>
    {valorPrincipal}
  </strong>

  {subtitulo && (
    <span style={{ fontSize: 13, opacity: 0.6, color: "#94a3b8" }}>
      {subtitulo}
    </span>
  )}
</div>
    </div>
  );
}