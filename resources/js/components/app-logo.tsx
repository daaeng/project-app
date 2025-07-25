// import { Sprout } from 'lucide-react';
// import AppLogoIcon from './app-logo-icon';

export default function AppLogo() {
    return (
        <>
            <div className="text-sidebar-primary-foreground flex aspect-square size-8 items-center justify-center rounded-md">
                {/* <AppLogoIcon className="size-5 fill-current text-white dark:text-black" /> */}
                {/* <Sprout className="size-5 fill-current text-white dark:text-black"/> */}
                <img src="/assets/GKA_no_Tag.png" alt="GKA Logo" className="w-10 h-10 object-contain" />
            </div>
            <div className="ml-1 grid flex-1 text-left text-sm">
                <span className="mb-0.5 truncate leading-none font-semibold">Garuda Karya Amanat</span>
            </div>
        </>
    );
}
