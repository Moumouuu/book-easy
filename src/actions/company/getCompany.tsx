import prismadb from "@/lib/prismadb";
import getUser from "../user/getUser";

export default async function getCompany(companyId: string) {
  const currentUser = await getUser();

  if (!currentUser) throw new Response("User not found", { status: 401 });

  // get the company with the given ID & verify that the current user has access to it
  const company = await prismadb.company.findUniqueOrThrow({
    where: {
      id: String(companyId),
      AND: {
        userRoles: {
          some: {
            userId: currentUser.id,
          },
        },
      },
    },
  });

  return company ?? null;
}
