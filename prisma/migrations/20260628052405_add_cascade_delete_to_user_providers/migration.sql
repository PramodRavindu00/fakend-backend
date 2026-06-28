-- DropForeignKey
ALTER TABLE "UserProvider" DROP CONSTRAINT "UserProvider_userId_fkey";

-- AddForeignKey
ALTER TABLE "UserProvider" ADD CONSTRAINT "UserProvider_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;
