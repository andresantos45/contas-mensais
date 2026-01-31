import React from "react";
import {
  Chart as ChartJS,
  LineElement,
  PointElement,
  LinearScale,
  CategoryScale,
  Tooltip,
  Legend,
  Filler,
} from "chart.js";
import { Line } from "react-chartjs-2";

ChartJS.register(
  LineElement,
  PointElement,
  LinearScale,
  CategoryScale,
  Tooltip,
  Legend,
  Filler
);

// 📅 MESES FIXOS
const MESES = [
  "Jan",
  "Fev",
  "Mar",
  "Abr",
  "Mai",
  "Jun",
  "Jul",
  "Ago",
  "Set",
  "Out",
  "Nov",
  "Dez",
];

interface GraficoLinhaProps {
  entradas?: Record<number, number>;
  saidas?: Record<number, number>;
  saldoAcumulado?: Record<number, number>;
}

const GraficoLinha = React.memo(
  ({ entradas, saidas, saldoAcumulado }: GraficoLinhaProps) => {
    const labels = MESES;

    let datasets: any[] = [];

    if (saldoAcumulado) {
      const dadosSaldo = MESES.map((_, i) => {
        const mes = i + 1;
        return Number(saldoAcumulado[mes] ?? 0);
      });

      datasets = [
        {
          label: "Saldo acumulado",
          data: dadosSaldo,
          borderColor: "#3b82f6",
          backgroundColor: "rgba(59,130,246,0.2)",
          tension: 0.3,
          pointRadius: 4,
          fill: true,
        },
      ];
    } else {
      const dadosEntradas = MESES.map((_, i) => {
        const mes = i + 1;
        return Number(entradas?.[mes] ?? 0);
      });

      const dadosSaidas = MESES.map((_, i) => {
        const mes = i + 1;
        return Number(saidas?.[mes] ?? 0);
      });

      datasets = [
        {
          label: "Entradas",
          data: dadosEntradas,
          borderColor: "#22c55e",
          backgroundColor: "rgba(34,197,94,0.2)",
          tension: 0.3,
          pointRadius: 4,
          fill: true,
        },
        {
          label: "Saídas",
          data: dadosSaidas,
          borderColor: "#ef4444",
          backgroundColor: "rgba(239,68,68,0.2)",
          tension: 0.3,
          pointRadius: 4,
          fill: true,
        },
      ];
    }

    const data = {
      labels,
      datasets,
    };

    const options = {
      responsive: true,
      maintainAspectRatio: false,
      plugins: {
        legend: {
          position: "bottom" as const,
          labels: {
            color: "#e5e7eb",
            padding: 16,
          },
        },
        tooltip: {
          callbacks: {
            label: (context: any) => {
              const valor = context.raw ?? 0;
              return `${context.dataset.label}: ${valor.toLocaleString(
                "pt-BR",
                {
                  style: "currency",
                  currency: "BRL",
                }
              )}`;
            },
          },
        },
      },
      scales: {
        x: {
          ticks: { color: "#94a3b8" },
          grid: { color: "rgba(148,163,184,0.1)" },
        },
        y: {
          ticks: {
            color: "#94a3b8",
            callback: (value: any) =>
              Number(value).toLocaleString("pt-BR", {
                style: "currency",
                currency: "BRL",
              }),
          },
          grid: {
            color: (ctx: any) =>
              ctx.tick.value === 0
                ? "rgba(226,232,240,0.35)"
                : "rgba(148,163,184,0.1)",
            lineWidth: (ctx: any) => (ctx.tick.value === 0 ? 2 : 1),
          },
        },
      },
    };

    return (
      <div style={{ height: 320, width: "100%" }}>
        <Line data={data} options={options} />
      </div>
    );
  }
);

export default GraficoLinha;