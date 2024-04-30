"use client";

import { UploadDropzone } from "@/lib/uploadthing";
import { toast } from "sonner";

export default function Upload() {
  return (
    <main className="flex min-h-screen flex-col items-center justify-between p-24">
      <UploadDropzone
        endpoint="imageUploader"
        onClientUploadComplete={(res) => {
          toast.success("Upload complete!");
        }}
        onUploadError={(error: Error) => {
          toast.error(error.message);
        }}
      />
    </main>
  );
}
