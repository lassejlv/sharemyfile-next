"use client";

import { Button } from "@/components/ui/button";
import { KindeUser } from "@kinde-oss/kinde-auth-nextjs/types";
import { File } from "@prisma/client";
import {
  FaCreditCard,
  FaDoorClosed,
  FaDoorOpen,
  FaDownload,
  FaSignOutAlt,
  FaUpload,
} from "react-icons/fa";
import { LuFileStack } from "react-icons/lu";
import {
  Table,
  TableBody,
  TableCaption,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import { useRouter } from "next/navigation";
import { CreateFileShareLink, DeleteFile, GetFiles } from "@/lib/_actions";
import { toast } from "sonner";
import { useState } from "react";
import { UploadDropzone } from "@/lib/uploadthing";
import { formatSizeToMb } from "@/lib/helpers";
import Billing from "./Billing";

export default function Dashboard({ files, user }: { files: File[]; user: KindeUser }) {
  const [filesList, setFilesList] = useState<File[]>(files);
  const [isBillingTab, setIsBillingTab] = useState(false);
  const router = useRouter();

  return (
    <div className="flex h-screen w-full">
      <div className="flex h-full w-64 flex-col border-r p-4">
        <div className="mb-6 flex items-center  gap-2">
          <span className="text-lg font-semibold">ShareMyFiles</span>
        </div>
        <nav className="flex flex-col gap-2">
          <Button
            variant="outline"
            className={`flex items-center justify-start gap-2 rounded-md px-3 py-2 ${!isBillingTab && "bg-secondary"}`}
            onClick={() => setIsBillingTab(false)}
          >
            <LuFileStack />
            Files
          </Button>
          <Button
            variant="outline"
            className={`flex items-center justify-start gap-2 rounded-md px-3 py-2 ${isBillingTab && "bg-secondary"}`}
            onClick={() => setIsBillingTab(true)}
          >
            <FaCreditCard />
            Billing
          </Button>
          <AlertDialog>
            <AlertDialogTrigger asChild>
              <Button
                variant="outline"
                className="flex items-center justify-start gap-2 rounded-md px-3 py-2"
              >
                <FaUpload />
                Upload
              </Button>
            </AlertDialogTrigger>
            <AlertDialogContent>
              <AlertDialogHeader>
                <AlertDialogTitle>Upload a file</AlertDialogTitle>
              </AlertDialogHeader>
              <AlertDialogDescription>
                <UploadDropzone
                  endpoint="imageUploader"
                  onClientUploadComplete={async (res) => {
                    toast.success("Upload complete!");

                    const reloadFiles = await GetFiles();
                    if (reloadFiles === "Unauthorized") return;

                    setFilesList(reloadFiles);
                  }}
                  onUploadError={(error: Error) => {
                    toast.error(error.message);
                  }}
                />
              </AlertDialogDescription>
            </AlertDialogContent>
          </AlertDialog>

          <div className="absolute bottom-4">
            <Button variant="outline" onClick={() => router.push("/api/auth/logout")}>
              <FaSignOutAlt className="mr-2" />
              Logout
            </Button>
          </div>
        </nav>
      </div>
      <div className="flex-1 p-6">
        {!isBillingTab && (
          <>
            <h1 className="mb-4 text-2xl font-bold">
              Welcome back {user.given_name} {user.family_name}
            </h1>
            <p className="mb-6 text-gray-500 dark:text-gray-400">View all your files here</p>

            <Table>
              <TableCaption>Here is all your files</TableCaption>
              <TableHeader>
                <TableRow>
                  <TableHead className="w-[100px]">ID</TableHead>
                  <TableHead>Name</TableHead>
                  <TableHead>Type</TableHead>
                  <TableHead>Size</TableHead>
                  <TableHead>Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filesList.length === 0 && (
                  <TableRow>
                    <TableCell colSpan={5} className="text-center">
                      No files found. Upload some files!
                    </TableCell>
                  </TableRow>
                )}
                {filesList.map((file) => (
                  <TableRow key={file.id}>
                    <TableCell className="select-all">{file.id}</TableCell>
                    <TableCell className="select-all">{file.name}</TableCell>
                    <TableCell className="select-all">{file.type}</TableCell>
                    <TableCell className="select-all">{formatSizeToMb(file.size)}</TableCell>
                    <TableCell>
                      <div className="flex space-x-3">
                        <Button variant="outline" onClick={() => router.push(file.path)}>
                          <FaDownload className="mr-2" />
                          Download
                        </Button>

                        <Button
                          variant="secondary"
                          onClick={async () => {
                            const created = await CreateFileShareLink(file.id);
                            if (created === "File not found") return toast.error("File not found");

                            navigator.clipboard.writeText(
                              `${window.location.origin}/files-share/${created.id}?token=${created.token}`,
                            );
                            toast.success("Link copied to clipboard!");
                          }}
                        >
                          Copy Link
                        </Button>

                        <AlertDialog>
                          <AlertDialogTrigger asChild>
                            <Button variant="destructive">Delete</Button>
                          </AlertDialogTrigger>
                          <AlertDialogContent>
                            <AlertDialogHeader>
                              <AlertDialogTitle>Are you absolutely sure?</AlertDialogTitle>
                              <AlertDialogDescription>
                                Hold up boy, this action cannot be undone. Are you sure you wanna
                                delete this file? You don't go to us crying when you delete your
                                files. You hear me?
                                <div className="my-3 space-x-3">
                                  <AlertDialogCancel>Cancel</AlertDialogCancel>
                                  <AlertDialogAction
                                    onClick={() => {
                                      const promise = new Promise(async (resolve, reject) => {
                                        const deleted = await DeleteFile(file.id);

                                        if (deleted) {
                                          setFilesList((prev) =>
                                            prev.filter((f) => f.id !== file.id),
                                          );
                                          resolve(true);
                                        } else {
                                          reject("There was an error deleting the file.");
                                        }
                                      });

                                      toast.promise(promise, {
                                        success: "File deleted!",
                                        loading: "Deleting file...",
                                        error: (err) => err,
                                      });
                                    }}
                                  >
                                    Delete
                                  </AlertDialogAction>
                                </div>
                              </AlertDialogDescription>
                            </AlertDialogHeader>
                          </AlertDialogContent>
                        </AlertDialog>
                      </div>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </>
        )}

        {isBillingTab && <Billing user={user} files={filesList} />}
      </div>
    </div>
  );
}
