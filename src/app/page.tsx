"use client";

import { Button } from "@/components/ui/button";
import { useRouter } from "next/navigation";
import { IoIosArrowForward, IoLogoGithub } from "react-icons/io";

export default function Home() {
  const router = useRouter();

  return (
    <main className="flex h-screen w-screen flex-col items-center  justify-center">
      <h1 className="text-4xl">File sharing made easy</h1>

      <div className="my-7 flex space-x-4">
        <Button
          className="animate-bounce hover:animate-none"
          onClick={() => router.push("/dashboard")}
        >
          Start sharing
        </Button>
        <Button
          variant="outline"
          className="hover:animate-pulse"
          onClick={() => router.push("https://github.com/lassejlv/sharemyfile-next")}
        >
          <IoLogoGithub size={20} className="mr-2" />
          Github
        </Button>
      </div>
    </main>
  );
}
