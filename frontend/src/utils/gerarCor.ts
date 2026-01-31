function hashTexto(texto: string) {
  let hash = 0;

  for (let i = 0; i < texto.length; i++) {
    hash = texto.charCodeAt(i) + ((hash << 5) - hash);
  }

  return hash;
}

// 🎨 cor base determinística (paleta controlada e legível)
export function gerarCor(texto: string) {
  const hash = Math.abs(hashTexto(texto));

  // 🎯 paleta com cores bem separadas visualmente
  const PALETA_HUES = [
    210, // azul
    0, // vermelho
    120, // verde
    45, // laranja
    270, // roxo
    330, // rosa
    180, // ciano
    90, // lima
  ];

  const index = hash % PALETA_HUES.length;
  const hue = PALETA_HUES[index];

  // 🔥 alterna luminosidade para evitar cores parecidas
  const lightness = index % 2 === 0 ? 48 : 58;

  return `hsl(${hue}, 70%, ${lightness}%)`;
}

// 🗂️ categoria → mesma cor em todo o sistema
export function getCorCategoria(nome: string) {
  return gerarCor(nome.toLowerCase().trim());
}

// 📊 comparativos (Entradas x Saídas, etc.)
export function getCorComparativo(label: string) {
  return gerarCor(label.toUpperCase());
}
