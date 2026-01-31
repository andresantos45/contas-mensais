import ItemConta from "../Dashboard/ItemConta";
import { Conta } from "../../types/Conta";
import { Entrada } from "../../types/Entrada";

interface ListaEntradasProps {
  entradas: Entrada[];
  cores: {
    fundo: string;
    card: string;
    texto: string;
    textoSuave: string;
    borda: string;
    botao: string;
  };
  iniciarEdicao: (e: Entrada) => void;
  excluirEntrada: (id: number) => void;
}

export default function ListaEntradas({
  entradas,
  cores,
  iniciarEdicao,
  excluirEntrada,
}: ListaEntradasProps) {
  return (
    <>
      {entradas.map((e) => {
        // 🔁 Adapter correto: só os campos que a UI usa
        const contaFake: Pick<
  Conta,
  "id" | "descricao" | "valor" | "mes" | "ano" | "categoriaNome"
> = {
  id: e.id,
  descricao: e.descricao,
  valor: e.valor,
  mes: e.mes,
  ano: e.ano,
  categoriaNome: e.categoriaNome,
};

        return (
          <ItemConta
            key={e.id}
            conta={contaFake as Conta}
            contaFutura={false}
            cores={cores}
            iniciarEdicao={() => iniciarEdicao(e)}
            excluirConta={() => excluirEntrada(e.id)}
          />
        );
      })}
    </>
  );
}
