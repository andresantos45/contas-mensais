interface ItemContaProps {
  conta: any;
  cores: any;
  iniciarEdicao: (conta: any) => void;
  excluirConta: (id: number) => void;
}

export default function ItemConta({
  conta,
  cores,
  iniciarEdicao,
  excluirConta,
}: ItemContaProps) {
  return (
    <div
      style={{
        display: "grid",
        gridTemplateColumns: "2fr 1fr 1fr 1fr auto auto",
        gap: 12,
        alignItems: "center",
        padding: "14px 8px",
        borderBottom: `1px solid ${cores.borda}`,
        fontSize: 14
      }}
    >
      <div style={{ fontWeight: 500 }}>
        {conta.descricao}
      </div>

      <div style={{ color: cores.textoSuave }}>
        {conta.categoriaNome}
      </div>

      <div style={{ fontWeight: 500 }}>
        {conta.valor.toLocaleString("pt-BR", {
          style: "currency",
          currency: "BRL"
        })}
      </div>

      <div style={{ color: cores.textoSuave }}>
        {conta.mes}/{conta.ano}
      </div>

      <button onClick={() => iniciarEdicao(conta)}>✏️</button>
      <button onClick={() => excluirConta(conta.id)}>❌</button>
    </div>
  );
}