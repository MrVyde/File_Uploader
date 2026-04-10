/*
  Warnings:

  - A unique constraint covering the columns `[filename,folderId]` on the table `File` will be added. If there are existing duplicate values, this will fail.

*/
-- CreateIndex
CREATE UNIQUE INDEX "File_filename_folderId_key" ON "File"("filename", "folderId");
