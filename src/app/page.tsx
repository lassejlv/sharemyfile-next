"use client";

import { Button } from "@/components/ui/button";
import { useRouter } from "next/navigation";
import { IoIosArrowForward } from "react-icons/io";

export default function Home() {
  const router = useRouter();

  return (
    <main className="flex flex-col items-center justify-center w-screen  h-screen">
      <h1 className="text-4xl">File sharing made easy</h1>

      <div className="flex my-7 space-x-4">
        <Button
          className="animate-bounce hover:animate-none"
          onClick={() => router.push("/upload")}
        >
          Start sharing
        </Button>
        <Button variant="outline">
          <IoIosArrowForward className="mr-2" />
          Learn more
        </Button>
      </div>
    </main>
  );
}
