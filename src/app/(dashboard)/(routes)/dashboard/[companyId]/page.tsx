"use client";
import { useCompany } from "@/store/dashboard";

export default function Dashboard() {
  const { companyId } = useCompany();

  return <div>Dashboard</div>;
}
