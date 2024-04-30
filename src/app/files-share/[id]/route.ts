import { formatSizeToMb } from "@/lib/helpers";
import { prisma } from "@/lib/prisma";
import { NextResponse } from "next/server";

export async function GET(req: Request, { params }: { params: { id: string } }) {
  // get /files-share/:id?token<token>
  const token = req.url.split("?")[1].split("=")[1];

  if (!token) return new Response("Could not get token", { status: 400 });

  const fileShareLink = await prisma.shareLink.findUnique({
    where: { id: params.id },
  });

  // Check if link is valid
  if (!fileShareLink || fileShareLink.token !== token) {
    return new Response("Invalid link", { status: 404 });
  }

  // Check if link is expired
  if (fileShareLink.expiresAt < new Date()) {
    await prisma.shareLink.delete({ where: { id: fileShareLink.id } });
    return new Response("Link expired", { status: 404 });
  }

  const file = await prisma.file.findUnique({
    where: { id: fileShareLink.file_id },
  });

  if (!file) {
    return new Response("File not found", { status: 404 });
  }

  const html = `
    <html>
      <head>
        <title>${file.name}</title>
        <script src="https://cdn.tailwindcss.com"></script>
      </head>
      <body class="container mx-auto pt-4 bg-black">
        <h1 class="text-2xl font-bold text-white">${file.name}</h1>
        <p class="text-sm text-gray-400 my-2">Size: ${formatSizeToMb(file.size)}</p>
        <p class="text-sm text-gray-400 my-2">Type: ${file.type}</p>
        <p class="text-sm text-gray-400 my-2">Uploaded at: ${file.createdAt}</p>
        ${file.type === "image" ? `<img src="${file.path}" style="max-width: 50%" />` : ""}
        ${file.type === "pdf" ? `<embed src="${file.path}" width="100%" height="100%" />` : ""}
        ${file.type === "audio" ? `<audio controls><source src="${file.path}" type="audio/mpeg"></audio>` : ""}
        ${file.type === "video" ? `<video controls width="50%" height="50%"><source src="${file.path}" type="video/mp4"></video>` : ""}
        <br />
        <a class="bg-blue-500 text-white px-4 py-2 rounded mt-4" href="${file.path}" download>Download</a>
            Download
        </a>
      </body>
    </html>
  `;

  return new Response(html, {
    headers: {
      "Content-Type": "text/html",
    },
  });
}
