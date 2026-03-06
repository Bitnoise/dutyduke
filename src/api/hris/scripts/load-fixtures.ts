import path from 'path';
import fs from 'fs';
import { prisma } from '@/api/hris/prisma/client';
import type {
  EmploymentType,
  EmployeeStatus,
  SkillType,
  AbsenceType,
  AbsenceStatus,
  DocumentStatus,
  EquipmentStatus,
} from '../../../../.prisma-generated/organization-client';

const FIXTURES_DIR = path.resolve(process.cwd(), 'src/api/hris/scripts/fixtures');

function loadJson<T>(filename: string): T {
  const filePath = path.join(FIXTURES_DIR, filename);
  return JSON.parse(fs.readFileSync(filePath, 'utf-8')) as T;
}

// ID mapping for entities with unique name constraints
// Maps fixture ID -> actual DB ID (same if created by us, different if pre-existing)
const skillIdMap = new Map<string, string>();
const equipCatIdMap = new Map<string, string>();
const docCatIdMap = new Map<string, string>();

function resolveSkillId(fixtureId: string): string {
  return skillIdMap.get(fixtureId) ?? fixtureId;
}
function resolveEquipCatId(fixtureId: string): string {
  return equipCatIdMap.get(fixtureId) ?? fixtureId;
}
function resolveDocCatId(fixtureId: string): string {
  return docCatIdMap.get(fixtureId) ?? fixtureId;
}

// ============================================================
// CLEAN
// ============================================================

async function cleanFixtures(): Promise<void> {
  console.log('\n🧹 Cleaning fixture data...');

  const deletions = [
    {
      name: 'employee benefits',
      fn: () => prisma.employeeBenefit.deleteMany({ where: { id: { startsWith: 'fix-' } } }),
    },
    {
      name: 'employee equipment',
      fn: () => prisma.employeeEquipment.deleteMany({ where: { id: { startsWith: 'fix-' } } }),
    },
    {
      name: 'employee skills',
      fn: () => prisma.employeeSkill.deleteMany({ where: { id: { startsWith: 'fix-' } } }),
    },
    {
      name: 'earnings',
      fn: () => prisma.employeeEarnings.deleteMany({ where: { id: { startsWith: 'fix-' } } }),
    },
    {
      name: 'absences',
      fn: () => prisma.absence.deleteMany({ where: { id: { startsWith: 'fix-' } } }),
    },
    {
      name: 'documents',
      fn: () => prisma.document.deleteMany({ where: { id: { startsWith: 'fix-' } } }),
    },
    {
      name: 'children',
      fn: () => prisma.employeeChild.deleteMany({ where: { id: { startsWith: 'fix-' } } }),
    },
    {
      name: 'courses',
      fn: () => prisma.employeeCourse.deleteMany({ where: { id: { startsWith: 'fix-' } } }),
    },
    {
      name: 'projects',
      fn: () => prisma.employeeProject.deleteMany({ where: { id: { startsWith: 'fix-' } } }),
    },
    {
      name: 'languages',
      fn: () => prisma.employeeLanguage.deleteMany({ where: { id: { startsWith: 'fix-' } } }),
    },
    {
      name: 'education',
      fn: () => prisma.employeeEducation.deleteMany({ where: { id: { startsWith: 'fix-' } } }),
    },
    {
      name: 'employment history',
      fn: () => prisma.employeeEmploymentHistory.deleteMany({ where: { id: { startsWith: 'fix-' } } }),
    },
    {
      name: 'equipment',
      fn: () => prisma.equipment.deleteMany({ where: { id: { startsWith: 'fix-' } } }),
    },
    {
      name: 'employees',
      fn: () => prisma.employee.deleteMany({ where: { id: { startsWith: 'fix-' } } }),
    },
    {
      name: 'benefits',
      fn: () => prisma.benefit.deleteMany({ where: { id: { startsWith: 'fix-' } } }),
    },
    {
      name: 'skills',
      fn: () => prisma.skill.deleteMany({ where: { id: { startsWith: 'fix-' } } }),
    },
    {
      name: 'equipment categories',
      fn: () => prisma.equipmentCategory.deleteMany({ where: { id: { startsWith: 'fix-' } } }),
    },
    {
      name: 'equipment locations',
      fn: () => prisma.equipmentLocalization.deleteMany({ where: { id: { startsWith: 'fix-' } } }),
    },
    {
      name: 'document categories',
      fn: () => prisma.documentCategory.deleteMany({ where: { id: { startsWith: 'fix-' } } }),
    },
    {
      name: 'company',
      fn: () => prisma.company.deleteMany({ where: { id: { startsWith: 'fix-' } } }),
    },
    {
      name: 'settings',
      fn: () => prisma.settings.deleteMany({ where: { id: { startsWith: 'fix-' } } }),
    },
  ];

  for (const { name, fn } of deletions) {
    const result = await fn();
    if (result.count > 0) {
      console.log(`  Deleted ${result.count} ${name}`);
    }
  }

  console.log('✅ Fixture data cleaned\n');
}

// ============================================================
// REFERENCE DATA LOADERS
// ============================================================

async function loadSkills(): Promise<void> {
  console.log('  Loading skills...');
  const skills = loadJson<Array<{ id: string; name: string }>>('skills.json');
  let created = 0;
  let skipped = 0;

  for (const skill of skills) {
    const existing = await prisma.skill.findUnique({ where: { name: skill.name } });
    if (existing) {
      skillIdMap.set(skill.id, existing.id);
      skipped++;
    } else {
      await prisma.skill.create({ data: { id: skill.id, name: skill.name } });
      skillIdMap.set(skill.id, skill.id);
      created++;
    }
  }

  console.log(`  ✅ Skills: ${created} created, ${skipped} already existed`);
}

async function loadEquipmentCategories(): Promise<void> {
  console.log('  Loading equipment categories...');
  const categories = loadJson<Array<{ id: string; name: string }>>('equipment-categories.json');
  let created = 0;
  let skipped = 0;

  for (const cat of categories) {
    const existing = await prisma.equipmentCategory.findUnique({ where: { name: cat.name } });
    if (existing) {
      equipCatIdMap.set(cat.id, existing.id);
      skipped++;
    } else {
      await prisma.equipmentCategory.create({ data: { id: cat.id, name: cat.name } });
      equipCatIdMap.set(cat.id, cat.id);
      created++;
    }
  }

  console.log(`  ✅ Equipment categories: ${created} created, ${skipped} already existed`);
}

async function loadEquipmentLocations(): Promise<void> {
  console.log('  Loading equipment locations...');
  const locations = loadJson<Array<{ id: string; name: string }>>('equipment-locations.json');
  let created = 0;

  for (const loc of locations) {
    const existing = await prisma.equipmentLocalization.findUnique({ where: { id: loc.id } });
    if (!existing) {
      await prisma.equipmentLocalization.create({ data: { id: loc.id, name: loc.name } });
      created++;
    }
  }

  console.log(`  ✅ Equipment locations: ${created} created`);
}

async function loadDocumentCategories(): Promise<void> {
  console.log('  Loading document categories...');
  const categories = loadJson<Array<{ id: string; name: string }>>('document-categories.json');
  let created = 0;
  let skipped = 0;

  for (const cat of categories) {
    const existing = await prisma.documentCategory.findUnique({ where: { name: cat.name } });
    if (existing) {
      docCatIdMap.set(cat.id, existing.id);
      skipped++;
    } else {
      await prisma.documentCategory.create({ data: { id: cat.id, name: cat.name } });
      docCatIdMap.set(cat.id, cat.id);
      created++;
    }
  }

  console.log(`  ✅ Document categories: ${created} created, ${skipped} already existed`);
}

async function loadBenefits(): Promise<void> {
  console.log('  Loading benefits...');
  const benefits = loadJson<Array<{ id: string; name: string; note: string | null }>>('benefits.json');

  for (const ben of benefits) {
    await prisma.benefit.upsert({
      where: { id: ben.id },
      update: {},
      create: { id: ben.id, name: ben.name, note: ben.note },
    });
  }

  console.log(`  ✅ ${benefits.length} benefits loaded`);
}

// ============================================================
// COMPANY & SETTINGS
// ============================================================

async function loadCompany(): Promise<void> {
  console.log('  Loading company...');
  const org = await prisma.organization.findFirst();

  if (!org) {
    console.log('  ⚠️  No organization found. Skipping company creation.');
    console.log('     Run organization:create first, then re-run fixtures.');
    return;
  }

  await prisma.company.upsert({
    where: { id: 'fix-company-01' },
    update: {},
    create: {
      id: 'fix-company-01',
      name: 'Vortex Labs',
      organizationId: org.id,
    },
  });

  console.log(`  ✅ Company "Vortex Labs" created under org "${org.name}"`);
}

async function loadSettings(): Promise<void> {
  console.log('  Loading settings...');
  const existing = await prisma.settings.findFirst();

  if (existing) {
    console.log('  ✅ Settings already exist, skipping');
    return;
  }

  await prisma.settings.create({
    data: {
      id: 'fix-settings-01',
      language: 'en',
      dateFormat: 'MM_DD_YYYY',
    },
  });

  console.log('  ✅ Settings created (English, MM/DD/YYYY)');
}

// ============================================================
// EMPLOYEES (with nested data)
// ============================================================

interface FixtureEmployee {
  id: string;
  firstName: string;
  lastName: string;
  workEmail: string;
  role: string;
  employmentType: string;
  status: string;
  joinDate: string;
  birthdate: string | null;
  holiday: number | null;
  firstYearHoliday: number | null;
  phone: string | null;
  address: string | null;
  personalId: string | null;
  taxId: string | null;
  bankAccount: string | null;
  description: string | null;
  hobbies: string[];
  iceName: string | null;
  icePhone: string | null;
  education: Array<{ id: string; name: string; startDate: string; endDate: string | null }>;
  languages: Array<{ id: string; name: string; level: string }>;
  projects: Array<{
    id: string;
    name: string;
    role: string;
    description: string | null;
    startDate: string;
    endDate: string | null;
    order: number;
    isVisible: boolean;
  }>;
  employmentHistory: Array<{
    id: string;
    company: string;
    role: string;
    startDate: string;
    endDate: string;
    description: string | null;
  }>;
  courses: Array<{ id: string; name: string; date: string }>;
  children: Array<{ id: string; name: string; birthDate: string }>;
}

async function loadEmployees(): Promise<void> {
  console.log('  Loading employees...');
  const employees = loadJson<FixtureEmployee[]>('employees.json');

  // Create base employee records individually (encrypted fields need per-record processing)
  let created = 0;
  for (const emp of employees) {
    const existing = await prisma.employee.findUnique({ where: { id: emp.id } });
    if (existing) continue;

    await prisma.employee.create({
      data: {
        id: emp.id,
        firstName: emp.firstName,
        lastName: emp.lastName,
        workEmail: emp.workEmail,
        role: emp.role,
        employmentType: emp.employmentType as EmploymentType,
        status: emp.status as EmployeeStatus,
        joinDate: new Date(emp.joinDate),
        birthdate: emp.birthdate ? new Date(emp.birthdate) : null,
        holiday: emp.holiday,
        firstYearHoliday: emp.firstYearHoliday,
        phone: emp.phone,
        address: emp.address,
        personalId: emp.personalId,
        taxId: emp.taxId,
        bankAccount: emp.bankAccount,
        description: emp.description,
        hobbies: emp.hobbies,
        iceName: emp.iceName,
        icePhone: emp.icePhone,
      },
    });
    created++;
  }
  console.log(`  ✅ ${created} employees created`);

  // Extract and bulk-load nested data (no encrypted fields)
  const allEducation = employees.flatMap((emp) =>
    emp.education.map((edu) => ({
      id: edu.id,
      name: edu.name,
      startDate: new Date(edu.startDate),
      endDate: edu.endDate ? new Date(edu.endDate) : null,
      employeeId: emp.id,
    })),
  );
  if (allEducation.length > 0) {
    await prisma.employeeEducation.createMany({ data: allEducation, skipDuplicates: true });
    console.log(`  ✅ ${allEducation.length} education records loaded`);
  }

  const allLanguages = employees.flatMap((emp) =>
    emp.languages.map((lang) => ({
      id: lang.id,
      name: lang.name,
      level: lang.level,
      employeeId: emp.id,
    })),
  );
  if (allLanguages.length > 0) {
    await prisma.employeeLanguage.createMany({ data: allLanguages, skipDuplicates: true });
    console.log(`  ✅ ${allLanguages.length} language records loaded`);
  }

  const allProjects = employees.flatMap((emp) =>
    emp.projects.map((proj) => ({
      id: proj.id,
      name: proj.name,
      role: proj.role,
      description: proj.description,
      startDate: new Date(proj.startDate),
      endDate: proj.endDate ? new Date(proj.endDate) : null,
      order: proj.order,
      isVisible: proj.isVisible,
      employeeId: emp.id,
    })),
  );
  if (allProjects.length > 0) {
    await prisma.employeeProject.createMany({ data: allProjects, skipDuplicates: true });
    console.log(`  ✅ ${allProjects.length} project records loaded`);
  }

  const allHistory = employees.flatMap((emp) =>
    emp.employmentHistory.map((hist) => ({
      id: hist.id,
      company: hist.company,
      role: hist.role,
      startDate: new Date(hist.startDate),
      endDate: new Date(hist.endDate),
      description: hist.description,
      employeeId: emp.id,
    })),
  );
  if (allHistory.length > 0) {
    await prisma.employeeEmploymentHistory.createMany({ data: allHistory, skipDuplicates: true });
    console.log(`  ✅ ${allHistory.length} employment history records loaded`);
  }

  const allCourses = employees.flatMap((emp) =>
    emp.courses.map((course) => ({
      id: course.id,
      name: course.name,
      date: new Date(course.date),
      employeeId: emp.id,
    })),
  );
  if (allCourses.length > 0) {
    await prisma.employeeCourse.createMany({ data: allCourses, skipDuplicates: true });
    console.log(`  ✅ ${allCourses.length} course records loaded`);
  }

  const allChildren = employees.flatMap((emp) =>
    emp.children.map((child) => ({
      id: child.id,
      name: child.name,
      birthDate: new Date(child.birthDate),
      employeeId: emp.id,
    })),
  );
  if (allChildren.length > 0) {
    await prisma.employeeChild.createMany({ data: allChildren, skipDuplicates: true });
    console.log(`  ✅ ${allChildren.length} children records loaded`);
  }
}

// ============================================================
// EQUIPMENT
// ============================================================

interface FixtureEquipment {
  id: string;
  signature: string;
  name: string;
  brand: string | null;
  model: string | null;
  status: string;
  serial: string | null;
  invoiceNumber: string | null;
  supplier: string | null;
  purchaseDate: string | null;
  warrantyDuration: number | null;
  leaseDuration: number | null;
  value: number | null;
  assigneeId: string | null;
  description: string | null;
  note: string | null;
  categoryId: string | null;
  locationId: string | null;
}

async function loadEquipment(): Promise<void> {
  console.log('  Loading equipment...');
  const equipment = loadJson<FixtureEquipment[]>('equipment.json');

  await prisma.equipment.createMany({
    data: equipment.map((eq) => ({
      id: eq.id,
      signature: eq.signature,
      name: eq.name,
      brand: eq.brand,
      model: eq.model,
      status: eq.status as EquipmentStatus,
      serial: eq.serial,
      invoiceNumber: eq.invoiceNumber,
      supplier: eq.supplier,
      purchaseDate: eq.purchaseDate ? new Date(eq.purchaseDate) : null,
      warrantyDuration: eq.warrantyDuration,
      leaseDuration: eq.leaseDuration,
      value: eq.value,
      assigneeId: eq.assigneeId,
      description: eq.description,
      note: eq.note,
      categoryId: eq.categoryId ? resolveEquipCatId(eq.categoryId) : null,
      locationId: eq.locationId,
    })),
    skipDuplicates: true,
  });

  console.log(`  ✅ ${equipment.length} equipment items loaded`);
}

// ============================================================
// DOCUMENTS
// ============================================================

interface FixtureDocument {
  id: string;
  description: string;
  filePath: string;
  expDate: string | null;
  assignedTo: string | null;
  status: string[];
  categoryId: string | null;
}

async function loadDocuments(): Promise<void> {
  console.log('  Loading documents...');
  const documents = loadJson<FixtureDocument[]>('documents.json');

  await prisma.document.createMany({
    data: documents.map((doc) => ({
      id: doc.id,
      description: doc.description,
      filePath: doc.filePath,
      expDate: doc.expDate ? new Date(doc.expDate) : null,
      assignedTo: doc.assignedTo,
      status: doc.status as DocumentStatus[],
      categoryId: doc.categoryId ? resolveDocCatId(doc.categoryId) : null,
    })),
    skipDuplicates: true,
  });

  console.log(`  ✅ ${documents.length} documents loaded`);
}

// ============================================================
// ABSENCES
// ============================================================

interface FixtureAbsence {
  id: string;
  type: string;
  startDate: string;
  endDate: string;
  days: number;
  description: string | null;
  status: string;
  label: string | null;
  issuerId: string;
  reviewerId: string | null;
  requestedAt: string;
  approvedAt: string | null;
  rejectedAt: string | null;
  halfStart: boolean;
  halfEnd: boolean;
  recipientIds: string[];
}

async function loadAbsences(): Promise<void> {
  console.log('  Loading absences...');
  const absences = loadJson<FixtureAbsence[]>('absences.json');

  await prisma.absence.createMany({
    data: absences.map((abs) => ({
      id: abs.id,
      type: abs.type as AbsenceType,
      startDate: new Date(abs.startDate),
      endDate: new Date(abs.endDate),
      days: abs.days,
      description: abs.description,
      status: abs.status as AbsenceStatus,
      label: abs.label,
      issuerId: abs.issuerId,
      reviewerId: abs.reviewerId,
      requestedAt: new Date(abs.requestedAt),
      approvedAt: abs.approvedAt ? new Date(abs.approvedAt) : null,
      rejectedAt: abs.rejectedAt ? new Date(abs.rejectedAt) : null,
      halfStart: abs.halfStart,
      halfEnd: abs.halfEnd,
      recipientIds: abs.recipientIds,
    })),
    skipDuplicates: true,
  });

  console.log(`  ✅ ${absences.length} absences loaded`);
}

// ============================================================
// EARNINGS
// ============================================================

interface FixtureEarning {
  id: string;
  employeeId: string;
  value: number;
  date: string;
  description: string;
}

async function loadEarnings(): Promise<void> {
  console.log('  Loading earnings...');
  const earnings = loadJson<FixtureEarning[]>('earnings.json');

  await prisma.employeeEarnings.createMany({
    data: earnings.map((earn) => ({
      id: earn.id,
      employeeId: earn.employeeId,
      value: earn.value,
      date: new Date(earn.date),
      description: earn.description,
    })),
    skipDuplicates: true,
  });

  console.log(`  ✅ ${earnings.length} earnings records loaded`);
}

// ============================================================
// CROSS-ENTITY ASSIGNMENTS
// ============================================================

async function loadEmployeeSkills(): Promise<void> {
  console.log('  Loading employee skills...');

  interface FixtureEmployeeSkill {
    id: string;
    employeeId: string;
    skillId: string;
    type: string;
  }

  const empSkills = loadJson<FixtureEmployeeSkill[]>('employee-skills.json');

  await prisma.employeeSkill.createMany({
    data: empSkills.map((es) => ({
      id: es.id,
      employeeId: es.employeeId,
      skillId: resolveSkillId(es.skillId),
      type: es.type as SkillType,
    })),
    skipDuplicates: true,
  });

  console.log(`  ✅ ${empSkills.length} employee skill assignments loaded`);
}

async function loadEmployeeEquipment(): Promise<void> {
  console.log('  Loading employee equipment assignments...');

  interface FixtureEmployeeEquipment {
    id: string;
    employeeId: string;
    equipmentId: string;
  }

  const empEquip = loadJson<FixtureEmployeeEquipment[]>('employee-equipment.json');

  await prisma.employeeEquipment.createMany({
    data: empEquip.map((ee) => ({
      id: ee.id,
      employeeId: ee.employeeId,
      equipmentId: ee.equipmentId,
    })),
    skipDuplicates: true,
  });

  console.log(`  ✅ ${empEquip.length} employee equipment assignments loaded`);
}

async function loadEmployeeBenefits(): Promise<void> {
  console.log('  Loading employee benefits...');

  interface FixtureEmployeeBenefit {
    id: string;
    benefitId: string;
    employeeId: string;
    startDate: string;
  }

  const empBenefits = loadJson<FixtureEmployeeBenefit[]>('employee-benefits.json');

  let created = 0;
  for (const eb of empBenefits) {
    try {
      await prisma.employeeBenefit.upsert({
        where: {
          benefitId_employeeId: {
            benefitId: eb.benefitId,
            employeeId: eb.employeeId,
          },
        },
        update: {},
        create: {
          id: eb.id,
          benefitId: eb.benefitId,
          employeeId: eb.employeeId,
          startDate: new Date(eb.startDate),
        },
      });
      created++;
    } catch {
      // Skip duplicates silently
    }
  }

  console.log(`  ✅ ${created} employee benefit assignments loaded`);
}

// ============================================================
// MAIN
// ============================================================

async function main() {
  const args = process.argv.slice(2);
  const shouldClean = args.includes('--clean') || args.includes('--reset');

  if (args.includes('--help')) {
    console.log('Usage: tsx src/api/hris/scripts/load-fixtures.ts [options]');
    console.log('');
    console.log('Loads demo fixture data into the database for the DutyDuke demo instance.');
    console.log('All fixture records use IDs prefixed with "fix-" for easy identification and cleanup.');
    console.log('');
    console.log('Options:');
    console.log('  --clean   Remove all existing fixture data before loading fresh data');
    console.log('  --reset   Alias for --clean');
    console.log('  --help    Show this help message');
    console.log('');
    console.log('Examples:');
    console.log('  yarn fixtures:load          Load fixture data (skips existing records)');
    console.log('  yarn fixtures:load --clean   Clean and reload all fixture data');
    process.exit(0);
  }

  console.log('🏗️  DutyDuke Demo Fixture Loader');
  console.log('================================\n');

  try {
    if (shouldClean) {
      await cleanFixtures();
    }

    console.log('📦 Loading reference data...');
    await loadSkills();
    await loadEquipmentCategories();
    await loadEquipmentLocations();
    await loadDocumentCategories();
    await loadBenefits();

    console.log('\n🏢 Loading company & settings...');
    await loadCompany();
    await loadSettings();

    console.log('\n👥 Loading employees and related data...');
    await loadEmployees();

    console.log('\n💻 Loading equipment...');
    await loadEquipment();

    console.log('\n📄 Loading documents...');
    await loadDocuments();

    console.log('\n📅 Loading absences...');
    await loadAbsences();

    console.log('\n💰 Loading earnings...');
    await loadEarnings();

    console.log('\n🔗 Loading assignments...');
    await loadEmployeeSkills();
    await loadEmployeeEquipment();
    await loadEmployeeBenefits();

    console.log('\n========================================');
    console.log('🎉 All fixture data loaded successfully!');
    console.log('   50 employees | 100 equipment items');
    console.log('   Skills, benefits, documents, absences, earnings & more');
    console.log('========================================');
  } catch (error) {
    console.error('\n❌ Failed to load fixtures:', error instanceof Error ? error.message : error);
    if (error instanceof Error && error.stack) {
      console.error(error.stack);
    }
    process.exit(1);
  } finally {
    await prisma.$disconnect();
  }
}

main();
