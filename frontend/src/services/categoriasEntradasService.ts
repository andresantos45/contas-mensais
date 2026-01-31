import api from "./api";
import { CategoriaEntrada } from "../types/CategoriaEntrada";

export async function listarCategoriasEntradas(): Promise<CategoriaEntrada[]> {
  const response = await api.get<CategoriaEntrada[]>(
    "/api/categorias-entradas"
  );
  return response.data;
}

import axios from "axios";

export async function criarCategoriaEntrada(
  nome: string
): Promise<CategoriaEntrada | null> {
  try {
    const response = await api.post<CategoriaEntrada>(
      "/api/categorias-entradas",
      { nome }
    );
    return response.data;
  } catch (error: any) {
    if (axios.isAxiosError(error) && error.response?.status === 409) {
      // duplicado → o componente decide o que fazer
      return null;
    }

    throw error; // outros erros continuam subindo
  }
}

export async function excluirCategoriaEntrada(id: number): Promise<void> {
  await api.delete(`/api/categorias-entradas/${id}`);
}