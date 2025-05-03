'use client';
import { usePathname } from 'next/navigation';
import Link from 'next/link';
import HomeIcon from '@mui/icons-material/Home';
import LoginIcon from '@mui/icons-material/Login';
import CalculateIcon from '@mui/icons-material/Calculate';
import FitnessCenterIcon from '@mui/icons-material/FitnessCenter';
import RestaurantIcon from '@mui/icons-material/Restaurant';
import { ReactElement } from 'react';
import { signOut } from "next-auth/react";

interface NavLink {
    href: string;
    label: string;
    icon: ReactElement;
}

type NavConfig = {
    [key: string]: NavLink[];
};

const navConfig: NavConfig = {
    "/dashboard": [
        { href: "/dashboard", label: "Home", icon: <HomeIcon /> },
        { href: "/dashboard/workouts", label: "Workouts", icon: <FitnessCenterIcon /> },
        { href: "/dashboard/macro_calculator", label: "Macro Calculator", icon: <CalculateIcon /> },
        { href: "/dashboard/calorie_log", label: "Calorie Log", icon: <RestaurantIcon /> },
        { href: "/login", label: "Logout", icon: <LoginIcon /> }
    ],
    "/dashboard/workouts": [
        { href: "/dashboard", label: "Home", icon: <HomeIcon /> },
        { href: "/dashboard/macro_calculator", label: "Macro Calculator", icon: <CalculateIcon /> },
        { href: "/dashboard/calorie_log", label: "Calorie Log", icon: <RestaurantIcon /> },
        { href: "/login", label: "Logout", icon: <LoginIcon /> }
    ],
    "/dashboard/macro_calculator": [
        { href: "/dashboard", label: "Home", icon: <HomeIcon /> },
        { href: "/dashboard/workouts", label: "Workouts", icon: <FitnessCenterIcon /> },
        { href: "/dashboard/calorie_log", label: "Calorie Log", icon: <RestaurantIcon /> },
        { href: "/login", label: "Logout", icon: <LoginIcon /> }
    ],
    "/dashboard/calorie_log": [
        { href: "/dashboard", label: "Home", icon: <HomeIcon /> },
        { href: "/dashboard/workouts", label: "Workouts", icon: <FitnessCenterIcon /> },
        { href: "/dashboard/macro_calculator", label: "Macro Calculator", icon: <CalculateIcon /> },
        { href: "/login", label: "Logout", icon: <LoginIcon />  }
    ]
};

export default function NavLinks() {
    const pathname = usePathname() || '/dashboard';

    const findParentRoute = (path: string): NavLink[] => {
        // Try exact match first
        if (path in navConfig) {
            return navConfig[path];
        }

        // Split path and try to find closest parent
        const pathParts = path.split('/');
        while (pathParts.length > 2) { // Keep at least /dashboard
            pathParts.pop();
            const parentPath = pathParts.join('/');
            if (parentPath in navConfig) {
                return navConfig[parentPath];
            }
        }

        // Fallback to dashboard links
        return navConfig["/dashboard"];
    };

    const currentLinks = findParentRoute(pathname);

    return (
        <div className="menu p-4 w-full ">
            {currentLinks.map((link) => {
    const isLogout = link.label === "Logout";

    return (
        <button
            key={link.href}
            onClick={() => {
                if (isLogout) {
                    signOut({ callbackUrl: "/login" }); // will remove session & redirect
                } else {
                    window.location.href = link.href; // regular nav
                }
            }}
            className={`flex w-full text-left flex-row gap-4 m-1 items-center py-3 px-4 rounded-lg hover:bg-base-300 transition-colors ${
                pathname === link.href ? 'bg-primary text-primary-content' : 'text-base-content'
            }`}
        >
            {link.icon}
            <span className="font-medium">{link.label}</span>
        </button>
    );
})}
        </div>
    );
}