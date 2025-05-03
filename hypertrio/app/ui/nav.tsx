'use client'
import Link from 'next/link';
import { usePathname } from 'next/navigation';

export default function Nav() {
  return (
    <nav className="w-full flex flex-row h-20 align-middle items-center justify-between px-14 py-12 bg-base-100">
      <Link href="/" className="text-xl font-bold text-primary">
        HyperTrio
      </Link>
      <div className="flex gap-6">
        <Link href="/about" className="hover:text-gray-600 text-primary">About</Link>
        <Link href="/login" className="hover:text-gray-600 text-primary">Login</Link>
      </div>
    </nav>
  );
}