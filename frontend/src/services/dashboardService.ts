// frontend/src/services/dashboardService.ts

import api from "./api";

export async function obterYoy(ano: number) {
  const response = await api.get(`/dashboard/yoy/${ano}`);
  return response.data;
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