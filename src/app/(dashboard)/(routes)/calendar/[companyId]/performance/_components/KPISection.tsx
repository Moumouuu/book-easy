"use client";

import { PeriodEnum } from "@/enum/period";
import { useState } from "react";
import { SelectPeriod } from "./selectPeriod";
import KPICards from "./KPICards";

export default function () {
  const [period, setPeriod] = useState<string>(PeriodEnum.DAY);

  return (
    <div className="my-5 flex flex-col rounded border p-4">
      <div className="mb-3">
        <SelectPeriod period={period} setPeriod={setPeriod} />
      </div>
      <KPICards period={period} />
      <p className="text-gretext-tremor-default text-tremor-content dark:text-dark-tremor-content ml-1 mt-2 font-medium">
        L&apos;évolution est par rapport à la période précédente de la même
        durée.
      </p>
    </div>
  );
}
