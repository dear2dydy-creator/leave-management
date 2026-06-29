-- CreateTable
CREATE TABLE "tardy_records" (
    "id" TEXT NOT NULL,
    "employeeId" TEXT NOT NULL,
    "date" TIMESTAMP(3) NOT NULL,
    "note" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "tardy_records_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "tardy_records" ADD CONSTRAINT "tardy_records_employeeId_fkey" FOREIGN KEY ("employeeId") REFERENCES "employees"("id") ON DELETE CASCADE ON UPDATE CASCADE;
