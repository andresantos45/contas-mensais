const CORES_FIXAS = [
  "#22c55e", // verde
  "#3b82f6", // azul
  "#f97316", // laranja
  "#ef4444", // vermelho
  "#a855f7", // roxo
  "#14b8a6", // teal
  "#eab308", // amarelo
  "#ec4899", // rosa
  "#64748b", // cinza
];

import { Pie } from "react-chartjs-2";
import { getCorCategoria } from "../../utils/gerarCor";
import { Chart as ChartJS, ArcElement, Tooltip, Legend } from "chart.js";

ChartJS.register(ArcElement, Tooltip, Legend);

export default function GraficoCategoria({ dados }: any) {
  // 1️⃣ EMPTY STATE
  if (!dados || Object.keys(dados).length === 0) {
    return (
      <div
        style={{
          height: 220,
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          opacity: 0.6,
        }}
      >
        Nenhum dado por categoria para exibir
      </div>
    );
  }

  // 2️⃣ DADOS
  // 🔥 NORMALIZA + ORDENA (decrescente)
  const dadosOrdenados = Object.entries(dados)
    .map(([label, valor]) => [label, Number(valor)] as const)
    .filter(([, valor]) => valor > 0)
    .sort((a, b) => b[1] - a[1]);

  const labels = dadosOrdenados.map(([label]) => label);
  const valores = dadosOrdenados.map(([, valor]) => valor);

  // 🎨 cor única por categoria (baseada no nome)
  const totalCategorias = labels.length;

  const backgroundColor = labels.map((label, index) => {
    const baseHue = (360 / totalCategorias) * index;
    return `hsl(${baseHue}, 70%, 55%)`;
  });

  // 🔢 total para porcentagem
  const total = valores.reduce((s, v) => s + v, 0);

  // 3️⃣ DATA
  const data = {
    labels,
    datasets: [
      {
        data: valores,
        backgroundColor,
      },
    ],
  };

  // 4️⃣ OPTIONS
  const options = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        position: "bottom" as const,
        labels: {
          color: "#e5e7eb", // 🔥 COR DO TEXTO (resolve o problema)
          boxWidth: 14,
          padding: 16,
          generateLabels: (chart: any) => {
            const data = chart.data;
            return data.labels.map((label: string, i: number) => {
              const valor = data.datasets[0].data[i];
              const percentual =
                total > 0 ? ((valor / total) * 100).toFixed(1) : "0";

              return {
                text: `${label} — ${valor.toLocaleString("pt-BR", {
                  style: "currency",
                  currency: "BRL",
                })} (${percentual}%)`,
                fillStyle: data.datasets[0].backgroundColor[i],
                strokeStyle: data.datasets[0].backgroundColor[i],
                lineWidth: 1,
                index: i,
                fontColor: "#e5e7eb", // 🔥 ESTA É A CHAVE
              };
            });
          },
        },
      },

      tooltip: {
        callbacks: {
          label: (context: any) => {
            const valor = context.raw ?? 0;
            const percentual =
              total > 0 ? ((valor / total) * 100).toFixed(1) : "0";

            return `${context.label} — ${valor.toLocaleString("pt-BR", {
              style: "currency",
              currency: "BRL",
            })} (${percentual}%)`;
          },
        },
      },
    },
  };

  // 5️⃣ RENDER FINAL
  return (
    <div
      style={{
        height: 340, // 🔥 espaço para legenda completa
        width: "100%",
        position: "relative",
      }}
    >
      <Pie data={data} options={options} />
    </div>
  );
}
