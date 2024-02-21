import prismadb from "@/lib/prismadb";
import { Book } from "@prisma/client";

interface ReservationPart {
  name: string;
  amount: number;
  share: string;
  color: string;
}

interface Part {
  label: string;
  between: number[]; // Define an array of numbers to represent the range
  color: string;
}

export default async function getCompanyReservationsPercentage(
  companyId: string,
): Promise<ReservationPart[]> {
  const parts: Part[] = [
    {
      label: "Le client à fait 1 Réservation",
      between: [1, 1],
      color: "bg-red-500",
    },
    {
      label: "Le client à fait entre 2 et 5 Réservations",
      between: [2, 5],
      color: "bg-yellow-500",
    },
    {
      label: "Le client à fait 6 Réservations et plus",
      between: [6, Infinity], // 6 and above
      color: "bg-green-500",
    },
  ];
  const partReservations: ReservationPart[] = [];

  const books = await prismadb.book.findMany({
    where: {
      companyId,
    },
    select: {
      createdById: true,
    },
  });

  // Count the number of reservations made by each customer
  const reservationCountsByCustomer = books.reduce((acc: any, reservation) => {
    acc[reservation.createdById] = (acc[reservation.createdById] || 0) + 1;
    return acc;
  }, {});

  // Calculate the reservations count for each part and create ReservationPart objects
  for (const part of parts) {
    const [min, max] = part.between;
    let amount = 0;

    if (max === Infinity) {
      amount = Object.values(reservationCountsByCustomer).filter(
        (count: any) => count >= min,
      ).length;
    } else {
      amount = Object.values(reservationCountsByCustomer).filter(
        (count: any) => count >= min && count <= max,
      ).length;
    }

    const share =
      (
        (amount / Object.keys(reservationCountsByCustomer).length) *
        100
      ).toFixed(1) + "%";
    const color = part.color;

    partReservations.push({
      name: part.label,
      amount,
      share,
      color,
    });
  }

  return partReservations;
}
