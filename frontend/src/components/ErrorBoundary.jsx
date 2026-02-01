import { Component } from "react";

export default class ErrorBoundary extends Component {
  constructor(props) {
    super(props);
    this.state = { hasError: false };
  }

  static getDerivedStateFromError() {
    return { hasError: true };
  }

  componentDidCatch(error, info) {
    // TODO: integrar serviço de logs (Sentry, LogRocket, etc.)
  }

  render() {
    if (this.state.hasError) {
      return (
        <div style={{ padding: 16, color: "#ef4444" }}>
          ⚠️ Erro ao carregar este gráfico
        </div>
      );
    }

    return this.props.children;
  }
}