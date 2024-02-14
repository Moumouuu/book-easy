import prismadb from "@/lib/prismadb";
import getCompany from "../getCompany";

interface DailyMetrics {
  date: string;
  revenue: number;
  reservationCount: number;
}

export default async function getCompanyAreaStats(
  companyId: string,
): Promise<DailyMetrics[]> {
  const company = await getCompany(companyId);
  if (!company) {
    throw new Error("Company not found");
  }

  // Calculate last week metrics
  const lastWeekMetrics = await getLastWeekMetrics(companyId);

  return lastWeekMetrics;
}

async function getLastWeekMetrics(companyId: string): Promise<DailyMetrics[]> {
  const lastWeekStartDate = new Date();
  lastWeekStartDate.setDate(lastWeekStartDate.getDate() - 7);
  const lastWeekEndDate = new Date();

  const reservationsForLastWeek = await prismadb.book.findMany({
    where: {
      companyId,
      start_at: {
        lte: lastWeekEndDate,
        gte: lastWeekStartDate,
      },
    },
    orderBy: {
      start_at: "asc",
    },
  });

  // Initialize an object to store daily metrics
  const dailyMetrics: Record<string, DailyMetrics> = {};

  // Calculate daily revenue and reservation counts
  reservationsForLastWeek.forEach((reservation) => {
    const reservationDate = reservation.start_at.toISOString().split("T")[0];
    if (!dailyMetrics[reservationDate]) {
      dailyMetrics[reservationDate] = {
        date: reservationDate,
        revenue: 0,
        reservationCount: 0,
      };
    }
    dailyMetrics[reservationDate].revenue += reservation.price;
    dailyMetrics[reservationDate].reservationCount++;
  });

  // Convert the object of daily metrics to an array of objects
  const lastWeekMetrics: DailyMetrics[] = Object.values(dailyMetrics);

  return lastWeekMetrics;
}
