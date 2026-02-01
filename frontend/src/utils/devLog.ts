export function devLog(...args: unknown[]) {
  if (import.meta.env.DEV) {
    // noop em produção
  }
}