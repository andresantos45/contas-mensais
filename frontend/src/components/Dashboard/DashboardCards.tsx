import DashboardCard from "./DashboardCard";

interface DashboardCardsProps {
  modoTela: "contas" | "entradas"; // 🔥 NOVO
  mesBusca: number;
  totalPeriodo: number;
  totalEntradas: number;
  saldoFinal: number;
  mediaMensal: number;
  diferenca: number;
  percentual: number | null;
  tipo: "alta" | "queda" | "neutro";
  nomeCategoriaMaior: string;
  valorCategoriaMaior: number;
}

export default function DashboardCards({
  modoTela,
  mesBusca,
  totalPeriodo,
  totalEntradas,
  saldoFinal,
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
        gridTemplateColumns: "repeat(auto-fit, minmax(220px, 1fr))",
        gap: 12,
        marginTop: 24,
        width: "100%",
      }}
    >
      {modoTela === "contas" && (
  <>
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
        <span style={{ fontWeight: 700 }}>
          {Math.abs(diferenca).toLocaleString("pt-BR", {
            style: "currency",
            currency: "BRL",
          })}
        </span>
      }
      subtitulo={
        percentual !== null ? `${Math.abs(percentual).toFixed(1)}%` : "—"
      }
      variacao={
        tipo === "alta"
          ? "positivo"
          : tipo === "queda"
            ? "negativo"
            : "neutro"
      }
      corBorda={
        tipo === "alta" ? "#16a34a" : tipo === "queda" ? "#dc2626" : "#2563eb"
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
  </>
)}

{modoTela === "entradas" && (
  <>
    <DashboardCard
      titulo="💰 Total de Entradas"
      valorPrincipal={totalEntradas.toLocaleString("pt-BR", {
        style: "currency",
        currency: "BRL",
      })}
      corBorda="#22c55e"
    />

    <DashboardCard
      titulo="🧮 Saldo Final"
      valorPrincipal={saldoFinal.toLocaleString("pt-BR", {
        style: "currency",
        currency: "BRL",
      })}
      corBorda={saldoFinal >= 0 ? "#16a34a" : "#dc2626"}
    />
  </>
)}
    </div>
  );
}
