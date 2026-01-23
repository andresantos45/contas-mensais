import api from "./api";

export interface CriarUsuarioDTO {
  nome: string;
  email: string;
  senha: string;
  role: "admin" | "user";
}

export async function listarUsuarios() {
  const response = await api.get("/admin/usuarios");
  return response.data;
}

export async function excluirUsuario(id: number) {
  await api.delete(`/admin/usuarios/${id}`);
}

export async function criarUsuario(dados: CriarUsuarioDTO) {
  const token = localStorage.getItem("token");

  const response = await api.post("/auth/register", dados, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });
}