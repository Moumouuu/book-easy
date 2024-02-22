import getCompany from "@/actions/company/getCompany";
import { getCustomers } from "@/actions/company/getCustomers";
import { getTeamUsers } from "@/actions/company/getTeamUsers";
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
  console.log(companyId);

  if (!companyId) return new Response("companyId is required", { status: 400 });

  const company = await getCompany(companyId);
  if (!company) return new Response("Company not found", { status: 404 });

  const user = getUser();
  if (!user) return new Response("User not found", { status: 404 });

  const customersInCompany = await getTeamUsers(companyId);

  return new Response(JSON.stringify(customersInCompany), {
    status: 200,
  });
}

export async function PUT(request: Request, { params }: IGet) {
  const { companyId } = params;
  const { data } = await request.json();
  const { selectedRole, teamateId } = data;

  if (!selectedRole || !teamateId)
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

  // change role of the teamate in the company
  const userCompanyRole = await prismadb.userCompanyRole.update({
    where: {
      userId_companyId: {
        companyId: company.id,
        userId: teamateId,
      },
    },
    data: {
      role: selectedRole,
    },
  });

  return new Response(JSON.stringify(userCompanyRole), { status: 200 });
}

export async function DELETE(request: Request, { params }: IGet) {
  const { companyId } = params;
  const teamateIds: string[] = await request.json();

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

  // delete teamate from the company (not the customer itself)
  const deletedTeamates = await prismadb.userCompanyRole.deleteMany({
    where: {
      companyId: company.id,
      userId: {
        in: teamateIds,
      },
    },
  });

  return new Response(JSON.stringify(deletedTeamates), { status: 200 });
}
