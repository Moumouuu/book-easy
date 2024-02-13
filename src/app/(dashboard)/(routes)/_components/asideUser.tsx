"use client";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { useSession } from "next-auth/react";

export default function AsideUser() {
  const { data: userSession } = useSession();
  return (
    <div className="flex items-center ">
      <Avatar>
        <AvatarImage
          src={userSession?.user?.image ?? ""}
          alt={userSession?.user?.name ?? "User avatar"}
        />
        <AvatarFallback>
          {userSession?.user?.name?.slice(0, 2).toUpperCase() ??
            userSession?.user?.email?.slice(0, 2).toUpperCase()}
        </AvatarFallback>
      </Avatar>
      <span className="ml-3 text-lg">
        {userSession?.user?.name ??
          userSession?.user?.email?.split("@")[0].slice(0, 10)}
      </span>
    </div>
  );
}
