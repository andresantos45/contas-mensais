function DashboardComparativo({
  percentual,
  diferenca,
  tipo
}) {
  return (
    <div
      style={{
        background: "#f9fafb",
        padding: 12,
        borderRadius: 12,
        border: "1px solid #e5e7eb",
        marginBottom: 12
      }}
    >
      <div style={{ fontSize: 13, opacity: 0.7, marginBottom: 6 }}>
        Comparação com período anterior
      </div>

      <div
        style={{
          fontSize: 26,
          fontWeight: 800,
          color:
            tipo === "aumento"
              ? "#16a34a"
              : tipo === "reducao"
              ? "#dc2626"
              : "#9ca3af"
        }}
      >
        {tipo === "aumento" && "▲ "}
        {tipo === "reducao" && "▼ "}
        {tipo === "neutro" && "● "}
        {tipo === "neutro"
          ? "0,0%"
          : `${Math.abs(percentual).toFixed(1)}%`}
      </div>

      <div style={{ fontSize: 14, opacity: 0.7 }}>
        {tipo === "aumento" && (
          <>
            Aumento de{" "}
            {Math.abs(diferenca).toLocaleString("pt-BR", {
              style: "currency",
              currency: "BRL"
            })}
          </>
        )}

        {tipo === "reducao" && (
          <>
            Redução de{" "}
            {Math.abs(diferenca).toLocaleString("pt-BR", {
              style: "currency",
              currency: "BRL"
            })}
          </>
        )}

        {tipo === "neutro" && "Sem variação"}
      </div>
    </div>
  );
}

export default DashboardComparativo;