import { useEffect, useState } from "react";
import api from "../services/api";
import { Conta } from "../types/Conta";
import { CategoriaConta } from "../types/CategoriaConta";
import { CategoriaEntrada } from "../types/CategoriaEntrada";
import { Entrada } from "../types/Entrada";
import { assert } from "../utils/assert";

export function useDashboardData(mesBusca: number, anoBusca: number) {
  const [loading, setLoading] = useState(false);

  const [contas, setContas] = useState<Conta[]>([]);

  const [entradas, setEntradas] = useState<Entrada[]>([]);
  const [entradasBase, setEntradasBase] = useState<Entrada[]>([]);
  const [categorias, setCategorias] = useState<CategoriaConta[]>([]);
  const [categoriasEntradas, setCategoriasEntradas] = useState<
    CategoriaEntrada[]
  >([]);
  const [totalPeriodoAnterior, setTotalPeriodoAnterior] = useState(0);

  async function carregarContasPeriodo() {
    const response = await api.get<Conta[]>(
      `/api/contas/${mesBusca}/${anoBusca}`
    );
    let todas = response.data;

    const hoje = new Date();
    const inicioMes = new Date(anoBusca, mesBusca - 1, 1);

    if (mesBusca !== 0 && inicioMes > hoje) {
      const ano = await api.get<Conta[]>(`/api/contas/0/${anoBusca}`);
      todas = ano.data;
    }

    const contasNormalizadas = todas.map((c: Conta) => {
      const categoria = categorias.find((cat) => cat.id === c.categoriaId);

      assert(
        categoria,
        `Conta sem categoria válida (categoriaId=${c.categoriaId})`
      );

      return {
        ...c,
        categoriaNome: categoria.nome,
      };
    });

    setContas(contasNormalizadas);
  }

  async function carregarEntradasPeriodo() {
    const response = await api.get<Entrada[]>(
      `/api/entradas/${mesBusca}/${anoBusca}`
    );

    const entradasNormalizadas: Entrada[] = response.data.map((e) => {
      if (!e.categoriaNome) {
        throw new Error(`Entrada sem categoriaNome (id=${e.id})`);
      }

      return e;
    });

    setEntradas(entradasNormalizadas);
    setEntradasBase(entradasNormalizadas);
  }

  async function carregarCategorias() {
    const response = await api.get<CategoriaConta[]>("/api/categorias-contas");
    setCategorias(
      response.data.sort((a, b) =>
        a.nome.localeCompare(b.nome, "pt-BR", { sensitivity: "base" })
      )
    );
  }

  async function carregarCategoriasEntradas() {
    const response = await api.get<CategoriaEntrada[]>(
      "/api/categorias-entradas"
    );
    setCategoriasEntradas(
      response.data.sort((a, b) =>
        a.nome.localeCompare(b.nome, "pt-BR", { sensitivity: "base" })
      )
    );
  }

  async function carregarPeriodoAnterior() {
    let total = 0;

    if (mesBusca === 0) {
      const r = await api.get(`/api/contas/0/${anoBusca - 1}`);
      total = r.data.reduce((s: number, c: Conta) => s + c.valor, 0);
    } else {
      const mesAnt = mesBusca - 1 || 12;
      const anoAnt = mesBusca === 1 ? anoBusca - 1 : anoBusca;

      const r = await api.get(`/api/contas/${mesAnt}/${anoAnt}`);
      total = r.data.reduce((s: number, c: Conta) => s + c.valor, 0);
    }

    setTotalPeriodoAnterior(total);
  }

  // =======================
  // 🔄 FUNÇÕES DE RELOAD
  // =======================

  async function reloadContas() {
    await carregarContasPeriodo();
    await carregarPeriodoAnterior();
  }

  async function reloadEntradas() {
    await carregarEntradasPeriodo();
  }

  async function reloadCategorias() {
    await carregarCategorias();
    await carregarCategoriasEntradas();
  }

  useEffect(() => {
    let ativo = true;

    async function carregarTudo() {
      try {
        setLoading(true);

        await carregarCategorias();
        await carregarCategoriasEntradas();

        await Promise.all([
          carregarContasPeriodo(),
          carregarEntradasPeriodo(),
          carregarPeriodoAnterior(),
        ]);
      } finally {
        if (ativo) setLoading(false);
      }
    }

    carregarTudo();
    return () => {
      ativo = false;
    };
  }, [mesBusca, anoBusca]);

  return {
    loading,
    contas,
    entradas,
    entradasBase,
    categorias,
    categoriasEntradas,
    totalPeriodoAnterior,

    // 🔄 reloads
    reloadContas,
    reloadEntradas,
    reloadCategorias,
  };
}
