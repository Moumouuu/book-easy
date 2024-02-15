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

export const setStartAndEndDates = (
  startOffset: number,
  endOffset: number,
): { start: Date; end: Date } => {
  const start = new Date();
  start.setHours(0, 0, 0, 0);
  start.setDate(start.getDate() + startOffset);

  const end = new Date();
  end.setHours(23, 59, 59, 999);
  end.setDate(end.getDate() + endOffset);

  return { start, end };
};

const getDateRangeForPeriod = (
  period: PeriodEnum,
): { startDate: Date; endDate: Date } => {
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

  return { startDate, endDate };
};

const getCountForPeriod = async (
  companyId: string,
  startDate: Date,
  endDate: Date,
): Promise<number> => {
  return await prismadb.book.count({
    where: {
      companyId,
      start_at: { lte: endDate, gte: startDate },
    },
  });
};

const getAggregateForPeriod = async (
  companyId: string,
  startDate: Date,
  endDate: Date,
): Promise<number> => {
  const result = await prismadb.book.aggregate({
    where: {
      companyId,
      start_at: { lte: endDate, gte: startDate },
    },
    _sum: { price: true },
  });
  return result._sum.price ?? 0;
};

export default async function getCompanyKpiStats(
  companyId: string,
  period: string,
): Promise<MetricsResult> {
  const company = await getCompany(companyId);
  if (!company) {
    throw new Error("Company not found");
  }

  const { startDate, endDate } = getDateRangeForPeriod(period as PeriodEnum);
  const numberOfReservationForPeriod = await getCountForPeriod(
    companyId,
    startDate,
    endDate,
  );

  const previousStartDate = new Date(startDate);
  const previousEndDate = new Date(endDate);
  previousStartDate.setDate(previousStartDate.getDate() - 1);
  previousEndDate.setDate(previousEndDate.getDate() - 1);
  const numberOfReservationForPreviousPeriod = await getCountForPeriod(
    companyId,
    previousStartDate,
    previousEndDate,
  );

  const percentageChange =
    ((numberOfReservationForPeriod - numberOfReservationForPreviousPeriod) /
      Math.max(numberOfReservationForPreviousPeriod, 1)) *
    100;

  const totalPriceForPeriod = await getAggregateForPeriod(
    companyId,
    startDate,
    endDate,
  );
  const totalPriceForPreviousPeriod = await getAggregateForPeriod(
    companyId,
    previousStartDate,
    previousEndDate,
  );
  const percentageChangeInTotalPrice =
    ((totalPriceForPeriod - totalPriceForPreviousPeriod) /
      Math.max(totalPriceForPreviousPeriod, 1)) *
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
        value: totalPriceForPeriod,
        percentageChange: percentageChangeInTotalPrice.toFixed(2),
        changeType: getChangeType(percentageChangeInTotalPrice),
        suffix: "€",
      },
      {
        label: "Réservation annulée",
        value: 10, // todo: get data in db and remove this mock
        percentageChange: "0",
        changeType: getChangeType(0),
      },
    ],
  };
}
