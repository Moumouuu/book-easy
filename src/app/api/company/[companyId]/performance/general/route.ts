import getCompany from "@/actions/company/getCompany";
import { MaximumFreeFeaturesEnum } from "@/enum/maximumFreeFeatures";
import prismadb from "@/lib/prismadb";
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

  const company = await getCompany(companyId);

  if (!company) return new Response("Company not found", { status: 404 });

  try {
    const [numberOfEmployees, numberOfCustomers, numberOfOrders] =
      await Promise.all([
        getNumberOfEmployees(companyId),
        getNumberOfCustomers(companyId),
        getNumberOfOrders(companyId),
      ]);

    const responsePayload = [
      {
        label: "Nombre de réservations",
        value: numberOfOrders,
        key: MaximumFreeFeaturesEnum.numberOfOrders,
      },
      {
        label: "Nombre de clients",
        value: numberOfCustomers,
        key: MaximumFreeFeaturesEnum.numberOfCustomers,
      },
      {
        label: "Nombre d'employés",
        value: numberOfEmployees,
        key: MaximumFreeFeaturesEnum.numberOfEmployees,
      },
    ];

    return new Response(JSON.stringify(responsePayload), { status: 200 });
  } catch (error) {
    console.error("Error retrieving company metrics:", error);
    return new Response("Internal server error", { status: 500 });
  }
}

async function getNumberOfEmployees(companyId: string): Promise<number> {
  const companyData = await prismadb.company.findUnique({
    where: { id: companyId },
    select: { userRoles: true },
  });

  return companyData?.userRoles.length || 0;
}

async function getNumberOfCustomers(companyId: string): Promise<number> {
  const nbCustomers = await prismadb.user.count({
    where: { books: { some: { companyId } } },
  });

  return nbCustomers;
}

async function getNumberOfOrders(companyId: string): Promise<number> {
  const nbOrders = await prismadb.book.count({
    where: { companyId },
  });

  return nbOrders;
}
