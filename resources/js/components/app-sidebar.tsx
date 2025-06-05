import { NavFooter } from '@/components/nav-footer';
import { NavMain } from '@/components/nav-main';
import { NavUser } from '@/components/nav-user';
import { Sidebar, SidebarContent, SidebarFooter, SidebarHeader, SidebarMenu, SidebarMenuButton, SidebarMenuItem } from '@/components/ui/sidebar';
import { type NavItem } from '@/types';
import { Link } from '@inertiajs/react';
import { LayoutDashboard, ChartArea, UserCog2, PackageIcon, BookText, ReceiptText, Notebook} from 'lucide-react';
import AppLogo from './app-logo';

const mainNavItems: NavItem[] = [
    {
        title: 'Dashboard',
        href: '/dashboard',
        icon: LayoutDashboard,
    },

    {
        title: 'User Management',
        href: '/usermanagements',
        icon: UserCog2,
    },
    
    {
        title: 'Role Management',
        href: '/roles',
        icon: Notebook,
    },

    {
        title: 'Product',
        href: '/products',
        icon: PackageIcon,
    },
    
    {
        title: 'Request Latter',
        href: '/requests',
        icon: BookText ,
    },
    {
        title: 'Invoice',
        href: '/notas',
        icon: ReceiptText ,
    },
    
    {
        title: 'Administration',
        href: '/administrasis',
        icon: ChartArea,
    },
    
    /*{
        title: 'catalog',
        href: '/catalog',
        icon: LayoutGrid,
    },*/
    
];

const footerNavItems: NavItem[] = [
/*
    {
        title: 'Repository',
        href: 'https://github.com/laravel/react-starter-kit',
        icon: Folder,
    },
    {
        title: 'Documentation',
        href: 'https://laravel.com/docs/starter-kits',
        icon: BookOpen,
    },
*/
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
