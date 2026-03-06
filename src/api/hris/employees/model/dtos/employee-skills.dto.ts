import { type Nullable, type CUID, type WithoutId } from '@/shared';

type BaseEmployeeSkillEntry = {
  id: CUID;
  startDate: Date;
  endDate: Nullable<Date>;
};

type UpdateDto<T extends { id: CUID }> = Omit<T, 'id'> & { employeeId: CUID };

export type ProjectDto = BaseEmployeeSkillEntry & {
  name: string;
  role: string;
  description: Nullable<string>;
  order: number;
  isVisible: boolean;
};

export type CreateProjectDto = WithoutId<BaseEmployeeSkillEntry> & {
  name: string;
  role: string;
  description: Nullable<string>;
  isVisible: boolean;
};

export type UpdateProjectDto = Omit<UpdateDto<ProjectDto>, 'employeeId'>;

export type EmploymentHistoryDto = BaseEmployeeSkillEntry & {
  role: string;
  company: string;
  description: Nullable<string>;
};

export type CreateEmploymentHistoryDto = WithoutId<EmploymentHistoryDto>;

export type UpdateEmploymentHistoryDto = Omit<UpdateDto<EmploymentHistoryDto>, 'employeeId'>;

export type EducationDto = BaseEmployeeSkillEntry & {
  name: string;
};

export type CreateEducationDto = WithoutId<EducationDto>;

export type UpdateEducationDto = Omit<UpdateDto<EducationDto>, 'employeeId'>;

export type CourseDto = Pick<BaseEmployeeSkillEntry, 'id'> & {
  date: Date;
  name: string;
};

export type CreateCourseDto = WithoutId<CourseDto>;

export type UpdateCourseDto = WithoutId<CourseDto>;

export type LanguageDto = {
  id: CUID;
  name: string;
  level: string;
};

export type UpdateLanguageDto = UpdateDto<LanguageDto>;

export type EmployeeSkillDto = {
  id: CUID;
  type: 'PRIMARY' | 'SECONDARY';
  employeeId: CUID;
  skillId: CUID;
  name: string;
};

export type UpdateSkillDto = Pick<EmployeeSkillDto, 'skillId'> & {
  type: 'PRIMARY' | 'SECONDARY';
  employeeId: CUID;
};

export type PrimarySkillDto = {
  id: CUID;
  type: 'PRIMARY';
  skillId: CUID;
  employeeId: CUID;
  name: string;
};

export type SecondarySkillDto = {
  id: CUID;
  type: 'SECONDARY';
  skillId: CUID;
  employeeId: CUID;
  name: string;
};

export type EmployeeSkillsDto = {
  projects: ProjectDto[];
  employmentHistory: EmploymentHistoryDto[];
  education: EducationDto[];
  courses: CourseDto[];
  primarySkills: PrimarySkillDto[];
  secondarySkills: SecondarySkillDto[];
  languages: LanguageDto[];
  description: Nullable<string>;
};

export type UpdateEmployeeSkillsDto = {
  description: Nullable<string>;
  languages: LanguageDto[];
  primarySkills: string[];
  secondarySkills: string[];
};
