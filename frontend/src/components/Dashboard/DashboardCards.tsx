import DashboardCard from "./DashboardCard";

interface DashboardCardsProps {
  mesBusca: number;
  totalPeriodo: number;
  mediaMensal: number;
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
    gridTemplateColumns: "repeat(auto-fit, minmax(240px, 1fr))", // 👈 menor no mobile
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
  valorPrincipal={
    <span
      style={{
        display: "inline-flex",
        alignItems: "center",
        gap: 6,
        fontSize: "1em",
        fontWeight: 700,
        color:
          tipo === "alta"
            ? "#16a34a"
            : tipo === "queda"
            ? "#dc2626"
            : "#2563eb",
      }}
    >
      
      <span>
        {Math.abs(diferenca).toLocaleString("pt-BR", {
          style: "currency",
          currency: "BRL",
        })}
      </span>
    </span>
  }
  subtitulo={
    percentual !== null
      ? `${Math.abs(percentual).toFixed(1)}%`
      : "—"
  }
  tooltip="Comparação feita com base no total do período anterior"
  variacao={
    tipo === "alta"
      ? "positivo"
      : tipo === "queda"
      ? "negativo"
      : "neutro"
  }
  corBorda={
    tipo === "alta"
      ? "#16a34a"
      : tipo === "queda"
      ? "#dc2626"
      : "#2563eb"
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