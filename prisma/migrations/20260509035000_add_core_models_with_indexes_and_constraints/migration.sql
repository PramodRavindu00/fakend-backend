/*
  Warnings:

  - Added the required column `secretHash` to the `Project` table without a default value. This is not possible if the table is not empty.
  - Added the required column `updatedAt` to the `Project` table without a default value. This is not possible if the table is not empty.

*/
-- CreateEnum
CREATE TYPE "ProjectStatus" AS ENUM ('Active', 'Inactive', 'Deleted');

-- CreateEnum
CREATE TYPE "HttpMethod" AS ENUM ('GET', 'POST', 'PUT', 'PATCH', 'DELETE');

-- AlterTable
ALTER TABLE "Project" ADD COLUMN     "deletedAt" TIMESTAMP(3),
ADD COLUMN     "lastAccessedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
ADD COLUMN     "ownerId" TEXT,
ADD COLUMN     "secretHash" TEXT NOT NULL,
ADD COLUMN     "status" "ProjectStatus" NOT NULL DEFAULT 'Active',
ADD COLUMN     "updatedAt" TIMESTAMP(3) NOT NULL;

-- CreateTable
CREATE TABLE "Route" (
    "id" UUID NOT NULL,
    "projectId" UUID NOT NULL,
    "method" "HttpMethod" NOT NULL,
    "path" TEXT NOT NULL,
    "description" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Route_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "RouteResponse" (
    "id" UUID NOT NULL,
    "routeId" UUID NOT NULL,
    "scenario" TEXT NOT NULL DEFAULT 'default',
    "statusCode" INTEGER NOT NULL,
    "body" JSONB NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "RouteResponse_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE INDEX "Route_projectId_idx" ON "Route"("projectId");

-- CreateIndex
CREATE UNIQUE INDEX "Route_projectId_method_path_key" ON "Route"("projectId", "method", "path");

-- CreateIndex
CREATE INDEX "RouteResponse_routeId_idx" ON "RouteResponse"("routeId");

-- CreateIndex
CREATE UNIQUE INDEX "RouteResponse_routeId_scenario_key" ON "RouteResponse"("routeId", "scenario");

-- AddForeignKey
ALTER TABLE "Route" ADD CONSTRAINT "Route_projectId_fkey" FOREIGN KEY ("projectId") REFERENCES "Project"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "RouteResponse" ADD CONSTRAINT "RouteResponse_routeId_fkey" FOREIGN KEY ("routeId") REFERENCES "Route"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
