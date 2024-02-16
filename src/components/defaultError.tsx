"use client";
import { MdError } from "react-icons/md";
import { Button } from "./ui/button";
import { useRouter } from "next/navigation";
interface IDefaultError {
  title: string;
  message: string;
}

export default function DefaultError({ title, message }: IDefaultError) {
  const router = useRouter();
  return (
    <div className="flex h-screen w-full flex-col items-center justify-center">
      <MdError size={40} color="orange" />

      <h1 className="mb-3 text-center text-2xl font-semibold lg:w-1/2 lg:text-3xl">
        {title}
      </h1>
      <p className="text-md font-medium text-red-800 lg:text-lg">{message}</p>
      <Button onClick={() => router.push("/")} className="mt-5">
        Retourner à l&apos;accueil
      </Button>
    </div>
  );
}
