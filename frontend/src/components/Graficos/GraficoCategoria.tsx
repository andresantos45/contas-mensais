import { Pie } from "react-chartjs-2";
import {
  Chart as ChartJS,
  ArcElement,
  Tooltip,
  Legend,
} from "chart.js";

ChartJS.register(ArcElement, Tooltip, Legend);

export default function GraficoCategoria({ dados }: any) {
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

  const labels = Object.keys(dados);
  const valores = Object.values(dados);

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

  return (
    <div style={{ height: 220 }}>
      <Pie data={data} />
    </div>
  );
}
