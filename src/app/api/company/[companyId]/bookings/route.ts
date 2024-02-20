import { getBookings } from "@/actions/company/getBookings";
import getCompany from "@/actions/company/getCompany";
import getUser from "@/actions/user/getUser";
import { RoleEnum } from "@/enum/roles";
import prismadb from "@/lib/prismadb";

interface IGet {
  params: {
    companyId: string;
  };
}

export async function GET(request: Request, { params }: IGet) {
  const { companyId } = params;

  if (!companyId) return new Response("companyId is required", { status: 400 });

  const company = await getCompany(companyId);
  if (!company) return new Response("Company not found", { status: 404 });

  const user = getUser();
  if (!user) return new Response("User not found", { status: 404 });

  const customersInCompany = await getBookings(companyId);

  return new Response(JSON.stringify(customersInCompany), {
    status: 200,
  });
}

export async function DELETE(request: Request, { params }: IGet) {
  const { companyId } = params;
  const bookIds = await request.json();

  // get & verif user have access to it
  const company = await getCompany(companyId);

  const currentUser = await getUser();

  if (!currentUser) return new Response("User not found", { status: 404 });

  // check if user is admin of the company
  const isUserAdmin = company.userRoles.find(
    (user: { role: string; user: { id: string } }) => {
      return user.role === RoleEnum.ADMIN && user.user.id === currentUser.id;
    },
  );

  if (!isUserAdmin) return new Response("Unauthorized", { status: 401 });

  const deletedBookings = await prismadb.book.deleteMany({
    where: {
      companyId: companyId,
      id: {
        in: bookIds,
      },
    },
  });

  return new Response(JSON.stringify(deletedBookings), { status: 200 });
}

export async function PUT(request: Request, { params }: IGet) {
  const { companyId } = params;
  const { data } = await request.json();
  const { newBook } = data;

  if (!newBook)
    return new Response("selectedRole and teamateId are required", {
      status: 400,
    });

  // get & verif user have access to it
  const company = await getCompany(companyId);

  const currentUser = await getUser();
  if (!currentUser) return new Response("User not found", { status: 404 });

  // check if user is admin of the company
  const isUserAdmin = company.userRoles.find(
    (user: { role: string; user: { id: string } }) => {
      return user.role === RoleEnum.ADMIN && user.user.id === currentUser.id;
    },
  );

  if (!isUserAdmin) return new Response("Unauthorized", { status: 401 });

  if (newBook.hasOwnProperty("created_by")) {
    delete newBook.created_by;
  }

  // change role of the teamate in the company
  const updatedBooks = await prismadb.book.update({
    where: {
      id: newBook.id,
    },
    data: {
      ...newBook,
    },
  });

  return new Response(JSON.stringify(updatedBooks), { status: 200 });
}
