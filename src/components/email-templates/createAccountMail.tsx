import { appTitle } from "@/utils";
import {
  Body,
  Button,
  Column,
  Container,
  Head,
  Heading,
  Hr,
  Html,
  Img,
  Link,
  Preview,
  Row,
  Section,
  Text,
} from "@react-email/components";
import { Tailwind } from "@react-email/tailwind";

interface CreateAccountMailProps {
  receiverEmail: string;
  currentName: string;
  companyName: string;
  companyId: string;
  secureToken: string;
  senderEmail: string;
  reservationId: string;
}

const baseUrl = process.env.NEXT_PUBLIC_BOOKEASY_URL;

export const CreateAccountMail = ({
  currentName,
  receiverEmail,
  companyName,
  companyId,
  senderEmail,
  secureToken,
  reservationId,
}: CreateAccountMailProps) => {
  const previewText = `Rejoignez ${appTitle}`;
  const reservationLink = `${baseUrl}/sign-in/?email=${receiverEmail}&senderEmail=${senderEmail}&token=${secureToken}&company=${companyId}&reservationId=${reservationId}`;

  return (
    <Html>
      <Head />
      <Preview>{previewText}</Preview>
      <Tailwind>
        <Body className="mx-auto my-auto bg-white px-2 font-sans">
          <Container className="mx-auto my-[40px] max-w-[465px] rounded border border-solid border-[#eaeaea] p-[20px]">
            <Section className="mt-[32px]">
              <Img
                src={`${baseUrl}/assets/images/icon-bookEasy.png`}
                width="40"
                height="37"
                alt="bookeasy logo"
                className="mx-auto my-0"
              />
            </Section>
            <Heading className="mx-0 my-[30px] p-0 text-center text-[24px] font-normal text-black">
              {currentName} vous invite à rejoindre{" "}
              <strong>{companyName}</strong> !
            </Heading>
            <Section className="mb-[32px] mt-[32px] text-center">
              <Button
                className="rounded bg-[#000000] px-5 py-3 text-center text-[12px] font-semibold text-white no-underline"
                href={reservationLink}
              >
                Valider l&apos;invitation en créant un compte
              </Button>
            </Section>
            <Text className="text-[14px] leading-[24px] text-black">
              ou copier coller le lien suivant dans votre navigateur:{" "}
              <Link
                href={reservationLink}
                className="text-blue-600 no-underline"
              >
                {reservationLink}
              </Link>
            </Text>
            <Hr className="mx-0 my-[26px] w-full border border-solid border-[#eaeaea]" />
            <Text className="text-[12px] leading-[24px] text-[#666666]">
              This invitation was intended for{" "}
              <span className="text-black">{receiverEmail}</span>. If you were
              not expecting this invitation, you can ignore this email. If you
              are concerned about your account&apos;s safety, please reply to
              this email to get in touch with us.
            </Text>
          </Container>
        </Body>
      </Tailwind>
    </Html>
  );
};

export default CreateAccountMail;
