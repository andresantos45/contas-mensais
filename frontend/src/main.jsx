import React from "react";
import ReactDOM from "react-dom/client";
import App from "./App";
import "./index.css";

// 🔽 ADICIONAR ESTE BLOCO
import { Chart as ChartJS, ArcElement, Tooltip, Legend } from "chart.js";

// 🔴 REGISTRO OBRIGATÓRIO PARA GRÁFICOS DE PIZZA
ChartJS.register(ArcElement, Tooltip, Legend);

const rootElement = document.getElementById("root");

if (!rootElement) {
  throw new Error("Elemento #root não encontrado no HTML");
}

ReactDOM.createRoot(rootElement).render(
  <React.StrictMode>
    <App />
  </React.StrictMode>,
);
