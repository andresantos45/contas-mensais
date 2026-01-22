import { useEffect, useState } from "react";
import {
 listarUsuarios,
  excluirUsuario,
  criarUsuario,
} 
from "../services/adminService";
export default function UsuariosAdmin() {
  const [usuarios, setUsuarios] = useState([]);
  const [loading, setLoading] = useState(true);
  const [nome, setNome] = useState("");
const [email, setEmail] = useState("");
const [senha, setSenha] = useState("");
const [role, setRole] = useState("user");
const [criando, setCriando] = useState(false);

  async function carregarUsuarios() {
    try {
      const data = await listarUsuarios();
      setUsuarios(data);
    } catch (err) {
      alert("Acesso negado ou erro ao carregar usuários");
    } finally {
      setLoading(false);
    }
  }

  async function handleExcluir(id) {
    const confirmar = window.confirm("Deseja excluir este usuário?");
    if (!confirmar) return;

    try {
  await excluirUsuario(id);
  carregarUsuarios();
} catch (err) {
  alert(
    err.response?.data || "Erro ao excluir usuário"
  );
}
  }

async function handleCriarUsuario(e) {
  e.preventDefault();

  if (!nome || !email || !senha) {
    alert("Preencha todos os campos");
    return;
  }

  try {
    setCriando(true);

    await criarUsuario({
      nome,
      email,
      senha,
      role,
    });

    setNome("");
    setEmail("");
    setSenha("");
    setRole("user");

    carregarUsuarios();
  } catch (err) {
    alert(err.response?.data || "Erro ao criar usuário");
  } finally {
    setCriando(false);
  }
}

  useEffect(() => {
    carregarUsuarios();
  }, []);

  if (loading) return <p>Carregando usuários...</p>;

  return (
    <div style={{ padding: 20 }}>
      <h2>Usuários do Sistema</h2>

      <form onSubmit={handleCriarUsuario} style={{ marginBottom: 24 }}>
  <h3>Criar novo usuário</h3>

  <div style={{ display: "flex", gap: 8, flexWrap: "wrap" }}>
    <input
      placeholder="Nome"
      value={nome}
      onChange={(e) => setNome(e.target.value)}
    />

    <input
      placeholder="Email"
      value={email}
      onChange={(e) => setEmail(e.target.value)}
    />

    <input
      type="password"
      placeholder="Senha"
      value={senha}
      onChange={(e) => setSenha(e.target.value)}
    />

    <select value={role} onChange={(e) => setRole(e.target.value)}>
      <option value="user">Usuário</option>
      <option value="admin">Administrador</option>
    </select>

    <button type="submit" disabled={criando}>
      {criando ? "Criando..." : "Criar usuário"}
    </button>
  </div>
</form>

      <table width="100%" border="1" cellPadding="8">
        <thead>
          <tr>
            <th>Nome</th>
            <th>Email</th>
            <th>Role</th>
            <th>Ações</th>
          </tr>
        </thead>
        <tbody>
          {usuarios.map((u) => (
            <tr key={u.id}>
              <td>{u.nome}</td>
              <td>{u.email}</td>
              <td>{u.role}</td>
              <td>
  <button
    onClick={() => handleExcluir(u.id)}
    disabled={
      u.role === "admin" &&
      usuarios.filter(x => x.role === "admin").length === 1
    }
    title={
      u.role === "admin" &&
      usuarios.filter(x => x.role === "admin").length === 1
        ? "Não é permitido excluir o último administrador"
        : "Excluir usuário"
    }
  >
    Excluir
  </button>
</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}