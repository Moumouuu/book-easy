import { BentoDemo } from "./_components/bento";
import { CallToAction } from "./_components/CTA";
import { FAQ } from "./_components/faq";
import { HeroScrollBaner } from "./_components/heroScrollBaner";
import { Press } from "./_components/reviews";

export default async function App() {
  return (
    <div className="flex flex-col justify-center items-center">
      <HeroScrollBaner />
      <Press />
      <BentoDemo />
      <CallToAction />
      <FAQ />
    </div>
  );
}
