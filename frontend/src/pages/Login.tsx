import { useState, FormEvent } from "react";
import { login } from "../services/authService";
import { useNavigate, useSearchParams } from "react-router-dom";

export default function Login() {
  const [email, setEmail] = useState("");
  const [senha, setSenha] = useState("");
  const [mostrarSenha, setMostrarSenha] = useState(false);
  const [erro, setErro] = useState("");
  const [loading, setLoading] = useState(false);

  const navigate = useNavigate();
  const [searchParams] = useSearchParams();

  const expired = searchParams.get("expired") === "1";

  async function handleLogin(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setErro("");
    setLoading(true);

    try {
      const data = await login(email, senha);
      localStorage.setItem("token", data.token);
      localStorage.setItem("refreshToken", data.refreshToken);
      navigate("/dashboard", { replace: true });
    } catch (err) {
      setErro("Email ou senha inválidos");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div style={{ maxWidth: 360, margin: "100px auto" }}>
      <h2>Login</h2>

      {expired && (
        <div
          style={{
            marginBottom: 16,
            padding: "12px 14px",
            borderRadius: 8,
            background: "#1f2933",
            color: "#fbbf24",
            fontSize: 14,
          }}
        >
          Sua sessão expirou. Faça login novamente.
        </div>
      )}

      <form onSubmit={handleLogin}>
        <input
          type="email"
          placeholder="Email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
        />

        <input
          type={mostrarSenha ? "text" : "password"}
          placeholder="Senha"
          value={senha}
          onChange={(e) => setSenha(e.target.value)}
          required
        />

        <label
          style={{
            display: "flex",
            alignItems: "center",
            gap: 6,
            marginBottom: 12,
            color: "#fff",
          }}
        >
          <input
            type="checkbox"
            checked={mostrarSenha}
            onChange={() => setMostrarSenha(!mostrarSenha)}
          />
          Mostrar senha
        </label>

        <button type="submit" disabled={loading}>
          {loading ? "Entrando..." : "Entrar"}
        </button>

        {erro && <p style={{ color: "red" }}>{erro}</p>}
      </form>
    </div>
  );
}
