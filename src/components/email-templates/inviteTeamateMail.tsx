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

interface InviteTeamateMailProps {
  receiverEmail: string;
  currentId: string;
  currentEmail: string;
  companyName: string;
  companyId: string;
}

const baseUrl = process.env.BOOKEASY_URL;

export const InviteTeamateMail = ({
  currentEmail,
  receiverEmail,
  currentId,
  companyName,
  companyId,
}: InviteTeamateMailProps) => {
  const previewText = `Rejoignez ${appTitle}`;
  const reservationLink = `${baseUrl}/sign-in/invitation?email=${receiverEmail}&token=${currentId}&company=${companyId}`;

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
              {currentEmail} vous invite à rejoindre {companyName} !
            </Heading>
            <Section>
              <Row>
                <Column align="right">
                  <Img
                    className="rounded-full"
                    src={
                      "https://api.dicebear.com/7.x/lorelei/svg?backgroundColor=b6e3f4,c0aede,d1d4f9"
                    }
                    width="64"
                    height="64"
                  />
                </Column>
                <Column align="left">
                  <Img
                    className="rounded-full"
                    src={`${baseUrl}/assets/images/icon-bookEasy.png`}
                    width="64"
                    height="64"
                  />
                </Column>
              </Row>
            </Section>
            <Section className="mb-[32px] mt-[32px] text-center">
              <Button
                className="rounded bg-[#000000] px-5 py-3 text-center text-[12px] font-semibold text-white no-underline"
                href={reservationLink}
              >
                Valider l&apos;invitation
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

export default InviteTeamateMail;
