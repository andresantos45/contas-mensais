type VariacaoTipo = "positivo" | "negativo" | "neutro";

interface DashboardCardProps {
  titulo: string;
  valorPrincipal: React.ReactNode;
  subtitulo?: React.ReactNode;
  corBorda?: string;
  variacao?: VariacaoTipo;
}

export default function DashboardCard({
  titulo,
  valorPrincipal,
  subtitulo,
  corBorda = "#334155",
  variacao = "neutro", // 👈 ADICIONE AQUI
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
  return (
    <div
      style={{
        background: "#020617",
        padding: 20,
        borderRadius: 16,
        border: `1px solid ${variacaoAtual.borda}`, // 👈 SUBSTITUA
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
  <strong style={{ fontSize: 26, color: variacaoAtual.valor }}>
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