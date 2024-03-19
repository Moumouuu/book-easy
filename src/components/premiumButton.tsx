"use client";
import useIsPremium from "@/hooks/useIsPremium";
import useStripeSubscribe from "@/hooks/useStripe";
import { GiPartyPopper } from "react-icons/gi";
import { Button } from "./ui/button";

interface IPremiumButton {
  size?: "sm" | "lg";
}

export default function PremiumButton({ size = "lg" }: IPremiumButton) {
  const { isPremium } = useIsPremium();
  const { subscribeToStripe, loading } = useStripeSubscribe();

  if (isPremium) {
    return (
      <Button variant="default" disabled>
        <GiPartyPopper className="mr-2" size={20} />
        Vous êtes premium
      </Button>
    );
  }
  return (
    <Button
      size={size}
      variant="premium"
      onClick={subscribeToStripe}
      isLoading={loading}
      disabled={loading}
    >
      <GiPartyPopper className="mr-2" size={20} />
      Passer premium
    </Button>
  );
}
