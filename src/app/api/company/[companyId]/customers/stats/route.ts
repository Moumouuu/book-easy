import prismadb from "@/lib/prismadb";
import { formatDate } from "@/utils";
import { NextResponse } from "next/server";

interface IGet {
  params: {
    companyId: string;
  };
}
export async function GET(req: Request, { params }: IGet) {
  const { companyId } = params;
  const { searchParams } = new URL(req.url);
  const customerId = searchParams.get("customerId");

  if (!customerId || !companyId) {
    return new NextResponse("Missing parameters");
  }

  // Get the biggest reservation (price wise)
  const reservations = await prismadb.book.findMany({
    where: {
      createdById: String(customerId),
      companyId: companyId,
    },
    select: {
      price: true,
      created_at: true,
    },
  });

  const biggestReservation = reservations.reduce((prev, current) => {
    return prev.price > current.price ? prev : current;
  });

  const numberOfReservations = reservations.length;

  let total = 0;
  reservations.forEach((reservation: { price: number }) => {
    total += reservation.price;
  });

  const averagePrice = total / numberOfReservations;

  // find the oldest reservation
  const newCustomerAt = reservations.reduce((oldest: any, current: any) => {
    if (!oldest || current.createdAt < oldest.createdAt) {
      return current;
    } else {
      return oldest;
    }
  }, null);

  const newestReservation = reservations.reduce((newest: any, current: any) => {
    if (!newest || current.createdAt > newest.createdAt) {
      return current;
    } else {
      return newest;
    }
  });

  newCustomerAt.created_at = formatDate(newCustomerAt.created_at);

  const data = [
    {
      label: "Nombre de réservations",
      value: numberOfReservations,
    },
    {
      label: "Prix moyen",
      value: averagePrice.toFixed(2),
      suffix: "€",
    },
    {
      label: "Réservation la plus chère",
      value: biggestReservation.price,
      suffix: "€",
    },
    {
      label: "Date de la dernière réservation",
      value: newestReservation.created_at,
    },
    {
      label: "Montant de la dernière réservation",
      value: newestReservation.price,
      suffix: "€",
    },
    {
      // should stay at the end of the array
      label: "Date de la première réservation",
      value: newCustomerAt.created_at,
    },
  ];

  return new NextResponse(JSON.stringify(data));
}
