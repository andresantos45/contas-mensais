import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  Tooltip,
  Legend
} from "chart.js";
import { Bar } from "react-chartjs-2";

ChartJS.register(
  CategoryScale,
  LinearScale,
  BarElement,
  Tooltip,
  Legend
);

type Props = {
  dados: Record<string, number>;
};

export default function GraficoMensal({ dados }: Props) {
  const labels = Object.keys(dados);
  const valores = Object.values(dados);

  if (labels.length === 0) {
    return <p>Nenhum dado para exibir</p>;
  }

  const chartData = {
    labels,
    datasets: [
      {
        label: "Total por mês (R$)",
        data: valores,
        backgroundColor: "#22c55e",
        borderRadius: 6
      }
    ]
  };

  const options = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        labels: {
          color: "#e5e7eb"
        }
      },
      tooltip: {
        callbacks: {
          label: function (context: any) {
            return context.raw.toLocaleString("pt-BR", {
              style: "currency",
              currency: "BRL"
            });
          }
        }
      }
    },
    scales: {
      x: {
        ticks: {
          color: "#e5e7eb"
        },
        grid: {
          color: "#334155"
        }
      },
      y: {
        ticks: {
          color: "#e5e7eb"
        },
        grid: {
          color: "#334155"
        }
      }
    }
  };

  return (
    <div style={{ height: 320 }}>
      <Bar data={chartData} options={options} />
    </div>
  );
}