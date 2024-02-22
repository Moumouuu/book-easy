"use client";
import { useCompany } from "@/store/dashboard";

export default function Calendar() {
  const { companyId } = useCompany();

  return <div>Dashboard</div>;
}
