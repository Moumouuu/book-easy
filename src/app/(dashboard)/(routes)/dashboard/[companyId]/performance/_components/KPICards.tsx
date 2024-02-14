// 'use client';
import { cn } from "@/lib/utils";
import { Company } from "@prisma/client";
import { Card } from "@tremor/react";

const data = [
  {
    name: "Daily active users",
    stat: "3,450",
    change: "+12.1%",
    changeType: "positive",
  },
  {
    name: "Weekly sessions",
    stat: "1,342",
    change: "-9.8%",
    changeType: "negative",
  },
  {
    name: "Duration",
    stat: "5.2min",
    change: "+7.7%",
    changeType: "positive",
  },
];

interface ICompanyStats {
  label: string;
  value: number;
  percentageChange: number;
  changeType: "positive" | "negative" | "neutral";
}

interface IProps {
  companyStats: ICompanyStats[];
}

export default function KPICards({ companyStats }: IProps) {
  return (
    <>
      <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
        {companyStats.map((companyStat) => (
          <Card key={companyStat.label}>
            <div className="flex items-center justify-between">
              <p className="text-tremor-default text-tremor-content dark:text-dark-tremor-content font-medium">
                {companyStat.label}
              </p>
              <span
                className={cn(
                  companyStat.changeType === "positive"
                    ? "bg-emerald-100 text-emerald-800 ring-emerald-600/10 dark:bg-emerald-400/10 dark:text-emerald-500 dark:ring-emerald-400/20"
                    : "bg-red-100 text-red-800 ring-red-600/10 dark:bg-red-400/10 dark:text-red-500 dark:ring-red-400/20",
                  "rounded-tremor-small text-tremor-label inline-flex items-center px-2 py-1 font-medium ring-1 ring-inset",
                )}
              >
                {companyStat.percentageChange}%{" "}
                {companyStat.changeType === "positive" ? "↑" : "↓"}
              </span>
            </div>
            <p className="text-tremor-metric text-tremor-content-strong dark:text-dark-tremor-content-strong font-semibold">
              {companyStat.value}
            </p>
          </Card>
        ))}
      </div>
    </>
  );
}
