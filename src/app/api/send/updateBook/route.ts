import { UpdateBookMail } from "@/components/email-templates/updateBookMail";
import prismadb from "@/lib/prismadb";
import { NextRequest } from "next/server";
import { Resend } from "resend";

const resend = new Resend(process.env.RESEND_API_KEY);

export async function POST(request: NextRequest) {
  const { data: bookData } = await request.json();
  const { id, price, start_at, end_at } = bookData;

  // check if the book exists
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
          firstName: true,
          lastName: true,
        },
      },
    },
  });

  const username = `${book.created_by.firstName} ${book.created_by.lastName}`;
  const companyName = book.company.name;
  // todo change the link to the real one
  const reservationLink = `${process.env.BOOKEASY_URL}/book/${id}`;
  const userImage =
    "https://api.dicebear.com/7.x/lorelei/svg?backgroundColor=b6e3f4,c0aede,d1d4f9";

  const data = await resend.emails.send({
    from: "Acme <onboarding@resend.dev>",
    to: ["delivered@resend.dev"],
    subject: "Votre réservation a été modifiée !",
    react: UpdateBookMail({
      companyName,
      reservationLink,
      userImage,
      username,
      price,
      start_at,
      end_at,
    }) as React.ReactElement,
  });

  return Response.json(data);
}
