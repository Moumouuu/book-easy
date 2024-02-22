import getCompany from "@/actions/company/getCompany";
import { getCustomers } from "@/actions/company/getCustomers";
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

  const customersInCompany = await getCustomers(companyId);

  return new Response(JSON.stringify(customersInCompany), {
    status: 200,
  });
}

export async function DELETE(request: Request, { params }: IGet) {
  const { companyId } = params;
  const customersIds: string[] = await request.json();

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

  // delete customers from the company (not the customer itself)
  // remove all book of the customers in the company
  const customersDeleted = await prismadb.book.deleteMany({
    where: {
      createdById: {
        in: customersIds,
      },
      AND: {
        companyId: companyId,
      },
    },
  });

  return new Response(JSON.stringify(customersDeleted), { status: 200 });
}
