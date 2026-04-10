import { prisma } from "../lib/prisma";

export const createFile = async ({
  filename,
  url,
  size,
  folderId,
  ownerId,
}: {
  filename: string;
  url: string;
  size: number;
  folderId: string;
  ownerId: number;
}) => {
  return prisma.file.create({
    data: {
      filename,
      url,
      size,
      folderId,
      ownerId,
    },
  });
};

export const getFilesByFolder = async (folderId: string, ownerId: number) => {
  return prisma.file.findMany({
    where: {
      folderId,
      ownerId, // ensures user only sees their own files
    },
    orderBy: {
      createdAt: "desc",
    },
  });
};

export const getFileById = async (id: string) => {
  return prisma.file.findUnique({
    where: { id },
  });
};

export const updateFileName = async (id: string, filename: string) => {
  return prisma.file.update({
    where: { id },
    data: { filename },
  });
};


export const deleteFile = async (id: string) => {
  return prisma.file.delete({
    where: { id },
  });
};