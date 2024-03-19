import prismadb from "@/lib/prismadb";
import { NextRequest, NextResponse } from "next/server";

export async function POST(request: NextRequest) {
  const { reservationId, customerId } = await request.json();


  if (!reservationId || !customerId) {
    return new NextResponse("La réservation ou le client est manquant");
  }

  const reservation = await prismadb.book.update({
    where: {
      id: reservationId,
    },
    data: {
      createdById: customerId,
    },
  });

  if (!reservation) return new NextResponse("Une erreur est survenue");

  return new NextResponse(JSON.stringify(reservation), { status: 201 });
}
