import DashboardCard from "./DashboardCard";

interface DashboardCardsProps {
  mesBusca: number;
  totalPeriodo: number;
  mediaMensal: number;
  tendencia: "↑" | "↓" | "→";
  diferenca: number;
  percentual: number | null;
  tipo: "alta" | "queda" | "neutro";
  nomeCategoriaMaior: string;
  valorCategoriaMaior: number;
}

export default function DashboardCards({
  mesBusca,
  totalPeriodo,
  mediaMensal,
  tendencia,
  diferenca,
  percentual,
  tipo,
  nomeCategoriaMaior,
  valorCategoriaMaior,
}: DashboardCardsProps) {
  return (
    <div
      style={{
        display: "grid",
        gridTemplateColumns: "repeat(auto-fit, minmax(260px, 1fr))",
        gap: 16,
        marginTop: 24,
      }}
    >
      <DashboardCard
        titulo="Total do período"
        valorPrincipal={totalPeriodo.toLocaleString("pt-BR", {
          style: "currency",
          currency: "BRL",
        })}
      />

      <DashboardCard
        titulo={mesBusca === 0 ? "Média mensal do ano" : "Valor do mês"}
        valorPrincipal={mediaMensal.toLocaleString("pt-BR", {
          style: "currency",
          currency: "BRL",
        })}
        subtitulo={
          mesBusca === 0
            ? "cálculo baseado no ano inteiro"
            : "referente ao mês selecionado"
        }
      />

      <DashboardCard
        titulo="Comparação com período anterior"
        valorPrincipal={`${tendencia} ${diferenca.toLocaleString("pt-BR", {
          style: "currency",
          currency: "BRL",
        })}`}
        subtitulo={percentual !== null ? `${percentual.toFixed(1)}%` : "—"}
        corBorda={
          tipo === "alta"
            ? "#16a34a"
            : tipo === "queda"
            ? "#dc2626"
            : "#334155"
        }
      />

      <DashboardCard
        titulo="Categoria com maior gasto"
        valorPrincipal={nomeCategoriaMaior}
        subtitulo={valorCategoriaMaior.toLocaleString("pt-BR", {
          style: "currency",
          currency: "BRL",
        })}
        corBorda="#0ea5e9"
      />
    </div>
  );
}