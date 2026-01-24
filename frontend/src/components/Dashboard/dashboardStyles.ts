export const dashboardContainer = {
  minHeight: "100vh",
  padding: "32px 20px",
  maxWidth: "1400px",
  margin: "0 auto",
  width: "100%",
  boxSizing: "border-box" as const,
  overflowX: "hidden" as const,
};

export const dashboardCard = {
  width: "100%",
  borderRadius: 20,
  padding: 32,
  display: "flex" as const,
  flexDirection: "column" as const,
  boxSizing: "border-box" as const,
};

export const sectionTitle = {
  fontSize: 20,
  fontWeight: 700,
  marginBottom: 16,
};

export const gridCards = {
  display: "grid",
  gridTemplateColumns: "repeat(auto-fit, minmax(260px, 1fr))",
  gap: 20,
  marginTop: 32,
  width: "100%",
};

export const gridGraficos = {
  display: "grid",
  gridTemplateColumns: "repeat(auto-fit, minmax(280px, 1fr))",
  gap: 32,
  marginTop: 40,
  width: "100%",
};
