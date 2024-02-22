import prismadb from "@/lib/prismadb";
import getCompany from "../getCompany";

export default async function getCompanySalesStats(companyId: string) {
  const company = await getCompany(companyId);
  if (!company) {
    throw new Error("Company not found");
  }

  const allMonthPeriods = [];
  const dataPromises = [];

  // fill allMonthPeriods with the last 12 months
  for (let i = 0; i < 12; i++) {
    const date = new Date();
    date.setMonth(date.getMonth() - i);
    const startDate = new Date(date.getFullYear(), date.getMonth(), 1); // Start of the month
    const endDate = new Date(date.getFullYear(), date.getMonth() + 1, 0); // End of the month
    const month = date.toLocaleString("default", { month: "short" });
    const year = date.getFullYear();
    allMonthPeriods.push(`${month} ${year}`);

    // Push the promise to fetch data for this month
    const dataPromise = fetchDataForMonth(companyId, startDate, endDate);
    dataPromises.push(dataPromise);
  }

  // Wait for all promises to resolve
  const dataForAllMonthPeriods = await Promise.all(dataPromises);

  // Combine data for all months
  const result = allMonthPeriods.map((period, index) => {
    return {
      date: period,
      "This Month": dataForAllMonthPeriods[index].thisYear,
      "Last Month": dataForAllMonthPeriods[index].lastYear,
    };
  });

  return result.reverse();
}

async function fetchDataForMonth(
  companyId: string,
  startDate: Date,
  endDate: Date,
) {
  const totalPriceForPeriodPromise = prismadb.book.aggregate({
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

  const endDateLastYear = new Date(endDate);
  endDateLastYear.setFullYear(endDate.getFullYear() - 1);

  const startDateLastYear = new Date(startDate);
  startDateLastYear.setFullYear(startDate.getFullYear() - 1);

  const totalPriceForLastPeriodPromise = prismadb.book.aggregate({
    where: {
      companyId,
      start_at: {
        lte: endDateLastYear,
        gte: startDateLastYear,
      },
    },
    _sum: {
      price: true,
    },
  });

  const [totalPriceForPeriod, totalPriceForLastPeriod] = await Promise.all([
    totalPriceForPeriodPromise,
    totalPriceForLastPeriodPromise,
  ]);

  return {
    thisYear: totalPriceForPeriod._sum.price ?? 0,
    lastYear: totalPriceForLastPeriod._sum.price ?? 0,
  };
}
