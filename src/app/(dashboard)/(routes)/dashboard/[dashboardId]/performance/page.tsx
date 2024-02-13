"use client";
import { useDashboard } from "@/store/dashboard";
import Example from "./_components/example";

export default function Performance() {
  const { dashboardId } = useDashboard();

  return (
    <div>
      <h1>Performance</h1>
      <Example />
    </div>
  );
}
