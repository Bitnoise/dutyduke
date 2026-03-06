import {
  type UpdateEducationDto,
  type UpdateEmploymentHistoryDto,
  type UpdateProjectDto,
  type UpdateLanguageDto,
  type UpdateCourseDto,
  type UpdateSkillDto,
  type CreateProjectDto,
  type CreateEmploymentHistoryDto,
  type CreateEducationDto,
  type CreateCourseDto,
} from '@/api/hris/employees/model/dtos';
import { type SkillType } from '@/api/hris/prisma/client';
import { type CUID } from '@/shared';

export type EmployeeSkillsRepository = {
  updateProjects: (employeeId: CUID, projects: UpdateProjectDto[]) => Promise<void>;
  updateLanguages: (employeeId: CUID, projects: UpdateLanguageDto[]) => Promise<void>;
  updateSkills: (type: SkillType, skills: UpdateSkillDto[]) => Promise<void>;
  addProject: (employeeId: CUID, project: CreateProjectDto, order: number) => Promise<void>;
  updateProject: (projectId: CUID, project: Omit<UpdateProjectDto, 'order'>) => Promise<void>;
  deleteProject: (projectId: CUID) => Promise<void>;
  addEmploymentHistory: (employeeId: CUID, employmentHistory: CreateEmploymentHistoryDto) => Promise<void>;
  updateEmploymentHistory: (
    employmentHistoryId: CUID,
    employmentHistory: UpdateEmploymentHistoryDto,
  ) => Promise<void>;
  deleteEmploymentHistory: (employmentHistoryId: CUID) => Promise<void>;
  addEducation: (employeeId: CUID, education: CreateEducationDto) => Promise<void>;
  updateEducation: (educationId: CUID, education: UpdateEducationDto) => Promise<void>;
  deleteEducation: (educationId: CUID) => Promise<void>;
  addCourse: (employeeId: CUID, course: CreateCourseDto) => Promise<void>;
  updateCourse: (courseId: CUID, course: UpdateCourseDto) => Promise<void>;
  deleteCourse: (courseId: CUID) => Promise<void>;
  getSkillsByEmployeeId: (employeeId: CUID, type: SkillType) => Promise<UpdateSkillDto[]>;
  removeSkillsFromEmployee: (employeeId: CUID, skillIds: CUID[]) => Promise<void>;
};
