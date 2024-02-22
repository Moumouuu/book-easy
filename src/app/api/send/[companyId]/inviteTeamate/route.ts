import getCompany from "@/actions/company/getCompany";
import getUser from "@/actions/user/getUser";
import InviteTeamateMail from "@/components/email-templates/inviteTeamateMail";
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
  const { email } = await request.json();
  const { companyId } = params;

  // Get company and current user
  const [company, currentUser] = await Promise.all([
    getCompany(companyId),
    getUser(),
  ]);

  // Check if current user exists
  if (!currentUser || !company || !email) {
    return new Response("User or company or email not found", { status: 404 });
  }

  // Check if email is valid
  const emailSchema = z.string().email();
  const isValidEmail = emailSchema.safeParse(email);
  if (!isValidEmail.success)
    return new Response("Invalid email", { status: 400 });

  // create secure token
  const secureToken = await prismadb.secureToken.create({
    data: {
      type: $Enums.SecureTokenType.INVITATION,
    },
  });

  // Send email
  const data = await resend.emails.send({
    from: "Acme <onboarding@resend.dev>",
    // todo replace with real email address
    //to: [email],
    to: ["delivered@resend.dev"],
    subject: "Validation de votre compte",
    react: InviteTeamateMail({
      receiverEmail: email,
      currentName: `${currentUser.firstName} ${currentUser.lastName}`,
      companyName: company.name,
      companyId: company.id,
      senderEmail: currentUser.email,
      secureToken: secureToken.id,
    }) as React.ReactElement,
  });

  return Response.json(data);
}
