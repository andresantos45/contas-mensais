export interface Entrada {
  id: number;
  descricao: string;
  valor: number;
  data: string; // ISO
  mes: number;
  ano: number;
  categoriaEntradaId: number;
  categoriaEntradaNome?: string;
}