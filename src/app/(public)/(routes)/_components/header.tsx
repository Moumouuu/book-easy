"use client";

import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";
import Link from "next/link";
import * as React from "react";

import { Button } from "@/components/ui/button";
import {
  NavigationMenu,
  NavigationMenuContent,
  NavigationMenuItem,
  NavigationMenuLink,
  NavigationMenuList,
  NavigationMenuTrigger,
  navigationMenuTriggerStyle,
} from "@/components/ui/navigation-menu";
import { defaultFetcherGet } from "@/lib/fetcher";
import { cn } from "@/lib/utils";
import { Menu } from "lucide-react";
import { useSession } from "next-auth/react";
import Image from "next/image";
import { useRouter } from "next/navigation";
import useSWR from "swr";
import GetStartedButton from "./getStartedButton";

const features: { title: string; description: string }[] = [
  {
    title: "Calendrier",
    description:
      "Un calendrier pour gérer les réservations, les disponibilités et les événements.",
  },
  {
    title: "Performances",
    description:
      "Analysez les performances de votre entreprise, les réservations et les clients.",
  },
  {
    title: "Clients",
    description:
      "Gérez les informations de vos clients, leurs réservations et leurs préférences.",
  },
  {
    title: "Équipes",
    description: "Gérez les équipes, les rôles et les permissions.",
  },
  {
    title: "Réservations ",
    description: "Gérez les réservations, les détails et les annulations.",
  },
];

export function Header() {
  const { data: user } = useSession();
  const router = useRouter();
  const { data: companies } = useSWR("/api/company", defaultFetcherGet);

  async function handleRoute() {
    if (!user?.user) router.push("/sign-in");
    // redirect to the first dashboard of the company
    if (companies) {
      router.push(`/company/${companies[0].id}`);
    }
  }

  return (
    <div className="flex justify-between lg:justify-around items-center p-4">
      <Navigation />
      <div className="lg:mx-3 flex">
        <GetStartedButton />
        <Button onClick={handleRoute} className="mx-2" variant={"premium"}>
          Accéder au dashboard
        </Button>
      </div>
    </div>
  );
}

interface item {
  title: string;
  description: string;
  href?: string;
}
const items: item[] = [
  {
    title: "Documentation",
    description:
      "Toutes les informations pour commencer à utiliser l'application.",
    href: "/docs",
  },
  {
    title: "Installation self-hosted",
    description: "Comment installer l'application, en self-hosting.",
    href: "/docs/getting-started/self-hosted",
  },
  {
    title: "Installation en ligne",
    description: "Comment utiliser l'application en ligne.",
    href: "/docs/getting-started",
  },
];

const Navigation = () => {
  return (
    <>
      <div className="block lg:hidden">
        <Sheet>
          <SheetTrigger>
            <Menu size={24} />
          </SheetTrigger>
          <SheetContent side={"left"}>
            <div className="h-full overflow-y-auto p-3">
              {items.map((item) => (
                <div key={item.title} className="flex flex-col my-5">
                  <Link href={"/"}>
                    <span className="text-md font-semibold">{item.title}</span>
                    <br />
                    <span className="text-muted-foreground text-sm font-medium">
                      {item.description}
                    </span>
                  </Link>
                </div>
              ))}
            </div>
          </SheetContent>
        </Sheet>
      </div>
      <div className="hidden lg:flex">
        <Link href="/">
          <Image
            src="/assets/images/icon-bookEasy.png"
            alt="logo"
            width={48}
            height={48}
          />
        </Link>
        <NavigationMenu>
          <NavigationMenuList>
            <NavigationMenuItem>
              <NavigationMenuTrigger>Commencer</NavigationMenuTrigger>
              <NavigationMenuContent>
                <ul className="grid gap-3 p-6 md:w-[400px] lg:w-[500px] lg:grid-cols-[.75fr_1fr]">
                  <li className="row-span-3">
                    <NavigationMenuLink asChild>
                      <a
                        className="flex h-full w-full select-none flex-col justify-end rounded-md bg-gradient-to-b from-muted/50 to-muted p-6 no-underline outline-none focus:shadow-md"
                        href="/"
                      >
                        <Image
                          src="/assets/images/icon-bookEasy.png"
                          alt="logo"
                          width={48}
                          height={48}
                        />
                        <div className="mb-2 mt-4 text-lg font-medium">
                          BookEazy
                        </div>
                        <p className="text-sm leading-tight text-muted-foreground">
                          Application web de gestion de réservation, de clients
                          et qui permet d&apos;analyser les performances.
                        </p>
                      </a>
                    </NavigationMenuLink>
                  </li>
                  <ListItem href="/docs" title="Documentations">
                    Toutes les informations pour commencer à utiliser
                    l&apos;application.
                  </ListItem>
                  <ListItem
                    href="/docs/getting-started/self-hosted"
                    title="Installation self-hosted"
                  >
                    Comment installer l&apos;application, en self-hosting.
                  </ListItem>
                  <ListItem
                    href="/docs/getting-started"
                    title="Installation en ligne"
                  >
                    Comment utiliser l&apos;application en ligne.
                  </ListItem>
                </ul>
              </NavigationMenuContent>
            </NavigationMenuItem>
            <NavigationMenuItem>
              <NavigationMenuTrigger>Fonctionnalités</NavigationMenuTrigger>
              <NavigationMenuContent>
                <ul className="grid w-[400px] gap-3 p-4 md:w-[500px] md:grid-cols-2 lg:w-[600px] ">
                  {features.map((feature) => (
                    <ListItem
                      key={feature.title}
                      title={feature.title}
                      href={"/"}
                    >
                      {feature.description}
                    </ListItem>
                  ))}
                </ul>
              </NavigationMenuContent>
            </NavigationMenuItem>
            <NavigationMenuItem>
              <Link href="/docs" legacyBehavior passHref>
                <NavigationMenuLink className={navigationMenuTriggerStyle()}>
                  Documentation
                </NavigationMenuLink>
              </Link>
            </NavigationMenuItem>
          </NavigationMenuList>
        </NavigationMenu>
      </div>
    </>
  );
};

const ListItem = React.forwardRef<
  React.ElementRef<"a">,
  React.ComponentPropsWithoutRef<"a">
>(({ className, title, children, ...props }, ref) => {
  return (
    <li>
      <NavigationMenuLink asChild>
        <a
          ref={ref}
          className={cn(
            "block select-none space-y-1 rounded-md p-3 leading-none no-underline outline-none transition-colors hover:bg-accent hover:text-accent-foreground focus:bg-accent focus:text-accent-foreground",
            className
          )}
          {...props}
        >
          <div className="text-sm font-medium leading-none">{title}</div>
          <p className="line-clamp-2 text-sm leading-snug text-muted-foreground">
            {children}
          </p>
        </a>
      </NavigationMenuLink>
    </li>
  );
});
ListItem.displayName = "ListItem";
