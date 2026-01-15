import { useState } from "react";
import api from "../services/api";
import { useNavigate } from "react-router-dom";

export default function Login() {
  const [email, setEmail] = useState("");
  const [senha, setSenha] = useState("");
  const [erro, setErro] = useState("");
  const navigate = useNavigate();

  async function handleLogin(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setErro("");

    try {
      const response = await api.post("/auth/login", {
        email,
        senha,
      });

      const token = response.data.token;
      localStorage.setItem("token", token);

      // ✅ REDIRECIONAMENTO CORRETO
      navigate("/dashboard", { replace: true });

    } catch {
      setErro("Email ou senha inválidos");
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

        <button type="submit">Entrar</button>

        {erro && <p style={{ color: "red" }}>{erro}</p>}
      </form>
    </div>
  );
}