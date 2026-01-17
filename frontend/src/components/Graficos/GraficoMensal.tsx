import { Pie } from "react-chartjs-2";

export default function GraficoMensal({ dados }: any) {
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
