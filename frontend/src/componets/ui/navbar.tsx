"use client"
import { usePathname } from "next/navigation";
import {
  Navbar, NavbarBrand, NavbarMenuToggle, NavbarMenu,
  NavbarMenuItem, NavbarContent, NavbarItem, Link,
} from "@heroui/react";

export const AcmeLogo = () => {
  return (
    <svg fill="none" height="36" viewBox="0 0 32 32" width="36">
      <path
        clipRule="evenodd"
        d="M17.6482 10.1305L15.8785 7.02583L7.02979 22.5499H10.5278L17.6482 10.1305ZM19.8798 14.0457L18.11 17.1983L19.394 19.4511H16.8453L15.1056 22.5499H24.7272L19.8798 14.0457Z"
        fill="currentColor"
        fillRule="evenodd"
      />
    </svg>
  );
};

const navItems = [
  { label: "Inicio", href: "/" },
  { label: "Catalogo", href: "/page/catalogo" },
  { label: "Inventario", href: "/page/inventario" },
  { label: "Personas", href: "/page/persona" },
  { label: "Departamentos", href: "/page/departamento" },
  { label: "Reportes", href: "/page/reportes" },
  { label: "Datos Personales", href: "/page/datosPersonales" },

];

export default function SideBar() {
  const pathname = usePathname();
  const isActive = (href: string) => pathname === href;

  return (
    <Navbar disableAnimation isBordered>
      {/* mobile: toggle */}
      <NavbarContent className="sm:hidden" justify="start">
        <NavbarMenuToggle />
      </NavbarContent>

      {/* mobile: logo */}
      <NavbarContent className="sm:hidden pr-3" justify="center">
        <NavbarBrand>
           <img src="/assets/logo.png" alt="Logo" className="h-12 w-auto" />
        </NavbarBrand>
      </NavbarContent>

      {/* desktop: logo + links */}
      <NavbarContent className="hidden sm:flex gap-4" justify="center">
        <NavbarBrand>
          <img src="/assets/logo.png" alt="Logo" className="h-15 w-auto" />
        </NavbarBrand>
        {navItems.map((item) => (
          <NavbarItem key={item.href} isActive={isActive(item.href)}>
            <Link
              href={item.href}
              color={isActive(item.href) ? "primary" : "foreground"}
              aria-current={isActive(item.href) ? "page" : undefined}
            >
              {item.label}
            </Link>
          </NavbarItem>
        ))}
      </NavbarContent>

      {/* mobile: menu hamburguesa */}
      <NavbarMenu>
        {navItems.map((item) => (
          <NavbarMenuItem key={item.href}>
            <Link
              className="w-full"
              href={item.href}
              color={isActive(item.href) ? "warning" : "foreground"}
              size="lg"
            >
              {item.label}
            </Link>
          </NavbarMenuItem>
        ))}
      </NavbarMenu>
    </Navbar>
  );
}