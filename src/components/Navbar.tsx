'use client';

import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import { signOut } from '@/lib/auth';

export default function Navbar() {
  const router = useRouter();
  const pathname = usePathname();

  async function handleSignOut() {
    await signOut();
    router.push('/');
  }

  const navLinks = [
    { href: '/dashboards', label: 'Dashboards' },
    { href: '/clients', label: 'Clients' },
    { href: '/data', label: 'Data' },
    { href: '/settings', label: 'Settings' },
  ];

  return (
    <nav className="sticky top-0 z-50 border-b border-border bg-background/80 backdrop-blur-xl px-6 py-3 flex items-center justify-between">
      <Link href="/dashboards" className="text-xl font-bold tracking-tight">
        <span className="bg-gradient-to-r from-accent-light to-accent bg-clip-text text-transparent">Client</span>
        <span className="text-foreground">Pulse</span>
      </Link>
      <div className="flex items-center gap-1">
        {navLinks.map((link) => (
          <Link
            key={link.href}
            href={link.href}
            className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
              pathname?.startsWith(link.href)
                ? 'text-foreground bg-surface'
                : 'text-muted hover:text-foreground hover:bg-surface/50'
            }`}
          >
            {link.label}
          </Link>
        ))}
        <div className="w-px h-5 bg-border mx-2" />
        <button
          onClick={handleSignOut}
          className="px-4 py-2 rounded-lg text-sm text-muted hover:text-foreground hover:bg-surface/50 transition-colors"
        >
          Sign Out
        </button>
      </div>
    </nav>
  );
}
