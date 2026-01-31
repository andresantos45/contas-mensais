import { Pie } from "react-chartjs-2";
import { gerarCor } from "../../utils/gerarCor";
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

// 🎨 cor única por categoria (baseada no nome)
const backgroundColor = labels.map((label) => gerarCor(label));

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
        boxWidth: 14,
        padding: 16,
      },
    },
    tooltip: {
      callbacks: {
        label: (context: any) => {
          const valor = context.raw ?? 0;
          return valor.toLocaleString("pt-BR", {
            style: "currency",
            currency: "BRL",
          });
        },
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