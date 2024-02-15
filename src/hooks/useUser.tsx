"use client";

import { defaultFetcherGet } from "@/lib/fetcher";
import useSWR from "swr";

export default function useUser() {
  const {
    data: user,
    isLoading,
    error,
  } = useSWR("/api/auth", defaultFetcherGet);

  return {
    user,
    isLoading,
    error,
  };
}
