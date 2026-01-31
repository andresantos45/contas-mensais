import api from "./api";
import { CategoriaEntrada } from "../types/CategoriaEntrada";

export async function listarCategoriasEntradas(): Promise<CategoriaEntrada[]> {
  const response = await api.get<CategoriaEntrada[]>(
    "/api/categorias-entradas"
  );
  return response.data;
}

export async function criarCategoriaEntrada(
  nome: string
): Promise<CategoriaEntrada> {
  const response = await api.post<CategoriaEntrada>(
    "/api/categorias-entradas",
    { nome }
  );
  return response.data;
}

export async function excluirCategoriaEntrada(id: number): Promise<void> {
  await api.delete(`/api/categorias-entradas/${id}`);
}