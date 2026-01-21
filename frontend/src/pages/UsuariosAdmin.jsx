import { useEffect, useState } from "react";
import { listarUsuarios, excluirUsuario } from "../services/adminService";

export default function UsuariosAdmin() {
  const [usuarios, setUsuarios] = useState([]);
  const [loading, setLoading] = useState(true);

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

    await excluirUsuario(id);
    carregarUsuarios();
  }

  useEffect(() => {
    carregarUsuarios();
  }, []);

  if (loading) return <p>Carregando usuários...</p>;

  return (
    <div style={{ padding: 20 }}>
      <h2>Usuários do Sistema</h2>

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
                {u.role !== "admin" && (
                  <button onClick={() => handleExcluir(u.id)}>
                    Excluir
                  </button>
                )}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}