import { PrismaClient } from "@prisma/client";

/**
 * Instância singleton do Prisma Client.
 * Evita múltiplas instâncias em desenvolvimento geradas pelo Hot Reloading do Next.js.
 */
const globalForPrisma = globalThis as unknown as {
  prisma: PrismaClient | undefined;
};

export const prisma =
  globalForPrisma.prisma ??
  new PrismaClient({
    log: process.env.NODE_ENV === "development" ? ["warn", "error"] : ["error"],
  });

if (process.env.NODE_ENV !== "production") {
  globalForPrisma.prisma = prisma;
}
