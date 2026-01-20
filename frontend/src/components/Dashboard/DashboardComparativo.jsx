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
    display: "flex",
    alignItems: "center",
    gap: 6,
    color:
      tipo === "aumento"
        ? "#16a34a"
        : tipo === "reducao"
        ? "#dc2626"
        : "#2563eb" // azul para igual
  }}
>
  {/* ÍCONE */}
  {tipo === "aumento" && <span style={{ fontSize: "1em" }}>▲</span>}
  {tipo === "reducao" && <span style={{ fontSize: "1em" }}>▼</span>}
  {tipo === "neutro" && <span style={{ fontSize: "1em" }}>=</span>}

  {/* TEXTO */}
  <span>
    {tipo === "neutro"
      ? "0,0%"
      : `${Math.abs(percentual).toFixed(1)}%`}
  </span>
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