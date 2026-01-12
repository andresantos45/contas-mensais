// frontend/src/services/dashboardService.ts

export async function obterYoy(ano: number) {
  const response = await fetch(
    "https://localhost:5138/api/dashboard/yoy/" + ano
  );

  if (!response.ok) {
    throw new Error("Erro ao buscar YoY");
  }

  return response.json();
}

/* =========================
   DASHBOARD RESUMIDO
   ========================= */
export function calcularDashboard(
  contas: any[],
  totalPeriodoAnterior: number,
  mesBusca: number
) {
  const totalPeriodo = contas.reduce(
    (soma, c) => soma + (c.valor || 0),
    0
  );

  const diferenca = totalPeriodo - totalPeriodoAnterior;

  const percentual =
    totalPeriodoAnterior === 0
      ? 0
      : (diferenca / totalPeriodoAnterior) * 100;

  let tipo: "positivo" | "negativo" | "neutro" = "neutro";

  if (percentual > 0) tipo = "positivo";
  if (percentual < 0) tipo = "negativo";

  return {
    totalPeriodo,
    diferenca,
    percentual,
    tipo,
    tendencia:
      tipo === "positivo" ? "▲" : tipo === "negativo" ? "▼" : "↔"
  };
}