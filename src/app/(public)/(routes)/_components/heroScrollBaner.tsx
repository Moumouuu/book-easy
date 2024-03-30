"use client";
import Image from "next/image";
import { ButtonHovered } from "./buttonHovered";
import { ContainerScroll } from "./containerScollAnimation";

export function HeroScrollBaner() {
  return (
    <div className="flex flex-col overflow-hidden">
      <ContainerScroll
        titleComponent={
          <>
            <h1 className="text-4xl font-semibold text-black dark:text-white">
              Boostez votre entreprise avec <br />
              <span className="text-4xl md:text-[6rem] font-bold mt-1 leading-none">
                Nos Réservations
              </span>
            </h1>
          </>
        }
      >
        <Image
          src={`/assets/images/hero.png`}
          alt="hero"
          height={720}
          width={1400}
          className="mx-auto rounded-2xl object-cover h-full object-left-top"
          draggable={false}
        />
      </ContainerScroll>
    </div>
  );
}
