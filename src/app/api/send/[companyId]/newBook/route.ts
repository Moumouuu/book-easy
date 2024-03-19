import getCompany from "@/actions/company/getCompany";
import getUser from "@/actions/user/getUser";
import NewBookMail from "@/components/email-templates/newBookMail";
import prismadb from "@/lib/prismadb";
import { NextRequest } from "next/server";
import { Resend } from "resend";

const resend = new Resend(process.env.RESEND_API_KEY);

interface IGet {
  params: {
    companyId: string;
  };
}

export async function POST(request: NextRequest, { params }: IGet) {
  const { id, price, start_at, end_at, customerEmail } = await request.json();
  const { companyId } = params;

  // Get company and current user
  const [company, currentUser] = await Promise.all([
    getCompany(companyId),
    getUser(),
  ]);

  // Check if current user exists
  if (!currentUser || !company) {
    return new Response("User or company not found", { status: 404 });
  }

  // Fetch the book details
  const book = await prismadb.book.findUniqueOrThrow({
    where: { id },
    select: {
      price: true,
      start_at: true,
      end_at: true,
      company: {
        select: {
          name: true,
        },
      },
      created_by: {
        select: {
          email: true,
          firstName: true,
          lastName: true,
        },
      },
    },
  });

  let firstName, lastName, email, username;

  if (book.created_by) {
    firstName = book.created_by.firstName;
    lastName = book.created_by.lastName;
    email = book.created_by.email;
    username = `${firstName} ${lastName}`;
  }

  const companyName = book.company.name;
  const reservationLink = `${process.env.NEXT_PUBLIC_BOOKEASY_URL}/book/${id}`;

  // Send email
  const data = await resend.emails.send({
    from: "Acme <onboarding@bookeazy.fr>",
    to: [email ?? customerEmail, "robinpluviaux@gmail.com"],
    subject: "Votre confimation de réservation",
    react: NewBookMail({
      companyName,
      reservationLink,
      username,
      price,
      start_at,
      end_at,
    }) as React.ReactElement,
  });

  return Response.json(data);
}
