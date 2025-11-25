/*
  Warnings:

  - A unique constraint covering the columns `[name,directory_id]` on the table `files` will be added. If there are existing duplicate values, this will fail.

*/
-- DropIndex
DROP INDEX "folders_parent_directory_id_key";

-- CreateIndex
CREATE UNIQUE INDEX "files_name_directory_id_key" ON "files"("name", "directory_id");
