'use client'
import Image from "next/image";
import Link from "next/link";
import NavLinks from "./nav-links";
import { usePathname } from 'next/navigation';

export default function SideBar() {
    const pathname = usePathname()
    console.log(pathname)
    return (
        <div className="h-screen w-56 bg-base-200 drop-shadow-sm flex-none">
            <div className="w-full h-20 flex items-center justify-center font-medium text-lg text-primary border-b border-base-300">
                Hypertr.io
            </div >
            <NavLinks />
        </div>
    );
}