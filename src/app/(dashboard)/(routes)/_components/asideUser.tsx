"use client";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { User } from "@prisma/client";
import { UserSectionSkeleton } from "../company/[companyId]/performance/_components/skeletons/userSectionSkeleton";
import useUser from "@/hooks/useUser";

interface UserSession {
  user: User | null;
  isLoading: boolean;
  error?: any;
}

export default function AsideUser() {
  const { user: userSession, isLoading }: UserSession = useUser();

  if (isLoading) {
    return <UserSectionSkeleton />;
  }

  return (
    <div className="flex items-center">
      <Avatar>
        <AvatarFallback>
          {userSession?.firstName?.slice(0, 2).toUpperCase()}
        </AvatarFallback>
      </Avatar>
      <span className="ml-3 text-lg">
        {userSession?.firstName} {userSession?.lastName}
      </span>
    </div>
  );
}
