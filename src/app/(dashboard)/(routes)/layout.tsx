import { Metadata } from "next";

export const metadata: Metadata = {
  title: "BookEasy - DashBoard",
  description:
    "Faciliter la gestion des réservations pour les entreprises, en particulier dans les secteurs tels que la restauration, les salons de beauté, les activités de loisirs,",
};

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <body>{children}</body>;
}
