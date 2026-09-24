"use client";

import React, { useState } from 'react';
import Sidebar from '../../components/Sidebar';
import { 
    User, 
    Bell, 
    Lock, 
    CreditCard, 
    Globe, 
    Palette, 
    ShieldCheck, 
    ChevronRight,
    Camera,
    Mail,
    Smartphone,
    Monitor,
    LogOut
} from 'lucide-react';

const SETTINGS_SECTIONS = [
    { id: 'profile', icon: <User size={18} />, label: 'Personal Profile' },
    { id: 'notifications', icon: <Bell size={18} />, label: 'Notifications' },
    { id: 'security', icon: <Lock size={18} />, label: 'Security & Access' },
    { id: 'billing', icon: <CreditCard size={18} />, label: 'Billing & Plans' },
    { id: 'preferences', icon: <Palette size={18} />, label: 'App Preferences' },
];

export default function SettingsPage() {
    const [activeSection, setActiveSection] = useState('profile');

    return (
        <div className="min-h-screen bg-[#f3f4f6] font-sans flex text-slate-900">
            <Sidebar />
            <div className="flex-1 flex flex-col h-screen overflow-y-auto">
                {/* Header */}
                <div className="bg-white/70 backdrop-blur-md sticky top-0 z-10 px-8 py-5 border-b border-slate-200">
                    <h1 className="text-xl font-bold tracking-tight text-slate-800">Account Settings</h1>
                    <p className="text-xs text-slate-500 mt-0.5">Manage your personal information and application preferences</p>
                </div>

                <div className="p-8">
                    <div className="max-w-[1000px] mx-auto flex flex-col md:flex-row gap-8">
                        {/* Settings Navigation */}
                        <div className="w-full md:w-64 shrink-0 space-y-1">
                            {SETTINGS_SECTIONS.map(item => (
                                <button 
                                    key={item.id}
                                    onClick={() => setActiveSection(item.id)}
                                    className={`w-full flex items-center justify-between px-4 py-3 rounded-xl text-sm font-semibold transition-all ${
                                        activeSection === item.id 
                                        ? "bg-slate-900 text-white shadow-lg" 
                                        : "text-slate-500 hover:bg-white hover:text-slate-800"
                                    }`}
                                >
                                    <div className="flex items-center gap-3">
                                        {item.icon}
                                        {item.label}
                                    </div>
                                    <ChevronRight size={14} className={activeSection === item.id ? "opacity-100" : "opacity-0"} />
                                </button>
                            ))}
                            <div className="pt-4 mt-4 border-t border-slate-200">
                                <button className="w-full flex items-center gap-3 px-4 py-3 text-sm font-semibold text-red-500 hover:bg-red-50 rounded-xl transition-all">
                                    <LogOut size={18} /> Log Out
                                </button>
                            </div>
                        </div>

                        {/* Settings Content */}
                        <div className="flex-1 space-y-6">
                            {activeSection === 'profile' && (
                                <div className="space-y-6">
                                    {/* Profile Card */}
                                    <div className="bg-white rounded-3xl p-8 border border-slate-100 shadow-sm">
                                        <h2 className="text-lg font-bold text-slate-800 mb-6">Personal Profile</h2>
                                        
                                        <div className="flex items-center gap-8 mb-8">
                                            <div className="relative">
                                                <div className="w-24 h-24 rounded-3xl overflow-hidden bg-slate-100 border-4 border-white shadow-md">
                                                    <img src="https://i.pravatar.cc/150?u=current" alt="Profile" className="w-full h-full object-cover" />
                                                </div>
                                                <button className="absolute -bottom-2 -right-2 w-8 h-8 bg-slate-900 text-white rounded-full flex items-center justify-center border-2 border-white shadow-sm hover:bg-slate-700 transition-colors">
                                                    <Camera size={14} />
                                                </button>
                                            </div>
                                            <div>
                                                <h3 className="font-bold text-slate-800">Upload New Avatar</h3>
                                                <p className="text-xs text-slate-400 mt-1 max-w-[200px]">At least 256x256 px. PNG or JPG file.</p>
                                                <div className="flex gap-2 mt-3">
                                                    <button className="text-[11px] font-bold text-blue-600 bg-blue-50 px-3 py-1.5 rounded-lg border border-blue-100">Upload</button>
                                                    <button className="text-[11px] font-bold text-slate-400 hover:text-slate-600 px-3 py-1.5">Remove</button>
                                                </div>
                                            </div>
                                        </div>

                                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                            <div className="space-y-1.5">
                                                <label className="text-[11px] font-bold text-slate-400 uppercase tracking-wider pl-1">Full Name</label>
                                                <input type="text" defaultValue="Elena Rodriguez" className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 font-medium" />
                                            </div>
                                            <div className="space-y-1.5">
                                                <label className="text-[11px] font-bold text-slate-400 uppercase tracking-wider pl-1">Legal Title</label>
                                                <input type="text" defaultValue="General Counsel" className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 font-medium" />
                                            </div>
                                            <div className="space-y-1.5 md:col-span-2">
                                                <label className="text-[11px] font-bold text-slate-400 uppercase tracking-wider pl-1">Work Email</label>
                                                <div className="relative">
                                                    <Mail className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 w-4 h-4" />
                                                    <input type="email" defaultValue="elena.r@legalinspect.ai" className="w-full pl-11 pr-4 py-3 bg-slate-50 border border-slate-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 font-medium" />
                                                </div>
                                            </div>
                                            <div className="space-y-1.5 md:col-span-2">
                                                <label className="text-[11px] font-bold text-slate-400 uppercase tracking-wider pl-1">Bio / Professional Summary</label>
                                                <textarea rows={3} className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 font-medium resize-none" defaultValue="Specializing in corporate law and technology compliance. Managing all legal operations for the team." />
                                            </div>
                                        </div>

                                        <div className="mt-8 pt-8 border-t border-slate-100 flex justify-end gap-3">
                                            <button className="px-6 py-2.5 rounded-xl text-sm font-bold text-slate-500 hover:bg-slate-50">Cancel</button>
                                            <button className="px-8 py-2.5 rounded-xl text-sm font-bold bg-slate-900 text-white hover:bg-slate-700 shadow-md transition-all">Save Changes</button>
                                        </div>
                                    </div>

                                    {/* Additional Info */}
                                    <div className="bg-white rounded-3xl p-8 border border-slate-100 shadow-sm flex items-center justify-between">
                                        <div className="flex items-center gap-4">
                                            <div className="w-12 h-12 bg-emerald-50 rounded-2xl flex items-center justify-center">
                                                <ShieldCheck size={24} className="text-emerald-500" />
                                            </div>
                                            <div>
                                                <h3 className="font-bold text-slate-800">Verification Status</h3>
                                                <p className="text-xs text-slate-400">Your account is fully verified and secure.</p>
                                            </div>
                                        </div>
                                        <span className="text-[10px] font-bold bg-emerald-50 text-emerald-600 px-3 py-1 rounded-full border border-emerald-100 uppercase tracking-widest">Verified</span>
                                    </div>
                                </div>
                            )}

                            {activeSection === 'notifications' && (
                                <div className="bg-white rounded-3xl p-8 border border-slate-100 shadow-sm space-y-8">
                                    <h2 className="text-lg font-bold text-slate-800">Notification Preferences</h2>
                                    
                                    <div className="space-y-6">
                                        {[
                                            { title: "Analysis Completed", desc: "Get notified when a document analysis is finished.", email: true, app: true },
                                            { title: "High Risk Flags", desc: "Urgent alerts when critical risks are detected in reviews.", email: true, app: true },
                                            { title: "Team Activity", desc: "Updates on team invites and case assignments.", email: false, app: true },
                                            { title: "Weekly Insights", desc: "A summary of your weekly legal analysis metrics.", email: true, app: false },
                                        ].map(item => (
                                            <div key={item.title} className="flex items-start justify-between pb-6 border-b border-slate-50 last:border-0 last:pb-0">
                                                <div className="max-w-[70%]">
                                                    <h3 className="text-sm font-bold text-slate-800">{item.title}</h3>
                                                    <p className="text-xs text-slate-500 mt-1">{item.desc}</p>
                                                </div>
                                                <div className="flex gap-4">
                                                    <div className="flex flex-col items-center gap-1.5">
                                                        <span className="text-[9px] font-bold text-slate-400 uppercase tracking-tighter">Email</span>
                                                        <button className={`w-10 h-5 rounded-full transition-all relative ${item.email ? "bg-emerald-500" : "bg-slate-200"}`}>
                                                            <div className={`absolute top-1 w-3 h-3 bg-white rounded-full transition-all ${item.email ? "left-6" : "left-1"}`}></div>
                                                        </button>
                                                    </div>
                                                    <div className="flex flex-col items-center gap-1.5">
                                                        <span className="text-[9px] font-bold text-slate-400 uppercase tracking-tighter">App</span>
                                                        <button className={`w-10 h-5 rounded-full transition-all relative ${item.app ? "bg-emerald-500" : "bg-slate-200"}`}>
                                                            <div className={`absolute top-1 w-3 h-3 bg-white rounded-full transition-all ${item.app ? "left-6" : "left-1"}`}></div>
                                                        </button>
                                                    </div>
                                                </div>
                                            </div>
                                        ))}
                                    </div>
                                </div>
                            )}

                            {activeSection !== 'profile' && activeSection !== 'notifications' && (
                                <div className="bg-white rounded-3xl p-16 border border-slate-100 shadow-sm text-center">
                                    <div className="w-16 h-16 bg-slate-50 rounded-full flex items-center justify-center mx-auto mb-4">
                                        <Monitor size={24} className="text-slate-300" />
                                    </div>
                                    <h3 className="text-slate-800 font-bold">{SETTINGS_SECTIONS.find(s => s.id === activeSection)?.label} Settings</h3>
                                    <p className="text-slate-500 text-sm mt-1">This module is currently being optimized for your experience.</p>
                                </div>
                            )}
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
