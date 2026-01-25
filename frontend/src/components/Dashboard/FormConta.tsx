import { useEffect } from "react";
import { CSSProperties } from "react";
import { isContaFutura } from "../../utils/isContaFutura";
import { useIsMobile } from "../../hooks/useIsMobile";


import { formGrid, label, inputBase, buttonPrimary } from "./formContaStyles";

import { Categoria } from "../../types/Categoria";
import { Conta } from "../../types/Conta";

interface FormContaProps {
  descricao: string;
  setDescricao: (v: string) => void;
  valor: string;
  setValor: (v: string) => void;
  data: string;
  setData: (v: string) => void;
  categoriaId: string;
  setCategoriaId: (v: string) => void;
  categorias: Categoria[];
  contaEditando: Conta | null;
  salvandoConta: boolean;
  criarConta: (e: React.FormEvent) => void;
  cores: {
    fundo: string;
    card: string;
    texto: string;
    textoSuave: string;
    borda: string;
    botao: string;
  };
  cancelarEdicao: () => void;
}

export default function FormConta({
  descricao,
  setDescricao,
  valor,
  setValor,
  data,
  setData,
  categoriaId,
  setCategoriaId,
  categorias,
  contaEditando,
  salvandoConta,
  criarConta,
  cores,
  cancelarEdicao,
}: FormContaProps) {
 const isMobile = useIsMobile();

  useEffect(() => {
    if (contaEditando && categorias.length > 0) {
      setCategoriaId(String(contaEditando.categoriaId));
    }
  }, [contaEditando, categorias, setCategoriaId]);

  const contaFutura = isContaFutura(data);


  return (
    <form
      onSubmit={criarConta}
      style={{
        ...formGrid,
        gridTemplateColumns: isMobile ? "1fr" : formGrid.gridTemplateColumns,
        gap: isMobile ? 12 : formGrid.gap,
        width: "100%",
      }}
    >
      {/* DESCRIÇÃO */}
      <div>
        <label style={{ ...label, color: cores.textoSuave }}>Descrição</label>
        <input
          value={descricao}
          onChange={(e) => setDescricao(e.target.value)}
          required
          placeholder="Ex: Mercado, Aluguel, Internet..."
          style={{
            ...(inputBase as CSSProperties),
            padding: isMobile ? "8px 10px" : "10px 12px",
            fontSize: isMobile ? 13 : 14,
          }}
        />
      </div>

      {/* VALOR */}
      <div>
        <label style={{ ...label, color: cores.textoSuave }}>Valor</label>
        <input
          type="number"
          min="0.01"
          step="0.01"
          value={valor}
          onChange={(e) => setValor(e.target.value)}
          required
          style={inputBase}
        />
      </div>

      {/* DATA */}
      <div>
        <label style={{ ...label, color: cores.textoSuave }}>Data</label>
        <input
          type="date"
          value={data}
          onChange={(e) => setData(e.target.value)}
          required
          style={inputBase}
        />
      </div>


      {/* DATA */}
<div>
  <label style={{ ...label, color: cores.textoSuave }}>Data</label>
  <input
    type="date"
    value={data}
    onChange={(e) => setData(e.target.value)}
    required
    style={inputBase}
  />

  {contaFutura && (
    <div
      style={{
        marginTop: 6,
        fontSize: 12,
        color: "#60a5fa",
        fontWeight: 500,
      }}
    >
      📅 Esta é uma conta futura (planejamento)
    </div>
  )}
</div>

      {/* CATEGORIA */}
      <div>
        <label style={{ ...label, color: cores.textoSuave }}>Categoria</label>
        <select
          value={categoriaId}
          onChange={(e) => setCategoriaId(e.target.value)}
          required
          style={inputBase}
        >
          <option value="" disabled>
            Selecione uma categoria
          </option>
          {categorias.map((cat) => (
            <option key={cat.id} value={String(cat.id)}>
              {cat.nome}
            </option>
          ))}
        </select>
      </div>

      {/* BOTÃO SALVAR */}
      <button
        type="submit"
        disabled={salvandoConta}
        style={{
          ...(buttonPrimary as CSSProperties),
          background: cores.botao,
          padding: isMobile ? "10px 14px" : "12px 16px",
          fontSize: isMobile ? 13 : 14,
          opacity: salvandoConta ? 0.6 : 1,
          cursor: salvandoConta ? "not-allowed" : "pointer",
        }}
      >
        {salvandoConta
          ? "⏳ Salvando..."
          : contaEditando
            ? "💾 Salvar"
            : "➕ Adicionar"}
      </button>

      {/* BOTÃO CANCELAR */}
      {contaEditando && (
        <button
          type="button"
          onClick={cancelarEdicao}
          style={{
            height: isMobile ? 36 : 40,
            fontSize: isMobile ? 13 : 14,
          }}
        >
          ❌ Cancelar
        </button>
      )}
    </form>
  );
}
