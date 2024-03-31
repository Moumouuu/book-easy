import { defaultFetcherGet } from "@/lib/fetcher";
import { storeIsPremium } from "@/store/premium";
import useSWR from "swr";

export default function useIsPremium() {
  const { isPremium, setPremium } = storeIsPremium();
  const { data, error } = useSWR("/api/premium", defaultFetcherGet);

  if (error) {
    console.error("Error fetching premium status:", error);
  }

  // Only set premium if data exists and it's different from the current value
  if (data && data !== isPremium) {
    setPremium(data as boolean);
  }

  return { isPremium, error };
}
