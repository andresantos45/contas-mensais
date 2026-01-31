import { useState, FormEvent } from "react";
import { login } from "../services/authService";
import { useNavigate } from "react-router-dom";

export default function Login() {
  const [email, setEmail] = useState("");
  const [senha, setSenha] = useState("");
  const [mostrarSenha, setMostrarSenha] = useState(false);
  const [erro, setErro] = useState("");
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  async function handleLogin(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setErro("");
    setLoading(true);

    try {
      const data = await login(email, senha);

      localStorage.setItem("token", data.token);

      navigate("/dashboard", { replace: true });
    } catch (err) {
      console.error("Erro no login:", err);
      setErro("Email ou senha inválidos");
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
