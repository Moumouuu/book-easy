"use client";
import { useDashboard } from "@/store/dashboard";
import { useEffect } from "react";

interface IProps {
  params: {
    dashboardId: string;
  };
}

export default function Dashboard({ params }: IProps) {
  const { dashboardId } = params;
  const { setDashboardId } = useDashboard();

  useEffect(() => {
    // Set dashboard id to store for future use
    setDashboardId(dashboardId);
  }, [dashboardId]);

  return <div>Dashboard</div>;
}
