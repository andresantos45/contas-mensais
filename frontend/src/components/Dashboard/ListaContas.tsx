import ItemConta from "./ItemConta";

interface ListaContasProps {
  contas: any[];
  cores: any;
  iniciarEdicao: (conta: any) => void;
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