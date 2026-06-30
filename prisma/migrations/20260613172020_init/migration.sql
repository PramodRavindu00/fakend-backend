-- CreateEnum
CREATE TYPE "Provider" AS ENUM ('Google', 'Github');

-- CreateEnum
CREATE TYPE "ProjectStatus" AS ENUM ('Active', 'Inactive', 'Deleted');

-- CreateEnum
CREATE TYPE "HttpMethod" AS ENUM ('GET', 'POST', 'PUT', 'PATCH', 'DELETE');

-- CreateTable
CREATE TABLE "User" (
    "id" UUID NOT NULL,
    "email" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "avatarUrl" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "User_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "UserProvider" (
    "id" UUID NOT NULL,
    "provider" "Provider" NOT NULL,
    "providerUserId" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "userId" UUID NOT NULL,

    CONSTRAINT "UserProvider_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Project" (
    "id" UUID NOT NULL,
    "title" TEXT NOT NULL,
    "secretHash" TEXT NOT NULL,
    "ownerId" UUID,
    "status" "ProjectStatus" NOT NULL DEFAULT 'Active',
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "lastAccessedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "deletedAt" TIMESTAMP(3),

    CONSTRAINT "Project_pkey" PRIMARY KEY ("id")
);

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
CREATE UNIQUE INDEX "User_email_key" ON "User"("email");

-- CreateIndex
CREATE UNIQUE INDEX "UserProvider_provider_providerUserId_key" ON "UserProvider"("provider", "providerUserId");

-- CreateIndex
CREATE UNIQUE INDEX "Project_secretHash_key" ON "Project"("secretHash");

-- CreateIndex
CREATE INDEX "Route_projectId_idx" ON "Route"("projectId");

-- CreateIndex
CREATE UNIQUE INDEX "Route_projectId_method_path_key" ON "Route"("projectId", "method", "path");

-- CreateIndex
CREATE INDEX "RouteResponse_routeId_idx" ON "RouteResponse"("routeId");

-- CreateIndex
CREATE UNIQUE INDEX "RouteResponse_routeId_scenario_key" ON "RouteResponse"("routeId", "scenario");

-- AddForeignKey
ALTER TABLE "UserProvider" ADD CONSTRAINT "UserProvider_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Route" ADD CONSTRAINT "Route_projectId_fkey" FOREIGN KEY ("projectId") REFERENCES "Project"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "RouteResponse" ADD CONSTRAINT "RouteResponse_routeId_fkey" FOREIGN KEY ("routeId") REFERENCES "Route"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
