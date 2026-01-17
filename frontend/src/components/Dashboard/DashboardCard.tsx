interface DashboardCardProps {
  titulo: string;
  valorPrincipal: string;
  subtitulo?: string;
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
        minHeight: 110,
        display: "flex",
        flexDirection: "column",
        justifyContent: "space-between",
      }}
    >
      <span style={{ fontSize: 14, opacity: 0.7 }}>{titulo}</span>

      <strong style={{ fontSize: 26 }}>{valorPrincipal}</strong>

      {subtitulo && (
        <span style={{ fontSize: 13, opacity: 0.6 }}>{subtitulo}</span>
      )}
    </div>
  );
}