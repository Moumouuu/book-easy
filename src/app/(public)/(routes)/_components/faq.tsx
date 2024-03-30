"use client";

import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";

const faqs = [
  {
    section: "General",
    qa: [
      {
        question: "Qu'est-ce que BookEazy ?",
        answer: (
          <span>
            BookEazy est une application de gestion de rendez-vous en ligne qui
            permet aux entreprises de gérer leurs rendez-vous, leurs clients et
            leurs employés. Avec BookEazy, vous pouvez facilement planifier des
            rendez-vous, avoir une vue d&apos;ensemble de votre emploi du temps
            et de vos performances.
          </span>
        ),
      },
      {
        question: "Comment puis-je commencer à utiliser BookEazy ?",
        answer: (
          <span>
            Pour commencer à utiliser BookEazy, créez un compte, configurez
            votre entreprise et commencez à planifier des rendez-vous. Vous
            pouvez également inviter vos clients à prendre rendez-vous en ligne.
          </span>
        ),
      },
    ],
  },
  {
    section: "Support",
    qa: [
      {
        question: "Comment puis-je obtenir de l'aide avec BookEazy ?",
        answer: (
          <span>
            Si vous avez besoin d&apos;aide avec BookEazy, consultez notre
            documentation ou contactez notre équipe d&apos;assistance par
            e-mail.
          </span>
        ),
      },
    ],
  },
];

export function FAQ() {
  return (
    <section id="faq">
      <div className="py-14">
        <div className="container mx-auto px-4 md:px-8">
          <div className="mx-auto max-w-5xl text-center">
            <h4 className="text-xl font-bold tracking-tight text-black dark:text-white">
              FAQs
            </h4>
            <h2 className="text-4xl font-bold tracking-tight text-black dark:text-white sm:text-6xl">
              Questions fréquemment posées
            </h2>
            <p className="mt-6 text-xl leading-8 text-black/80 dark:text-white">
              Trouvez des réponses à vos questions sur BookEazy, son
              fonctionnement, sa personnalisation et son intégration.
            </p>
          </div>
          <div className="container mx-auto my-12 max-w-[600px] space-y-12">
            {faqs.map((faq, idx) => (
              <section key={idx} id={"faq-" + faq.section}>
                <h2 className="mb-4 text-left text-base font-semibold tracking-tight text-foreground/60">
                  {faq.section}
                </h2>
                <Accordion
                  type="single"
                  collapsible
                  className="flex w-full flex-col items-center justify-center"
                >
                  {faq.qa.map((faq, idx) => (
                    <AccordionItem
                      key={idx}
                      value={faq.question}
                      className="w-full max-w-[600px]"
                    >
                      <AccordionTrigger>{faq.question}</AccordionTrigger>
                      <AccordionContent>{faq.answer}</AccordionContent>
                    </AccordionItem>
                  ))}
                </Accordion>
              </section>
            ))}
          </div>
          <h4 className="mb-12 text-center text-sm font-medium tracking-tight text-foreground/80">
            Besoin d&apos;aide supplémentaire ? Contactez notre équipe de support à{" "}
            <a href="mailto:support@example.com" className="underline">
              robin@pluviaux.fr
            </a>
          </h4>
        </div>
      </div>
    </section>
  );
}
