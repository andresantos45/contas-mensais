import { Pie } from "react-chartjs-2";
import {
  Chart as ChartJS,
  ArcElement,
  Tooltip,
  Legend,
} from "chart.js";

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
  const labels = Object.keys(dados);
  const valores = Object.values(dados);

  // 3️⃣ DATA
  const data = {
    labels,
    datasets: [
      {
        data: valores,
        backgroundColor: [
          "#0ea5e9",
          "#38bdf8",
          "#0284c7",
          "#0369a1",
          "#075985",
          "#0c4a6e",
        ],
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
          boxWidth: 14,
          padding: 16,
        },
      },
    },
  };

  // 5️⃣ RENDER FINAL
  return (
    <div
      style={{
        height: 260,
        width: "100%",
        position: "relative",
      }}
    >
      <Pie data={data} options={options} />
    </div>
  );
}