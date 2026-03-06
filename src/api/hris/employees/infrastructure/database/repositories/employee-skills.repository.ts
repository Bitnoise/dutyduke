import {
  type UpdateEmploymentHistoryDto,
  type UpdateEducationDto,
  type UpdateProjectDto,
  type UpdateLanguageDto,
  type UpdateCourseDto,
  type UpdateSkillDto,
  type CreateProjectDto,
  type CreateEmploymentHistoryDto,
  type CreateEducationDto,
  type CreateCourseDto,
} from '@/api/hris/employees/model/dtos';
import { type EmployeeSkillsRepository } from '@/api/hris/employees/model/repositories';
import { type SkillType, type OrganizationPrismaClient } from '@/api/hris/prisma/client';
import { type CUID } from '@/shared';

export function employeeSkillsRepository(db: OrganizationPrismaClient): EmployeeSkillsRepository {
  const updateEmploymentHistory = async (
    employmentHistoryId: CUID,
    employmentHistory: UpdateEmploymentHistoryDto,
  ) => {
    await db.employeeEmploymentHistory.update({
      data: employmentHistory,
      where: { id: employmentHistoryId },
    });
  };

  const updateProjects = async (employeeId: CUID, projects: UpdateProjectDto[]) => {
    await db.employeeProject.deleteMany({ where: { employeeId } });
    await db.employeeProject.createMany({ data: projects.map((project) => ({ ...project, employeeId })) });
  };

  const updateLanguages = async (employeeId: CUID, languages: UpdateLanguageDto[]) => {
    await db.employeeLanguage.deleteMany({ where: { employeeId } });
    await db.employeeLanguage.createMany({ data: languages });
  };

  const updateSkills = async (type: SkillType, skills: UpdateSkillDto[]) => {
    await Promise.all(
      skills.map((skill) =>
        db.employeeSkill.upsert({
          where: {
            employeeId_skillId: {
              employeeId: skill.employeeId,
              skillId: skill.skillId,
            },
          },
          update: {
            type,
          },
          create: {
            ...skill,
            type,
          },
        }),
      ),
    );
  };

  const addProject = async (employeeId: CUID, project: CreateProjectDto, order: number) => {
    await db.employeeProject.create({
      data: {
        ...project,
        order,
        employee: {
          connect: {
            id: employeeId,
          },
        },
      },
    });
  };

  const updateProject = async (projectId: CUID, project: Omit<UpdateProjectDto, 'order'>) => {
    await db.employeeProject.update({ data: project, where: { id: projectId } });
  };

  const deleteProject = async (projectId: CUID) => {
    await db.employeeProject.delete({ where: { id: projectId } });
  };

  const addEmploymentHistory = async (employeeId: CUID, employmentHistory: CreateEmploymentHistoryDto) => {
    await db.employeeEmploymentHistory.create({
      data: {
        ...employmentHistory,
        employee: {
          connect: {
            id: employeeId,
          },
        },
      },
    });
  };

  const deleteEmploymentHistory = async (employmentHistoryId: CUID) => {
    await db.employeeEmploymentHistory.delete({ where: { id: employmentHistoryId } });
  };

  const addEducation = async (employeeId: CUID, education: CreateEducationDto) => {
    await db.employeeEducation.create({
      data: {
        ...education,
        employee: {
          connect: {
            id: employeeId,
          },
        },
      },
    });
  };

  const updateEducation = async (educationId: CUID, education: UpdateEducationDto) => {
    await db.employeeEducation.update({ data: education, where: { id: educationId } });
  };

  const deleteEducation = async (educationId: CUID) => {
    await db.employeeEducation.delete({ where: { id: educationId } });
  };

  const addCourse = async (employeeId: CUID, course: CreateCourseDto) => {
    await db.employeeCourse.create({
      data: {
        ...course,
        employee: {
          connect: {
            id: employeeId,
          },
        },
      },
    });
  };

  const updateCourse = async (courseId: CUID, course: UpdateCourseDto) => {
    await db.employeeCourse.update({ data: course, where: { id: courseId } });
  };

  const deleteCourse = async (courseId: CUID) => {
    await db.employeeCourse.delete({ where: { id: courseId } });
  };

  const getSkillsByEmployeeId = async (employeeId: CUID, type: SkillType) =>
    db.employeeSkill.findMany({
      where: {
        employeeId,
        type,
      },
    });

  const removeSkillsFromEmployee = async (employeeId: CUID, skillIds: CUID[]) => {
    await db.employeeSkill.deleteMany({
      where: {
        employeeId,
        skillId: {
          in: skillIds,
        },
      },
    });
  };

  return {
    updateProjects,
    updateLanguages,
    updateSkills,
    addProject,
    updateProject,
    deleteProject,
    addEmploymentHistory,
    updateEmploymentHistory,
    deleteEmploymentHistory,
    addEducation,
    updateEducation,
    deleteEducation,
    addCourse,
    updateCourse,
    deleteCourse,
    getSkillsByEmployeeId,
    removeSkillsFromEmployee,
  };
}
