"use client";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { RoleEnum } from "@/enum/roles";
import useIsAdmin from "@/hooks/useIsAdmin";
import useUser from "@/hooks/useUser";
import { User } from "@prisma/client";
import { UserSectionSkeleton } from "../company/[companyId]/performance/_components/skeletons/userSectionSkeleton";

interface UserSession {
  user: User | null;
  isLoading: boolean;
  error?: any;
}

export default function AsideUser() {
  const { user: userSession, isLoading }: UserSession = useUser();
  const isAdmin = useIsAdmin();

  if (isLoading) {
    return <UserSectionSkeleton />;
  }

  return (
    <>
      <div className="flex flex-col items-center lg:flex-row ">
        <div className="mb-3 flex lg:mb-0">
          <Avatar>
            <AvatarFallback>
              {userSession?.firstName?.slice(0, 2).toUpperCase()}
            </AvatarFallback>
          </Avatar>
          <div className="ml-2">
            <p className="flex items-center text-lg font-medium text-black dark:text-white">
              {userSession?.firstName} {userSession?.lastName}
            </p>
            <p className="text-left text-xs font-light text-gray-500">
              {userSession?.email}
            </p>
          </div>
        </div>
      </div>

      <Badge className="ml-3 text-xs">
        {isAdmin ? RoleEnum.ADMIN : RoleEnum.USER}
      </Badge>
    </>
  );
}
