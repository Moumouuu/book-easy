import getCompany from "@/actions/company/getCompany";
import getUser from "@/actions/user/getUser";
import DeleteBookMail from "@/components/email-templates/deleteBookMail";
import prismadb from "@/lib/prismadb";
import { NextRequest } from "next/server";
import { Resend } from "resend";

const resend = new Resend(process.env.RESEND_API_KEY);

interface IPost {
  params: {
    companyId: string;
  };
}

export async function POST(request: NextRequest, { params }: IPost) {
  const { companyId } = params;
  const bookIds = await request.json();

  // Fetch company and current user
  const [company, currentUser] = await Promise.all([
    getCompany(companyId),
    getUser(),
  ]);

  if (!currentUser || !company) {
    return new Response("User or company not found", { status: 404 });
  }

  // Get books
  const books = await prismadb.book.findMany({
    where: {
      companyId: companyId,
      id: {
        in: bookIds.data,
      },
    },
    select: {
      id: true,
      start_at: true,
      end_at: true,
      created_by: {
        select: {
          email: true,
          firstName: true,
          lastName: true,
        },
      },
      company: {
        select: {
          name: true,
        },
      },
    },
  });

  if (books.length === 0) {
    return new Response("No books found", { status: 404 });
  }

  // Send email and delete books
  for (const book of books) {
    const reservationLink = `${process.env.NEXT_PUBLIC_BOOKEASY_URL}/user/books`;

    let username, email;
    if (book.created_by?.firstName && book.created_by?.lastName) {
      username = `${book.created_by.firstName} ${book.created_by.lastName}`;
      email = book.created_by.email;
    }

    if (email) {
      await resend.emails.send({
        from: "Acme <onboarding@bookeazy.fr>",
        to: [email, "robinpluviaux@gmail.com"],
        subject: "Votre réservation a été supprimée !",
        react: DeleteBookMail({
          companyName: book.company.name,
          reservationLink,
          username,
          start_at: book.start_at.toString(),
          end_at: book.end_at?.toString(),
        }) as React.ReactElement,
      });
    }
  }

  // Delete books
  await prismadb.book.deleteMany({
    where: {
      id: {
        in: bookIds.data,
      },
    },
  });

  return Response.json({ message: "Books deleted" });
}
