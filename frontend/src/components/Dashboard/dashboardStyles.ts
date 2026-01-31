export const dashboardContainer = {
  minHeight: "100vh",
  padding: "16px 12px",
  maxWidth: "1400px",
  margin: "0 auto",
  width: "100%",
  boxSizing: "border-box" as const,
  overflowX: "hidden" as const,
};

export const dashboardCard = {
  width: "100%",
  borderRadius: 16,
  padding: 16,
  display: "flex" as const,
  flexDirection: "column" as const,
  boxSizing: "border-box" as const,
};

export const sectionTitle = {
  fontSize: 16,
  fontWeight: 700,
  marginBottom: 12,
};

export const gridCards = {
  display: "grid",
  gridTemplateColumns: "1fr",
  gap: 16,
  marginTop: 20,
  width: "100%",
};

export const gridGraficos = {
  display: "grid",
  gridTemplateColumns: "1fr",
  gap: 20,
  marginTop: 24,
  width: "100%",
};