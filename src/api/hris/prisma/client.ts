import { fieldEncryptionExtension } from 'prisma-field-encryption';
import { Prisma, PrismaClient } from '../../../../.prisma-generated/organization-client';

export {
  PrismaClient as OrganizationPrismaClient,
  Prisma as OrganizationPrisma,
} from '../../../../.prisma-generated/organization-client';
export * from '../../../../.prisma-generated/organization-client';

// Global for singleton pattern in development
const globalForPrisma = global as unknown as { prisma: PrismaClient | undefined };

// Create singleton Prisma client with field encryption
const createPrismaClient = () => {
  const client = new PrismaClient({
    log: process.env.NODE_ENV === 'development' ? ['error', 'warn'] : ['error'],
    datasources: {
      client_db: {
        url: process.env.DATABASE_URL,
      },
    },
  }).$extends(
    fieldEncryptionExtension({
      encryptionKey: process.env.PRISMA_FIELD_ENCRYPTION_KEY!,
      dmmf: Prisma.dmmf,
    }),
  ) as PrismaClient;

  return client;
};

// Lazy singleton — only instantiated when first accessed (avoids build-time errors)
const getPrismaClient = (): PrismaClient => {
  if (!globalForPrisma.prisma) {
    globalForPrisma.prisma = createPrismaClient();
  }
  return globalForPrisma.prisma;
};

export const prisma = new Proxy({} as PrismaClient, {
  get(_target, prop) {
    return getPrismaClient()[prop as keyof PrismaClient];
  },
});

export default prisma;
