import { isOwnerRoute, privateRoute, type PermissionChecker } from '@/api/hris/authorization';
import { resourcesAcl } from '@/api/hris/employees/infrastructure/acl';
import { type OrganizationContext } from '@/api/hris';
import {
  employeeRepository,
  employeeSkillsRepository,
} from '@/api/hris/employees/infrastructure/database/repositories';
import {
  addCourseUseCase,
  addEducationUseCase,
  addEmploymentHistoryUseCase,
  addProjectUseCase,
  changeProjectOrderUseCase,
  deleteCourseUseCase,
  deleteEducationUseCase,
  deleteEmploymentHistoryUseCase,
  deleteProjectUseCase,
  updateCourseUseCase,
  updateEducationUseCase,
  updateEmployeeSkillsUseCase,
  updateEmploymentHistoryUseCase,
  updateProjectUseCase,
  validateEmployeeStatusUseCase,
} from '@/api/hris/employees/model/use-cases';
import { type Direction, type CUID } from '@/shared';
import {
  type EmployeeSkillsDto,
  type CreateProjectDto,
  type UpdateProjectDto,
  type CreateEmploymentHistoryDto,
  type UpdateEmploymentHistoryDto,
  type UpdateEducationDto,
  type CreateEducationDto,
  type CreateCourseDto,
  type UpdateCourseDto,
  type UpdateEmployeeSkillsDto,
} from '@/api/hris/employees/model/dtos';
import { documentsAcl, type EmployeeCVPayload } from '@/api/hris/employees/infrastructure/acl/documents.acl';
import { organizationAcl } from '@/api/hris/employees/infrastructure/acl/organization.acl';
import { StringTools } from '@/shared/utils/string-tools';
import { employeeQueries, employeesSkillQueries } from '@/api/hris/employees/infrastructure/database/queries';
import { getUserLocale } from '@/shared/service/locale/user-locale.service';

export type EmployeeSkillsController = {
  getEmployeeSkills: (employeeId: string) => Promise<EmployeeSkillsDto>;
  getAllEmployeesBySkillIds: (skillIds: CUID[]) => Promise<CUID[]>;
  updateEmployeeSkills: (employeeId: string, skills: UpdateEmployeeSkillsDto) => Promise<void>;
  getEmployeeCvPdfBuffer: (
    employeeId: CUID,
    anonymize: boolean,
  ) => Promise<{ buffer: Buffer; filename: string }>;
  addProject: (employeeId: CUID, project: CreateProjectDto) => Promise<void>;
  changeProjectOrder: (projectId: CUID, employeeId: CUID, dir: Direction) => Promise<void>;
  updateProject: (
    employeeId: CUID,
    projectId: CUID,
    project: Omit<UpdateProjectDto, 'order'>,
  ) => Promise<void>;
  deleteProject: (projectId: CUID, employeeId: CUID) => Promise<void>;
  addEmploymentHistory: (employeeId: CUID, employmentHistory: CreateEmploymentHistoryDto) => Promise<void>;
  updateEmploymentHistory: (
    employeeId: CUID,
    employmentHistoryId: CUID,
    employmentHistory: UpdateEmploymentHistoryDto,
  ) => Promise<void>;
  deleteEmploymentHistory: (employeeId: CUID, employmentHistoryId: CUID) => Promise<void>;
  addEducation: (employeeId: CUID, education: CreateEducationDto) => Promise<void>;
  updateEducation: (employeeId: CUID, educationId: CUID, education: UpdateEducationDto) => Promise<void>;
  deleteEducation: (employeeId: CUID, educationId: CUID) => Promise<void>;
  addCourse: (employeeId: CUID, course: CreateCourseDto) => Promise<void>;
  updateCourse: (employeeId: CUID, courseId: CUID, course: UpdateCourseDto) => Promise<void>;
  deleteCourse: (employeeId: CUID, courseId: CUID) => Promise<void>;
};

export function employeeSkillsController(organizationContext: OrganizationContext): EmployeeSkillsController {
  const employeeRepositoryImpl = employeeRepository(organizationContext.db);
  const employeeSkillsRepositoryImpl = employeeSkillsRepository(organizationContext.db);
  const employeeQueriesImpl = employeeQueries(organizationContext);
  const resourcesAclImpl = resourcesAcl(organizationContext);

  const employeeSkillsQueriesImpl = employeesSkillQueries(organizationContext);
  const documentsAclInstance = documentsAcl(organizationContext);
  const organizationAclInstance = organizationAcl(organizationContext);

  const updateEmployeeSkills = async (
    checker: PermissionChecker,
    employeeId: string,
    skills: UpdateEmployeeSkillsDto,
  ) => {
    await validateEmployeeStatusUseCase(employeeQueriesImpl)(employeeId);

    await updateEmployeeSkillsUseCase(
      employeeSkillsRepositoryImpl,
      employeeRepositoryImpl,
      resourcesAclImpl,
    )(employeeId, skills);
  };

  const getEmployeeCvPdfBuffer = async (
    checker: PermissionChecker,
    employeeId: CUID,
    anonymize: boolean,
  ): Promise<{ buffer: Buffer; filename: string }> => {
    const locale = await getUserLocale();
    const templateVariable = await employeeSkillsQueriesImpl.getEmployeeCVPayload(employeeId, locale);
    const organizationOverview = await organizationAclInstance.getOrganizationOverview();

    const buffer = await documentsAclInstance.getEmployeeCvPdfBuffer(<EmployeeCVPayload>{
      isAnonymized: anonymize,
      companyName: organizationOverview?.name,
      ...templateVariable,
    });

    const filename = StringTools.removeDiacritics(
      `cv_${templateVariable.firstName.toLowerCase()}_${anonymize ? templateVariable.lastNameFirstLetter.toLowerCase() : templateVariable.lastName.toLowerCase()}.pdf`,
    );
    return {
      buffer,
      filename,
    };
  };

  const addProject = async (checker: PermissionChecker, employeeId: CUID, project: CreateProjectDto) => {
    await validateEmployeeStatusUseCase(employeeQueriesImpl)(employeeId);

    const projects = await employeeSkillsQueriesImpl.getEmployeeProjects(employeeId);

    await addProjectUseCase(employeeSkillsRepositoryImpl)(employeeId, project, projects);
  };

  const changeProjectOrder = async (
    checker: PermissionChecker,
    projectId: CUID,
    employeeId: CUID,
    dir: Direction,
  ) => {
    await validateEmployeeStatusUseCase(employeeQueriesImpl)(employeeId);

    const projects = await employeeSkillsQueriesImpl.getEmployeeProjects(employeeId);

    await changeProjectOrderUseCase(employeeSkillsRepositoryImpl)(projectId, employeeId, projects, dir);
  };

  const updateProject = async (
    checker: PermissionChecker,
    employeeId: CUID,
    projectId: CUID,
    project: Omit<UpdateProjectDto, 'order'>,
  ) => {
    await validateEmployeeStatusUseCase(employeeQueriesImpl)(employeeId);

    await updateProjectUseCase(employeeSkillsRepositoryImpl)(projectId, project);
  };

  const deleteProject = async (checker: PermissionChecker, projectId: CUID, employeeId: CUID) => {
    await validateEmployeeStatusUseCase(employeeQueriesImpl)(employeeId);

    const projects = await employeeSkillsQueriesImpl.getEmployeeProjects(employeeId);

    await deleteProjectUseCase(employeeSkillsRepositoryImpl)(projectId, employeeId, projects);
  };

  const addEmploymentHistory = async (
    checker: PermissionChecker,
    employeeId: CUID,
    employmentHistory: CreateEmploymentHistoryDto,
  ) => {
    await validateEmployeeStatusUseCase(employeeQueriesImpl)(employeeId);

    await addEmploymentHistoryUseCase(employeeSkillsRepositoryImpl)(employeeId, employmentHistory);
  };

  const updateEmploymentHistory = async (
    checker: PermissionChecker,
    employeeId: CUID,
    employmentHistoryId: CUID,
    employmentHistory: UpdateEmploymentHistoryDto,
  ) => {
    await validateEmployeeStatusUseCase(employeeQueriesImpl)(employeeId);

    await updateEmploymentHistoryUseCase(employeeSkillsRepositoryImpl)(
      employmentHistoryId,
      employmentHistory,
    );
  };

  const deleteEmploymentHistory = async (
    checker: PermissionChecker,
    employeeId: CUID,
    employmentHistoryId: CUID,
  ) => {
    await validateEmployeeStatusUseCase(employeeQueriesImpl)(employeeId);

    await deleteEmploymentHistoryUseCase(employeeSkillsRepositoryImpl)(employmentHistoryId);
  };

  const addEducation = async (
    checker: PermissionChecker,
    employeeId: CUID,
    education: CreateEducationDto,
  ) => {
    await validateEmployeeStatusUseCase(employeeQueriesImpl)(employeeId);

    await addEducationUseCase(employeeSkillsRepositoryImpl)(employeeId, education);
  };

  const updateEducation = async (
    checker: PermissionChecker,
    employeeId: CUID,
    educationId: CUID,
    education: UpdateEducationDto,
  ) => {
    await validateEmployeeStatusUseCase(employeeQueriesImpl)(employeeId);

    await updateEducationUseCase(employeeSkillsRepositoryImpl)(educationId, education);
  };

  const deleteEducation = async (checker: PermissionChecker, employeeId: CUID, educationId: CUID) => {
    await validateEmployeeStatusUseCase(employeeQueriesImpl)(employeeId);

    await deleteEducationUseCase(employeeSkillsRepositoryImpl)(educationId);
  };

  const addCourse = async (checker: PermissionChecker, employeeId: CUID, course: CreateCourseDto) => {
    await validateEmployeeStatusUseCase(employeeQueriesImpl)(employeeId);

    await addCourseUseCase(employeeSkillsRepositoryImpl)(employeeId, course);
  };

  const updateCourse = async (
    checker: PermissionChecker,
    employeeId: CUID,
    courseId: CUID,
    course: UpdateCourseDto,
  ) => {
    await validateEmployeeStatusUseCase(employeeQueriesImpl)(employeeId);

    await updateCourseUseCase(employeeSkillsRepositoryImpl)(courseId, course);
  };

  const deleteCourse = async (checker: PermissionChecker, employeeId: CUID, courseId: CUID) => {
    await validateEmployeeStatusUseCase(employeeQueriesImpl)(employeeId);

    await deleteCourseUseCase(employeeSkillsRepositoryImpl)(courseId);
  };

  const getEmployeeSkills = async (checker: PermissionChecker, employeeId: string) => {
    return employeeSkillsQueriesImpl.getEmployeeSkills(employeeId);
  };

  const getAllEmployeesBySkillIds = async (checker: PermissionChecker, skillIds: CUID[]) => {
    return employeeSkillsQueriesImpl.getAllEmployeesBySkillIds(skillIds);
  };

  return {
    getEmployeeSkills: privateRoute(getEmployeeSkills),
    updateEmployeeSkills: privateRoute(updateEmployeeSkills),
    getEmployeeCvPdfBuffer: isOwnerRoute(getEmployeeCvPdfBuffer),
    addProject: privateRoute(addProject),
    changeProjectOrder: privateRoute(changeProjectOrder),
    updateProject: privateRoute(updateProject),
    deleteProject: privateRoute(deleteProject),
    addEmploymentHistory: privateRoute(addEmploymentHistory),
    updateEmploymentHistory: privateRoute(updateEmploymentHistory),
    deleteEmploymentHistory: privateRoute(deleteEmploymentHistory),
    addEducation: privateRoute(addEducation),
    updateEducation: privateRoute(updateEducation),
    deleteEducation: privateRoute(deleteEducation),
    addCourse: privateRoute(addCourse),
    updateCourse: privateRoute(updateCourse),
    deleteCourse: privateRoute(deleteCourse),
    getAllEmployeesBySkillIds: privateRoute(getAllEmployeesBySkillIds),
  };
}
