import getCompany from "@/actions/company/getCompany";
import getCompanyReservationsPercentage from "@/actions/company/statistics/getCompanyReservationsPercentage";
import getUser from "@/actions/user/getUser";
import { NextRequest } from "next/server";

interface IGet {
  params: {
    companyId: string;
  };
}

export async function GET(request: NextRequest, { params }: IGet) {
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
  const company = await getCompany(companyId);
  if (!company)
    return new Response("The company does not exist!", { status: 400 });

  const data = await getCompanyReservationsPercentage(companyId);
  if (!data)
    return new Response("The company percentage does not exist!", {
      status: 400,
    });

  return new Response(JSON.stringify(data), { status: 200 });
}
