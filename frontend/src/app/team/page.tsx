"use client";

import React, { useState } from 'react';
import Sidebar from '../../components/Sidebar';
import { 
    Users, 
    UserPlus, 
    Mail, 
    MoreHorizontal, 
    Shield, 
    CheckCircle, 
    Clock, 
    Search, 
    Filter,
    ChevronDown
} from 'lucide-react';

const TEAM_MEMBERS = [
    { id: 1, name: "Sarah Chen", role: "Senior Attorney", email: "sarah.chen@legalinspect.ai", status: "Active", access: "Admin", avatar: "https://i.pravatar.cc/150?u=sarah" },
    { id: 2, name: "Marcus Liu", role: "Legal Counsel", email: "marcus.liu@legalinspect.ai", status: "Active", access: "Editor", avatar: "https://i.pravatar.cc/150?u=marcus" },
    { id: 3, name: "James Park", role: "Junior Associate", email: "james.park@legalinspect.ai", status: "Away", access: "Viewer", avatar: "https://i.pravatar.cc/150?u=james" },
    { id: 4, name: "Emily Roberts", role: "Compliance Officer", email: "emily.roberts@legalinspect.ai", status: "Active", access: "Admin", avatar: "https://i.pravatar.cc/150?u=emily" },
    { id: 5, name: "David Wilson", role: "Paralegal", email: "david.wilson@legalinspect.ai", status: "Inactive", access: "Editor", avatar: "https://i.pravatar.cc/150?u=david" },
    { id: 6, name: "Elena Rodriguez", role: "General Counsel", email: "elena.r@legalinspect.ai", status: "Active", access: "Admin", avatar: "https://i.pravatar.cc/150?u=elena" },
];

const ACCESS_STYLES: Record<string, string> = {
    "Admin": "bg-purple-50 text-purple-700 border-purple-100",
    "Editor": "bg-blue-50 text-blue-700 border-blue-100",
    "Viewer": "bg-slate-50 text-slate-600 border-slate-100",
};

export default function TeamPage() {
    const [searchQuery, setSearchQuery] = useState('');

    const filteredMembers = TEAM_MEMBERS.filter(member => 
        member.name.toLowerCase().includes(searchQuery.toLowerCase()) || 
        member.email.toLowerCase().includes(searchQuery.toLowerCase()) ||
        member.role.toLowerCase().includes(searchQuery.toLowerCase())
    );

    return (
        <div className="min-h-screen bg-[#f3f4f6] font-sans flex text-slate-900">
            <Sidebar />
            <div className="flex-1 flex flex-col h-screen overflow-y-auto">
                {/* Header */}
                <div className="bg-white/70 backdrop-blur-md sticky top-0 z-10 px-8 py-5 border-b border-slate-200 flex justify-between items-center">
                    <div>
                        <h1 className="text-xl font-bold tracking-tight text-slate-800">Team Management</h1>
                        <p className="text-xs text-slate-500 mt-0.5">Invite and manage roles for your legal team</p>
                    </div>
                    <button className="flex items-center gap-2 bg-slate-900 text-white px-5 py-2.5 rounded-xl text-sm font-semibold hover:bg-slate-700 transition-colors">
                        <UserPlus size={16} /> Invite Member
                    </button>
                </div>

                <div className="p-8 space-y-6">
                    {/* Stats Overview */}
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                        <div className="bg-white rounded-2xl p-6 border border-slate-100 shadow-sm">
                            <div className="flex items-center justify-between mb-4">
                                <div className="w-10 h-10 bg-blue-50 rounded-xl flex items-center justify-center">
                                    <Users size={20} className="text-blue-500" />
                                </div>
                                <span className="text-[10px] font-bold text-emerald-500 bg-emerald-50 px-2 py-0.5 rounded-full border border-emerald-100">+2 new</span>
                            </div>
                            <h3 className="text-3xl font-black text-slate-800">{TEAM_MEMBERS.length}</h3>
                            <p className="text-xs text-slate-500 font-medium">Total Active Members</p>
                        </div>
                        <div className="bg-white rounded-2xl p-6 border border-slate-100 shadow-sm">
                            <div className="flex items-center justify-between mb-4">
                                <div className="w-10 h-10 bg-purple-50 rounded-xl flex items-center justify-center">
                                    <Shield size={20} className="text-purple-500" />
                                </div>
                            </div>
                            <h3 className="text-3xl font-black text-slate-800">{TEAM_MEMBERS.filter(m => m.access === 'Admin').length}</h3>
                            <p className="text-xs text-slate-500 font-medium">Account Administrators</p>
                        </div>
                        <div className="bg-white rounded-2xl p-6 border border-slate-100 shadow-sm">
                            <div className="flex items-center justify-between mb-4">
                                <div className="w-10 h-10 bg-amber-50 rounded-xl flex items-center justify-center">
                                    <Mail size={20} className="text-amber-500" />
                                </div>
                                <span className="text-xs text-amber-500 font-bold">1 pending</span>
                            </div>
                            <h3 className="text-3xl font-black text-slate-800">12</h3>
                            <p className="text-xs text-slate-500 font-medium">Invitations Sent</p>
                        </div>
                    </div>

                    {/* Team Table */}
                    <div className="bg-white rounded-2xl border border-slate-100 shadow-sm overflow-hidden">
                        <div className="px-6 py-4 border-b border-slate-100 flex flex-col md:flex-row justify-between items-center gap-4">
                            <div className="relative w-full md:w-80">
                                <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 w-4 h-4" />
                                <input 
                                    type="text" 
                                    placeholder="Search members..." 
                                    className="w-full pl-9 pr-4 py-2 border border-slate-200 rounded-xl text-sm focus:outline-none focus:ring-1 focus:ring-blue-500 bg-slate-50"
                                    value={searchQuery}
                                    onChange={(e) => setSearchQuery(e.target.value)}
                                />
                            </div>
                            <div className="flex gap-2">
                                <button className="flex items-center gap-2 text-xs font-bold text-slate-600 bg-slate-100 px-3 py-2 rounded-lg hover:bg-slate-200 transition-colors">
                                    <Filter size={14} /> Filter <ChevronDown size={14} />
                                </button>
                            </div>
                        </div>

                        <table className="w-full">
                            <thead className="bg-slate-50 border-b border-slate-100">
                                <tr>
                                    <th className="px-6 py-4 text-left text-[11px] font-bold text-slate-500 uppercase tracking-wider">Member</th>
                                    <th className="px-6 py-4 text-left text-[11px] font-bold text-slate-500 uppercase tracking-wider">Status</th>
                                    <th className="px-6 py-4 text-left text-[11px] font-bold text-slate-500 uppercase tracking-wider">Access Level</th>
                                    <th className="px-6 py-4 text-left text-[11px] font-bold text-slate-500 uppercase tracking-wider">Join Date</th>
                                    <th className="px-6 py-4 text-right"></th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-slate-50">
                                {filteredMembers.map(member => (
                                    <tr key={member.id} className="hover:bg-slate-50/50 transition-colors">
                                        <td className="px-6 py-4">
                                            <div className="flex items-center gap-3">
                                                <div className="w-10 h-10 rounded-full overflow-hidden shrink-0 border-2 border-white shadow-sm">
                                                    <img src={member.avatar} alt={member.name} className="w-full h-full object-cover" />
                                                </div>
                                                <div>
                                                    <div className="text-sm font-bold text-slate-800">{member.name}</div>
                                                    <div className="text-xs text-slate-400">{member.role}</div>
                                                </div>
                                            </div>
                                        </td>
                                        <td className="px-6 py-4">
                                            <div className="flex items-center gap-1.5">
                                                {member.status === 'Active' ? (
                                                    <div className="w-2 h-2 rounded-full bg-emerald-500"></div>
                                                ) : member.status === 'Away' ? (
                                                    <div className="w-2 h-2 rounded-full bg-amber-500"></div>
                                                ) : (
                                                    <div className="w-2 h-2 rounded-full bg-slate-300"></div>
                                                )}
                                                <span className="text-xs font-medium text-slate-600">{member.status}</span>
                                            </div>
                                        </td>
                                        <td className="px-6 py-4">
                                            <span className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[10px] font-bold border ${ACCESS_STYLES[member.access]}`}>
                                                <Shield size={10} /> {member.access}
                                            </span>
                                        </td>
                                        <td className="px-6 py-4 text-xs text-slate-500 font-medium">Jan 12, 2024</td>
                                        <td className="px-6 py-4 text-right">
                                            <button className="p-2 hover:bg-slate-100 rounded-lg transition-colors text-slate-400">
                                                <MoreHorizontal size={18} />
                                            </button>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                        
                        {filteredMembers.length === 0 && (
                            <div className="py-20 text-center">
                                <p className="text-slate-400 text-sm">No team members found.</p>
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
}
