import { Conta } from "../../types/Conta";

export function calcularDashboard(
  contas: Conta[],
  entradas: { valor: number }[],
  mesBusca: number,
  anoBusca: number,
  totalPeriodoAnterior: number
) {
  if (!contas || contas.length === 0) {
    return {
      totalPeriodo: 0,
      mediaMensal: 0,
      diferenca: 0,
      percentual: 0,
      tipo: "neutro" as const,
      tendencia: "→" as const,
      totalPorMes: {},
      totalPorCategoria: {},
      nomeCategoriaMaior: "—",
      valorCategoriaMaior: 0,
    };
  }

  const totalPeriodo = contas.reduce(
  (soma: number, c: Conta) => soma + Number(c.valor),
  0
);

const totalEntradas = entradas.reduce(
  (soma: number, e) => soma + Number(e.valor),
  0
);

const saldoFinal = totalEntradas - totalPeriodo;

  const divisorMedia = mesBusca === 0 ? 12 : 1;
  const mediaMensal = totalPeriodo / divisorMedia;

  const diferenca = totalPeriodo - totalPeriodoAnterior;

  const percentual =
    totalPeriodoAnterior > 0
      ? (diferenca / totalPeriodoAnterior) * 100
      : null;

  const tipo: "alta" | "queda" | "neutro" =
    diferenca > 0 ? "alta" : diferenca < 0 ? "queda" : "neutro";

  const tendencia: "↑" | "↓" | "→" =
    tipo === "alta" ? "↑" : tipo === "queda" ? "↓" : "→";

  const nomesMeses = [
    "Jan", "Fev", "Mar", "Abr", "Mai", "Jun",
    "Jul", "Ago", "Set", "Out", "Nov", "Dez",
  ];

  const totalPorMes = contas.reduce(
    (acc: Record<string, number>, c: Conta) => {
      if (!c.mes || c.mes < 1 || c.mes > 12) return acc;
      const nomeMes = nomesMeses[c.mes - 1];
      acc[nomeMes] = (acc[nomeMes] || 0) + Number(c.valor);
      return acc;
    },
    {}
  );

  const totalPorCategoria = contas.reduce(
    (acc: Record<string, number>, c: Conta) => {
      if (!c.categoriaNome) return acc;
      acc[c.categoriaNome] =
        (acc[c.categoriaNome] || 0) + Number(c.valor);
      return acc;
    },
    {}
  );

  const categoriaMaior = Object.entries(totalPorCategoria).sort(
    (a, b) => b[1] - a[1]
  )[0];

  return {
  totalPeriodo,
  totalEntradas,
  saldoFinal,
  mediaMensal,
  diferenca,
  percentual,
  tipo,
  tendencia,
  totalPorMes,
  totalPorCategoria,
  nomeCategoriaMaior: categoriaMaior?.[0] ?? "—",
  valorCategoriaMaior: categoriaMaior?.[1] ?? 0,
};
}