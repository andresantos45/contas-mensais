import { Conta } from "../../types/Conta";
import ItemConta from "./ItemConta";

interface ListaContasProps {
  contas: Conta[];
  cores: {
    fundo: string;
    card: string;
    texto: string;
    textoSuave: string;
    borda: string;
    botao: string;
  };
  iniciarEdicao: (conta: Conta) => void;
  excluirConta: (id: number) => void;
}

export default function ListaContas({
  contas,
  cores,
  iniciarEdicao,
  excluirConta,
}: ListaContasProps) {
  if (contas.length === 0) {
    return <p>Nenhuma conta cadastrada.</p>;
  }

  return (
    <>
      {contas.map(conta => (
        <ItemConta
          key={conta.id}
          conta={conta}
          cores={cores}
          iniciarEdicao={iniciarEdicao}
          excluirConta={excluirConta}
        />
      ))}
    </>
  );
}