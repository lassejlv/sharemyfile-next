import { prisma } from "@/lib/prisma";
import { getKindeServerSession } from "@kinde-oss/kinde-auth-nextjs/server";
import { createUploadthing, type FileRouter } from "uploadthing/next";
import { UploadThingError } from "uploadthing/server";

const f = createUploadthing();

const auth = (req: Request) => ({ id: "fakeId" }); // Fake auth function

// FileRouter for your app, can contain multiple FileRoutes
export const ourFileRouter = {
  // Define as many FileRoutes as you like, each with a unique routeSlug
  imageUploader: f({
    video: { maxFileSize: "128MB" },
    audio: { maxFileSize: "64MB" },
    text: { maxFileSize: "1MB" },
    image: { maxFileSize: "4MB" },
    pdf: { maxFileSize: "16MB" },
  })
    // Set permissions and file types for this FileRoute
    .middleware(async ({ req }) => {
      // This code runs on your server before upload
      const user = await getKindeServerSession().getUser();

      // If you throw, the user will not be able to upload
      if (!user) throw new UploadThingError("Unauthorized");

      // Whatever is returned here is accessible in onUploadComplete as `metadata`
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
