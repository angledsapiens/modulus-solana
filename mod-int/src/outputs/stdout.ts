export function emit(label: string, payload: unknown) {
  console.log(`[OUTPUT:${label}]`);
  console.dir(payload, { depth: null });
}
