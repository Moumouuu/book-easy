import prismadb from "@/lib/prismadb";
import getCompany from "./getCompany";

export default async function getCompanyStats(
  companyId: string,
  period: string,
) {
  const company = await getCompany(companyId);
  if (!company) return new Response("Company not found", { status: 404 });

  let startDate, endDate;

  // Déterminer les dates de début et de fin en fonction de la période spécifiée
  switch (period) {
    case "day":
      startDate = new Date();
      startDate.setDate(startDate.getDate() - 1);
      endDate = new Date();
      break;
    case "week":
      startDate = new Date();
      startDate.setDate(startDate.getDate() - 7);
      endDate = new Date();
      break;
    case "month":
      startDate = new Date();
      startDate.setMonth(startDate.getMonth() - 1);
      endDate = new Date();
      break;
    case "year":
      startDate = new Date();
      startDate.setFullYear(startDate.getFullYear() - 1);
      endDate = new Date();
      break;
    default:
      return new Response("Invalid period", { status: 400 });
  }

  // Obtenez le nombre de réservations pour la période spécifiée
  const numberOfReservationForPeriod = await prismadb.book.count({
    where: {
      companyId,
      created_at: {
        lte: endDate,
        gte: startDate,
      },
    },
  });

  // Obtenez le nombre de réservations pour la période précédente
  const previousStartDate = new Date(startDate);
  const previousEndDate = new Date(endDate);
  previousStartDate.setDate(previousStartDate.getDate() - 1);
  previousEndDate.setDate(previousEndDate.getDate() - 1);

  const numberOfReservationForPreviousPeriod = await prismadb.book.count({
    where: {
      companyId,
      created_at: {
        lte: previousEndDate,
        gte: previousStartDate,
      },
    },
  });

  // Calculez le pourcentage d'évolution
  const percentageChange =
    ((numberOfReservationForPeriod - numberOfReservationForPreviousPeriod) /
      numberOfReservationForPreviousPeriod) *
    100;

  console.log(percentageChange);

  return {
    numberOfReservationForPeriod,
    numberOfReservationForPreviousPeriod,
    percentageChange,
  };
}
