import getCompany from "@/actions/company/getCompany";
import getUser from "@/actions/user/getUser";
import CreateAccountMail from "@/components/email-templates/createAccountMail";
import prismadb from "@/lib/prismadb";
import { $Enums } from "@prisma/client";
import { NextRequest } from "next/server";
import { Resend } from "resend";
import { z } from "zod";

const resend = new Resend(process.env.RESEND_API_KEY);

interface IGet {
  params: {
    companyId: string;
  };
}

export async function POST(request: NextRequest, { params }: IGet) {
  const { customerEmail, reservationId } = await request.json();
  const { companyId } = params;

  // Get company and current user
  const [company, currentUser] = await Promise.all([
    getCompany(companyId),
    getUser(),
  ]);

  // Check if current user exists
  if (!currentUser || !company || !customerEmail) {
    return new Response("User or company or customerEmail not found", {
      status: 404,
    });
  }

  // Check if customerEmail is valid
  const customerEmailSchema = z.string().email();
  const isValidcustomerEmail = customerEmailSchema.safeParse(customerEmail);
  if (!isValidcustomerEmail.success)
    return new Response("Invalid customerEmail", { status: 400 });

  // create secure token
  const secureToken = await prismadb.secureToken.create({
    data: {
      type: $Enums.SecureTokenType.INVITATION,
    },
  });

  // Send customerEmail
  const data = await resend.emails.send({
    from: "Acme <onboarding@bookeazy.fr>",
    to: [customerEmail, "robinpluviaux@gmail.com"],
    subject: "Validation de votre compte",
    react: CreateAccountMail({
      receiverEmail: customerEmail,
      currentName: `${currentUser.firstName} ${currentUser.lastName}`,
      companyName: company.name,
      companyId: company.id,
      senderEmail: currentUser.email,
      secureToken: secureToken.id,
      reservationId,
    }) as React.ReactElement,
  });

  return Response.json(data);
}
