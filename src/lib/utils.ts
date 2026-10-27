import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

/**
 * Utilitário para combinar classes condicionais do Tailwind CSS de forma segura.
 */
export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}
