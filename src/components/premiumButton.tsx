"use client";
import { GiPartyPopper } from "react-icons/gi";
import { Button } from "./ui/button";
import useIsPremium from "@/hooks/useIsPremium";

export default function PremiumButton() {
  // TODO check if user is premium
  const { isPremium } = useIsPremium();

  if (isPremium) {
    return (
      <Button variant="default">
        <GiPartyPopper className="mr-2" size={20} />
        Gérer mon abonnement
      </Button>
    );
  }
  return (
    <Button variant="premium">
      <GiPartyPopper className="mr-2" size={20} />
      Passer premium
    </Button>
  );
}
