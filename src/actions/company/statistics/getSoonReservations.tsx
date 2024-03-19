import prismadb from "@/lib/prismadb";

interface SoonReservations {
  email: string | null;
  start_at: Date;
  end_at: Date | null;
  price: number;
}

export default async function getSoonReservations(
  companyId: string
): Promise<SoonReservations[]> {
  // find the 3 soonest reservations for the company
  const soonReservation = await prismadb.book.findMany({
    where: {
      companyId: companyId,
      start_at: {
        gte: new Date(),
      },
    },
    select: {
      start_at: true,
      end_at: true,
      price: true,
      created_by: {
        select: {
          email: true,
        },
      },
    },
    take: 3,
    orderBy: {
      start_at: "asc",
    },
  });

  // format the data
  return soonReservation.map((reservation) => ({
    email: reservation.created_by?.email ?? null,
    start_at: reservation.start_at,
    end_at: reservation.end_at,
    price: reservation.price,
  }));
}
