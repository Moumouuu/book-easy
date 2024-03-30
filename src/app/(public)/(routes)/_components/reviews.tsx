import Image from "next/image";
import Marquee from "./marquee";

const press = [
  "TheNewYorkTimes",
  "TheWashingtonPost",
  "Forbes",
  "Bloomberg",
  "BusinessInsider",
  "TechCrunch",
  "TheGuardian",
  "Wired",
];

export function Press() {
  return (
    <section id="press">
      <div className="py-14">
        <div className="container mx-auto px-4 md:px-8">
          <div className="relative mt-6">
            <Marquee className="max-w-full [--duration:40s]">
              {press.map((logo, idx) => (
                <Image
                  key={idx}
                  width={160}
                  height={40}
                  src={`https://cdn.magicui.design/press/${logo}.svg`}
                  className="h-10 w-40 px-2 dark:brightness-0 dark:invert"
                  alt={`logo-${logo}`}
                />
              ))}
            </Marquee>
            <div className="pointer-events-none absolute inset-y-0 left-0 h-full w-1/3 bg-gradient-to-r from-background"></div>
            <div className="pointer-events-none absolute inset-y-0 right-0 h-full w-1/3 bg-gradient-to-l from-background"></div>
          </div>
        </div>
      </div>
    </section>
  );
}
