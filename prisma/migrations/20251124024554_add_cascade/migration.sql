-- DropForeignKey
ALTER TABLE "files" DROP CONSTRAINT "files_directory_id_fkey";

-- DropForeignKey
ALTER TABLE "files" DROP CONSTRAINT "files_owner_id_fkey";

-- DropForeignKey
ALTER TABLE "folders" DROP CONSTRAINT "folders_ownerId_fkey";

-- DropForeignKey
ALTER TABLE "folders" DROP CONSTRAINT "folders_parent_directory_id_fkey";

-- AddForeignKey
ALTER TABLE "folders" ADD CONSTRAINT "folders_ownerId_fkey" FOREIGN KEY ("ownerId") REFERENCES "users"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "folders" ADD CONSTRAINT "folders_parent_directory_id_fkey" FOREIGN KEY ("parent_directory_id") REFERENCES "folders"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "files" ADD CONSTRAINT "files_owner_id_fkey" FOREIGN KEY ("owner_id") REFERENCES "users"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "files" ADD CONSTRAINT "files_directory_id_fkey" FOREIGN KEY ("directory_id") REFERENCES "folders"("id") ON DELETE CASCADE ON UPDATE CASCADE;
