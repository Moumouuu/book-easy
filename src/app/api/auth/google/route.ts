import { authOptions } from "@/lib/auth";
import prismadb from "@/lib/prismadb";
import { getServerSession } from "next-auth";
import { NextRequest, NextResponse } from "next/server";

// this route is used to create a new user when it come from the google auth
export async function POST(req: NextRequest) {
  const session = await getServerSession(authOptions);
  const email = session?.user?.email;
  const image = session?.user?.image;

  if (!email) {
    return new NextResponse("Missing id", { status: 400 });
  }

  const { firstname, lastname, phoneNumber } = await req.json();

  const user = await prismadb.user.create({
    data: {
      email: email,
      firstName: firstname,
      lastName: lastname,
      phone_number: phoneNumber,
      image: image,
    },
  });

  if (!user) {
    return new NextResponse("Error updating user", { status: 500 });
  }

  return new NextResponse("User updated", {
    status: 200,
  });
}
