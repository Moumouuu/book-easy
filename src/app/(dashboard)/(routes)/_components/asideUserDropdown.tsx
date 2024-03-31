"use client";

import { LogOut, Settings } from "lucide-react";

import DefaultError from "@/components/defaultError";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuPortal,
  DropdownMenuSeparator,
  DropdownMenuSub,
  DropdownMenuSubContent,
  DropdownMenuSubTrigger,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { defaultFetcherGet } from "@/lib/fetcher";
import { signOut } from "next-auth/react";
import Link from "next/link";
import { FaHouse } from "react-icons/fa6";
import useSWR from "swr";
import AsideUser from "./asideUser";

export function AsideUserDropdown() {
  const {
    data: companies,
    isLoading,
    error,
  } = useSWR("/api/company", defaultFetcherGet);

  if (isLoading) {
    return null;
  }

  if (error) {
    return <DefaultError message="Failed to fetch companies" title="Error" />;
  }

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant={"ghost"} className="py-6">
          <AsideUser />
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent className="w-56">
        <DropdownMenuLabel>Mon compte</DropdownMenuLabel>
        <DropdownMenuSeparator />
        <DropdownMenuGroup>
          <DropdownMenuSub>
            <DropdownMenuSubTrigger>
              <FaHouse className="mr-2 h-4 w-4" />
              <span>Mes entreprises</span>
            </DropdownMenuSubTrigger>
            <DropdownMenuPortal>
              <DropdownMenuSubContent>
                {companies?.map((company: { id: string; name: string }) => (
                  <Link key={company.id} href={`/company/${company.id}`}>
                    <DropdownMenuItem>
                      <span>{company.name}</span>
                    </DropdownMenuItem>
                  </Link>
                ))}
              </DropdownMenuSubContent>
            </DropdownMenuPortal>
          </DropdownMenuSub>
          <Link href="/user/setting">
            <DropdownMenuItem>
              <Settings className="mr-2 h-4 w-4" />
              <span>Paramètre du compte</span>
            </DropdownMenuItem>
          </Link>
        </DropdownMenuGroup>
        <DropdownMenuSeparator />
        <DropdownMenuItem onClick={() => signOut()}>
          <LogOut className="mr-2 h-4 w-4" />
          <span>Déconnexion</span>
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
