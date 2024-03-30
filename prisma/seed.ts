import { PrismaClient } from "@prisma/client";
import { faker } from "@faker-js/faker";

const prisma = new PrismaClient();

async function main() {
  // Fetch existing users and companies
  const existingUsers = await prisma.user.findMany();
  const existingCompanies = await prisma.company.findMany();

  // company does not exist then create one
  if (existingCompanies.length === 0) {
    const company = await prisma.company.create({
      data: {
        name: faker.company.name(),
      },
    });
    existingCompanies.push(company);
    console.log("Company created successfully : " + company.id);
  }
  // user does not exist then create 10
  if (existingUsers.length <= 50) {
    for (let i = 0; i < 50; i++) {
      const user = await prisma.user.create({
        data: {
          email: faker.internet.email(),
          firstName: faker.person.firstName(),
          lastName: faker.person.lastName(),
          password: faker.internet.password(),
          phone_number: faker.phone.number(),
          recover_password_token: faker.string.uuid(),
        },
      });
      existingUsers.push(user);
      console.log("User created successfully : " + user.id);
    }
  }

  // Generate fake books using existing users and companies
  const books = [];
  for (let i = 0; i < 500; i++) {
    const book = await prisma.book.create({
      data: {
        start_at: faker.date.past(),
        end_at: faker.date.soon(),
        price: faker.number.int({ min: 0, max: 200 }),
        created_by_email_temp: faker.internet.email(),
        // Generate more fake data for other fields as needed
        created_by: {
          connect: {
            id: existingUsers[
              faker.number.int({ min: 0, max: existingUsers.length - 1 })
            ].id,
          },
        },
        company: {
          connect: {
            id: existingCompanies[
              faker.number.int({ min: 0, max: existingCompanies.length - 1 })
            ].id,
          },
        },
      },
    });
    books.push(book);
    console.log("Book created successfully : " + book.id);
  }

  console.log("Fake data created successfully");
}

main()
  .catch((e) => {
    console.error(e);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
