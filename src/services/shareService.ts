import { prisma } from "../lib/prisma";
import { randomUUID } from "crypto";
import path from "path";

/** Create a share link for a folder */
export const createShare = async (folderId: string, duration: number) => {
  const expiresAt = new Date();
  expiresAt.setDate(expiresAt.getDate() + duration);

  const token = randomUUID();

  return prisma.share.create({
    data: {
      folderId,
      token,
      expiresAt,
    },
  });
};

/** Get share by token */
export const getShareByToken = async (token: string) => {
  return prisma.share.findUnique({
    where: { token },
    include: {
      folder: {
        include: {
          files: true, // load files
        },
      },
    },
  });
};


/** Check if share is expired */
export const isExpired = (expiresAt: Date): boolean => {
  return new Date() > expiresAt;
};

/** Get a file within a shared folder */
export const getSharedFile = async (token: string, fileId: string) => {
  const share = await getShareByToken(token);
  if (!share) return null;

    // Expiry check here
  if (isExpired(share.expiresAt)) return null;

  const file = share.folder.files.find(f => f.id === fileId);
  if (!file) return null;

  // Compute absolute path
  // Assume file.url is relative to project root or uploads folder
  const absolutePath = path.resolve(file.url);

  return { share, file: { ...file, absolutePath } };
};

/**
 * Get shared folder by token
 * Returns null if token invalid or share expired
 */
export const getSharedFolderByToken = async (token: string) => {
  const share = await getShareByToken(token);
  if (!share) return null;

  if (isExpired(share.expiresAt)) return null;

  return share.folder;
};