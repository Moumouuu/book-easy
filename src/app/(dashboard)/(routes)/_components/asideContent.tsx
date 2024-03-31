"use client";
import { AiFillDashboard } from "react-icons/ai";
import { FaRegCalendarPlus } from "react-icons/fa";
import { FaAddressBook, FaPeopleGroup } from "react-icons/fa6";
import { IoCalendarNumberSharp, IoSettings } from "react-icons/io5";

import Link from "next/link";
import { usePathname } from "next/navigation";

import PremiumButton from "@/components/premiumButton";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { useCompany } from "@/store/dashboard";
import { X } from "lucide-react";
import { useState } from "react";
import { AsideUserDropdown } from "./asideUserDropdown";

interface IAsideItem {
  label: string;
  icon: JSX.Element;
  href: string;
}

export default function AsideContent() {
  const [defaultMoreInfoPopUpIsOpen, setDefaultMoreInfoPopUpIsOpen] =
    useState<boolean>(true);
  const { companyId } = useCompany();
  const defaultPath = `/company/${companyId}`;
  const currentPath = usePathname();

  const ICON_SIZE = 20;

  const asideItems: IAsideItem[] = [
    {
      label: "Calendar",
      icon: <IoCalendarNumberSharp className="mr-3" size={ICON_SIZE} />,
      href: defaultPath,
    },
    {
      label: "Performance",
      icon: <AiFillDashboard className="mr-3" size={ICON_SIZE} />,
      href: `${defaultPath}/performance`,
    },
    {
      label: "Clients",
      icon: <FaAddressBook className="mr-3" size={ICON_SIZE} />,
      href: `${defaultPath}/customers`,
    },
    {
      label: "Équipes",
      icon: <FaPeopleGroup className="mr-3" size={ICON_SIZE} />,
      href: `${defaultPath}/team`,
    },
    {
      label: "Réservations",
      icon: <FaRegCalendarPlus className="mr-3" size={ICON_SIZE} />,
      href: `${defaultPath}/bookings`,
    },
    {
      label: "Paramètres",
      icon: <IoSettings className="mr-3" size={ICON_SIZE} />,
      href: `${defaultPath}/settings`,
    },
  ];

  return (
    <div className="mt-5 flex h-[90%] flex-col justify-between">
      <div className="flex flex-col">
        {asideItems.map((item: IAsideItem) => (
          <Link
            key={item.label}
            href={item.href}
            className={cn(
              currentPath === item.href
                ? "bg-primary/25 text-primary"
                : "text-gray-500",
              "hover:bg-primary/15 hover:text-primary ease my-1 flex items-center rounded-lg px-3 py-2  duration-100"
            )}
          >
            {item.icon}
            <span className="text-md font-medium">{item.label}</span>
          </Link>
        ))}
      </div>
      <div>
        {defaultMoreInfoPopUpIsOpen && (
          <div className="bg-primary-foreground relative mb-3 rounded border p-4 ">
            <X
              onClick={() => setDefaultMoreInfoPopUpIsOpen(false)}
              className="absolute right-2 top-2 cursor-pointer"
              size={20}
            />
            <p className="text-sm">
              Accéder à des fonctionnalités avancées pour{" "}
              <span className="text-primary font-bold">
                booster votre activité
              </span>{" "}
              et des métriques pour suivre votre performance.
            </p>
            <div className="mt-3">
              <PremiumButton size="sm" />
              <Button size={"sm"} className="mt-2" variant={"secondary"}>
                En savoir plus
              </Button>
            </div>
          </div>
        )}
        <AsideUserDropdown />
      </div>
    </div>
  );
}
