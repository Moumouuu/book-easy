"use client";
import { AiFillDashboard } from "react-icons/ai";
import { FaRegCalendarPlus } from "react-icons/fa";
import { FaAddressBook, FaPeopleGroup } from "react-icons/fa6";
import { IoCalendarNumberSharp, IoSettings } from "react-icons/io5";

import Link from "next/link";
import { usePathname } from "next/navigation";

import { cn } from "@/lib/utils";
import { AsideUserDropdown } from "./asideUserDropdown";
import { useCompany } from "@/store/dashboard";
import { ThemeToggle } from "@/components/theme-toggle";

interface IAsideItem {
  label: string;
  icon: JSX.Element;
  href: string;
}

export default function AsideContent() {
  const { companyId } = useCompany();
  const defaultPath = `/calendar/${companyId}`;
  const currentPath = usePathname();

  const asideItems: IAsideItem[] = [
    {
      label: "Calendar",
      icon: <IoCalendarNumberSharp className="mr-3" size={25} />,
      href: defaultPath,
    },
    {
      label: "Performance",
      icon: <AiFillDashboard className="mr-3" size={25} />,
      href: `${defaultPath}/performance`,
    },
    {
      label: "Clients",
      icon: <FaAddressBook className="mr-3" size={25} />,
      href: `${defaultPath}/customers`,
    },
    {
      label: "Équipes",
      icon: <FaPeopleGroup className="mr-3" size={25} />,
      href: `${defaultPath}/teams`,
    },
    {
      label: "Réservations",
      icon: <FaRegCalendarPlus className="mr-3" size={25} />,
      href: `${defaultPath}/bookings`,
    },
    {
      label: "Paramètres",
      icon: <IoSettings className="mr-3" size={25} />,
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
                ? "bg-primary/20 text-primary"
                : "text-gray-600",
              "hover:bg-primary/20 hover:text-primary ease my-1 flex items-center rounded-lg px-3 py-4 duration-100",
            )}
          >
            {item.icon}
            <span className="text-lg font-medium">{item.label}</span>
          </Link>
        ))}
      </div>
      <AsideUserDropdown />
    </div>
  );
}
