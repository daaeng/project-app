import { NavFooter } from '@/components/nav-footer';
import { NavMain } from '@/components/nav-main';
import { NavUser } from '@/components/nav-user';
import { Sidebar, SidebarContent, SidebarFooter, SidebarHeader, SidebarMenu, SidebarMenuButton, SidebarMenuItem } from '@/components/ui/sidebar';
import { type NavItem } from '@/types';
import { Link } from '@inertiajs/react';
// ADD Archive here
import { LayoutDashboard, ChartArea, UserCog2, PackageIcon, ReceiptText, Notebook, HandCoins, UsersRound, PackageOpen, BookUser, Banknote, Archive, Clock, BookUp2 } from 'lucide-react';
import AppLogo from './app-logo';

const mainNavItems: NavItem[] = [
    {
        title: 'Dashboard',
        href: '/dashboard',
        icon: LayoutDashboard,
    },

    {
        title: 'Role Management',
        href: '/roles',
        icon: Notebook,
    },

    {
        title: 'User Management',
        href: '/usermanagements',
        icon: UserCog2,
    },

    {
        title: 'Employee',
        href: '/pegawai',
        icon: BookUser,
    },
    
    {
        title: 'Incisor',
        href: '/incisors',
        icon: UsersRound,
    },
    
    {
        title: 'Incised Data',
        href: '/inciseds',
        icon: PackageOpen,
    },

    {
        title: 'Product',
        href: '/products',
        icon: PackageIcon,
    },

    // --- NEW INVENTORY MENU ITEM ---
    {
        title: 'Inventory',
        href: '/inventories',
        icon: Archive,
    },
    // -----------------------------
    
    // {
    //     title: 'Request Latter',
    //     href: '/requests',
    //     icon: BookText ,
    // },
    
    {
        title: 'PPB',
        href: '/ppb',
        icon: BookUp2 ,
    },
    
    {
        title: 'Invoice',
        href: '/notas',
        icon: ReceiptText ,
    },
    
    {
        title: 'Cash Receipt',
        href: '/kasbons',
        icon: HandCoins,
    },
    
    {
        title: 'Administration',
        href: '/administrasis',
        icon: ChartArea,
    },
    
    {
        title: 'Payroll',
        href: '/payroll',
        icon: Banknote,
    },

    {
        title: 'Absensi',
        href: '/attendances',
        icon: Clock,
    },
];

const footerNavItems: NavItem[] = [
    // ... your footer items
];

export function AppSidebar() {
    return (
        <Sidebar collapsible="icon" variant="inset">
            <SidebarHeader>
                <SidebarMenu>
                    <SidebarMenuItem>
                        <SidebarMenuButton size="lg" asChild>
                            <Link href="/dashboard" prefetch>
                                <AppLogo />
                            </Link>
                        </SidebarMenuButton>
                    </SidebarMenuItem>
                </SidebarMenu>
            </SidebarHeader>

            <SidebarContent>
                <NavMain items={mainNavItems} />
            </SidebarContent>

            <SidebarFooter>
                <NavFooter items={footerNavItems} className="mt-auto" />
                <NavUser />
            </SidebarFooter>
        </Sidebar>
    );
}
