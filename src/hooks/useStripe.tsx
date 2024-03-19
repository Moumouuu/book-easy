"use client";
import axios from "axios";
import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import { useState } from "react";

const useStripeSubscribe = () => {
  const [loading, setLoading] = useState(false);
  const { data: session } = useSession();
  const router = useRouter();

  const subscribeToStripe = async () => {
    if (!session) router.push("/sign-in");
    try {
      setLoading(true);
      const response = await axios.get("/api/stripe");

      // Assuming the response contains a URL to redirect the user for subscription
      window.location.href = response.data.url;
    } catch (error) {
      // Handle any error if needed
      console.error("Error subscribing to Stripe:", error);
    } finally {
      setLoading(false);
    }
  };

  return { subscribeToStripe, loading };
};

export default useStripeSubscribe;
