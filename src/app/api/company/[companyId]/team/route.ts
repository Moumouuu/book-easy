import getCompany from "@/actions/company/getCompany";
import { getCustomers } from "@/actions/company/getCustomers";
import { getTeamUsers } from "@/actions/company/getTeamUsers";
import getUser from "@/actions/user/getUser";

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
