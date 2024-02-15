"use client";
import PremiumButton from "@/components/premiumButton";
import { ThemeToggle } from "@/components/theme-toggle";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import useUser from "@/hooks/useUser";
import { User } from "@prisma/client";
import { UserSectionSkeleton } from "./skeletons/userSectionSkeleton";

interface UserSession {
  user: User | null;
  isLoading: boolean;
  error?: any;
}

export default function UserSection() {
  const { user: userSession, isLoading }: UserSession = useUser();

  if (isLoading) {
    return <UserSectionSkeleton />;
  }

  return (
    <div className="flex w-full flex-col  justify-between lg:flex-row">
      <div className="mb-2 flex lg:mb-0">
        <Avatar>
          <AvatarImage
            src={userSession?.image ?? ""}
            alt={userSession?.firstName ?? "User avatar"}
          />
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
