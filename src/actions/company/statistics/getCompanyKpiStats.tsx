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

export default async function getCompanyKpiStats(
  companyId: string,
  period: string,
): Promise<MetricsResult> {
  const company = await getCompany(companyId);
  if (!company) {
    throw new Error("Company not found");
  }

  let startDate: Date, endDate: Date;

  // Set the start and end date for the period
  switch (period) {
    case PeriodEnum.DAY:
      startDate = new Date();
      startDate.setDate(startDate.getDate() - 1);
      endDate = new Date();
      break;
    case PeriodEnum.WEEK:
      startDate = new Date();
      startDate.setDate(startDate.getDate() - 7);
      endDate = new Date();
      break;
    case PeriodEnum.MONTH:
      startDate = new Date();
      startDate.setMonth(startDate.getMonth() - 1);
      endDate = new Date();
      break;
    case PeriodEnum.YEAR:
      startDate = new Date();
      startDate.setFullYear(startDate.getFullYear() - 1);
      endDate = new Date();
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
  previousStartDate.setDate(previousStartDate.getDate() - 1);
  previousEndDate.setDate(previousEndDate.getDate() - 1);

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
    numberOfReservationForPreviousPeriod !== 0
      ? ((numberOfReservationForPeriod - numberOfReservationForPreviousPeriod) /
          numberOfReservationForPreviousPeriod) *
        100
      : 0;

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

  const percentageChangeInTotalPrice =
    totalPriceForPreviousPeriodPrice !== 0
      ? ((totalPriceForPeriodPrice - totalPriceForPreviousPeriodPrice) /
          totalPriceForPreviousPeriodPrice) *
        100
      : 0;

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
