/**
 * Formatadores utilitários para localização brasileira (PT-BR).
 * Garante apresentação consistente de moeda e datas na NexaCore.
 */

/**
 * Formata um número ou valor decimal no padrão monetário do Real Brasileiro (R$).
 * Exemplo: 1299.9 -> "R$ 1.299,90"
 */
export function formatarPreco(valor: number | string | { toString(): string } | null | undefined): string {
  if (valor === null || valor === undefined) return "R$ 0,00";
  const num = typeof valor === "number" ? valor : parseFloat(valor.toString());
  if (isNaN(num)) return "R$ 0,00";

  return new Intl.NumberFormat("pt-BR", {
    style: "currency",
    currency: "BRL",
  }).format(num);
}

/**
 * Formata uma data no formato brasileiro tradicional (DD/MM/AAAA).
 * Exemplo: Date -> "23/10/2026"
 */
export function formatarData(data: Date | string | number | null | undefined): string {
  if (!data) return "-";
  const d = new Date(data);
  if (isNaN(d.getTime())) return "-";

  return new Intl.DateTimeFormat("pt-BR", {
    day: "2-digit",
    month: "2-digit",
    year: "numeric",
  }).format(d);
}

/**
 * Formata data e hora no padrão brasileiro (DD/MM/AAAA às HH:mm).
 */
export function formatarDataHora(data: Date | string | number | null | undefined): string {
  if (!data) return "-";
  const d = new Date(data);
  if (isNaN(d.getTime())) return "-";

  const dataStr = new Intl.DateTimeFormat("pt-BR", {
    day: "2-digit",
    month: "2-digit",
    year: "numeric",
  }).format(d);

  const horaStr = new Intl.DateTimeFormat("pt-BR", {
    hour: "2-digit",
    minute: "2-digit",
  }).format(d);

  return `${dataStr} às ${horaStr}`;
}
