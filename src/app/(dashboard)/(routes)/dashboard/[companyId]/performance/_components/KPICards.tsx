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

interface IProps {
  company: Company;
}

export default function KPICards({ company }: IProps) {
  return (
    <>
      <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
        {data.map((item) => (
          <Card key={item.name}>
            <div className="flex items-center justify-between">
              <p className="text-tremor-default text-tremor-content dark:text-dark-tremor-content font-medium">
                {item.name}
              </p>
              <span
                className={cn(
                  item.changeType === "positive"
                    ? "bg-emerald-100 text-emerald-800 ring-emerald-600/10 dark:bg-emerald-400/10 dark:text-emerald-500 dark:ring-emerald-400/20"
                    : "bg-red-100 text-red-800 ring-red-600/10 dark:bg-red-400/10 dark:text-red-500 dark:ring-red-400/20",
                  "rounded-tremor-small text-tremor-label inline-flex items-center px-2 py-1 font-medium ring-1 ring-inset",
                )}
              >
                {item.change}
              </span>
            </div>
            <p className="text-tremor-metric text-tremor-content-strong dark:text-dark-tremor-content-strong font-semibold">
              {item.stat}
            </p>
          </Card>
        ))}
      </div>
    </>
  );
}
