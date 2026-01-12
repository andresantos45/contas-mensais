function DashboardCard({ titulo, children }) {
  return (
    <div
      style={{
        background: "inherit",
        padding: 18,
        borderRadius: 16,
        boxShadow: "0 8px 20px rgba(0,0,0,0.08)",
        border: "1px solid #e5e7eb"
      }}
    >
      <div style={{ fontSize: 13, opacity: 0.7, marginBottom: 8 }}>
        {titulo}
      </div>

      {children}
    </div>
  );
}

export default DashboardCard;