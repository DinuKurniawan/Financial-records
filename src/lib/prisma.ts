import { PrismaBetterSqlite3 } from "@prisma/adapter-better-sqlite3";
import { PrismaClient } from "@prisma/client";

const globalForPrisma = globalThis as unknown as {
  prisma: PrismaClient | undefined;
};

const databaseUrl = process.env.DATABASE_URL;

if (!databaseUrl) {
  throw new Error("DATABASE_URL belum diatur di file .env.");
}

const createPrismaClient = () => {
  const adapter = new PrismaBetterSqlite3({
    url: databaseUrl,
  });

  return new PrismaClient({
    adapter,
  });
};

function hasCurrentFinanceDelegates(
  client: PrismaClient | undefined,
): client is PrismaClient {
  return Boolean(client && "category" in client);
}

const cachedPrisma = globalForPrisma.prisma;

// During `next dev`, the global Prisma client can outlive a schema change.
// Recreate it when the cached instance does not yet expose the latest delegates.
export const prisma = hasCurrentFinanceDelegates(cachedPrisma)
  ? cachedPrisma
  : createPrismaClient();

if (process.env.NODE_ENV !== "production") {
  globalForPrisma.prisma = prisma;
}
