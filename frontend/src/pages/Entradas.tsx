import { useEffect, useState } from "react";
import api from "../services/api";

interface Categoria {
  id: number;
  nome: string;
}

interface Entrada {
  id: number;
  descricao: string;
  valor: number;
  data: string;
  categoriaNome: string;
}

export default function Entradas() {
  const [categorias, setCategorias] = useState<Categoria[]>([]);
  const [entradas, setEntradas] = useState<Entrada[]>([]);

  const [descricao, setDescricao] = useState("");
  const [valor, setValor] = useState("");
  const [data, setData] = useState("");
  const [categoriaId, setCategoriaId] = useState(0);

  // ajuste conforme seu controle atual
  const mesAtual = new Date().getMonth() + 1;
  const anoAtual = new Date().getFullYear();

  // 🔹 carregar categorias
  useEffect(() => {
    api.get("/categorias").then((res) => {
      setCategorias(res.data);
    });
  }, []);

  // 🔹 carregar entradas
  const carregarEntradas = async () => {
    const res = await api.get(`/entradas/${mesAtual}/${anoAtual}`);
    setEntradas(res.data);
  };

  useEffect(() => {
    carregarEntradas();
  }, []);

  // 🔹 criar entrada
  const adicionarEntrada = async () => {
    if (!descricao || !valor || !data || categoriaId === 0) {
      alert("Preencha todos os campos");
      return;
    }

    await api.post("/entradas", {
      descricao,
      valor: Number(valor),
      data,
      categoriaId,
    });

    setDescricao("");
    setValor("");
    setData("");
    setCategoriaId(0);

    carregarEntradas();
  };

  const totalEntradas = entradas.reduce((acc, e) => acc + e.valor, 0);

  return (
    <div>
      <h1>Entradas</h1>

      {/* FORMULÁRIO */}
      <div>
        <input
          placeholder="Descrição"
          value={descricao}
          onChange={(e) => setDescricao(e.target.value)}
        />

        <input
          type="number"
          placeholder="Valor"
          value={valor}
          onChange={(e) => setValor(e.target.value)}
        />

        <input
          type="date"
          value={data}
          onChange={(e) => setData(e.target.value)}
        />

        <select
          value={categoriaId}
          onChange={(e) => setCategoriaId(Number(e.target.value))}
        >
          <option value={0}>Selecione a categoria</option>
          {categorias.map((c) => (
            <option key={c.id} value={c.id}>
              {c.nome}
            </option>
          ))}
        </select>

        <button onClick={adicionarEntrada}>Adicionar entrada</button>
      </div>

      {/* TOTAL */}
      <h3>Total de entradas: R$ {totalEntradas.toFixed(2)}</h3>

      {/* LISTA */}
      <ul>
        {entradas.map((e) => (
          <li key={e.id}>
            {e.descricao} — {e.categoriaNome} — R$ {e.valor.toFixed(2)}
          </li>
        ))}
      </ul>
    </div>
  );
}