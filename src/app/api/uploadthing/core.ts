import { prisma } from "@/lib/prisma";
import { getKindeServerSession } from "@kinde-oss/kinde-auth-nextjs/server";
import { createUploadthing, type FileRouter } from "uploadthing/next";
import { UploadThingError } from "uploadthing/server";

const f = createUploadthing();

export const ourFileRouter = {
  imageUploader: f({
    video: { maxFileSize: "128MB", maxFileCount: 4 },
    audio: { maxFileSize: "64MB", maxFileCount: 8 },
    text: { maxFileSize: "1MB", maxFileCount: 16 },
    image: { maxFileSize: "4MB", maxFileCount: 32 },
    pdf: { maxFileSize: "16MB", maxFileCount: 64 },
  })
    .middleware(async ({ req }) => {
      const user = await getKindeServerSession().getUser();

      if (!user) throw new UploadThingError("Unauthorized");

      return { userId: user.id };
    })
    .onUploadComplete(async ({ metadata, file }) => {
      const newFile = await prisma.file.create({
        data: {
          kinde_user_id: metadata.userId,
          key: file.key,
          path: file.url,
          size: file.size,
          type: file.type,
          name: file.name,
        },
      });

      console.log(newFile);

      return { ok: true };
    }),
} satisfies FileRouter;

export type OurFileRouter = typeof ourFileRouter;
