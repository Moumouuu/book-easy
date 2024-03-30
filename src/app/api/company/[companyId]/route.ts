import getUser from "@/actions/user/getUser";
import prismadb from "@/lib/prismadb";

interface IGet {
  params: {
    companyId: string;
  };
}

export async function GET(request: Request, { params }: IGet) {
  const companyId = params.companyId;

  if (!companyId)
    return new Response("The company ID is invalid!", { status: 400 });

  // get the current user from the session
  const currentUser = await getUser();

  if (!currentUser)
    return new Response("You must be logged in to access this resource!", {
      status: 401,
    });

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

  return new Response(JSON.stringify(company), { status: 200 });
}

