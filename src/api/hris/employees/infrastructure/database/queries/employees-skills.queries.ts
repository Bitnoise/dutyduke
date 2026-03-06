import { type OrganizationContext } from '@/api/hris';
import { EMPLOYEE_ERROR_MESSAGES } from '@/api/hris/employees/errors';
import { resourcesAcl } from '@/api/hris/employees/infrastructure/acl';
import {
  type ProjectDto,
  type EmployeeSkillsDto,
  type PrimarySkillDto,
  type SecondarySkillDto,
  type EmployeeSkillDto,
} from '@/api/hris/employees/model/dtos';
import { calculatePeriod, parseDate, type CUID } from '@/shared';
import { type EmployeeCVPayload } from '@/templates/pdf/cv';

type EmployeeCVPayloadData = Omit<EmployeeCVPayload, 'isAnonymized' | 'companyName'>;

export type EmployeesSkillQueries = {
  getEmployeeSkills: (employeeId: CUID) => Promise<EmployeeSkillsDto>;
  getEmployeeCVPayload(employeeId: CUID, locale: string): Promise<EmployeeCVPayloadData>;
  getEmployeeProjects(employeeId: CUID): Promise<ProjectDto[]>;
  getEmployeeSkillsByIds: (skillIds: CUID[]) => Promise<Omit<EmployeeSkillDto, 'name'>[]>;
  getAllEmployeesBySkillIds: (skillIds: CUID[]) => Promise<CUID[]>;
};

export function employeesSkillQueries(organizationContext: OrganizationContext): EmployeesSkillQueries {
  const { db } = organizationContext;

  const getEmployeeSkills = async (employeeId: CUID): Promise<EmployeeSkillsDto> => {
    const resourcesAclImpl = resourcesAcl(organizationContext);

    const employee = await db.employee.findUnique({
      select: { description: true },
      where: { id: employeeId },
    });

    const [employeePrimarySkillIds, employeeSecondarySkillIds] = await Promise.all([
      db.employeeSkill.findMany({
        select: { skillId: true },
        where: { employeeId, type: 'PRIMARY' },
      }),
      db.employeeSkill.findMany({
        select: { skillId: true },
        where: { employeeId, type: 'SECONDARY' },
      }),
    ]);

    const [primarySkills, secondarySkills] = await Promise.all([
      resourcesAclImpl.getEmployeeSkills(
        'PRIMARY',
        employeeId,
        employeePrimarySkillIds.map(({ skillId }) => skillId),
      ),
      resourcesAclImpl.getEmployeeSkills(
        'SECONDARY',
        employeeId,
        employeeSecondarySkillIds.map(({ skillId }) => skillId),
      ),
    ]);

    const [education, employmentHistory, projects, languages, courses] = await Promise.all([
      db.employeeEducation.findMany({
        where: { employeeId },
        orderBy: { startDate: 'desc' },
      }),
      db.employeeEmploymentHistory.findMany({
        where: { employeeId },
        orderBy: { startDate: 'desc' },
      }),
      db.employeeProject.findMany({ where: { employeeId }, orderBy: { order: 'asc' } }),
      db.employeeLanguage.findMany({ where: { employeeId } }),
      db.employeeCourse.findMany({ where: { employeeId } }),
    ]);

    return {
      description: employee?.description ?? null,
      education,
      employmentHistory,
      projects,
      languages,
      courses,
      primarySkills: primarySkills as PrimarySkillDto[],
      secondarySkills: secondarySkills as SecondarySkillDto[],
    };
  };

  const getEmployeeCVPayload = async (employeeId: CUID, _locale: string): Promise<EmployeeCVPayloadData> => {
    const employee = (await db.employee.findUnique({
      where: { id: employeeId },
      select: {
        firstName: true,
        lastName: true,
        description: true,
        role: true,
      },
    })) as {
      firstName: string;
      lastName: string;
      description: string;
      role: string;
    } | null;

    if (!employee) {
      throw new Error(EMPLOYEE_ERROR_MESSAGES.NOT_FOUND(employeeId));
    }

    const skills = await getEmployeeSkills(employeeId);

    return <EmployeeCVPayloadData>{
      firstName: employee.firstName,
      lastName: employee.lastName,
      lastNameFirstLetter: employee.lastName.charAt(0),
      position: employee.role,
      description: employee.description,
      primarySkills: skills.primarySkills.map((skill) => skill.name),
      secondarySkills: skills.secondarySkills.map((skill) => skill.name),
      languages: skills.languages.map((language: { level: string; name: string }) => ({
        name: language.name,
        level: language.level,
      })),
      projects: skills.projects
        .filter((project) => project.isVisible)
        .map((project) => ({
          period: calculatePeriod(
            new Date(project.startDate),
            project.endDate ? new Date(project.endDate) : new Date(),
          ),
          position: project.role,
          name: project.name,
          description: project.description,
        })),
      experience: skills.employmentHistory.map((history) => ({
        from: parseDate(history.startDate, 'MM.YYYY'),
        to: parseDate(history.endDate, 'MM.YYYY'),
        position: history.role,
        company: history.company,
        description: history.description,
      })),
      education: skills.education.map((education) => ({
        from: parseDate(education.startDate, 'MM.YYYY'),
        to: parseDate(education.endDate, 'MM.YYYY'),
        description: education.name,
      })),
    };
  };

  const getEmployeeProjects = (employeeId: CUID) => {
    return db.employeeProject.findMany({ where: { employeeId } });
  };

  const getEmployeeSkillsByIds = (skillIds: CUID[]) =>
    db.employeeSkill.findMany({
      where: {
        skillId: {
          in: skillIds,
        },
      },
    });

  const getAllEmployeesBySkillIds = (skillIds: CUID[]) =>
    db.employeeSkill
      .findMany({
        where: {
          skillId: {
            in: skillIds,
          },
        },
        select: {
          employeeId: true,
        },
      })
      .then((skills) => skills.map((skill) => skill.employeeId));

  return {
    getEmployeeSkills,
    getEmployeeCVPayload,
    getEmployeeProjects,
    getEmployeeSkillsByIds,
    getAllEmployeesBySkillIds,
  };
}
