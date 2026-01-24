import { Usuario } from "../types/Usuario";
import { useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";
import {
  listarUsuarios,
  excluirUsuario,
  criarUsuario,
} from "../services/adminService";
export default function UsuariosAdmin() {
  const corTexto = "#e5e7eb"; // texto principal
  const corTextoSuave = "#cbd5f5"; // emails
  const corCabecalho = "#f9fafb"; // títulos e header
  const [usuarios, setUsuarios] = useState<Usuario[]>([]);
  const [loading, setLoading] = useState(true);
  const [nome, setNome] = useState("");
  const [email, setEmail] = useState("");
  const [senha, setSenha] = useState("");
  const [role, setRole] = useState<"admin" | "user">("user");
  const [criando, setCriando] = useState(false);
  const navigate = useNavigate();

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

  async function handleExcluir(id: number, role: "admin" | "user") {
    const admins = usuarios.filter((u) => u.role === "admin");

    // 🚫 BLOQUEIA ANTES DE QUALQUER CONFIRM
    if (role === "admin" && admins.length === 1) {
      alert("Não é permitido excluir o último administrador");
      return;
    }

    // ✅ CONFIRM SÓ PARA CASOS PERMITIDOS
    const confirmar = window.confirm("Deseja excluir este usuário?");
    if (!confirmar) return;

    try {
      await excluirUsuario(id);
      carregarUsuarios();
    } catch (err: any) {
      alert(err?.response?.data || err?.message || "Erro ao executar ação");
    }
  }

  async function handleCriarUsuario(e: React.FormEvent<HTMLFormElement>) {
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
        role: role === "admin" ? "admin" : "user",
      });

      setNome("");
      setEmail("");
      setSenha("");
      setRole("user");

      carregarUsuarios();
    } catch (err: any) {
      console.error("ERRO AO CRIAR USUÁRIO:", err);
      alert(
        err?.response?.data?.message || err?.message || "Erro ao criar usuário"
      );
    } finally {
      setCriando(false);
    }
  }

  function voltar() {
    const token = localStorage.getItem("token");

    if (token) {
      navigate("/dashboard");
    } else {
      navigate("/login");
    }
  }

  function sair() {
    localStorage.removeItem("token");
        navigate("/login");
  }

  useEffect(() => {
    const token = localStorage.getItem("token");

    if (!token) {
      navigate("/login");
      return;
    }

    carregarUsuarios();
  }, []);

  if (loading) return <p>Carregando usuários...</p>;

  return (
    <div style={{ padding: 20 }}>
      {/* 🔙 BOTÕES DE NAVEGAÇÃO */}
      <div style={{ marginBottom: 16, display: "flex", gap: 8 }}>
        <button
          onClick={voltar}
          style={{
            padding: "6px 12px",
            borderRadius: 6,
            border: "none",
            cursor: "pointer",
          }}
        >
          ⬅ Voltar
        </button>

        <button
          onClick={sair}
          style={{
            padding: "6px 12px",
            borderRadius: 6,
            border: "none",
            cursor: "pointer",
            background: "#ef4444",
            color: "#fff",
            fontWeight: 600,
          }}
        >
          🚪 Sair
        </button>
      </div>
      <h2 style={{ color: corCabecalho }}>Usuários do Sistema</h2>

      <form onSubmit={handleCriarUsuario} style={{ marginBottom: 24 }}>
        <h3 style={{ color: corTexto }}>Criar novo usuário</h3>

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

          <select
            value={role}
            onChange={(e) => setRole(e.target.value as "admin" | "user")}
          >
            <option value="user">Usuário</option>
            <option value="admin">Administrador</option>
          </select>

          <button type="submit" disabled={criando}>
            {criando ? "Criando..." : "Criar usuário"}
          </button>
        </div>
      </form>

      <table
        width="100%"
        cellPadding="10"
        style={{
          borderCollapse: "collapse",
          color: corTexto,
        }}
      >
        <thead>
          <tr
            style={{
              color: corCabecalho,
              borderBottom: "1px solid #334155",
            }}
          >
            <th style={{ textAlign: "left" }}>Nome</th>
            <th style={{ textAlign: "left" }}>Email</th>
            <th style={{ textAlign: "left" }}>Role</th>
            <th style={{ textAlign: "left" }}>Ações</th>
          </tr>
        </thead>
        <tbody>
          {usuarios.map((u) => (
            <tr
              key={u.id}
              style={{
                borderBottom: "1px solid #1e293b",
              }}
            >
              <td
                style={{
                  color: corTexto,
                  padding: "12px 8px",
                }}
              >
                {u.nome}
              </td>
              <td
                style={{
                  color: corTexto,
                  padding: "12px 8px",
                }}
              >
                {u.email}
              </td>
              <td
                style={{
                  color: corTexto,
                  padding: "12px 8px",
                }}
              >
                {u.role}
              </td>
              <td>
                <button
                  onClick={() => handleExcluir(u.id, u.role)}
                  disabled={
                    u.role === "admin" &&
                    usuarios.filter((x) => x.role === "admin").length === 1
                  }
                  style={{
                    background: "#ef4444",
                    color: "#ffffff",
                    border: "none",
                    padding: "6px 12px",
                    borderRadius: 6,
                    fontWeight: 600,
                    cursor: "pointer",
                    opacity:
                      u.role === "admin" &&
                      usuarios.filter((x) => x.role === "admin").length === 1
                        ? 0.4
                        : 1,
                  }}
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
