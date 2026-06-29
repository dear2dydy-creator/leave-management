-- CreateEnum
CREATE TYPE "LeaveOfAbsenceType" AS ENUM ('DEEMED', 'PERSONAL');

-- CreateTable
CREATE TABLE "leave_of_absences" (
    "id" TEXT NOT NULL,
    "employeeId" TEXT NOT NULL,
    "startDate" TIMESTAMP(3) NOT NULL,
    "endDate" TIMESTAMP(3) NOT NULL,
    "type" "LeaveOfAbsenceType" NOT NULL,
    "note" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "leave_of_absences_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "leave_of_absences" ADD CONSTRAINT "leave_of_absences_employeeId_fkey" FOREIGN KEY ("employeeId") REFERENCES "employees"("id") ON DELETE CASCADE ON UPDATE CASCADE;
