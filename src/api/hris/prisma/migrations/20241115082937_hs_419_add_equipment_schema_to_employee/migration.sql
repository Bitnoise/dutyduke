-- CreateTable
CREATE TABLE "EmployeeEquipment" (
    "id" TEXT NOT NULL,
    "employeeId" TEXT NOT NULL,
    "equipmentId" TEXT NOT NULL,

    CONSTRAINT "EmployeeEquipment_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "EmployeeEquipment" ADD CONSTRAINT "EmployeeEquipment_employeeId_fkey" FOREIGN KEY ("employeeId") REFERENCES "Employee"("id") ON DELETE CASCADE ON UPDATE CASCADE;
