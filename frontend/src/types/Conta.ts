export type TipoConta = "entrada" | "saida";

export type Conta = {
  id: number;
  descricao: string;
  valor: number;
  data?: string;

  mes: number;
  ano: number;

  categoriaId: number;
  categoriaNome?: string; // 👈 pode faltar, frontend resolve

  tipo: TipoConta;
};
