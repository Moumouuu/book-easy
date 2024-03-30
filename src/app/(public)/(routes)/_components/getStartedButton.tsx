"use client";
import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { ButtonHovered } from "./buttonHovered";

export default function GetStartedButton() {
  const { data: user } = useSession();
  const router = useRouter();
  const [open, setOpen] = useState<boolean>(false);

  const handleRoute = () => {
    if (!user) router.push("/sign-in");
    toggleOpen();
  };

  const toggleOpen = () => {
    setOpen(!open);
  };

  // todo modal to create company

  return (
    <>
      <ButtonHovered onClick={handleRoute}>Commencer</ButtonHovered>
    </>
  );
}
