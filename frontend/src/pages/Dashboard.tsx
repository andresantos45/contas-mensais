import { useEffect, useState } from "react";
import * as XLSX from "xlsx";
import jsPDF from "jspdf";
import autoTable from "jspdf-autotable";
import GraficoMensal from "../components/Graficos/GraficoMensal";
import GraficoCategoria from "../components/Graficos/GraficoCategoria";
import api from "../services/api";
import { useNavigate } from "react-router-dom";
import DashboardHeader from "../components/Dashboard/DashboardHeader";
import DashboardCards from "../components/Dashboard/DashboardCards.tsx";
import DashboardFiltros from "../components/Dashboard/DashboardFiltros.tsx";
import ListaContas from "../components/Dashboard/ListaContas.tsx";
import FormConta from "../components/Dashboard/FormConta.tsx";
import GestaoCategorias from "../components/Dashboard/GestaoCategorias.tsx";

export default function Dashboard() {
   const navigate = useNavigate();

  function handleLogout() {
    localStorage.removeItem("token");
    navigate("/login", { replace: true });
  }
  const [modoEscuro, setModoEscuro] = useState(true);
  const [contas, setContas] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);
  const [mesBusca, setMesBusca] = useState(1);
  const [anoBusca, setAnoBusca] = useState(2025);
  const [totalPeriodoAnterior, setTotalPeriodoAnterior] = useState(0);
  const [exportando, setExportando] = useState<null | "excel" | "pdf">(null);
  const [categoriaFiltro, setCategoriaFiltro] = useState<string>("todas");
  const [valorMin, setValorMin] = useState<string>("");
  const [valorMax, setValorMax] = useState<string>("");
  const [categorias, setCategorias] = useState<any[]>([]);
  const [novaCategoria, setNovaCategoria] = useState("");
  const [contaEditando, setContaEditando] = useState<any | null>(null);
  const [salvandoConta, setSalvandoConta] = useState(false);
  const [mostrarCategorias, setMostrarCategorias] = useState(false);

 // =======================
// FORMULÁRIO – NOVA CONTA
// =======================
const [descricao, setDescricao] = useState("");
const [valor, setValor] = useState("");
const [data, setData] = useState("");
const [categoriaId, setCategoriaId] = useState("");

async function carregarContasPeriodo() {
  const response = await api.get(
    `/api/contas/${mesBusca}/${anoBusca}`
  );
  setContas(response.data);
}

async function carregarCategorias() {
  const response = await api.get("/api/categorias");
  setCategorias(
    response.data.sort(
      (a: any, b: any) => a.nome.localeCompare(b.nome)
    )
  );
}

  useEffect(() => {
  let ativo = true;

  async function carregarTudo() {
    try {
      setLoading(true);

      await Promise.all([
        carregarContasPeriodo(),
        carregarCategorias(),
        carregarPeriodoAnterior()
      ]);
    } catch (erro: any) {
      if (erro.code === "ERR_NETWORK") {
        alert("Servidor indisponível no momento. Tente novamente mais tarde.");
      } else {
        console.error("Erro ao carregar dados", erro);
      }
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
  const response = await api.get(
  `/api/contas/0/${anoBusca - 1}`
);
const dados = response.data;

  total = dados.reduce(
  (soma: number, c: any) => soma + Number(c.valor),
  0
);
} else {
      // MÊS ESPECÍFICO → MÊS ANTERIOR
      const mesAnterior = mesBusca - 1;
      const anoAnterior = mesAnterior === 0 ? anoBusca - 1 : anoBusca;
      const mesFinal = mesAnterior === 0 ? 12 : mesAnterior;

      const response = await api.get(
  `/api/contas/${mesFinal}/${anoAnterior}`
);
const dados = response.data;

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
  textoSuave: modoEscuro ? "#94a3b8" : "#4b5563",
  borda: modoEscuro ? "#334155" : "#d1d5db",
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
  (soma: number, c: any) => soma + Number(c.valor),
  0
);

const diferenca = totalPeriodo - totalPeriodoAnterior;

const percentual =
  totalPeriodoAnterior > 0
    ? (diferenca / totalPeriodoAnterior) * 100
    : null;

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
    if (!c.mes || c.mes < 1 || c.mes > 12) return acc; // ✅ proteção
    const nomeMes = nomesMeses[c.mes - 1];
    acc[nomeMes] = (acc[nomeMes] || 0) + Number(c.valor);
    return acc;
  },
  {}
);
// === MAIOR CATEGORIA ===
const totalPorCategoria = contasFiltradas.reduce(
  (acc: Record<string, number>, c: any) => {
    if (!c.categoriaNome) return acc; // ✅ proteção
    acc[c.categoriaNome] =
      (acc[c.categoriaNome] || 0) + Number(c.valor);
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
  if (contasFiltradas.length === 0) {
    alert("Nenhum dado para exportar");
    return;
  }

  try {
    setExportando("excel");

    const workbook = XLSX.utils.book_new();

    const nomesMeses = [
      "Jan", "Fev", "Mar", "Abr", "Mai", "Jun",
      "Jul", "Ago", "Set", "Out", "Nov", "Dez"
    ];

    // agrupa contas por mês
    const contasPorMes: Record<number, any[]> = {};

    contasFiltradas.forEach(c => {
      if (!contasPorMes[c.mes]) {
        contasPorMes[c.mes] = [];
      }

      contasPorMes[c.mes].push({
        Descrição: c.descricao,
        Categoria: c.categoriaNome,
        Valor: c.valor,
        Mês: c.mes,
        Ano: c.ano
      });
    });

    // cria uma aba por mês
    Object.entries(contasPorMes).forEach(([mes, dados]) => {
      const worksheet = XLSX.utils.json_to_sheet(dados);
      const nomeAba = nomesMeses[Number(mes) - 1];

      XLSX.utils.book_append_sheet(
        workbook,
        worksheet,
        nomeAba
      );
    });

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
// EXPORTAÇÃO PARA PDF (7.3)
// =======================
function exportarPDF() {
  if (contasFiltradas.length === 0) {
    alert("Nenhum dado para exportar");
    return;
  }

  const doc = new jsPDF();

  const nomesMeses = [
    "Janeiro", "Fevereiro", "Março", "Abril", "Maio", "Junho",
    "Julho", "Agosto", "Setembro", "Outubro", "Novembro", "Dezembro"
  ];

  let y = 20;

  doc.setFontSize(18);
  doc.text("Relatório de Contas Mensais", 14, y);
  y += 10;

  // 🔹 ANO INTEIRO → UM BLOCO POR MÊS
  if (mesBusca === 0) {
    for (let mes = 1; mes <= 12; mes++) {
      const contasDoMes = contasFiltradas.filter(c => c.mes === mes);
      if (contasDoMes.length === 0) continue;

      doc.setFontSize(14);
      doc.text(`${nomesMeses[mes - 1]} / ${anoBusca}`, 14, y);
      y += 6;

      const linhas = contasDoMes.map((c: any) => [
        c.descricao,
        c.categoriaNome,
        c.valor.toLocaleString("pt-BR", {
          style: "currency",
          currency: "BRL"
        })
      ]);

      autoTable(doc, {
        startY: y,
        head: [["Descrição", "Categoria", "Valor"]],
        body: linhas,
        styles: { fontSize: 10 },
        headStyles: { fillColor: [34, 197, 94] }
      });

      y = (doc as any).lastAutoTable.finalY + 10;

      if (y > 260) {
        doc.addPage();
        y = 20;
      }
    }

    doc.save(`contas_${anoBusca}.pdf`);
  }

  // 🔹 MÊS ÚNICO
  else {
    doc.setFontSize(14);
    doc.text(
      `${nomesMeses[mesBusca - 1]} / ${anoBusca}`,
      14,
      y
    );
    y += 6;

    const linhas = contasFiltradas.map((c: any) => [
      c.descricao,
      c.categoriaNome,
      c.valor.toLocaleString("pt-BR", {
        style: "currency",
        currency: "BRL"
      })
    ]);

    autoTable(doc, {
      startY: y,
      head: [["Descrição", "Categoria", "Valor"]],
      body: linhas,
      styles: { fontSize: 10 },
      headStyles: { fillColor: [99, 102, 241] }
    });

    doc.save(
      `contas_${nomesMeses[mesBusca - 1]}_${anoBusca}.pdf`
    );
  }
}

// =======================
// CRIAR CONTA
// =======================
// =======================
// CRIAR / EDITAR CONTA
// =======================
async function criarConta(e: React.FormEvent) {
  e.preventDefault();

  if (!descricao || !valor || !data || !categoriaId) {
    alert("Preencha todos os campos");
    return;
  }

  try {
    setSalvandoConta(true);

    const dataObj = new Date(data);

    if (isNaN(dataObj.getTime())) {
      alert("Data inválida");
      return;
    }

    if (contaEditando) {
      // ✏️ EDITAR CONTA
      await api.put(`/api/contas/${contaEditando.id}`, {
        descricao,
        valor: Number(valor),
        data: dataObj,
        categoriaId: Number(categoriaId),
      });

      setContaEditando(null);
    } else {
      // ➕ CRIAR CONTA
      await api.post("/api/contas", {
        descricao,
        valor: Number(valor),
        data: dataObj,
        categoriaId: Number(categoriaId),
      });
    }

    // limpa formulário
    setDescricao("");
    setValor("");
    setData("");
    setCategoriaId("");

    // recarrega contas do período
    const response = await api.get(
      `/api/contas/${mesBusca}/${anoBusca}`
    );
    setContas(response.data);

    await carregarPeriodoAnterior();
  } catch (error) {
    console.error(error);
    alert("Erro ao salvar conta");
  } finally {
    setSalvandoConta(false);
  }
}



// =======================
// CRIAR CATEGORIA
// =======================
async function criarCategoria(e: React.FormEvent) {
  e.preventDefault();

  if (!novaCategoria.trim()) {
    alert("Informe o nome da categoria");
    return;
  }

  // 🚫 evita categoria duplicada
  if (
    categorias.some(
      (c: any) => c.nome.toLowerCase() === novaCategoria.toLowerCase()
    )
  ) {
    alert("Categoria já existe");
    return;
  }

  try {
    const response = await api.post("/api/categorias", {
      nome: novaCategoria
    });

    const recarregar = await api.get("/api/categorias");

setCategorias(
  recarregar.data.sort(
    (a: any, b: any) => a.nome.localeCompare(b.nome)
  )
);

     setNovaCategoria("");
  } catch (error) {
    console.error(error);
    alert("Erro ao criar categoria");
  }
}
// =======================
// EXCLUIR CONTA
// =======================
async function excluirConta(id: number) {
  if (!window.confirm("Deseja excluir esta conta?")) return;

  try {
    await api.delete(`/api/contas/${id}`);

    setContas(contas.filter(c => c.id !== id));
    await carregarPeriodoAnterior();
  } catch (error) {
    console.error(error);
    alert("Erro ao excluir conta");
  }
}
async function excluirCategoria(id: number) {
  const emUso = contas.some(c => c.categoriaId === id);

  if (emUso) {
    alert("Esta categoria está vinculada a uma conta e não pode ser excluída.");
    return;
  }

  if (!window.confirm("Deseja excluir esta categoria?")) return;

  try {
    await api.delete(`/api/categorias/${id}`);
    setCategorias(categorias.filter(c => c.id !== id));
  } catch (error) {
    console.error(error);
    alert("Erro ao excluir categoria");
  }
}
// =======================
// INICIAR EDIÇÃO
// =======================
function iniciarEdicao(conta: any) {
  setContaEditando(conta);

  setDescricao(conta.descricao);
  setValor(String(conta.valor));

  // monta data no formato YYYY-MM-DD
  if (conta.data) {
  setData(conta.data.slice(0, 10));
} else {
  const mes = String(conta.mes).padStart(2, "0");
  setData(`${conta.ano}-${mes}-01`);
}

  setCategoriaId(String(conta.categoriaId ?? ""));
}
  return (
  <div
    style={{
      minHeight: "100vh",
      background: cores.fundo,
      padding: "20px"
    }}
  >
    <div
  className={modoEscuro ? "dashboard dark" : "dashboard"}
  style={{
    maxWidth: "1200px",
    margin: "0 auto",
    background: cores.card,
    borderRadius: 16,
    padding: 24,
    color: cores.texto
  }}
>
      <DashboardHeader
  textoPeriodo={textoPeriodo}
  cores={cores}
  exportando={exportando}
  exportarExcel={exportarExcel}
  exportarPDF={exportarPDF}
  setMostrarCategorias={setMostrarCategorias}
/>
      {loading && (
  <p>
    Atualizando dados...
  </p>
)}
      
     
  <FormConta
  descricao={descricao}
  setDescricao={setDescricao}
  valor={valor}
  setValor={setValor}
  data={data}
  setData={setData}
  categoriaId={categoriaId}
  setCategoriaId={setCategoriaId}
  categorias={categorias}
  contaEditando={contaEditando}
  salvandoConta={salvandoConta}
  criarConta={criarConta}
  cores={cores}
  cancelarEdicao={() => {
    setContaEditando(null);
    setDescricao("");
    setValor("");
    setData("");
    setCategoriaId("");
  }}
/>
  
<GestaoCategorias
  mostrar={mostrarCategorias}
  modoEscuro={modoEscuro}
  setModoEscuro={setModoEscuro}
  cores={cores}
  novaCategoria={novaCategoria}
  setNovaCategoria={setNovaCategoria}
  criarCategoria={criarCategoria}
  handleLogout={handleLogout}
/>

 <DashboardCards
  mesBusca={mesBusca}
  totalPeriodo={totalPeriodo}
  mediaMensal={mediaMensal}
  tendencia={tendencia}
  diferenca={diferenca}
  percentual={percentual}
  tipo={tipo}
  nomeCategoriaMaior={nomeCategoriaMaior}
  valorCategoriaMaior={valorCategoriaMaior}
/>
<DashboardFiltros
  mesBusca={mesBusca}
  setMesBusca={setMesBusca}
  anoBusca={anoBusca}
  setAnoBusca={setAnoBusca}
/>

<ListaContas
  contas={contasFiltradas}
  cores={cores}
  iniciarEdicao={iniciarEdicao}
  excluirConta={excluirConta}
/> 

{/* GRÁFICOS — SEMPRE VISÍVEIS */}
<div
  style={{
    display: "grid",
    gridTemplateColumns: "repeat(auto-fit, minmax(280px, 1fr))",
    gap: 24,
    marginTop: 32,
  }}
>
  {/* PIZZA — POR MÊS */}
  <div
    style={{
      background: cores.card,
      borderRadius: 16,
      padding: 16,
      border: `1px solid ${cores.borda}`,
    }}
  >
    <h3 style={{ marginBottom: 12 }}>📅 Gastos por mês</h3>
    <GraficoMensal dados={totalPorMes} />
  </div>

  {/* PIZZA — POR CATEGORIA */}
  <div
    style={{
      background: cores.card,
      borderRadius: 16,
      padding: 16,
      border: `1px solid ${cores.borda}`,
    }}
  >
    <h3 style={{ marginBottom: 12 }}>🗂️ Gastos por categoria</h3>
    <GraficoCategoria dados={totalPorCategoria} />
     </div>
  </div>

    </div>
  </div>
);
}