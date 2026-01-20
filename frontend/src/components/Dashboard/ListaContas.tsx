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
  return (
  <>
    {contas.length === 0 ? (
      <div
        style={{
          padding: "24px",
          textAlign: "center",
          color: cores.textoSuave,
        }}
      >
        <p>Nenhuma conta cadastrada ainda.</p>
        <p>Comece adicionando sua primeira conta 💸</p>
      </div>
    ) : (
      contas.map(conta => (
        <ItemConta
          key={conta.id}
          conta={conta}
          cores={cores}
          iniciarEdicao={iniciarEdicao}
          excluirConta={excluirConta}
        />
      ))
    )}
  </>
);
}