import prismadb from "@/lib/prismadb";

export async function getTeamUsers(companyId: string) {
  // find users in the company / team
  const customers = await prismadb.company.findUnique({
    where: {
      id: companyId,
    },
    select: {
      userRoles: {
        select: {
          user: {
            select: {
              id: true,
              email: true,
              firstName: true,
              lastName: true,
              phone_number: true,
              createdAt: true,
              companies: {
                select: {
                  role: true,
                },
              },
            },
          },
        },
      },
    },
  });

  return customers?.userRoles;
}
