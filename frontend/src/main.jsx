// import React from "react";
// import ReactDOM from "react-dom/client";
// import { BrowserRouter } from "react-router-dom";
// import App from "./App";
// import "./index.css";

// // ChartJS (ok ficar aqui)
// import { Chart as ChartJS, ArcElement, Tooltip, Legend } from "chart.js";
// ChartJS.register(ArcElement, Tooltip, Legend);

// const rootElement = document.getElementById("root");

// if (!rootElement) {
//   throw new Error("Elemento #root não encontrado no HTML");
// }

// ReactDOM.createRoot(rootElement).render(
//   <React.StrictMode>
//     <BrowserRouter>
//       <App />
//     </BrowserRouter>
//   </React.StrictMode>
// );

export default function App() {
  return (
    <div style={{ padding: 40, color: "#000" }}>
      <h1>App renderizou</h1>
      <p>Se você está vendo isso, o problema é rota/autenticação</p>
    </div>
  );
}