import Dashboard from "@/components/Dashboard";
import { prisma } from "@/lib/prisma";
import { getKindeServerSession } from "@kinde-oss/kinde-auth-nextjs/server";
import React from "react";

export default async function page() {
  const user = await getKindeServerSession().getUser();
  if (!user) return;

  const files = await prisma.file.findMany({
    where: { kinde_user_id: user.id },
  });

  return (
    <>
      <Dashboard files={files} user={user} />
    </>
  );
}
