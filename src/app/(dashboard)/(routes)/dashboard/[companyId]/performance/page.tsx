"use client";
import { useCompany } from "@/store/dashboard";

export default function Performance() {
  const { companyId } = useCompany();

  return (
    <div>
      <h1>Performance</h1>
    </div>
  );
}
