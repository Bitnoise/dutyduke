import {
  type CourseSchema,
  type EducationSchema,
  type EmploymentHistorySchema,
  type ProjectSchema,
  type LanguageSchema,
} from '@/app/(hris)/employees/[id]/skills/_schemas';

export type SkillsValidationError<T> = Record<string, Partial<Record<keyof T, string[] | undefined>>>;

export type ActionErrorState = {
  status: 'error';
  error: string;
};

export type EmploymentHistoryErrors = SkillsValidationError<EmploymentHistorySchema>;
export type ProjectErrors = SkillsValidationError<ProjectSchema>;
export type EducationErrors = SkillsValidationError<EducationSchema>;
export type CourseErrors = SkillsValidationError<CourseSchema>;
export type LanguageErrors = SkillsValidationError<LanguageSchema>;

export type CareerDevelopmentErrors = {
  employmentHistory: EmploymentHistoryErrors;
  projects: ProjectErrors;
};

export type EducationSectionErrors = {
  education: EducationErrors;
  courses: CourseErrors;
};

export type SkillsSectionErrors = {
  languages: LanguageErrors;
};
