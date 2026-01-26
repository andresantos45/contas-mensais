import {
  dashboardContainer,
  dashboardCard,
  sectionTitle,
  gridGraficos,
} from "../components/Dashboard/dashboardStyles";
import { useEffect, useState } from "react";
import * as XLSX from "xlsx";
import jsPDF from "jspdf";
import autoTable from "jspdf-autotable";
import GraficoMensal from "../components/Graficos/GraficoMensal";
import GraficoCategoria from "../components/Graficos/GraficoCategoria";
import api from "../services/api";
import { useNavigate } from "react-router-dom";
import { jwtDecode } from "jwt-decode";
import DashboardHeader from "../components/Dashboard/DashboardHeader";
import DashboardCards from "../components/Dashboard/DashboardCards.tsx";
import ListaContas from "../components/Dashboard/ListaContas.tsx";
import FormConta from "../components/Dashboard/FormConta.tsx";
import FormEntrada from "../components/Entradas/FormEntrada";
import ListaEntradas from "../components/Entradas/ListaEntradas";
import GestaoCategorias from "../components/Dashboard/GestaoCategorias.tsx";
import { calcularDashboard } from "../components/Dashboard/dashboardCalculations";
import { Conta } from "../types/Conta";
import { ContaExcel } from "../types/ContaExcel";
import { Categoria } from "../types/Categoria";
import Toast from "../components/UI/Toast";
import { useIsMobile } from "../hooks/useIsMobile";
import { isContaFutura } from "../utils/isContaFutura";

export default function Dashboard() {
  const navigate = useNavigate();

  function handleLogout() {
    localStorage.removeItem("token");
    navigate("/login", { replace: true });
  }

  function useIsAdmin(): boolean {
    const token = localStorage.getItem("token");
    if (!token) return false;

    try {
      const decoded: any = jwtDecode(token);
      return decoded.role === "admin";
    } catch {
      return false;
    }
  }

  const isAdmin = useIsAdmin();
  const [modoEscuro, setModoEscuro] = useState(true);
  const [contas, setContas] = useState<Conta[]>([]);
  const [loading, setLoading] = useState(false);
  const [mesBusca, setMesBusca] = useState(1);
  const [anoBusca, setAnoBusca] = useState(2025);
  const [totalPeriodoAnterior, setTotalPeriodoAnterior] = useState(0);
  const [exportando, setExportando] = useState<null | "excel" | "pdf">(null);
  const [categorias, setCategorias] = useState<Categoria[]>([]);
  const [novaCategoria, setNovaCategoria] = useState("");
  const [contaEditando, setContaEditando] = useState<Conta | null>(null);
  const [salvandoConta, setSalvandoConta] = useState(false);
  const [mostrarConfigModal, setMostrarConfigModal] = useState(false);
  const isMobile = useIsMobile();
  const [toast, setToast] = useState<{
    mensagem: string;
    tipo?: "sucesso" | "erro";
  } | null>(null);
  const [contaParaExcluir, setContaParaExcluir] = useState<Conta | null>(null);
  const [categoriaParaExcluir, setCategoriaParaExcluir] =
    useState<Categoria | null>(null);
  const [ultimaContaExcluida, setUltimaContaExcluida] = useState<Conta | null>(
    null
  );
  const [timeoutUndo, setTimeoutUndo] = useState<number | null>(null);
  const [mostrarFuturas, setMostrarFuturas] = useState(false);

  // 🔀 MODO DE TELA
  const [modoTela, setModoTela] = useState<"contas" | "entradas">("contas");

  // 🔥 ENTRADAS — STATES
  const [entradas, setEntradas] = useState<any[]>([]);
  const [entradaEditando, setEntradaEditando] = useState<any | null>(null);
  const [salvandoEntrada, setSalvandoEntrada] = useState(false);

  const [descricaoEntrada, setDescricaoEntrada] = useState("");
  const [valorEntrada, setValorEntrada] = useState("");
  const [dataEntrada, setDataEntrada] = useState("");
  const [categoriaEntradaId, setCategoriaEntradaId] = useState("");

  useEffect(() => {
    if (mostrarConfigModal) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "auto";
    }

    return () => {
      document.body.style.overflow = "auto";
    };
  }, [mostrarConfigModal]);

  useEffect(() => {
    function handleKeyDown(event: KeyboardEvent) {
      if (event.key === "Escape") {
        setMostrarConfigModal(false);
      }
    }

    if (mostrarConfigModal) {
      window.addEventListener("keydown", handleKeyDown);
    }

    return () => {
      window.removeEventListener("keydown", handleKeyDown);
    };
  }, [mostrarConfigModal]);

  // =======================
  // FORMULÁRIO – NOVA CONTA
  // =======================
  const [descricao, setDescricao] = useState("");
  const [valor, setValor] = useState("");
  const [data, setData] = useState("");
  const [categoriaId, setCategoriaId] = useState("");
  const [tipo, setTipo] = useState<"entrada" | "saida">("saida");

  async function carregarContasPeriodo() {
    try {
      // 1️⃣ busca normal do período
      const response = await api.get<Conta[]>(
        `/contas/${mesBusca}/${anoBusca}`
      );

      let todasContas = response.data;

      // 2️⃣ se o mês selecionado for futuro, busca também o ano inteiro
      const hoje = new Date();
      const inicioMesSelecionado = new Date(anoBusca, mesBusca - 1, 1);

      if (mesBusca !== 0 && inicioMesSelecionado > hoje) {
        const responseAno = await api.get<Conta[]>(`/contas/0/${anoBusca}`);

        todasContas = responseAno.data;
      }

      setContas(todasContas);
    } catch (error: any) {
      if (error.response?.status === 404) {
        setContas([]);
      } else {
        console.error("Erro ao carregar contas", error);
      }
    }
  }

  async function carregarCategorias() {
    try {
      const response = await api.get<Categoria[]>("/categorias");

      setCategorias(
        response.data.sort((a, b) =>
          a.nome.localeCompare(b.nome, "pt-BR", { sensitivity: "base" })
        )
      );
    } catch (error: any) {
      if (error.response?.status === 404) {
        setCategorias([]); // ✅ nenhuma categoria ainda
      } else {
        console.error("Erro ao carregar categorias", error);
      }
    }
  }

  useEffect(() => {
    let ativo = true;

    async function carregarTudo() {
      try {
        setLoading(true);

        await Promise.all([
          carregarContasPeriodo(),
          carregarCategorias(),
          carregarPeriodoAnterior(),
        ]);
      } catch (erro: any) {
        if (erro.code === "ERR_NETWORK") {
          alert(
            "Servidor indisponível no momento. Tente novamente mais tarde."
          );
        } else {
          console.error("Erro ao carregar dados", erro);
        }
      } finally {
        if (ativo) setLoading(false);
      }
    }

    setMostrarFuturas(false); // 🔒 sempre começa fechado

    carregarTudo();

    return () => {
      ativo = false;
    };
  }, [mesBusca, anoBusca]);

  async function carregarPeriodoAnterior() {
    let total = 0;

    try {
      if (mesBusca === 0) {
        const response = await api.get(`/contas/0/${anoBusca - 1}`);
        const dados = response.data;

        total = dados.reduce((soma: number, c: Conta) => soma + c.valor, 0);
      } else {
        // MÊS ESPECÍFICO → MÊS ANTERIOR
        const mesAnterior = mesBusca - 1;
        const anoAnterior = mesAnterior === 0 ? anoBusca - 1 : anoBusca;
        const mesFinal = mesAnterior === 0 ? 12 : mesAnterior;

        const response = await api.get(`/contas/${mesFinal}/${anoAnterior}`);
        const dados = response.data;

        total = dados.reduce((soma: number, c: Conta) => soma + c.valor, 0);
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
    botao: modoEscuro ? "#22c55e" : "#2563eb",
  };

  const textoPeriodo =
    mesBusca === 0 ? `Ano ${anoBusca}` : `Mês ${mesBusca}/${anoBusca}`;

  // =======================
  // DASHBOARD — CÁLCULOS CENTRALIZADOS
  // =======================

  const contasFiltradas = [...contas]
    .filter((c) => !isContaFutura(c.data ?? ""))
    .sort((a, b) =>
      a.descricao.localeCompare(b.descricao, "pt-BR", {
        sensitivity: "base",
      })
    );

  const contasFuturas = contas
    .filter((c) => isContaFutura(c.data ?? ""))
    .sort((a, b) =>
      a.descricao.localeCompare(b.descricao, "pt-BR", {
        sensitivity: "base",
      })
    );

  const mesSelecionadoEhFuturo = (() => {
    if (mesBusca === 0) return false;

    const hoje = new Date();
    const inicioMesSelecionado = new Date(anoBusca, mesBusca - 1, 1);

    return inicioMesSelecionado > hoje;
  })();

  const contasExibidas = mesSelecionadoEhFuturo
    ? contasFuturas.filter((c) => c.mes === mesBusca && c.ano === anoBusca)
    : mostrarFuturas
      ? contasFuturas
      : contasFiltradas;

  const totalPlanejadoMesSelecionado = mesSelecionadoEhFuturo
    ? contasExibidas.reduce((soma: number, c: Conta) => soma + c.valor, 0)
    : 0;

  const futurasAgrupadasPorMes: Record<string, Conta[]> = {};

  if (mostrarFuturas) {
    contasFuturas.forEach((c) => {
      const chave = `${c.ano}-${String(c.mes).padStart(2, "0")}`;
      if (!futurasAgrupadasPorMes[chave]) {
        futurasAgrupadasPorMes[chave] = [];
      }
      futurasAgrupadasPorMes[chave].push(c);
    });
  }

  const {
    totalPeriodo,
    mediaMensal,
    diferenca,
    percentual,
    tipo: tipoDashboard,
    tendencia,
    totalPorMes,
    totalPorCategoria,
    nomeCategoriaMaior,
    valorCategoriaMaior,
  } = calcularDashboard(
    contasFiltradas,
    mesBusca,
    anoBusca,
    totalPeriodoAnterior
  );

  const totalAnualNormalizado: Record<number, number> = {
    1: 0,
    2: 0,
    3: 0,
    4: 0,
    5: 0,
    6: 0,
    7: 0,
    8: 0,
    9: 0,
    10: 0,
    11: 0,
    12: 0,
  };

  if (mesBusca === 0) {
    contasFiltradas.forEach((c) => {
      totalAnualNormalizado[c.mes] += c.valor;
    });
  }

  const dadosGraficoMensal =
    mesBusca === 0 ? totalAnualNormalizado : totalPorMes;

  const totalFuturoPorMes: Record<number, number> = {};

  contasFuturas.forEach((c) => {
    if (!totalFuturoPorMes[c.mes]) {
      totalFuturoPorMes[c.mes] = 0;
    }

    totalFuturoPorMes[c.mes] += c.valor;
  });

  // =======================
  // EXPORTAÇÃO PARA EXCEL
  // =======================
  async function exportarExcel() {
    if (contasFiltradas.length === 0) {
      setToast({
        mensagem: "Nenhum dado para exportar",
        tipo: "erro",
      });

      return;
    }

    try {
      setExportando("excel");

      const workbook = XLSX.utils.book_new();

      const nomesMeses = [
        "Jan",
        "Fev",
        "Mar",
        "Abr",
        "Mai",
        "Jun",
        "Jul",
        "Ago",
        "Set",
        "Out",
        "Nov",
        "Dez",
      ];

      // agrupa contas por mês
      const contasPorMes: Record<number, ContaExcel[]> = {};

      contasFiltradas.forEach((c) => {
        if (!contasPorMes[c.mes]) {
          contasPorMes[c.mes] = [];
        }

        contasPorMes[c.mes].push({
          Descrição: c.descricao,
          Categoria: c.categoriaNome,
          Valor: c.valor,
          Mês: c.mes,
          Ano: c.ano,
        });
      });

      // cria uma aba por mês
      Object.entries(contasPorMes).forEach(([mes, dados]) => {
        const worksheet = XLSX.utils.json_to_sheet(dados);
        const nomeAba = nomesMeses[Number(mes) - 1];

        XLSX.utils.book_append_sheet(workbook, worksheet, nomeAba);
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
  async function exportarPDF() {
    if (contasFiltradas.length === 0) {
      alert("Nenhum dado para exportar");
      return;
    }

    const doc = new jsPDF();

    let contasAnoInteiro: Conta[] = [];

    if (mesBusca === 0) {
      try {
        const response = await api.get<Conta[]>(`/contas/0/${anoBusca}`);
        contasAnoInteiro = response.data.filter(
          (c) => !isContaFutura(c.data ?? "")
        );
      } catch {
        alert("Erro ao buscar contas do ano para exportação");
        return;
      }
    }

    // ============================
    // DADOS PARA EXPORTAÇÃO (SEM API)
    // ============================

    // Contas do período (mensal / anual)
    const contasMensaisPDF: Conta[] = contasFiltradas;

    // Planejamento futuro — fonte independente do dashboard
    const contasFuturasPDF: Conta[] = contas
      .filter((c) => isContaFutura(c.data ?? ""))
      .sort((a, b) => {
        if (a.ano !== b.ano) return a.ano - b.ano;
        return a.mes - b.mes;
      });

    const nomesMeses = [
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
      "Dezembro",
    ];

    let y = 20;

    doc.setFontSize(18);
    doc.text("Relatório de Contas Mensais", 14, y);
    y += 10;

    // 🔹 ANO INTEIRO → UM BLOCO POR MÊS
    if (mesBusca === 0) {
      for (let mes = 1; mes <= 12; mes++) {
        const contasDoMes = contasAnoInteiro.filter((c) => c.mes === mes);
        if (contasDoMes.length === 0) continue;

        doc.setFontSize(14);
        doc.text(`${nomesMeses[mes - 1]} / ${anoBusca}`, 14, y);
        y += 6;

        const linhas = contasDoMes.map((c: any) => [
          c.descricao,
          c.categoriaNome,
          c.valor.toLocaleString("pt-BR", {
            style: "currency",
            currency: "BRL",
          }),
        ]);

        autoTable(doc, {
          startY: y,
          head: [["Descrição", "Categoria", "Valor"]],
          body: linhas,
          styles: { fontSize: 10 },
          headStyles: { fillColor: [34, 197, 94] },
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
      doc.text(`${nomesMeses[mesBusca - 1]} / ${anoBusca}`, 14, y);
      y += 6;

      const linhas = contasMensaisPDF.map((c: Conta) => [
        c.descricao,
        c.categoriaNome,
        c.valor.toLocaleString("pt-BR", {
          style: "currency",
          currency: "BRL",
        }),
      ]);

      autoTable(doc, {
        startY: y,
        head: [["Descrição", "Categoria", "Valor"]],
        body: linhas,
        styles: { fontSize: 10 },
        headStyles: { fillColor: [99, 102, 241] },
      });
    }

    // ============================
    // PLANEJAMENTO FUTURO — PDF
    // ============================
    if (contasFuturasPDF.length > 0) {
      doc.addPage();

      doc.setFontSize(16);
      doc.text("Planejamento Futuro", 14, 20);

      let yFuturo = 30;

      // agrupa por ano-mês
      const futurasPorMes: Record<string, Conta[]> = {};

      contasFuturasPDF.forEach((c) => {
        const chave = `${c.ano}-${String(c.mes).padStart(2, "0")}`;
        if (!futurasPorMes[chave]) futurasPorMes[chave] = [];
        futurasPorMes[chave].push(c);
      });

      Object.entries(futurasPorMes).forEach(([chave, contasDoMes]) => {
        const [ano, mes] = chave.split("-");
        const nomeMes = nomesMeses[Number(mes) - 1];

        // título do mês
        doc.setFontSize(13);
        doc.text(`${nomeMes} / ${ano}`, 14, yFuturo);
        yFuturo += 6;

        const linhas = contasDoMes.map((c) => [
          c.descricao,
          c.categoriaNome,
          c.valor.toLocaleString("pt-BR", {
            style: "currency",
            currency: "BRL",
          }),
        ]);

        autoTable(doc, {
          startY: yFuturo,
          head: [["Descrição", "Categoria", "Valor"]],
          body: linhas,
          styles: { fontSize: 10 },
          headStyles: { fillColor: [96, 165, 250] },
        });

        const totalMes = contasDoMes.reduce((s, c) => s + c.valor, 0);

        yFuturo = (doc as any).lastAutoTable.finalY + 6;

        // total do mês
        doc.setFontSize(11);
        doc.text(
          `Total do mês: ${totalMes.toLocaleString("pt-BR", {
            style: "currency",
            currency: "BRL",
          })}`,
          14,
          yFuturo
        );

        yFuturo += 12;

        if (yFuturo > 260) {
          doc.addPage();
          yFuturo = 20;
        }
      });
    }
    // 🔒 SALVAR SOMENTE NO FINAL
    doc.save(
      mesBusca === 0
        ? `contas_${anoBusca}.pdf`
        : `contas_${nomesMeses[mesBusca - 1]}_${anoBusca}.pdf`
    );
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

      const hoje = new Date();
      hoje.setHours(0, 0, 0, 0);

      const dataFutura = dataObj > hoje;

      // permite até 1 ano à frente
      const limite = new Date(
        hoje.getFullYear() + 1,
        hoje.getMonth(),
        hoje.getDate()
      );

      if (dataObj > limite) {
        setToast({
          mensagem: "A data não pode ultrapassar 1 ano à frente",
          tipo: "erro",
        });
        return;
      }

      if (contaEditando) {
        // ✏️ EDITAR CONTA
        await api.put(`/contas/${contaEditando.id}`, {
          descricao,
          valor: Number(valor),
          data: dataObj.toISOString(),
          categoriaId: Number(categoriaId),
          tipo,
        });

        setToast({
          mensagem: "Conta atualizada com sucesso",
        });

        setContaEditando(null);
      } else {
        // ➕ CRIAR CONTA
        await api.post("/contas", {
          descricao,
          valor: Number(valor),
          data: dataObj.toISOString(),
          categoriaId: Number(categoriaId),
          tipo,
        });

        setToast({
          mensagem: "Conta criada com sucesso",
        });
      }

      /* ✅ PASSO F — AUTO-MUDANÇA DE PERÍODO */
      if (dataFutura) {
        setMesBusca(dataObj.getMonth() + 1);
        setAnoBusca(dataObj.getFullYear());
      }

      // limpa formulário
      setDescricao("");
      setValor("");
      setData("");
      setCategoriaId("");

      // recarrega contas
      await carregarContasPeriodo();
      await carregarPeriodoAnterior();
    } catch (error) {
      console.error(error);
      setToast({
        mensagem: "Erro ao salvar conta",
        tipo: "erro",
      });
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
        (c) => c.nome.toLowerCase() === novaCategoria.toLowerCase()
      )
    ) {
      setToast({
        mensagem: "Categoria já existe",
        tipo: "erro",
      });
      return;
    }

    try {
      const response = await api.post("/categorias", {
        nome: novaCategoria,
      });

      const recarregar = await api.get("/categorias");

      setCategorias(
        recarregar.data.sort((a: Categoria, b: Categoria) =>
          a.nome.localeCompare(b.nome, "pt-BR", { sensitivity: "base" })
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
    const conta = contas.find((c) => c.id === id);
    if (!conta) return;

    setContaParaExcluir(conta);
  }
  async function excluirCategoria(id: number) {
    const categoria = categorias.find((c) => c.id === id);
    if (!categoria) return;

    const emUso = contas.some((c) => c.categoriaId === id);

    if (emUso) {
      setToast({
        mensagem:
          "Esta categoria está vinculada a uma conta e não pode ser excluída.",
        tipo: "erro",
      });
      return;
    }

    setCategoriaParaExcluir(categoria);
  }

  async function confirmarExclusaoCategoria() {
    if (!categoriaParaExcluir) return;

    try {
      await api.delete(`/categorias/${categoriaParaExcluir.id}`);

      setCategorias(categorias.filter((c) => c.id !== categoriaParaExcluir.id));

      setToast({
        mensagem: "Categoria excluída com sucesso",
      });
    } catch (error) {
      console.error(error);
      setToast({
        mensagem: "Erro ao excluir categoria",
        tipo: "erro",
      });
    } finally {
      setCategoriaParaExcluir(null);
    }
  }

  async function desfazerExclusaoConta() {
    if (!ultimaContaExcluida) return;

    try {
      const ano = ultimaContaExcluida.ano;
      const mes = ultimaContaExcluida.mes;

      const dataValida = ultimaContaExcluida.data
        ? ultimaContaExcluida.data
        : new Date(
            ultimaContaExcluida.ano,
            ultimaContaExcluida.mes - 1,
            1
          ).toISOString();

      await api.post("/contas", {
        descricao: ultimaContaExcluida.descricao,
        valor: ultimaContaExcluida.valor,
        data: dataValida, // ✅ nunca undefined
        categoriaId: ultimaContaExcluida.categoriaId!,
      });

      setToast({
        mensagem: "Exclusão desfeita",
      });

      if (timeoutUndo) {
        clearTimeout(timeoutUndo);
        setTimeoutUndo(null);
      }

      setUltimaContaExcluida(null);
      await carregarContasPeriodo();
      await carregarPeriodoAnterior();
    } catch (error) {
      console.error(error);
      setToast({
        mensagem: "Erro ao desfazer exclusão",
        tipo: "erro",
      });
    }
  }

  // =======================
  // INICIAR EDIÇÃO
  // =======================
  function iniciarEdicao(conta: Conta) {
    console.log("Conta em edição:", conta);

    setContaEditando(conta);

    setDescricao(conta.descricao);
    setValor(String(conta.valor));

    if (conta.data) {
      setData(conta.data.slice(0, 10));
    } else {
      const mes = String(conta.mes).padStart(2, "0");
      setData(`${conta.ano}-${mes}-01`);
    }

    setCategoriaId(String(conta.categoriaId ?? ""));
    setTipo(conta.tipo);
  }
  return (
    <div
      style={{
        ...dashboardContainer,
        background: cores.fundo,
        overflowX: "hidden",
      }}
    >
      <div
        style={{
          ...dashboardCard,
          background: cores.card,
          color: cores.texto,
        }}
      >
        <DashboardHeader
          textoPeriodo={textoPeriodo}
          cores={cores}
          exportando={exportando}
          exportarExcel={exportarExcel}
          exportarPDF={exportarPDF}
          abrirConfiguracoes={() => setMostrarConfigModal(true)}
          onLogout={handleLogout}
        />

        {/* 🔀 SELETOR DE TELA */}
        <div style={{ display: "flex", gap: 8, margin: "16px 0" }}>
          <button
            onClick={() => setModoTela("contas")}
            style={{
              padding: "8px 14px",
              borderRadius: 8,
              border: "none",
              cursor: "pointer",
              background: modoTela === "contas" ? cores.botao : "transparent",
              color: modoTela === "contas" ? "#fff" : cores.texto,
            }}
          >
            📄 Contas
          </button>

          <button
            onClick={() => setModoTela("entradas")}
            style={{
              padding: "8px 14px",
              borderRadius: 8,
              border: "none",
              cursor: "pointer",
              background: modoTela === "entradas" ? "#22c55e" : "transparent",
              color: modoTela === "entradas" ? "#fff" : cores.texto,
            }}
          >
            💰 Entradas
          </button>
        </div>

        {mostrarConfigModal && (
          <div
            onClick={() => setMostrarConfigModal(false)}
            style={{
              position: "fixed",
              inset: 0,
              background: "rgba(0,0,0,0.6)",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              zIndex: 1000,
            }}
          >
            <div
              onClick={(e) => e.stopPropagation()}
              style={{
                background: cores.card,
                color: cores.texto,
                padding: 24,
                borderRadius: 16,
                width: "90%",
                maxWidth: 420,
              }}
            >
              <h3 style={{ marginTop: 0 }}>⚙️ Configurações</h3>

              <GestaoCategorias
                cores={cores}
                categorias={categorias}
                excluirCategoria={excluirCategoria}
                novaCategoria={novaCategoria}
                setNovaCategoria={setNovaCategoria}
                criarCategoria={criarCategoria}
                isAdmin={isAdmin}
              />

              <div style={{ textAlign: "right", marginTop: 20 }}>
                <button
                  onClick={() => setMostrarConfigModal(false)}
                  style={{
                    background: "transparent",
                    border: "none",
                    color: cores.textoSuave,
                    cursor: "pointer",
                    fontWeight: 600,
                  }}
                >
                  Fechar
                </button>
              </div>
            </div>
          </div>
        )}

        {loading && (
          <>
            <div
              style={{
                padding: 16,
                display: "grid",
                gap: 12,
              }}
            >
              {[1, 2, 3].map((i) => (
                <div
                  key={i}
                  style={{
                    height: 20,
                    borderRadius: 8,
                    background: modoEscuro
                      ? "linear-gradient(90deg,#020617,#020617,#020617)"
                      : "linear-gradient(90deg,#e5e7eb,#f3f4f6,#e5e7eb)",
                    opacity: 0.6,
                  }}
                />
              ))}
            </div>
          </>
        )}

        <div style={{ marginTop: 16 }}>
          {modoTela === "contas" ? (
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
                setTipo("saida");
              }}
              tipo={tipo}
              setTipo={setTipo}
            />
          ) : (
            <FormEntrada
              descricao={descricaoEntrada}
              setDescricao={setDescricaoEntrada}
              valor={valorEntrada}
              setValor={setValorEntrada}
              data={dataEntrada}
              setData={setDataEntrada}
              categoriaId={categoriaEntradaId}
              setCategoriaId={setCategoriaEntradaId}
              categorias={categorias}
              entradaEditando={entradaEditando}
              salvandoEntrada={salvandoEntrada}
              criarEntrada={() => {}}
              cores={cores}
              cancelarEdicao={() => {
                setEntradaEditando(null);
                setDescricaoEntrada("");
                setValorEntrada("");
                setDataEntrada("");
                setCategoriaEntradaId("");
              }}
            />
          )}
        </div>

        <DashboardCards
          mesBusca={mesBusca}
          totalPeriodo={totalPeriodo}
          mediaMensal={mediaMensal}
          diferenca={diferenca}
          percentual={percentual}
          tipo={tipoDashboard}
          nomeCategoriaMaior={nomeCategoriaMaior}
          valorCategoriaMaior={valorCategoriaMaior}
        />

        {/* CONTAS DO PERÍODO */}
        <div style={{ margin: "24px 0 12px" }}>
          <h3
            style={{
              ...sectionTitle,
              color: cores.texto,
            }}
          >
            Contas do Período
          </h3>

          {contasFuturas.length > 0 && (
            <p
              style={{
                marginTop: 6,
                marginBottom: 12,
                fontSize: 13,
                color: cores.textoSuave,
              }}
            >
              ℹ️ Contas futuras aparecem como <strong>planejamento</strong> e
              não entram nos totais atuais.
            </p>
          )}

          {/* PESQUISA — MÊS / ANO */}
          <div
            style={{
              display: "flex",
              gap: 12,
              flexWrap: "wrap",
            }}
          >
            <select
              value={mesBusca}
              onChange={(e) => setMesBusca(Number(e.target.value))}
              style={{
                background: "#ffffff",
                color: "#111827",
                border: "1px solid #d1d5db",
                borderRadius: 8,
                padding: "10px 12px",
                minWidth: 160,
                fontWeight: 500,
              }}
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
                "Dezembro",
              ].map((nome, index) => (
                <option key={index + 1} value={index + 1}>
                  {nome}
                </option>
              ))}
            </select>

            <input
              type="number"
              value={anoBusca}
              onChange={(e) => setAnoBusca(Number(e.target.value))}
              style={{
                width: 100,
                background: "#ffffff",
                color: "#111827",
                border: "1px solid #d1d5db",
                borderRadius: 8,
                padding: "10px 12px",
                textAlign: "center",
                fontWeight: 500,
              }}
            />
          </div>
        </div>

        {mesSelecionadoEhFuturo && (
          <div
            style={{
              marginTop: 12,
              padding: "12px 16px",
              borderRadius: 10,
              background: "rgba(96,165,250,0.15)",
              border: "1px solid #60a5fa",
              color: "#bfdbfe",
              fontSize: 14,
            }}
          >
            📆 <strong>Mês futuro (planejamento)</strong>
            <div style={{ marginTop: 6 }}>
              Total planejado neste mês:{" "}
              <strong>
                {totalPlanejadoMesSelecionado.toLocaleString("pt-BR", {
                  style: "currency",
                  currency: "BRL",
                })}
              </strong>
            </div>
          </div>
        )}

        {contasFuturas.length > 0 && (
          <div style={{ marginBottom: 12 }}>
            <button
              onClick={() => setMostrarFuturas(!mostrarFuturas)}
              style={{
                background: "transparent",
                border: `1px solid ${cores.borda}`,
                color: cores.texto,
                padding: "8px 12px",
                borderRadius: 8,
                cursor: "pointer",
                fontSize: 13,
              }}
            >
              {mostrarFuturas
                ? "Ocultar planejamento futuro"
                : "Mostrar planejamento futuro"}
            </button>
          </div>
        )}

        {!loading && contasFiltradas.length === 0 ? (
          <div
            style={{
              padding: 24,
              borderRadius: 12,
              border: `1px dashed ${cores.borda}`,
              color: cores.textoSuave,
              textAlign: "center",
              marginBottom: 16,
            }}
          >
            Nenhuma conta encontrada para este período. Comece adicionando uma
            nova acima ⬆️
          </div>
        ) : mostrarFuturas ? (
          Object.entries(futurasAgrupadasPorMes).map(
            ([chave, contasMes]: [string, Conta[]]) => {
              const [ano, mes] = chave.split("-");
              const nomeMes = [
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
                "Dezembro",
              ][Number(mes) - 1];

              const totalMes = contasMes.reduce(
                (soma: number, c: Conta) => soma + c.valor,
                0
              );

              return (
                <div key={chave} style={{ marginBottom: 24 }}>
                  <h4 style={{ marginBottom: 8 }}>
                    {nomeMes} / {ano}
                  </h4>

                  <ListaContas
                    contas={contasMes}
                    cores={cores}
                    iniciarEdicao={iniciarEdicao}
                    excluirConta={excluirConta}
                  />

                  <div
                    style={{
                      marginTop: 8,
                      textAlign: "right",
                      fontWeight: 600,
                      color: cores.textoSuave,
                    }}
                  >
                    Total do mês:{" "}
                    {totalMes.toLocaleString("pt-BR", {
                      style: "currency",
                      currency: "BRL",
                    })}
                  </div>
                </div>
              );
            }
          )
        ) : modoTela === "contas" ? (
          <ListaContas
            contas={contasExibidas}
            cores={cores}
            iniciarEdicao={iniciarEdicao}
            excluirConta={excluirConta}
          />
        ) : (
          <ListaEntradas
            entradas={entradas}
            cores={cores}
            iniciarEdicao={setEntradaEditando}
            excluirEntrada={(id) => {}}
          />
        )}

        {/* GRÁFICOS — SEMPRE VISÍVEIS */}
        <div
          style={{
            ...gridGraficos,
            gap: isMobile ? 20 : gridGraficos.gap,
          }}
        >
          {/* PIZZA — POR MÊS */}
          <div
            style={{
              background: cores.card,
              borderRadius: 16,
              padding: isMobile ? 12 : 16,
              border: `1px solid ${cores.borda}`,
            }}
          >
            <h3
              style={{
                marginBottom: isMobile ? 8 : 12,
                fontSize: isMobile ? 14 : 16,
              }}
            >
              📅 Gastos por mês
            </h3>
            <GraficoMensal dados={dadosGraficoMensal} />
          </div>

          {Object.keys(totalFuturoPorMes).length > 0 && (
            <div
              style={{
                background: cores.card,
                borderRadius: 16,
                padding: isMobile ? 12 : 16,
                border: `1px dashed ${cores.borda}`,
              }}
            >
              <h3
                style={{
                  marginBottom: isMobile ? 8 : 12,
                  fontSize: isMobile ? 14 : 16,
                  color: "#60a5fa",
                }}
              >
                🗓️ Planejamento futuro
              </h3>

              <GraficoMensal dados={totalFuturoPorMes} />
            </div>
          )}

          {/* PIZZA — POR CATEGORIA */}
          <div
            style={{
              background: cores.card,
              borderRadius: 16,
              padding: isMobile ? 12 : 16,
              border: `1px solid ${cores.borda}`,
            }}
          >
            <h3
              style={{
                marginBottom: isMobile ? 8 : 12,
                fontSize: isMobile ? 14 : 16,
              }}
            >
              🗂️ Gastos por categoria
            </h3>
            <GraficoCategoria dados={totalPorCategoria} />
          </div>
        </div>
      </div>

      {contaParaExcluir && (
        <div
          onClick={() => setContaParaExcluir(null)}
          style={{
            position: "fixed",
            inset: 0,
            background: "rgba(0,0,0,0.6)",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            zIndex: 1000,
          }}
        >
          <div
            onClick={(e) => e.stopPropagation()}
            style={{
              background: cores.card,
              color: cores.texto,
              padding: 24,
              borderRadius: 16,
              width: "90%",
              maxWidth: 380,
            }}
          >
            <h3 style={{ marginTop: 0 }}>Excluir conta?</h3>

            <p style={{ color: cores.textoSuave }}>
              Tem certeza que deseja excluir{" "}
              <strong>{contaParaExcluir.descricao}</strong>?
            </p>

            <div
              style={{
                display: "flex",
                justifyContent: "flex-end",
                gap: 12,
                marginTop: 20,
              }}
            >
              <button
                onClick={() => setContaParaExcluir(null)}
                style={{
                  background: "transparent",
                  border: "none",
                  color: cores.textoSuave,
                  cursor: "pointer",
                  fontWeight: 600,
                }}
              >
                Cancelar
              </button>

              <button
                onClick={async () => {
                  try {
                    const conta = contaParaExcluir;

                    await api.delete(`/contas/${conta.id}`);

                    setContas(contas.filter((c) => c.id !== conta.id));
                    setUltimaContaExcluida(conta);

                    setToast({
                      mensagem: "Conta excluída",
                    });

                    const timeout = setTimeout(() => {
                      setUltimaContaExcluida(null);
                    }, 5000);

                    setTimeoutUndo(timeout);

                    await carregarPeriodoAnterior();
                  } catch {
                    setToast({
                      mensagem: "Erro ao excluir conta",
                      tipo: "erro",
                    });
                  } finally {
                    setContaParaExcluir(null);
                  }
                }}
                style={{
                  background: "#dc2626",
                  color: "#fff",
                  border: "none",
                  borderRadius: 8,
                  padding: "10px 14px",
                  fontWeight: 600,
                  cursor: "pointer",
                }}
              >
                Excluir
              </button>
            </div>
          </div>
        </div>
      )}

      {categoriaParaExcluir && (
        <div
          style={{
            position: "fixed",
            inset: 0,
            background: "rgba(0,0,0,0.6)",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            zIndex: 1100,
          }}
        >
          <div
            style={{
              background: cores.card,
              color: cores.texto,
              padding: 24,
              borderRadius: 16,
              width: "90%",
              maxWidth: 420,
            }}
          >
            <h3 style={{ marginTop: 0 }}>🗑️ Excluir categoria</h3>

            <p style={{ color: cores.textoSuave }}>
              Tem certeza que deseja excluir a categoria{" "}
              <strong>{categoriaParaExcluir.nome}</strong>?
            </p>

            <div
              style={{
                display: "flex",
                justifyContent: "flex-end",
                gap: 12,
                marginTop: 20,
              }}
            >
              <button
                onClick={() => setCategoriaParaExcluir(null)}
                style={{
                  background: "transparent",
                  border: "none",
                  color: cores.textoSuave,
                  cursor: "pointer",
                  fontWeight: 600,
                }}
              >
                Cancelar
              </button>

              <button
                onClick={confirmarExclusaoCategoria}
                style={{
                  background: "#dc2626",
                  color: "#fff",
                  border: "none",
                  borderRadius: 8,
                  padding: "10px 14px",
                  fontWeight: 600,
                  cursor: "pointer",
                }}
              >
                Excluir
              </button>
            </div>
          </div>
        </div>
      )}

      {toast && (
        <Toast
          mensagem={toast.mensagem}
          tipo={toast.tipo}
          onClose={() => setToast(null)}
          acao={
            ultimaContaExcluida
              ? {
                  texto: "Desfazer",
                  onClick: desfazerExclusaoConta,
                }
              : undefined
          }
        />
      )}
    </div>
  );
}
