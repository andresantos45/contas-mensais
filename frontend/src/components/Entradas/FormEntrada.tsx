import { useEffect } from "react";
import { CSSProperties } from "react";
import { useIsMobile } from "../../hooks/useIsMobile";
import { formGrid, label, inputBase, buttonPrimary } from "./entradasStyles";

export interface CategoriaEntrada {
  id: number;
  nome: string;
}

interface Entrada {
  id: number;
  descricao: string;
  valor: number;
  data?: string;
  mes: number;
  ano: number;
  categoriaId: number;
  categoriaNome: string;
}

interface FormEntradaProps {
  descricao: string;
  setDescricao: (v: string) => void;
  valor: string;
  setValor: (v: string) => void;
  data: string;
  setData: (v: string) => void;

  categoriaId: string;
  setCategoriaId: (v: string) => void;
  categorias: CategoriaEntrada[];

  entradaEditando: Entrada | null;
  salvandoEntrada: boolean;

  criarEntrada: (e: React.FormEvent) => void;

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

export default function FormEntrada({
  descricao,
  setDescricao,
  valor,
  setValor,
  data,
  setData,
  categoriaId,
  setCategoriaId,
  categorias,
  entradaEditando,
  salvandoEntrada,
  criarEntrada,
  cores,
  cancelarEdicao,
}: FormEntradaProps) {
  const isMobile = useIsMobile();

  useEffect(() => {
    if (entradaEditando && categorias.length > 0) {
      setCategoriaId(String(entradaEditando.categoriaId));
    }
  }, [entradaEditando, categorias, setCategoriaId]);

  return (
    <form
      onSubmit={criarEntrada}
      style={{
        ...formGrid,
        gap: isMobile ? 12 : formGrid.gap,
        width: "100%",
      }}
    >
      {/* DESCRIÇÃO */}
      <div>
        <label style={{ ...label, color: cores.textoSuave }}>
          Descrição da entrada
        </label>
        <input
          value={descricao}
          onChange={(e) => setDescricao(e.target.value)}
          required
          placeholder="Ex: Salário, Comissão, Venda, Bico..."
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

      {/* CATEGORIA */}
      <div>
        <label style={{ ...label, color: cores.textoSuave }}>
          Categoria de entrada
        </label>
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
        disabled={salvandoEntrada}
        style={{
          ...(buttonPrimary as CSSProperties),
          background: cores.botao,
          padding: isMobile ? "10px 14px" : "12px 16px",
          fontSize: isMobile ? 13 : 14,
          opacity: salvandoEntrada ? 0.6 : 1,
          cursor: salvandoEntrada ? "not-allowed" : "pointer",
          gridColumn: "1 / -1", // 🔥 ocupa linha inteira
        }}
      >
        {salvandoEntrada
          ? "⏳ Salvando..."
          : entradaEditando
            ? "💾 Salvar entrada"
            : "➕ Adicionar entrada"}
      </button>

      {/* BOTÃO CANCELAR */}
      {entradaEditando && (
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
