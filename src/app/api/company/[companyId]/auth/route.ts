import getCompany from "@/actions/company/getCompany";
import { authOptions } from "@/lib/auth";
import prismadb from "@/lib/prismadb";
import { getServerSession } from "next-auth";
import { NextRequest, NextResponse } from "next/server";

interface IGet {
  params: {
    companyId: string;
  };
}

// this route is used to get the user data from the client side
export async function GET(req: NextRequest, { params }: IGet) {
  const session = await getServerSession(authOptions);
  const email = session?.user?.email;
  const companyId = params.companyId;

  if (!email) {
    return new NextResponse("Missing id", { status: 400 });
  }

  const company = await getCompany(companyId);
  if (!company) return new NextResponse("Company not found", { status: 404 });

  const user = await prismadb.user.findUnique({
    where: {
      email: String(email),
    },
    select: {
      id: true,
      email: true,
      firstName: true,
      lastName: true,
      phone_number: true,
      companies: {
        where: {
          companyId: companyId,
        },
        select: {
          role: true,
        },
      },
    },
  });

  if (!user) {
    return new NextResponse("User not found", { status: 404 });
  }

  return new NextResponse(JSON.stringify(user));
}
