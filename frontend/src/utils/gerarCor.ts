export function gerarCor(texto: string) {
  let hash = 0;

  for (let i = 0; i < texto.length; i++) {
    hash = texto.charCodeAt(i) + ((hash << 5) - hash);
  }

  // 🔥 usa saltos grandes no círculo cromático
  const GOLDEN_ANGLE = 137.508;
  const hue = Math.abs(hash * GOLDEN_ANGLE) % 360;

  return `hsl(${hue}, 75%, 50%)`;
}