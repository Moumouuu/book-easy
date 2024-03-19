import prismadb from "@/lib/prismadb";

export async function getBookings(companyId: string) {
  const bookings = await prismadb.book.findMany({
    where: {
      companyId,
    },
    select: {
      id: true,
      price: true,
      start_at: true,
      end_at: true,
      created_by: {
        select: {
          firstName: true,
          lastName: true,
          email: true,
        },
      },
    },
  });

  return bookings;
}
