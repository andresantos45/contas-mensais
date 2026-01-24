import { useNavigate } from "react-router-dom";

interface AbaUsuariosProps {
  cores: any;
}

export default function AbaUsuarios({ cores }: AbaUsuariosProps) {
  const navigate = useNavigate();

  return (
    <div style={{ marginTop: 16 }}>
      <p
        style={{
          marginBottom: 12,
          color: cores.textoSuave,
          fontSize: 14,
        }}
      >
        Gerenciamento de usuários do sistema
      </p>

      <button
        onClick={() => navigate("/admin/usuarios")}
        style={{
          background: "#6366f1",
          color: "#fff",
          border: "none",
          padding: "10px 16px",
          borderRadius: 8,
          cursor: "pointer",
          fontWeight: 700,
        }}
      >
        👥 Abrir gestão de usuários
      </button>
    </div>
  );
}
