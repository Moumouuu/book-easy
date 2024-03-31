import getCompany from "@/actions/company/getCompany";
import getUser from "@/actions/user/getUser";
import { UpdateBookMail } from "@/components/email-templates/updateBookMail";
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
  const { data: bookData } = await request.json();
  const { id, price, start_at, end_at } = bookData;
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

  let firstName, lastName, email;
  if (book.created_by) {
    firstName = book.created_by.firstName;
    lastName = book.created_by.lastName;
    email = book.created_by.email;
  }
  const username = `${firstName} ${lastName}`;
  const companyName = book.company.name;
  const reservationLink = `${process.env.NEXT_PUBLIC_BOOKEASY_URL}/user/books`;

  // in case it's a book come from a user that is not register to the app
  if (email) {
    // Send email
    await resend.emails.send({
      from: "Acme <onboarding@bookeazy.fr>",
      to: [email, "robinpluviaux@gmail.com"],
      subject: "Votre réservation a été modifiée !",
      react: UpdateBookMail({
        companyName,
        reservationLink,
        username,
        price,
        start_at,
        end_at,
      }) as React.ReactElement,
    });
  }

  return Response.json({ message: "Book updated" });
}
