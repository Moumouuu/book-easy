import { Toaster } from "@/components/ui/sonner";
import { authOptions } from "@/lib/auth";
import AuthProvider from "@/providers/auth-provider";
import { ThemeProvider } from "@/providers/theme-provider";
import type { Metadata } from "next";
import { getServerSession } from "next-auth";
import "./globals.css";

export const metadata: Metadata = {
  title:
    "BookEasy - Faciliter la gestion des réservations pour les entreprises",
  description:
    "Faciliter la gestion des réservations pour les entreprises, en particulier dans les secteurs tels que la restauration, les salons de beauté, les activités de loisirs,",
};

export default async function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const session = await getServerSession(authOptions);

  return (
    <html lang="fr" suppressHydrationWarning>
      <head />
      <body>
        <ThemeProvider
          attribute="class"
          defaultTheme="system"
          enableSystem
          disableTransitionOnChange
        >
          <AuthProvider session={session}>
            {children}
            <Toaster />
          </AuthProvider>
        </ThemeProvider>
      </body>
    </html>
  );
}
