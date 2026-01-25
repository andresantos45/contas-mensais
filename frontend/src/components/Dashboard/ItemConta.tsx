import { itemWrapper, acoes } from "./listaContasStyles";
import { Conta } from "../../types/Conta";


interface ItemContaProps {
  conta: Conta;
  contaFutura: boolean; // ✅ NOVO
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

export default function ItemConta({
  conta,
  contaFutura, // ✅ NOVO
  cores,
  iniciarEdicao,
  excluirConta,
}: ItemContaProps) {
  return (
    <div
  style={{
    ...itemWrapper,
    gridTemplateColumns: "2fr 1fr 1fr 1fr auto auto",
    padding: "14px 8px",
    borderBottom: `1px solid ${cores.borda}`,
    fontSize: 14,
  }}
>
      <div style={{ fontWeight: 500, display: "flex", gap: 8, alignItems: "center" }}>
  {conta.descricao}

  {contaFutura && (
    <span
      style={{
        fontSize: 11,
        padding: "2px 6px",
        borderRadius: 6,
        background: "#1e40af",
        color: "#fff",
        fontWeight: 600,
      }}
    >
      🕒 FUTURA
    </span>
  )}
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

      <div style={acoes}>
  <button onClick={() => iniciarEdicao(conta)}>✏️</button>
  <button onClick={() => excluirConta(conta.id)}>❌</button>
</div>
    </div>
  );
}