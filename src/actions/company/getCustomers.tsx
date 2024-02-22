import prismadb from "@/lib/prismadb";

export async function getCustomers(companyId: string) {
  // find users who have one book in company
  const customers = await prismadb.user.findMany({
    where: {
      books: {
        some: {
          companyId: companyId,
        },
      },
    },
    select: {
      id: true,
      email: true,
      firstName: true,
      lastName: true,
      phone_number: true,
    },
    orderBy: {
      createdAt: "desc",
    },
  });

  return customers;
}
