import { hrisApi } from '@/api/hris';
import { type CUID } from '@/shared';
import {
  BasicInfoForm,
  CoursesForm,
  EducationForm,
  EmploymentHistoryForm,
  ProjectsForm,
} from '@/app/(hris)/employees/[id]/skills/_forms';
import { getPermissionChecker } from '@/api/hris/authorization';
import { ResourceType, PermissionAction } from '@/api/hris/authorization/permissions';

type Props = {
  id: CUID;
};

export default async function EmployeeSkillsContent({ id }: Props) {
  const api = hrisApi;
  const [employee, skills, skillsFromResources, me, checker] = await Promise.all([
    api.employees.getEmployeeById(id),
    api.employees.getEmployeeSkills(id),
    api.resources.getAllSkills(),
    api.auth.getMe(),
    getPermissionChecker(),
  ]);

  const isArchived = employee.status === 'ARCHIVED';
  const canEdit = checker.can(ResourceType.EMPLOYEES, PermissionAction.EDIT);
  const isDisabled = isArchived || !canEdit;

  const {
    education,
    employmentHistory,
    projects,
    languages,
    courses,
    description,
    primarySkills,
    secondarySkills,
  } = skills;

  return (
    <div className="flex flex-col gap-y-8">
      <BasicInfoForm
        basicInfo={{ primarySkills, secondarySkills, description, languages }}
        employeeId={id}
        isDisabled={isDisabled}
        resourceSkills={skillsFromResources}
      />
      <ProjectsForm
        className="hidden"
        dateFormat={me.dateFormat}
        employeeId={id}
        isDisabled={isDisabled}
        projects={projects}
      />
      <EmploymentHistoryForm
        className="hidden"
        dateFormat={me.dateFormat}
        employeeId={id}
        employmentHistory={employmentHistory}
        isDisabled={isDisabled}
      />
      <EducationForm
        dateFormat={me.dateFormat}
        education={education}
        employeeId={id}
        isDisabled={isDisabled}
      />
      <CoursesForm courses={courses} dateFormat={me.dateFormat} employeeId={id} isDisabled={isDisabled} />
    </div>
  );
}
