import getUser from "@/actions/user/getUser";
import { checkSubscription } from "@/actions/user/premium";
import prismadb from "@/lib/prismadb";

export async function POST(request: Request) {
  const currentUser = await getUser();
  const { name, description } = await request.json();
  const isSubscribe = await checkSubscription();


  if (!currentUser)
    return new Response("You must be logged in to access this resource!", {
      status: 401,
    });

  if (!name)
    return new Response("The company name is invalid!", { status: 400 });

  if (!isSubscribe && currentUser._count.companies >= 1) {
    return new Response(
      "You must have a premium subscription to create more than one company!",
      { status: 403 }
    );
  }

  // create a new company with the current user as an admin
  const company = await prismadb.company.create({
    data: {
      name,
      description,
      userRoles: {
        create: {
          userId: currentUser.id,
          role: "ADMIN",
        },
      },
    },
  });

  if (!company)
    return new Response("Failed to create the company!", { status: 500 });

  return new Response(JSON.stringify(company), { status: 201 });
}


export async function GET (request: Request) {
  const currentUser = await getUser();

  if (!currentUser)
    return new Response("You must be logged in to access this resource!", {
      status: 401,
    });

  const companies = await prismadb.company.findMany({
    where: {
      userRoles: {
        some: {
          userId: currentUser.id,
        },
      },
    },
  });

  return new Response(JSON.stringify(companies), { status: 200 });
}