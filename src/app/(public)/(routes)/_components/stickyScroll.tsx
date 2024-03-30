"use client";
import Image from "next/image";
import { StickyScroll } from "./stickyScrollReveal";

const content = [
  {
    title: "Calendrier de réservation",
    description:
      "Notre plateforme vous permet de voir vos réservations sur une vue planning et de les gérer en un clin d'oeil.",
    content: (
      <div className="h-full w-full flex items-center justify-center text-white">
        <Image
          src="/assets/images/calendar.png"
          width={800}
          height={800}
          quality={100}
          className="h-full w-full object-cover"
          alt="linear board demo"
        />
      </div>
    ),
  },
  {
    title: "Gestion des réservations",
    description:
      "Notre plateforme vous permet de gérer vos réservations en temps réel. Plus de confusion sur la dernière version de votre projet. Dites adieu au chaos du contrôle de version et adoptez la simplicité des mises à jour en temps réel.",
    content: (
      <div className="h-full w-full flex items-center justify-center text-white">
        <Image
          src="/assets/images/bookings.png"
          width={800}
          height={800}
          quality={100}
          className="h-full w-full object-cover"
          alt="linear board demo"
        />
      </div>
    ),
  },
  {
    title: "Performances & Résultats",
    description:
      "Notre plateforme vous met en avant vos résultats, vos bénéfices, vos nombres de réservations passées, présentes et futures. Vous pouvez également suivre vos performances et les comparer à vos objectifs.",
    content: (
      <div className="h-full w-full flex items-center justify-center text-white">
        <Image
          src="/assets/images/hero.png"
          width={800}
          height={800}
          quality={100}
          className="h-full w-full object-cover"
          alt="linear board demo"
        />
      </div>
    ),
  },
  {
    title: "Vos clients",
    description:
      "Notre plateforme vous permet de gérer vos clients, de les suivre, de les contacter, de les fidéliser. Vous pouvez également suivre leurs réservations, leurs préférences et leurs habitudes.",
    content: (
      <div className="h-full w-full flex items-center justify-center text-white">
        <Image
          src="/assets/images/customers.png"
          width={800}
          height={800}
          quality={100}
          className="h-full w-full object-cover"
          alt="linear board demo"
        />
      </div>
    ),
  },
];
export function StickyScrollRevealDemo() {
  return (
    <div className="my-10 w-[80%] max-w-[1200px]">
      <StickyScroll content={content} />
    </div>
  );
}
