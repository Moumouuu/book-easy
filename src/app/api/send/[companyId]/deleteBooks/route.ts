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
      id: {
        in: bookIds,
      },
    },
    select: {
      id: true,
      start_at: true,
      end_at: true,
      created_by: {
        select: {
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

  const deletedBooks = [];

  // Send email and delete books
  for (const book of books) {
    const reservationLink = `${process.env.BOOKEASY_URL}/book/${book.id}`;
    const username = `${book.created_by.firstName} ${book.created_by.lastName}`;

    const deletedBook = await resend.emails.send({
      from: "Acme <onboarding@resend.dev>",
      to: ["delivered@resend.dev"],
      subject: "Votre réservation a été supprimée !",
      react: DeleteBookMail({
        companyName: book.company.name,
        reservationLink,
        username,
        start_at: book.start_at.toString(),
        end_at: book.end_at?.toString() ?? null,
      }) as React.ReactElement,
    });

    deletedBooks.push(deletedBook);
  }

  await prismadb.book.deleteMany({
    where: {
      id: {
        in: bookIds,
      },
    },
  });

  return Response.json(deletedBooks);
}
