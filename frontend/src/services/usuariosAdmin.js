import api from "./api";

export async function listarUsuarios() {
  const response = await api.get("/admin/usuarios");
  return response.data;
}

export async function excluirUsuario(id) {
  await api.delete(`/admin/usuarios/${id}`);
}