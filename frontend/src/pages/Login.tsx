import { useState } from "react";
import api from "../services/api";
import { useNavigate } from "react-router-dom";

export default function Login() {
  const [email, setEmail] = useState("");
  const [senha, setSenha] = useState("");
  const [erro, setErro] = useState("");
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  async function handleLogin(e: React.FormEvent) {
    e.preventDefault();
    setErro("");
    setLoading(true);

    try {
      const response = await api.post("/auth/login", {
        email,
        senha,
      });

      const token = response.data.token;

      if (!token) {
        throw new Error("Token não retornado pela API");
      }

      localStorage.setItem("token", token);
      navigate("/dashboard", { replace: true });

    } catch (err: any) {
      console.error("Erro no login:", err);

      if (err.response?.data) {
        setErro(
          typeof err.response.data === "string"
            ? err.response.data
            : "Erro retornado pela API"
        );
      } else {
        setErro("Erro inesperado ao tentar logar");
      }

    } finally {
      setLoading(false);
    }
  }

  return (
    <div style={{ maxWidth: 360, margin: "100px auto" }}>
      <h2>Login</h2>

      <form onSubmit={handleLogin}>
        <input
          type="email"
          placeholder="Email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
        />

        <input
          type="password"
          placeholder="Senha"
          value={senha}
          onChange={(e) => setSenha(e.target.value)}
          required
        />

        <button type="submit" disabled={loading}>
          {loading ? "Entrando..." : "Entrar"}
        </button>

        {erro && <p style={{ color: "red" }}>{erro}</p>}
      </form>
    </div>
  );
}