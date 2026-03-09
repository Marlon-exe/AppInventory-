import "./globals.css";
import { Providers } from "./providers";
import NavBar from "@/src/componets/ui/navbar";

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="es" suppressHydrationWarning>
      <body>
        <Providers >
          <NavBar />
          <main className="container mx-auto max-w-7xl px-6 items-center justify-center min-h-[calc(100vh-64px)]">
            {children}
          </main>
        </Providers>
      </body>
    </html>
  );
}