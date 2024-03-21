import prismadb from "@/lib/prismadb";

export async function createBooking(companyId: string, body: any) {
  const { start_at, end_at, price, customerId, customerEmail } = body;
  const bookings = await prismadb.book.create({
    data: {
      companyId: companyId,
      createdById: customerId || null, // if the customer is not logged in, the reservation will be created without a customer
      created_by_email_temp: customerEmail, // if the customer is not logged in, the reservation will be created without a customer
      start_at: new Date(start_at),
      end_at: new Date(end_at),
      price: parseInt(price),
    },
  });

  return bookings;
}
