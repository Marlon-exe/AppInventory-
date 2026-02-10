import { SidebarSectionDividers } from "../components/layout/sidebar.component";
import { Providers } from "../components/providers"
import "./globals.css";

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="es">
      <body className="flex m-0 antialiased">
        {/*Contenido, tambien 'es-ES' */}
        <Providers> 
          <SidebarSectionDividers />
          <main className="flex-1 p-5">
            {children}
          </main>
        </Providers>
      </body>
    </html>
  );
}