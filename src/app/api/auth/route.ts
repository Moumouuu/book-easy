import bcrypt from "bcrypt";
import { NextRequest, NextResponse } from "next/server";

import prismadb from "@/lib/prismadb";
import { $Enums } from "@prisma/client";

interface RequestData {
  email: string;
  password: string;
  firstname: string;
  lastname: string;
  phoneNumber: string;
  fromInvite: {
    email: string;
    senderEmail: string;
    token: string;
    company: string;
  };
}

export async function POST(req: NextRequest) {
  const {
    email,
    password,
    firstname,
    lastname,
    phoneNumber,
    fromInvite,
  }: RequestData = await req.json();

  if (!email || !password) {
    return new NextResponse("Missing email or password", { status: 400 });
  }

  // check if user already exist
  const userAlreadyExist = await prismadb.user.findUnique({
    where: {
      email: email,
    },
  });

  if (userAlreadyExist) {
    return NextResponse.json({
      error: "User already exist",
    });
  }

  if (fromInvite.email) {
    // secureToken isActive & type is INVITATION & created_at is not expired
    await prismadb.secureToken.findUniqueOrThrow({
      where: {
        id: fromInvite.token,
        AND: {
          created_at: {
            // 20 minutes
            gte: new Date(Date.now() - 20 * 60 * 1000),
          },
          isActive: true,
          type: $Enums.SecureTokenType.INVITATION,
        },
      },
    });

    // update secureToken isActive to true
    await prismadb.secureToken.update({
      where: {
        id: fromInvite.token,
      },
      data: {
        isActive: false,
      },
    });

    // check if user who receive the invite is not already in the company
    const userAlreadyInCompany = await prismadb.userCompanyRole.findFirst({
      where: {
        user: {
          email: fromInvite.email,
        },
      },
    });

    if (userAlreadyInCompany)
      return new NextResponse("User already in company", { status: 400 });

    // check if sender user is in company and is admin
    await prismadb.company.findFirstOrThrow({
      where: {
        id: fromInvite.company,
        userRoles: {
          some: {
            user: {
              email: fromInvite.senderEmail,
            },
            AND: {
              role: $Enums.Role.ADMIN,
            },
          },
        },
      },
    });
    // check if company exist
    await prismadb.company.findFirstOrThrow({
      where: {
        id: fromInvite.company,
      },
    });
  }

  // create user
  const newUser = await prismadb.user.create({
    data: {
      email: email,
      password: bcrypt.hashSync(password, 10),
      firstName: firstname,
      lastName: lastname,
      phone_number: phoneNumber,
    },
  });

  // create userRole if fromInvite and add user to company
  if (fromInvite.email && newUser) {
    const userRole = await prismadb.userCompanyRole.create({
      data: {
        role: "USER",
        company: {
          connect: {
            id: fromInvite.company,
          },
        },
        user: {
          connect: {
            id: newUser.id,
          },
        },
      },
    });
    if (!userRole) {
      return new NextResponse("Error creating user role", { status: 500 });
    }
  }

  if (!newUser) {
    return new NextResponse("Error creating user", { status: 500 });
  }

  return new NextResponse("User created", {
    status: 200,
  });
}
