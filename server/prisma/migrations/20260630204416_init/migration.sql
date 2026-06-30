-- CreateEnum
CREATE TYPE "Role" AS ENUM ('ADMINISTRATOR', 'OPERATOR', 'ENGINEER', 'VIEWER');

-- CreateEnum
CREATE TYPE "UserStatus" AS ENUM ('ACTIVE', 'LOCKED', 'DISABLED');

-- CreateEnum
CREATE TYPE "GenericStatus" AS ENUM ('NORMAL', 'EXCEPTION', 'FINISHED', 'IN_PROGRESS', 'PENDING', 'ACTIVE', 'INACTIVE', 'COMPLETED');

-- CreateEnum
CREATE TYPE "Priority" AS ENUM ('STANDARD', 'HIGH', 'CRITICAL', 'LOW');

-- CreateEnum
CREATE TYPE "Severity" AS ENUM ('CRITICAL', 'MAJOR', 'MINOR', 'WARNING');

-- CreateEnum
CREATE TYPE "AlarmStatus" AS ENUM ('ACTIVE', 'CLEARED', 'SUPPRESSED');

-- CreateEnum
CREATE TYPE "SlaStatus" AS ENUM ('COMPLIANT', 'AT_RISK', 'BREACHED', 'ON_TRACK');

-- CreateEnum
CREATE TYPE "TicketStatus" AS ENUM ('OPEN', 'IN_PROGRESS', 'RESOLVED');

-- CreateEnum
CREATE TYPE "WorkgroupType" AS ENUM ('ACCESS', 'CORE', 'FIELD', 'NOC');

-- CreateEnum
CREATE TYPE "Region" AS ENUM ('NORTH', 'SOUTH', 'EAST', 'WEST');

-- CreateTable
CREATE TABLE "users" (
    "id" SERIAL NOT NULL,
    "username" TEXT NOT NULL,
    "fullName" TEXT NOT NULL,
    "email" TEXT NOT NULL,
    "password" TEXT NOT NULL,
    "role" "Role" NOT NULL DEFAULT 'VIEWER',
    "workgroup" TEXT,
    "status" "UserStatus" NOT NULL DEFAULT 'ACTIVE',
    "lastLogin" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "users_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "role_models" (
    "id" SERIAL NOT NULL,
    "roleName" TEXT NOT NULL,
    "description" TEXT,
    "permissions" TEXT,
    "userCount" INTEGER NOT NULL DEFAULT 0,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "role_models_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "workgroups" (
    "id" SERIAL NOT NULL,
    "name" TEXT NOT NULL,
    "type" "WorkgroupType" NOT NULL DEFAULT 'ACCESS',
    "members" INTEGER NOT NULL DEFAULT 0,
    "lead" TEXT,
    "region" "Region" NOT NULL DEFAULT 'NORTH',
    "status" "GenericStatus" NOT NULL DEFAULT 'ACTIVE',
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "workgroups_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "orders" (
    "id" SERIAL NOT NULL,
    "customerOrderNumber" TEXT NOT NULL,
    "phoneNumber" TEXT NOT NULL,
    "cfsSpecifications" TEXT NOT NULL,
    "cfsEvent" TEXT NOT NULL,
    "productEvent" TEXT,
    "area" TEXT NOT NULL,
    "orderStatus" "GenericStatus" NOT NULL DEFAULT 'NORMAL',
    "orderStatusDate" TEXT NOT NULL,
    "completeDate" TEXT,
    "priority" "Priority" NOT NULL DEFAULT 'STANDARD',
    "warningDate" TEXT,
    "timeoutDate" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "orders_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "exceptions" (
    "id" SERIAL NOT NULL,
    "orderNumber" TEXT NOT NULL,
    "phoneNumber" TEXT,
    "exceptionType" TEXT NOT NULL,
    "severity" "Severity" NOT NULL DEFAULT 'MINOR',
    "area" TEXT,
    "raisedDate" TEXT NOT NULL,
    "slaBreach" BOOLEAN NOT NULL DEFAULT false,
    "assignedTo" TEXT,
    "status" "GenericStatus" NOT NULL DEFAULT 'PENDING',
    "resolution" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "exceptions_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "tasks" (
    "id" SERIAL NOT NULL,
    "taskId" TEXT NOT NULL,
    "orderNumber" TEXT,
    "taskType" TEXT NOT NULL,
    "workgroup" TEXT,
    "assignedTo" TEXT,
    "status" "GenericStatus" NOT NULL DEFAULT 'PENDING',
    "priority" "Priority" NOT NULL DEFAULT 'STANDARD',
    "dueDate" TEXT,
    "area" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "tasks_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "service_instances" (
    "id" SERIAL NOT NULL,
    "serviceId" TEXT NOT NULL,
    "customerName" TEXT NOT NULL,
    "serviceType" TEXT NOT NULL,
    "phoneNumber" TEXT,
    "status" "GenericStatus" NOT NULL DEFAULT 'ACTIVE',
    "activatedDate" TEXT,
    "area" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "service_instances_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "assurances" (
    "id" SERIAL NOT NULL,
    "serviceId" TEXT NOT NULL,
    "customer" TEXT NOT NULL,
    "kpi" TEXT NOT NULL,
    "score" TEXT NOT NULL,
    "status" "GenericStatus" NOT NULL DEFAULT 'NORMAL',
    "lastChecked" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "assurances_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "slas" (
    "id" SERIAL NOT NULL,
    "slaName" TEXT NOT NULL,
    "target" TEXT NOT NULL,
    "achieved" TEXT NOT NULL,
    "compliance" TEXT NOT NULL,
    "status" "SlaStatus" NOT NULL DEFAULT 'COMPLIANT',
    "period" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "slas_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "tickets" (
    "id" SERIAL NOT NULL,
    "ticketId" TEXT NOT NULL,
    "customer" TEXT NOT NULL,
    "category" TEXT NOT NULL,
    "severity" "Severity" NOT NULL DEFAULT 'MINOR',
    "status" "TicketStatus" NOT NULL DEFAULT 'OPEN',
    "openedDate" TEXT,
    "assignedTo" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "tickets_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "mac_records" (
    "id" SERIAL NOT NULL,
    "deviceId" TEXT NOT NULL,
    "deviceName" TEXT NOT NULL,
    "currentMac" TEXT NOT NULL,
    "newMac" TEXT NOT NULL,
    "area" TEXT,
    "status" "GenericStatus" NOT NULL DEFAULT 'PENDING',
    "modifiedBy" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "mac_records_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "migrations" (
    "id" SERIAL NOT NULL,
    "migrationId" TEXT NOT NULL,
    "source" TEXT NOT NULL,
    "target" TEXT NOT NULL,
    "records" INTEGER NOT NULL DEFAULT 0,
    "progress" INTEGER NOT NULL DEFAULT 0,
    "status" "GenericStatus" NOT NULL DEFAULT 'PENDING',
    "scheduled" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "migrations_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "resource_orders" (
    "id" SERIAL NOT NULL,
    "orderId" TEXT NOT NULL,
    "resourceType" TEXT NOT NULL,
    "quantity" INTEGER NOT NULL DEFAULT 1,
    "requestedBy" TEXT,
    "status" "GenericStatus" NOT NULL DEFAULT 'PENDING',
    "createdDate" TEXT,
    "area" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "resource_orders_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "resource_tasks" (
    "id" SERIAL NOT NULL,
    "taskId" TEXT NOT NULL,
    "orderId" TEXT,
    "resourceType" TEXT NOT NULL,
    "assignedTo" TEXT,
    "status" "GenericStatus" NOT NULL DEFAULT 'PENDING',
    "dueDate" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "resource_tasks_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "wfm_tasks" (
    "id" SERIAL NOT NULL,
    "taskId" TEXT NOT NULL,
    "title" TEXT NOT NULL,
    "type" TEXT NOT NULL,
    "assignedTo" TEXT,
    "priority" "Priority" NOT NULL DEFAULT 'STANDARD',
    "status" "GenericStatus" NOT NULL DEFAULT 'PENDING',
    "dueDate" TEXT,
    "location" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "wfm_tasks_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "teams" (
    "id" SERIAL NOT NULL,
    "teamName" TEXT NOT NULL,
    "type" TEXT NOT NULL,
    "members" INTEGER NOT NULL DEFAULT 0,
    "lead" TEXT,
    "region" "Region" NOT NULL DEFAULT 'NORTH',
    "activeTasks" INTEGER NOT NULL DEFAULT 0,
    "status" "GenericStatus" NOT NULL DEFAULT 'ACTIVE',
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "teams_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "bsnl_requests" (
    "id" SERIAL NOT NULL,
    "requestId" TEXT NOT NULL,
    "phoneNumber" TEXT,
    "requestType" TEXT NOT NULL,
    "circle" TEXT,
    "status" "GenericStatus" NOT NULL DEFAULT 'PENDING',
    "requestedDate" TEXT,
    "sla" "SlaStatus" NOT NULL DEFAULT 'ON_TRACK',
    "isHistory" BOOLEAN NOT NULL DEFAULT false,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "bsnl_requests_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "mpls_batches" (
    "id" SERIAL NOT NULL,
    "batchId" TEXT NOT NULL,
    "siteCount" INTEGER NOT NULL DEFAULT 0,
    "completed" INTEGER NOT NULL DEFAULT 0,
    "failed" INTEGER NOT NULL DEFAULT 0,
    "progress" INTEGER NOT NULL DEFAULT 0,
    "status" "GenericStatus" NOT NULL DEFAULT 'PENDING',
    "startDate" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "mpls_batches_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "dockets" (
    "id" SERIAL NOT NULL,
    "docketId" TEXT NOT NULL,
    "entity" TEXT NOT NULL,
    "type" TEXT NOT NULL,
    "pendingDays" INTEGER NOT NULL DEFAULT 0,
    "priority" "Priority" NOT NULL DEFAULT 'STANDARD',
    "status" "GenericStatus" NOT NULL DEFAULT 'PENDING',
    "lastAction" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "dockets_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "alarms" (
    "id" SERIAL NOT NULL,
    "alarmId" TEXT NOT NULL,
    "device" TEXT NOT NULL,
    "severity" "Severity" NOT NULL DEFAULT 'MINOR',
    "description" TEXT,
    "area" TEXT,
    "raisedDate" TEXT,
    "acknowledged" BOOLEAN NOT NULL DEFAULT false,
    "status" "AlarmStatus" NOT NULL DEFAULT 'ACTIVE',
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "alarms_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "incidents" (
    "id" SERIAL NOT NULL,
    "incidentId" TEXT NOT NULL,
    "title" TEXT NOT NULL,
    "severity" "Severity" NOT NULL DEFAULT 'MINOR',
    "affectedService" TEXT,
    "status" "GenericStatus" NOT NULL DEFAULT 'PENDING',
    "openedDate" TEXT,
    "assignedTo" TEXT,
    "sla" "SlaStatus" NOT NULL DEFAULT 'ON_TRACK',
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "incidents_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "audit_logs" (
    "id" SERIAL NOT NULL,
    "auditId" TEXT NOT NULL,
    "user" TEXT NOT NULL,
    "action" TEXT NOT NULL,
    "module" TEXT NOT NULL,
    "entity" TEXT,
    "timestamp" TEXT,
    "ip" TEXT,
    "userId" INTEGER,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "audit_logs_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "users_username_key" ON "users"("username");

-- CreateIndex
CREATE UNIQUE INDEX "users_email_key" ON "users"("email");

-- CreateIndex
CREATE UNIQUE INDEX "role_models_roleName_key" ON "role_models"("roleName");

-- CreateIndex
CREATE UNIQUE INDEX "workgroups_name_key" ON "workgroups"("name");

-- CreateIndex
CREATE UNIQUE INDEX "orders_customerOrderNumber_key" ON "orders"("customerOrderNumber");

-- CreateIndex
CREATE UNIQUE INDEX "tasks_taskId_key" ON "tasks"("taskId");

-- CreateIndex
CREATE UNIQUE INDEX "service_instances_serviceId_key" ON "service_instances"("serviceId");

-- CreateIndex
CREATE UNIQUE INDEX "tickets_ticketId_key" ON "tickets"("ticketId");

-- CreateIndex
CREATE UNIQUE INDEX "migrations_migrationId_key" ON "migrations"("migrationId");

-- CreateIndex
CREATE UNIQUE INDEX "resource_orders_orderId_key" ON "resource_orders"("orderId");

-- CreateIndex
CREATE UNIQUE INDEX "resource_tasks_taskId_key" ON "resource_tasks"("taskId");

-- CreateIndex
CREATE UNIQUE INDEX "wfm_tasks_taskId_key" ON "wfm_tasks"("taskId");

-- CreateIndex
CREATE UNIQUE INDEX "teams_teamName_key" ON "teams"("teamName");

-- CreateIndex
CREATE UNIQUE INDEX "bsnl_requests_requestId_key" ON "bsnl_requests"("requestId");

-- CreateIndex
CREATE UNIQUE INDEX "mpls_batches_batchId_key" ON "mpls_batches"("batchId");

-- CreateIndex
CREATE UNIQUE INDEX "dockets_docketId_key" ON "dockets"("docketId");

-- CreateIndex
CREATE UNIQUE INDEX "alarms_alarmId_key" ON "alarms"("alarmId");

-- CreateIndex
CREATE INDEX "alarms_severity_idx" ON "alarms"("severity");

-- CreateIndex
CREATE INDEX "alarms_status_idx" ON "alarms"("status");

-- CreateIndex
CREATE UNIQUE INDEX "incidents_incidentId_key" ON "incidents"("incidentId");

-- CreateIndex
CREATE UNIQUE INDEX "audit_logs_auditId_key" ON "audit_logs"("auditId");

-- AddForeignKey
ALTER TABLE "audit_logs" ADD CONSTRAINT "audit_logs_userId_fkey" FOREIGN KEY ("userId") REFERENCES "users"("id") ON DELETE SET NULL ON UPDATE CASCADE;
