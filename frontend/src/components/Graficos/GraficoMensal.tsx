import { Pie } from "react-chartjs-2";
import { Chart as ChartJS, ArcElement, Tooltip, Legend } from "chart.js";
import { getCorComparativo } from "../../utils/gerarCor";

ChartJS.register(ArcElement, Tooltip, Legend);

// 📅 NOMES DOS MESES
const NOMES_MESES: Record<number, string> = {
  1: "Jan",
  2: "Fev",
  3: "Mar",
  4: "Abr",
  5: "Mai",
  6: "Jun",
  7: "Jul",
  8: "Ago",
  9: "Set",
  10: "Out",
  11: "Nov",
  12: "Dez",
};

// 🎨 CORES FIXAS — NUNCA SE REPETEM
const CORES_MESES: Record<number, string> = {
  1: "#22c55e", // Jan - verde
  2: "#2563eb", // Fev - azul
  3: "#f97316", // Mar - laranja
  4: "#a855f7", // Abr - roxo
  5: "#ef4444", // Mai - vermelho
  6: "#14b8a6", // Jun - teal
  7: "#eab308", // Jul - amarelo
  8: "#0ea5e9", // Ago - azul claro
  9: "#db2777", // Set - rosa
  10: "#4d7c0f", // Out - oliva
  11: "#7c3aed", // Nov - violeta
  12: "#be123c", // Dez - vinho
};

type TipoGrafico = "mensal" | "saldo" | "comparativo";

interface GraficoMensalProps {
  dados: Record<string | number, number>;
  tipo?: TipoGrafico;
}

export default function GraficoMensal({
  dados,
  tipo = "mensal",
}: GraficoMensalProps) {
  // 🚫 SEM DADOS
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

  // 🔥 NORMALIZA
  const dadosFiltrados = Object.entries(dados)
    .map(([chave, valor]) => [String(chave), Number(valor)] as const)
    .filter(([, valor]) => valor !== 0);

  if (dadosFiltrados.length === 0) {
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

  const labels =
    tipo === "mensal" || tipo === "saldo"
      ? dadosFiltrados.map(([chave]) => {
          const numeroMes = Number(chave);

          // 🔒 se vier número → converte para nome
          if (!isNaN(numeroMes)) {
            return NOMES_MESES[numeroMes];
          }

          // 🔒 se já vier "Jan", "Fev", etc → usa direto
          return chave;
        })
      : dadosFiltrados.map(([label]) => label);

  const valores = dadosFiltrados.map(([, valor]) => Math.abs(valor));

  // 🎨 DEFINIÇÃO CLARA DAS CORES
  const backgroundColor =
  tipo === "mensal" || tipo === "saldo"
    ? dadosFiltrados.map(([mes]) => CORES_MESES[Number(mes)])
    : dadosFiltrados.map(([label]) => getCorComparativo(label));

  const data = {
    labels,
    datasets: [
      {
        data: valores,
        backgroundColor,
      },
    ],
  };

  const options = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        position: "bottom" as const,
        labels: {
          color: "#e5e7eb", // 🔥 texto visível
          boxWidth: 14,
          padding: 16,
          generateLabels: (chart: any) => {
            const data = chart.data;
            return data.labels.map((label: string, i: number) => {
              const valor = data.datasets[0].data[i];

              return {
                text: `${label} — ${valor.toLocaleString("pt-BR", {
                  style: "currency",
                  currency: "BRL",
                })}`,
                fillStyle: data.datasets[0].backgroundColor[i],
                strokeStyle: data.datasets[0].backgroundColor[i],
                lineWidth: 1,
                index: i,
                fontColor: "#e5e7eb", // 🔥 ESSENCIAL
              };
            });
          },
        },
      },
      tooltip: {
        callbacks: {
          label: (context: any) => {
            const valor = context.raw ?? 0;
            return `${context.label} — ${valor.toLocaleString("pt-BR", {
              style: "currency",
              currency: "BRL",
            })}`;
          },
        },
      },
    },
  };

  return (
    <div style={{ height: 340, width: "100%", position: "relative" }}>
      <Pie data={data} options={options} />
    </div>
  );
}
