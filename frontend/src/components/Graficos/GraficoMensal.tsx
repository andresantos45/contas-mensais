import { Pie } from "react-chartjs-2";
import { Chart as ChartJS, ArcElement, Tooltip, Legend } from "chart.js";

ChartJS.register(ArcElement, Tooltip, Legend);

export default function GraficoMensal({ dados }: any) {
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
        Nenhum dado mensal para exibir
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
          "#22c55e",
          "#16a34a",
          "#4ade80",
          "#86efac",
          "#15803d",
          "#166534",
          "#052e16",
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
