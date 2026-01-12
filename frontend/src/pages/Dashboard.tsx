import { useEffect, useState } from "react";
import * as XLSX from "xlsx";
import jsPDF from "jspdf";
import autoTable from "jspdf-autotable";
import GraficoMensal from "../components/Graficos/GraficoMensal";
import GraficoCategoria from "../components/Graficos/GraficoCategoria";

export default function Dashboard() {
  const [modoEscuro, setModoEscuro] = useState(true);
  const [contas, setContas] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);
  const [mesBusca, setMesBusca] = useState(1);
  const [anoBusca, setAnoBusca] = useState(2026);
  const [totalPeriodoAnterior, setTotalPeriodoAnterior] = useState(0);
  const [tipoGrafico, setTipoGrafico] =
  useState<"mes" | "categoria">("mes");
  const [exportando, setExportando] = useState<null | "excel" | "pdf">(null);
  const [categoriaFiltro, setCategoriaFiltro] = useState<string>("todas");
  const [valorMin, setValorMin] = useState<string>("");
  const [valorMax, setValorMax] = useState<string>("");

  const API_URL = import.meta.env.VITE_API_URL;

  useEffect(() => {
  let ativo = true;

  async function carregarTudo() {
    setLoading(true);

    try {
      // período atual
      const responseAtual = await fetch(
  `${API_URL}/contas/${mesBusca}/${anoBusca}`
);
const dadosAtual = await responseAtual.json();

if (ativo) setContas(dadosAtual);

      // período anterior
      await carregarPeriodoAnterior();
    } catch (erro) {
      console.error("Erro ao carregar dados", erro);
    } finally {
      if (ativo) setLoading(false);
    }
  }

  carregarTudo();

  return () => {
    ativo = false;
  };
}, [mesBusca, anoBusca]);
async function carregarPeriodoAnterior() {
  let total = 0;

  try {
    if (mesBusca === 0) {
  const response = await fetch(
  `${API_URL}/contas/0/${anoBusca - 1}`
);
  const dados = await response.json();

  total = dados.reduce(
    (soma: number, c: any) => soma + c.valor,
    0
  );
} else {
      // MÊS ESPECÍFICO → MÊS ANTERIOR
      const mesAnterior = mesBusca - 1;
      const anoAnterior = mesAnterior === 0 ? anoBusca - 1 : anoBusca;
      const mesFinal = mesAnterior === 0 ? 12 : mesAnterior;

      const response = await fetch(
  `${API_URL}/contas/${mesFinal}/${anoAnterior}`
);
      const dados = await response.json();

      total = dados.reduce(
        (soma: number, c: any) => soma + c.valor,
        0
      );
    }
  } catch (erro) {
    console.error("Erro ao carregar período anterior", erro);
  }

  setTotalPeriodoAnterior(total);
}
  const cores = {
    fundo: modoEscuro ? "#0f172a" : "#f3f4f6",
    card: modoEscuro ? "#020617" : "#ffffff",
    texto: modoEscuro ? "#e5e7eb" : "#111827",
    botao: modoEscuro ? "#22c55e" : "#2563eb"
  };
  const categoriasDisponiveis = Array.from(
  new Set(contas.map(c => c.categoriaNome).filter(Boolean))
);
const contasFiltradas = contas.filter(c => {
  if (categoriaFiltro !== "todas" && c.categoriaNome !== categoriaFiltro) {
    return false;
  }

  if (valorMin && c.valor < Number(valorMin)) {
    return false;
  }

  if (valorMax && c.valor > Number(valorMax)) {
    return false;
  }

  return true;
});
const totalPeriodo = contasFiltradas.reduce(
  (soma: number, c: any) => soma + c.valor,
  0
);

const diferenca = totalPeriodo - totalPeriodoAnterior;

const percentual =
  totalPeriodoAnterior === 0
    ? 0
    : (diferenca / totalPeriodoAnterior) * 100;

const tipo =
  diferenca > 0 ? "alta" : diferenca < 0 ? "queda" : "neutro";

const tendencia =
  tipo === "alta" ? "↑" : tipo === "queda" ? "↓" : "→";
  const divisorMedia = mesBusca === 0 ? 12 : 1;

const mediaMensal = totalPeriodo / divisorMedia;
const textoPeriodo =
  mesBusca === 0
    ? `Ano ${anoBusca}`
    : `Mês ${mesBusca}/${anoBusca}`;
// === TOTAL POR MÊS ===
const nomesMeses = [
  "Jan", "Fev", "Mar", "Abr", "Mai", "Jun",
  "Jul", "Ago", "Set", "Out", "Nov", "Dez"
];

const totalPorMes = contasFiltradas.reduce(
  (acc: Record<string, number>, c: any) => {
    const nomeMes = nomesMeses[c.mes - 1];
    acc[nomeMes] = (acc[nomeMes] || 0) + c.valor;
    return acc;
  },
  {}
);
// === MAIOR CATEGORIA ===
const totalPorCategoria = contasFiltradas.reduce(
  (acc: Record<string, number>, c: any) => {
    acc[c.categoriaNome] = (acc[c.categoriaNome] || 0) + c.valor;
    return acc;
  },
  {}
);

const categoriaMaior = Object.entries(totalPorCategoria).sort(
  (a, b) => b[1] - a[1]
)[0];

const nomeCategoriaMaior = categoriaMaior?.[0] ?? "—";
const valorCategoriaMaior = categoriaMaior?.[1] ?? 0;

// =======================
// EXPORTAÇÃO PARA EXCEL
// =======================
async function exportarExcel() {
  if (contas.length === 0) {
    alert("Nenhum dado para exportar");
    return;
  }

  try {
    setExportando("excel");

    const dadosExcel = contasFiltradas.map((c: any) => ({
      Descrição: c.descricao,
      Categoria: c.categoriaNome,
      Valor: c.valor,
      Mês: c.mes,
      Ano: c.ano
    }));

    const worksheet = XLSX.utils.json_to_sheet(dadosExcel);
    const workbook = XLSX.utils.book_new();

    XLSX.utils.book_append_sheet(workbook, worksheet, "Contas");

    XLSX.writeFile(
  workbook,
  mesBusca === 0
    ? `contas_ano_${anoBusca}.xlsx`
    : `contas_${mesBusca}_${anoBusca}.xlsx`
);
  } finally {
    setExportando(null);
  }
}
// =======================
// EXPORTAÇÃO PARA PDF
// =======================
function exportarPDF() {
  if (contas.length === 0) {
    alert("Nenhum dado para exportar");
    return;
  }

  const doc = new jsPDF();

  doc.setFontSize(16);
  doc.text("Relatório de Contas Mensais", 14, 20);

  doc.setFontSize(11);
  doc.text(
  `Período: ${textoPeriodo}`,
  14,
  28
);

  const linhas = contasFiltradas.map((c: any) => [
    c.descricao,
    c.categoriaNome,
    c.valor.toLocaleString("pt-BR", {
      style: "currency",
      currency: "BRL"
    }),
    `${c.mes}/${c.ano}`
  ]);

  autoTable(doc, {
    startY: 35,
    head: [["Descrição", "Categoria", "Valor", "Mês/Ano"]],
    body: linhas,
    styles: {
      fontSize: 10
    },
    headStyles: {
      fillColor: [34, 197, 94]
    }
  });

  doc.save(
  mesBusca === 0
    ? `contas_ano_${anoBusca}.pdf`
    : `contas_${mesBusca}_${anoBusca}.pdf`
);
}
  return (
    <div className={modoEscuro ? "dashboard dark" : "dashboard"}>
      <h1>Dashboard</h1>
      <p style={{ opacity: 0.6 }}>
  {textoPeriodo}
</p>
      {loading && (
  <p>
    Atualizando dados...
  </p>
)}
      {/* CONTROLES SUPERIORES */}
<div className="dashboard-controls">
  <select
  value={mesBusca}
  onChange={e => setMesBusca(Number(e.target.value))}
>
  <option value={0}>Ano inteiro</option>

  {[1,2,3,4,5,6,7,8,9,10,11,12].map(m => (
    <option key={m} value={m}>
      Mês {m}
    </option>
  ))}
</select>

  <input
    type="number"
    value={anoBusca}
    onChange={e => setAnoBusca(Number(e.target.value))}
    style={{ width: 90 }}
  />

  <button
  className="btn btn-theme"
  onClick={() => setModoEscuro(!modoEscuro)}
>
  Tema alternativo
</button>

  <button
    onClick={() => setTipoGrafico("mes")}
    style={{
      background: tipoGrafico === "mes" ? "#22c55e" : cores.card,
      color: tipoGrafico === "mes" ? "#fff" : cores.texto,
      borderRadius: 999,
      padding: "8px 14px",
      border: "none",
      fontWeight: 600
    }}
  >
    📅 Por mês
  </button>

  <button
    onClick={() => setTipoGrafico("categoria")}
    style={{
      background: tipoGrafico === "categoria" ? "#6366f1" : cores.card,
      color: tipoGrafico === "categoria" ? "#fff" : cores.texto,
      borderRadius: 999,
      padding: "8px 14px",
      border: "none",
      fontWeight: 600
    }}
  >
    🗂️ Por categoria
  </button>
</div>
{/* BOTÕES DE EXPORTAÇÃO */}
<div className="export-buttons">
  <button
    onClick={exportarExcel}
    disabled={exportando === "excel"}
    style={{
      background: exportando === "excel" ? "#64748b" : "#16a34a",
      color: "#fff",
      padding: "10px 16px",
      border: "none",
      borderRadius: 8,
      cursor: exportando === "excel" ? "not-allowed" : "pointer",
      fontWeight: 600
    }}
  >
    {exportando === "excel"
      ? "⏳ Exportando..."
      : "⬇️ Exportar Excel"}
  </button>

  <button
    onClick={exportarPDF}
    disabled={exportando !== null}
    style={{
      background: "#dc2626",
      color: "#fff",
      padding: "10px 16px",
      border: "none",
      borderRadius: 8,
      cursor: exportando ? "not-allowed" : "pointer",
      fontWeight: 600,
      opacity: exportando ? 0.6 : 1
    }}
  >
    📄 Exportar PDF
  </button>
</div>

 {/* GRID DE CARDS */}
<div className="cards-grid">
      {/* CARD – TOTAL DO PERÍODO */}
<div
  style={{
    background: cores.card,
    padding: 20,
    borderRadius: 16,
    marginTop: 16,
    maxWidth: 320,
    border: "1px solid #64748b"
  }}
>
  <div style={{ fontSize: 14, opacity: 0.7 }}>
    Total do período
  </div>

  <div style={{ fontSize: 28, fontWeight: 700, marginTop: 8 }}>
    {totalPeriodo.toLocaleString("pt-BR", {
      style: "currency",
      currency: "BRL"
    })}
  </div>
</div>
{/* CARD – MÉDIA MENSAL */}
<div
  style={{
    background: cores.card,
    padding: 20,
    borderRadius: 16,
    marginTop: 16,
    maxWidth: 320,
    border: "1px solid #64748b"
  }}
>
  <div style={{ fontSize: 14, opacity: 0.7 }}>
  {mesBusca === 0 ? "Média mensal do ano" : "Valor do mês"}
</div>

  <div style={{ fontSize: 26, fontWeight: 700, marginTop: 6 }}>
    {mediaMensal.toLocaleString("pt-BR", {
      style: "currency",
      currency: "BRL"
    })}
  </div>

  <div style={{ fontSize: 13, opacity: 0.6 }}>
  {mesBusca === 0
    ? "cálculo baseado no ano inteiro"
    : "referente ao mês selecionado"}
</div>
</div>
{/* CARD – COMPARAÇÃO COM PERÍODO ANTERIOR */}
<div
  style={{
    background: cores.card,
    padding: 20,
    borderRadius: 16,
    marginTop: 16,
    maxWidth: 320,
    border:
      tipo === "alta"
        ? "1px solid #16a34a"
        : tipo === "queda"
        ? "1px solid #dc2626"
        : "1px solid #64748b"
  }}
>
  <div style={{ fontSize: 14, opacity: 0.7 }}>
    Comparação com período anterior
  </div>

  <div style={{ fontSize: 26, fontWeight: 700, marginTop: 6 }}>
    {tendencia}{" "}
    {diferenca.toLocaleString("pt-BR", {
      style: "currency",
      currency: "BRL"
    })}
  </div>

  <div style={{ fontSize: 14, opacity: 0.7 }}>
    {percentual.toFixed(1)}%
  </div>
</div>
{/* CARD – MAIOR CATEGORIA */}
<div
  style={{
    background: cores.card,
    padding: 20,
    borderRadius: 16,
    marginTop: 16,
    maxWidth: 320,
    border: "1px solid #0ea5e9"
  }}
>
  <div style={{ fontSize: 14, opacity: 0.7 }}>
    Categoria com maior gasto
  </div>

  <div style={{ fontSize: 22, fontWeight: 700, marginTop: 6 }}>
    {nomeCategoriaMaior}
  </div>

  <div style={{ fontSize: 18, marginTop: 4 }}>
    {valorCategoriaMaior.toLocaleString("pt-BR", {
      style: "currency",
      currency: "BRL"
    })}
  </div>
</div>
</div>

{/* GRÁFICOS USANDO COMPONENTES */}
<div className="graficos-container">
  {tipoGrafico === "mes" && (
    <GraficoMensal dados={totalPorMes} />
  )}

  {tipoGrafico === "categoria" && (
    <GraficoCategoria dados={totalPorCategoria} />
  )}
</div>
      {loading && <p>Carregando dados...</p>}

    </div>
  );
}