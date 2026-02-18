"use client";
import { usePathname } from "next/navigation"; 
import { Building05, User01, PackagePlus, Package, BarChartSquare02, Folder, HomeLine, LayoutAlt01, MessageChatCircle, PieChart03, Rows01, Settings01 } from "@untitledui/icons";
import type { NavItemDividerType, NavItemType } from "@/components/application/app-navigation/config";
import { NavList as SidebarNavigationSectionDividers } from "@/components/application/app-navigation/base-components/nav-list";
import { BadgeWithDot } from "@/components/base/badges/badges";

const navItemsWithDividers: (NavItemType | NavItemDividerType)[] = [
    {
        label: "Home",
        href: "/",
        icon: HomeLine,
    },
    {
        label: "Catalogo",
        href: "/catalogo",
        icon: Package,
    },
    {
        label: "Inventario",
        href: "/inventario",
        icon: PackagePlus,
    },
    { divider: true },  
    {
        label: "Personas",
        href: "/personas",
        icon: User01
    },
    {
        label: "Departamentos",
        href:"/departamentos",
        icon:Building05
    },
    { divider: true },
];
export const SidebarSectionDividers = () => {
        const pathname = usePathname();
    return (<aside className="w-70 h-screen border-r border-gray-200 bg-white flex flex-col p-5">

        <div className="flex items-center gap-3 mb-8">
            <img
                src="/assets/logo.png"
                alt="Logo"
                className="w-10 h-10 object-contain"
            />
            <span className="font-bold text-lg text-gray-900">
                Inventario App
            </span>
        </div>

        <div style={{ flex: 1, overflowY: 'auto' }}>
            <SidebarNavigationSectionDividers  activeUrl={pathname}  items={navItemsWithDividers} />
        </div>
    </aside>
    )
};

