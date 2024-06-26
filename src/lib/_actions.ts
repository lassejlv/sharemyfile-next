"use server";

import { getKindeServerSession } from "@kinde-oss/kinde-auth-nextjs/server";
import { prisma } from "./prisma";
import { utapi } from "./utapi";

export const DeleteFile = async (fileId: string) => {
  try {
    const fileDeleted = await prisma.file.delete({ where: { id: fileId } });
    await utapi.deleteFiles(fileDeleted.key);
    return true;
  } catch (error) {
    console.error("Error deleting file", error);
    return false;
  }
};

export const GetFiles = async () => {
  const user = await getKindeServerSession().getUser();
  if (!user) return "Unauthorized";

  return prisma.file.findMany({
    where: {
      kinde_user_id: user.id,
    },
  });
};

export const CreateFileShareLink = async (fileId: string) => {
  const file = await prisma.file.findUnique({ where: { id: fileId } });
  if (!file) return "File not found";

  const newShareLink = await prisma.shareLink.create({
    data: {
      file_id: fileId,
      // 24 hours from now
      expiresAt: new Date(Date.now() + 24 * 60 * 60 * 1000),
    },
  });

  return newShareLink;
};
