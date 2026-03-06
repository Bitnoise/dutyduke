import dayjs from 'dayjs';
import { type OrganizationPrismaClient } from '@/api/hris/prisma/client';

export function changePasswordTokenQueries(db: OrganizationPrismaClient) {
  const getChangePasswordRequestByEmail = async (email: string) =>
    db.changePasswordRequest.findUnique({
      where: {
        email,
      },
    });

  const getActiveChangePasswordRequestByEmail = async (email: string) =>
    db.changePasswordRequest.findUnique({
      where: {
        email,
        expiresAt: {
          gte: dayjs().toDate(),
        },
      },
    });

  const getActiveChangePasswordRequestByToken = async (token: string) =>
    db.changePasswordRequest.findFirst({
      where: {
        token,
        expiresAt: {
          gte: dayjs().toDate(),
        },
      },
    });

  return {
    getChangePasswordRequestByEmail,
    getActiveChangePasswordRequestByEmail,
    getActiveChangePasswordRequestByToken,
  };
}
