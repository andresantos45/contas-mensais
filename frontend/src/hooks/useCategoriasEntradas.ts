import { useEffect, useState } from "react";
import { CategoriaEntrada } from "../types/CategoriaEntrada";
import {
  listarCategoriasEntradas,
  criarCategoriaEntrada,
  excluirCategoriaEntrada,
} from "../services/categoriasEntradasService";

export function useCategoriasEntradas() {
  const [categoriasEntradas, setCategoriasEntradas] = useState<
    CategoriaEntrada[]
  >([]);
  const [loading, setLoading] = useState(false);

  async function carregar() {
    setLoading(true);
    try {
      const dados = await listarCategoriasEntradas();
      setCategoriasEntradas(dados);
    } finally {
      setLoading(false);
    }
  }

  async function criar(nome: string) {
    const nova = await criarCategoriaEntrada(nome);
    setCategoriasEntradas((prev) =>
      [...prev, nova].sort((a, b) => a.nome.localeCompare(b.nome))
    );
  }

  async function excluir(id: number) {
    await excluirCategoriaEntrada(id);
    setCategoriasEntradas((prev) => prev.filter((c) => c.id !== id));
  }

  useEffect(() => {
    carregar();
  }, []);

  return {
    categoriasEntradas,
    loading,
    criar,
    excluir,
    recarregar: carregar,
  };
}