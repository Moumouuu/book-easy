import prismadb from "@/lib/prismadb";
import { PeriodEnum } from "@/enum/period";
import getCompany from "../getCompany";

interface ReservationMetrics {
  label: string;
  value: number;
  percentageChange: string;
  changeType: string;
  suffix?: string;
}

interface MetricsResult {
  KPI: ReservationMetrics[];
}

const getChangeType = (change: number): string => {
  if (change > 0) return "positive";
  if (change < 0) return "negative";
  return "neutral";
};

// Set the start and end date for the period
export function setStartAndEndDates(startOffset: number, endOffset: number) {
  const start = new Date();
  start.setHours(0, 0, 0, 0); // Set start time to beginning of the day (midnight)
  start.setDate(start.getDate() + startOffset);

  const end = new Date();
  end.setHours(23, 59, 59, 999); // Set end time to end of the day (just before midnight)
  end.setDate(end.getDate() + endOffset);

  return { start, end };
}

export default async function getCompanyKpiStats(
  companyId: string,
  period: string,
): Promise<MetricsResult> {
  const company = await getCompany(companyId);
  if (!company) {
    throw new Error("Company not found");
  }

  let startDate: Date, endDate: Date;

  switch (period) {
    case PeriodEnum.DAY:
      ({ start: startDate, end: endDate } = setStartAndEndDates(0, 0));
      break;
    case PeriodEnum.WEEK:
      ({ start: startDate, end: endDate } = setStartAndEndDates(-7, 0));
      break;
    case PeriodEnum.MONTH:
      ({ start: startDate, end: endDate } = setStartAndEndDates(0, 0));
      startDate.setMonth(startDate.getMonth() - 1);
      break;
    case PeriodEnum.YEAR:
      ({ start: startDate, end: endDate } = setStartAndEndDates(0, 0));
      startDate.setFullYear(startDate.getFullYear() - 1);
      break;
    default:
      throw new Error("Invalid period");
  }

  // Get the number of reservations for the period
  const numberOfReservationForPeriod = await prismadb.book.count({
    where: {
      companyId,
      start_at: {
        lte: endDate,
        gte: startDate,
      },
    },
  });

  // Get the number of reservations for the previous period
  const previousStartDate = new Date(startDate);
  const previousEndDate = new Date(endDate);

  // Adjusting previous period based on period type
  switch (period) {
    case PeriodEnum.DAY:
      previousStartDate.setDate(previousStartDate.getDate() - 1);
      previousEndDate.setDate(previousEndDate.getDate() - 1);
      break;
    case PeriodEnum.WEEK:
      previousStartDate.setDate(previousStartDate.getDate() - 7);
      previousEndDate.setDate(previousEndDate.getDate() - 7);
      break;
    case PeriodEnum.MONTH:
      previousStartDate.setMonth(previousStartDate.getMonth() - 1);
      previousEndDate.setMonth(previousEndDate.getMonth() - 1);
      break;
    case PeriodEnum.YEAR:
      previousStartDate.setFullYear(previousStartDate.getFullYear() - 1);
      previousEndDate.setFullYear(previousEndDate.getFullYear() - 1);
      break;
    default:
      throw new Error("Invalid period");
  }

  const numberOfReservationForPreviousPeriod = await prismadb.book.count({
    where: {
      companyId,
      start_at: {
        lte: previousEndDate,
        gte: previousStartDate,
      },
    },
  });

  // Calculate the percentage change
  const percentageChange =
    ((numberOfReservationForPeriod - numberOfReservationForPreviousPeriod) /
      Math.max(numberOfReservationForPreviousPeriod, 1)) *
    100;

  // Get the total price of all reservations for the period
  const totalPriceForPeriod = await prismadb.book.aggregate({
    where: {
      companyId,
      start_at: {
        lte: endDate,
        gte: startDate,
      },
    },
    _sum: {
      price: true,
    },
  });

  // Get the total price of all reservations for the previous period
  const totalPriceForPreviousPeriod = await prismadb.book.aggregate({
    where: {
      companyId,
      start_at: {
        lte: previousEndDate,
        gte: previousStartDate,
      },
    },
    _sum: {
      price: true,
    },
  });

  // Calculate the percentage change in total price
  const totalPriceForPeriodPrice = totalPriceForPeriod._sum.price ?? 0;
  const totalPriceForPreviousPeriodPrice =
    totalPriceForPreviousPeriod._sum.price ?? 0;

  // Calculate the percentage change
  const percentageChangeInTotalPrice =
    ((totalPriceForPeriodPrice - totalPriceForPreviousPeriodPrice) /
      Math.max(totalPriceForPreviousPeriodPrice, 1)) *
    100;

  return {
    KPI: [
      {
        label: "Nombre de réservations",
        value: numberOfReservationForPeriod,
        percentageChange: percentageChange.toFixed(2),
        changeType: getChangeType(percentageChange),
      },
      {
        label: "Chiffre d'affaires",
        value: totalPriceForPeriod._sum.price ?? 0,
        percentageChange: percentageChangeInTotalPrice.toFixed(2),
        changeType: getChangeType(percentageChangeInTotalPrice),
        suffix: "€",
      },
    ],
  };
}
