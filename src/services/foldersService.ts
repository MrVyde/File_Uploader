import { prisma} from "../lib/prisma";
import type { Prisma, Folder } from "@prisma/client";

export type FolderWithFiles = Prisma.FolderGetPayload<{
  include: { files: true };
}>;

export const createFolder = async (
  name: string, 
  ownerId: number
): Promise<Folder> => {
  return prisma.folder.create({
    data: { name, ownerId },
  });
};

export const getFoldersByUser = async (
    ownerId: number
): Promise<FolderWithFiles[]> => {
  return prisma.folder.findMany({
    where: { ownerId },
    include: { files: true }, // include files if needed
    orderBy: { createdAt: "desc" },
  });
};

export const getFolderById = async (
    id: string
): Promise<Folder | null> => {
  return prisma.folder.findUnique({
    where: { id },
    include: { files: true },
  });
};

export const updateFolder = async (
    id: string, 
    name: string
): Promise<Folder> => {
  return prisma.folder.update({
    where: { id },
    data: { name },
  });
};

export const deleteFolder = async (
    id: string
): Promise<void> => {
  await prisma.folder.delete({
    where: { id },
  });
};