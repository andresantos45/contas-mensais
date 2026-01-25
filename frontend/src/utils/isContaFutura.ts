export function isContaFutura(data: string) {
  if (!data) return false;

  const hoje = new Date();
  hoje.setHours(0, 0, 0, 0);

  const dataConta = new Date(data);
  dataConta.setHours(0, 0, 0, 0);

  return dataConta > hoje;
}
