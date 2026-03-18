import { PrismaPg } from "@prisma/adapter-pg";
import { PrismaClient } from "@prisma/client";

const globalForPrisma = globalThis as unknown as {
  prisma: PrismaClient | undefined;
};

const databaseUrl = process.env.DATABASE_URL;

if (!databaseUrl) {
  throw new Error("DATABASE_URL belum diatur di environment.");
}

const createPrismaClient = () => {
  const adapter = new PrismaPg({
    connectionString: databaseUrl,
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
