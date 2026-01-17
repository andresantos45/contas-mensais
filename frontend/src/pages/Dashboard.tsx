import { useEffect, useState } from "react";
import * as XLSX from "xlsx";
import jsPDF from "jspdf";
import autoTable from "jspdf-autotable";
import GraficoMensal from "../components/Graficos/GraficoMensal";
import GraficoCategoria from "../components/Graficos/GraficoCategoria";
import api from "../services/api";
import { useNavigate } from "react-router-dom";
import DashboardCard from "../components/Dashboard/DashboardCard";

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
  const [tipoGrafico, setTipoGrafico] = useState<"mes" | "categoria">("mes");
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

  useEffect(() => {
  let ativo = true;

  async function carregarTudo() {
    setLoading(true);

    try {
      // período atual
      const responseAtual = await api.get(
  `/api/contas/${mesBusca}/${anoBusca}`
);

const responseCategorias = await api.get("/api/categorias");


setCategorias(
  [...responseCategorias.data].sort(
    (a: any, b: any) => a.nome.localeCompare(b.nome)
  )
);

if (ativo) {
  setContas(responseAtual.data);
}


      // período anterior
      await carregarPeriodoAnterior();
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
    (soma: number, c: any) => soma + c.valor,
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
  const mes = String(conta.mes).padStart(2, "0");
  setData(`${conta.ano}-${mes}-01`);

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
      {/* HEADER DO DASHBOARD */}
<div
  style={{
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
    gap: 16,
    marginBottom: 24,
    flexWrap: "wrap",
  }}
>
  {/* ESQUERDA — TÍTULO */}
  <div>
    <h1 style={{ fontSize: 28, fontWeight: 700, margin: 0 }}>
      Contas Mensais
    </h1>
    <p style={{ opacity: 0.65, marginTop: 4 }}>
      {textoPeriodo}
    </p>
  </div>

  {/* DIREITA — AÇÕES */}
  <div style={{ display: "flex", gap: 12 }}>
    <button
      onClick={() => setModoEscuro(!modoEscuro)}
      style={{
        background: cores.card,
        color: cores.texto,
        border: "1px solid #334155",
        padding: "8px 14px",
        borderRadius: 8,
        cursor: "pointer",
        fontWeight: 600,
      }}
    >
      🌓 Tema
    </button>

    <button
      onClick={handleLogout}
      style={{
        background: "#dc2626",
        color: "#fff",
        border: "none",
        padding: "8px 14px",
        borderRadius: 8,
        cursor: "pointer",
        fontWeight: 600,
      }}
    >
      🚪 Sair
    </button>
  </div>
</div>
      {loading && (
  <p>
    Atualizando dados...
  </p>
)}
      {/* CONTROLES SUPERIORES */}
<div
  className="dashboard-controls"
  style={{
    display: "flex",
    flexWrap: "wrap",
    gap: 12,
    marginTop: 20,
    marginBottom: 24,
  }}
>
  <select
  value={mesBusca}
  onChange={e => setMesBusca(Number(e.target.value))}
>
  <option value={0}>Ano inteiro</option>

  {[
    "Janeiro",
    "Fevereiro",
    "Março",
    "Abril",
    "Maio",
    "Junho",
    "Julho",
    "Agosto",
    "Setembro",
    "Outubro",
    "Novembro",
    "Dezembro"
  ].map((nome, index) => (
    <option key={index + 1} value={index + 1}>
      {nome}
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
<div
  className="export-buttons"
  style={{
    display: "flex",
    gap: 12,
    marginBottom: 24,
    flexWrap: "wrap",
  }}
>
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
{/* FORMULÁRIO — CRIAR CONTA */}
<form
  onSubmit={criarConta}
  style={{
    display: "grid",
    gridTemplateColumns: "repeat(4, minmax(180px, 1fr)) auto",
    gap: 12,
    marginTop: 20,
    alignItems: "end"
  }}
>
  <div>
  <label
    style={{
      color: cores.textoSuave,
      fontSize: 13,
      marginBottom: 4,
      display: "block"
    }}
  >
    Descrição
  </label>

  <input
    value={descricao}
    onChange={e => setDescricao(e.target.value)}
    required
    style={{
      background: cores.card,
      color: cores.texto,
      border: `1px solid ${cores.borda}`,
      borderRadius: 8,
      padding: "8px 10px"
    }}
  />
</div>

  <div>
  <label style={{ color: cores.textoSuave, fontSize: 13, marginBottom: 4, display: "block" }}>
    Valor
  </label>

  <input
    type="number"
    value={valor}
    onChange={e => setValor(e.target.value)}
    required
    style={{
      background: cores.card,
      color: cores.texto,
      border: `1px solid ${cores.borda}`,
      borderRadius: 8,
      padding: "8px 10px"
    }}
  />
</div>

  <div>
  <label style={{ color: cores.textoSuave, fontSize: 13, marginBottom: 4, display: "block" }}>
    Data
  </label>

  <input
    type="date"
    value={data}
    onChange={e => setData(e.target.value)}
    required
    style={{
      background: cores.card,
      color: cores.texto,
      border: `1px solid ${cores.borda}`,
      borderRadius: 8,
      padding: "8px 10px"
    }}
  />
</div>

  <div>
  <label
    style={{
      color: cores.textoSuave,
      fontSize: 13,
      marginBottom: 4,
      display: "block"
    }}
  >
    Categoria
  </label>

  <select
    value={categoriaId}
    onChange={e => setCategoriaId(e.target.value)}
    required
    style={{
      background: cores.card,
      color: cores.texto,
      border: `1px solid ${cores.borda}`,
      borderRadius: 8,
      padding: "8px 10px"
    }}
  >
    <option value="">Selecione</option>

    {categorias.length === 0 && (
      <option value="" disabled>
        Nenhuma categoria cadastrada
      </option>
    )}

    {categorias.map(cat => (
      <option key={cat.id} value={cat.id}>
        {cat.nome}
      </option>
    ))}
  </select>
</div>

  <button
  type="submit"
  disabled={salvandoConta}
  style={{
    height: 40,
    background: salvandoConta ? "#64748b" : cores.botao,
    color: "#fff",
    border: "none",
    borderRadius: 8,
    cursor: salvandoConta ? "not-allowed" : "pointer",
    fontWeight: 600,
  }}
>
  {salvandoConta
    ? "⏳ Salvando..."
    : contaEditando
    ? "💾 Salvar edição"
    : "➕ Adicionar"}
</button>
{contaEditando && (
  <button
    type="button"
    onClick={() => {
      setContaEditando(null);
      setDescricao("");
      setValor("");
      setData("");
      setCategoriaId("");
    }}
    style={{ height: 40 }}
  >
    ❌ Cancelar
  </button>
)}
</form>

<button
  type="button"
  onClick={() => setMostrarCategorias(!mostrarCategorias)}
  style={{
    marginTop: 16,
    background: "#334155",
    color: "#fff",
    border: "none",
    padding: "8px 14px",
    borderRadius: 8,
    cursor: "pointer",
    fontWeight: 600,
  }}
>
  {mostrarCategorias ? "🔽 Ocultar categorias" : "⚙️ Gerenciar categorias"}
</button>

{mostrarCategorias && (
  <>
    {/* FORMULÁRIO — CRIAR CATEGORIA */}
    <form
      onSubmit={criarCategoria}
      style={{
        display: "flex",
        gap: 12,
        marginTop: 12,
        alignItems: "end",
      }}
    >
      <div>
  <label
    style={{
      color: cores.textoSuave,
      fontSize: 13,
      marginBottom: 4,
      display: "block"
    }}
  >
    Nova categoria
  </label>

  <input
    value={novaCategoria}
    onChange={e => setNovaCategoria(e.target.value)}
    placeholder="Ex: Alimentação"
    required
    style={{
      background: cores.card,
      color: cores.texto,
      border: `1px solid ${cores.borda}`,
      borderRadius: 8,
      padding: "8px 10px"
    }}
  />
</div>

      <button type="submit" style={{ height: 40 }}>
        ➕ Criar categoria
      </button>
    </form>
  </>
)}

 {/* GRID DE CARDS */}
<div
  style={{
    display: "grid",
    gridTemplateColumns: "repeat(auto-fit, minmax(260px, 1fr))",
    gap: 16,
    marginTop: 24,
  }}
>
  <DashboardCard
    titulo="Total do período"
    valorPrincipal={totalPeriodo.toLocaleString("pt-BR", {
      style: "currency",
      currency: "BRL",
    })}
  />

  <DashboardCard
    titulo={mesBusca === 0 ? "Média mensal do ano" : "Valor do mês"}
    valorPrincipal={mediaMensal.toLocaleString("pt-BR", {
      style: "currency",
      currency: "BRL",
    })}
    subtitulo={
      mesBusca === 0
        ? "cálculo baseado no ano inteiro"
        : "referente ao mês selecionado"
    }
  />

  <DashboardCard
    titulo="Comparação com período anterior"
    valorPrincipal={`${tendencia} ${diferenca.toLocaleString("pt-BR", {
      style: "currency",
      currency: "BRL",
    })}`}
    subtitulo={`${percentual.toFixed(1)}%`}
    corBorda={
      tipo === "alta"
        ? "#16a34a"
        : tipo === "queda"
        ? "#dc2626"
        : "#334155"
    }
  />

  <DashboardCard
    titulo="Categoria com maior gasto"
    valorPrincipal={nomeCategoriaMaior}
    subtitulo={valorCategoriaMaior.toLocaleString("pt-BR", {
      style: "currency",
      currency: "BRL",
    })}
    corBorda="#0ea5e9"
  />
</div>
{/* LISTA DE CONTAS */}
<div style={{ marginTop: 32 }}>
  <h2>Contas do período</h2>

  {contasFiltradas.length === 0 && (
    <p>Nenhuma conta cadastrada.</p>
  )}

  {contasFiltradas.map(conta => (
    <div
      key={conta.id}
      style={{
        display: "grid",
        gridTemplateColumns: "2fr 1fr 1fr 1fr auto auto",
        gap: 12,
        alignItems: "center",
        padding: "14px 8px",
borderBottom: "1px solid #334155",
fontSize: 14

      }}
    >
      <div style={{ fontWeight: 500 }}>
  {conta.descricao}
</div>

<div style={{ color: cores.textoSuave }}>
  {conta.categoriaNome}
</div>

<div style={{ fontWeight: 500 }}>
  {conta.valor.toLocaleString("pt-BR", {
    style: "currency",
    currency: "BRL"
  })}
</div>

<div style={{ color: cores.textoSuave }}>
  {conta.mes}/{conta.ano}
</div>

      <button onClick={() => iniciarEdicao(conta)}>
        ✏️
      </button>

      <button onClick={() => excluirConta(conta.id)}>
        ❌
      </button>
    </div>
  ))}
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
  </div>
);
}