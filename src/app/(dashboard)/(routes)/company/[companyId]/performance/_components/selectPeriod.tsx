import * as React from "react";

import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectLabel,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { PeriodEnum } from "@/enum/period";

interface ISelectPeriodProps {
  period: string;
  setPeriod: (period: string) => void;
}

export function SelectPeriod({ period, setPeriod }: ISelectPeriodProps) {
  const items: string[] = [
    PeriodEnum.DAY,
    PeriodEnum.WEEK,
    PeriodEnum.MONTH,
    PeriodEnum.YEAR,
  ];

  return (
    <Select onValueChange={setPeriod} defaultValue={period}>
      <SelectTrigger className="w-[180px]">
        <SelectValue placeholder="Select a period" />
      </SelectTrigger>
      <SelectContent>
        <SelectGroup>
          <SelectLabel>Periods</SelectLabel>
          {items.map((item, index) => (
            <SelectItem key={index} value={item}>
              {item}
            </SelectItem>
          ))}
        </SelectGroup>
      </SelectContent>
    </Select>
  );
}
