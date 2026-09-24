"use client";

import React from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import {
    Home,
    Briefcase,
    Search,
    Eye,
    ShieldCheck,
    FileText,
    Users,
    Plug,
    Settings,
    HelpCircle,
    LogOut,
    Hexagon
} from 'lucide-react';

export default function Sidebar() {
    const pathname = usePathname();

    return (
        <div className="w-64 bg-slate-950 border-r border-slate-800 flex flex-col h-screen sticky top-0 shrink-0">
            {/* Logo */}
            <div className="flex items-center gap-2 p-6 mb-4">
                <Hexagon className="text-white w-6 h-6 fill-white" />
                <span className="text-xl font-bold tracking-tight text-white">LegalInspect</span>
            </div>

            <div className="flex-1 overflow-y-auto shrink-0 flex flex-col gap-6 px-4">
                {/* Main Section */}
                <div className="space-y-1">
                    <div className="text-[10px] uppercase font-bold text-slate-500 tracking-widest pl-3 mb-2">MAIN</div>
                    <NavItem href="/" icon={<Home size={18} />} label="Dashboard" active={pathname === '/'} />
                    <NavItem href="/cases" icon={<Briefcase size={18} />} label="Cases" active={pathname === '/cases'} />
                    <NavItem href="/search" icon={<Search size={18} />} label="Legal Search" active={pathname === '/search'} />
                    <NavItem href="/review" icon={<Eye size={18} />} label="Smart Review" active={pathname === '/review'} />
                </div>

                {/* Analytics Section */}
                <div className="space-y-1">
                    <div className="text-[10px] uppercase font-bold text-slate-500 tracking-widest pl-3 mb-2">ANALYTICS</div>
                    <NavItem href="/compliance" icon={<ShieldCheck size={18} />} label="Compliance View" active={pathname === '/compliance'} />
                    <NavItem href="/forms" icon={<FileText size={18} />} label="Legal Forms" active={pathname === '/forms'} />
                </div>

                {/* Management Section */}
                <div className="space-y-1">
                    <div className="text-[10px] uppercase font-bold text-slate-500 tracking-widest pl-3 mb-2">MANAGEMENT</div>
                    <NavItem href="/team" icon={<Users size={18} />} label="Team" active={pathname === '/team'} />
                    <NavItem href="/integrations" icon={<Plug size={18} />} label="Integrations" active={pathname === '/integrations'} />
                </div>

                {/* Other Section */}
                <div className="space-y-1">
                    <div className="text-[10px] uppercase font-bold text-slate-500 tracking-widest pl-3 mb-2">OTHER</div>
                    <NavItem href="/settings" icon={<Settings size={18} />} label="Settings" active={pathname === '/settings'} />
                    <NavItem href="/support" icon={<HelpCircle size={18} />} label="Support Center" active={pathname === '/support'} />
                </div>
            </div>

            {/* Logout */}
            <div className="p-4 border-t border-slate-800">
                <button className="flex items-center gap-3 px-3 py-2 text-slate-400 hover:text-white transition-colors w-full">
                    <LogOut size={18} />
                    <span className="text-sm font-medium">Logout</span>
                </button>
            </div>
        </div>
    );
}

function NavItem({ href, icon, label, active = false }: { href: string, icon: React.ReactNode, label: string, active?: boolean }) {
    return (
        <Link href={href} className={`flex items-center gap-3 px-3 py-2.5 rounded-xl w-full transition-all ${active ? "bg-white text-slate-950 font-semibold" : "text-slate-400 hover:text-white hover:bg-slate-900"
            }`}>
            {icon}
            <span className="text-sm">{label}</span>
        </Link>
    );
}
