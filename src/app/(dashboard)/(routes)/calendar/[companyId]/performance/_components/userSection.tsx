"use client";
import PremiumButton from "@/components/premiumButton";
import { ThemeToggle } from "@/components/theme-toggle";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import useUser from "@/hooks/useUser";
import { User } from "@prisma/client";
import { UserSectionSkeleton } from "./skeletons/userSectionSkeleton";
import DefaultError from "@/components/defaultError";

interface UserSession {
  user: User | null;
  isLoading: boolean;
  error?: any;
}

export default function UserSection() {
  const { user: userSession, isLoading, error }: UserSession = useUser();

  if (isLoading) {
    return <UserSectionSkeleton />;
  }

  if (error) {
    return (
      <DefaultError
        title="Un problème est survenue lors de la récupération de l'utilisateur"
        message={error.message}
      />
    );
  }

  return (
    <div className="flex w-full flex-row items-center justify-between px-2 py-2 lg:px-10 lg:py-5">
      <div className="flex lg:mb-0">
        <Avatar>
          <AvatarFallback>
            {userSession?.firstName?.slice(0, 2).toUpperCase()}
          </AvatarFallback>
        </Avatar>
        <div className="ml-2">
          <p className="text-xl font-medium text-black dark:text-white">
            {userSession?.firstName} {userSession?.lastName}
          </p>
          <p className="text-xs font-light text-gray-500">
            {userSession?.email}
          </p>
        </div>
      </div>
      <div className="flex items-center ">
        <PremiumButton />
        <div className="ml-2">
          <ThemeToggle />
        </div>
      </div>
    </div>
  );
}
