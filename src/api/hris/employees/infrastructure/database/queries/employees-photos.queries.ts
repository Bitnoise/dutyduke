import { type OrganizationPrismaClient } from '@/api/hris/prisma/client';
import { type Nullable, type CUID } from '@/shared';

export function employeesPhotosQueries(db: OrganizationPrismaClient) {
  const getEmployeePhotos = (employeeId: CUID) =>
    db.employee.findMany({ select: { photosIds: true, avatarId: true }, where: { id: employeeId } });

  const getEmployeeAvatar = async (employeeId: CUID): Promise<Nullable<CUID>> => {
    const employeeAvatar = await db.employee.findFirst({
      where: { id: employeeId },
      select: { avatarId: true },
    });

    return employeeAvatar?.avatarId ?? null;
  };

  return {
    getEmployeePhotos,
    getEmployeeAvatar,
  };
}
