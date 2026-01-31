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

  async function criar(
  nome: string
): Promise<CategoriaEntrada | null> {
  const nova = await criarCategoriaEntrada(nome);

  if (!nova) {
    return null;
  }

  setCategoriasEntradas((prev) =>
    [...prev, nova].sort((a, b) =>
      a.nome.localeCompare(b.nome, "pt-BR", { sensitivity: "base" })
    )
  );

  return nova;
}

  async function excluir(id: number) {
  try {
    await excluirCategoriaEntrada(id);
    setCategoriasEntradas((prev) => prev.filter((c) => c.id !== id));
  } catch (error: any) {
    if (error.response?.status === 409) {
      throw new Error(
        "Esta categoria está vinculada a uma ou mais entradas e não pode ser excluída."
      );
    }

    throw new Error("Erro ao excluir categoria de entrada");
  }
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