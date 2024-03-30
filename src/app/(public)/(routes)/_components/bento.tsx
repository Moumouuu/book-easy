import { Calendar } from "@/components/ui/calendar";
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from "@/components/ui/command";
import { cn } from "@/lib/utils";
import { CalendarIcon, GlobeIcon } from "@radix-ui/react-icons";
import { AreaChart, Users } from "lucide-react";
import { BentoCard, BentoGrid } from "./bentoGrid";
import Globe from "./globe";
import Marquee from "./marquee";

const files = [
  {
    name: "users.pdf",
    body: "Vous pouvez gérer vos utilisateurs en toute simplicité avec BookEazy.",
  },
  {
    name: "reservations.xlsx",
    body: "Suivez vos réservations en temps réel et gérez-les facilement.",
  },
  {
    name: "teams.svg",
    body: "Créez des équipes et attribuez des rôles à vos collaborateurs.",
  },
  {
    name: "performances.gpg",
    body: "Analysez les performances de votre activité et prenez les bonnes décisions.",
  },
];

const features = [
  {
    Icon: AreaChart,
    name: "Performances",
    description:
      "Vos stats en temps réel pour suivre l'évolution de votre activité.",
    href: "/",
    cta: "Learn more",
    className: "col-span-3 lg:col-span-1",
    background: (
      <Marquee
        pauseOnHover
        className="absolute top-10 [--duration:20s] [mask-image:linear-gradient(to_top,transparent_40%,#000_100%)] "
      >
        {files.map((f, idx) => (
          <figure
            key={idx}
            className={cn(
              "relative w-32 cursor-pointer overflow-hidden rounded-xl border p-4",
              "border-gray-950/[.1] bg-gray-950/[.01] hover:bg-gray-950/[.05]",
              "dark:border-gray-50/[.1] dark:bg-gray-50/[.10] dark:hover:bg-gray-50/[.15]",
              "transform-gpu blur-[1px] transition-all duration-300 ease-out hover:blur-none"
            )}
          >
            <div className="flex flex-row items-center gap-2">
              <div className="flex flex-col">
                <figcaption className="text-sm font-medium dark:text-white ">
                  {f.name}
                </figcaption>
              </div>
            </div>
            <blockquote className="mt-2 text-xs">{f.body}</blockquote>
          </figure>
        ))}
      </Marquee>
    ),
  },
  {
    Icon: Users,
    name: "Équipe",
    description:
      "Gérez vos équipes et attribuez des rôles à vos collaborateurs.",
    href: "/",
    cta: "Learn more",
    className: "col-span-3 lg:col-span-2",
    background: (
      <Command className="absolute right-10 top-10 w-[70%] origin-top translate-x-0 border transition-all duration-300 ease-out [mask-image:linear-gradient(to_top,transparent_40%,#000_100%)] group-hover:-translate-x-10">
        <CommandInput placeholder="Type a command or search..." />
        <CommandList>
          <CommandEmpty>No results found.</CommandEmpty>
          <CommandGroup heading="Suggestions">
            <CommandItem>Albert</CommandItem>
            <CommandItem>Robin</CommandItem>
            <CommandItem>Aurélie</CommandItem>
            <CommandItem>Thomzer</CommandItem>
            <CommandItem>Bordy</CommandItem>
            <CommandItem>Matitis</CommandItem>
          </CommandGroup>
        </CommandList>
      </Command>
    ),
  },
  {
    Icon: GlobeIcon,
    name: "Réservations",
    description: "Des réservations partout dans le monde.",
    href: "/",
    cta: "Learn more",
    className: "col-span-3 lg:col-span-2",
    background: (
      <Globe className="top-0 h-[600px] w-[600px] transition-all duration-300 ease-out [mask-image:linear-gradient(to_top,transparent_30%,#000_100%)] group-hover:scale-105 sm:left-40" />
    ),
  },
  {
    Icon: CalendarIcon,
    name: "Calendrier",
    description: "Planifiez vos événements et vos rendez-vous.",
    className: "col-span-3 lg:col-span-1",
    href: "/",
    cta: "Learn more",
    background: (
      <Calendar
        mode="single"
        selected={new Date(2022, 4, 11, 0, 0, 0)}
        className="absolute right-0 top-10 origin-top rounded-md border transition-all duration-300 ease-out [mask-image:linear-gradient(to_top,transparent_40%,#000_100%)] group-hover:scale-105"
      />
    ),
  },
];

export async function BentoDemo() {
  return (
    <BentoGrid className="w-[80%] my-10">
      {features.map((feature, idx) => (
        <BentoCard key={idx} {...feature} />
      ))}
    </BentoGrid>
  );
}
