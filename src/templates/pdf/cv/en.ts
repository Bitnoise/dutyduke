import { cv, type CVLang } from '@/templates/pdf/cv';

const en = <CVLang>{
  personalData: 'PERSONAL DATA',
  skillsProfile: 'SKILLS PROFILE',
  primarySkills: 'Primary skills',
  secondarySkills: 'Secondary skills',
  languages: 'Languages',
  recentProjects: 'RECENT PROJECTS',
  experience: 'EXPERIENCE',
  education: 'EDUCATION',
  in: 'in',
  name: 'Name',
  company: 'Company',
};

export const cvEn = cv(en);
