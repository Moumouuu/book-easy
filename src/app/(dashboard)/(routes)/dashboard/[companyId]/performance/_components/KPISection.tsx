"use client";

import { PeriodEnum } from "@/enum/period";
import { useState } from "react";
import { SelectPeriod } from "./selectPeriod";
import KPICards from "./KPICards";

export default function () {
  const [period, setPeriod] = useState<string>(PeriodEnum.DAY);

  return (
    <div className="flex flex-col rounded border p-4 ">
      <div className="mb-3">
        <SelectPeriod period={period} setPeriod={setPeriod} />
      </div>
      <KPICards period={period} />
    </div>
  );
}
