"use client";

import React, { useState } from 'react';
import Sidebar from '../../components/Sidebar';
import { 
    Plug, 
    Check, 
    X, 
    Cloud, 
    MessageSquare, 
    Database, 
    Link as LinkIcon, 
    Settings, 
    ExternalLink,
    AlertCircle,
    Plus,
    ChevronRight
} from 'lucide-react';

const INTEGRATIONS = [
    { 
        id: "slack", 
        name: "Slack", 
        category: "Communication", 
        status: "Connected", 
        description: "Send automated analysis alerts and report summaries to designated channels.",
        icon: <MessageSquare className="text-[#4A154B]" />
    },
    { 
        id: "google-drive", 
        name: "Google Drive", 
        category: "Cloud Storage", 
        status: "Connected", 
        description: "Automatically sync analyzed documents and exported reports to your shared drives.",
        icon: <Cloud className="text-[#4285F4]" />
    },
    { 
        id: "dropbox", 
        name: "Dropbox", 
        category: "Cloud Storage", 
        status: "Disconnected", 
        description: "Directly import contracts and export analysis results to your Dropbox account.",
        icon: <Cloud className="text-[#0061FF]" />
    },
    { 
        id: "salesforce", 
        name: "Salesforce", 
        category: "CRM", 
        status: "Disconnected", 
        description: "Attach legal analysis reports directly to Salesforce Accounts and Opportunities.",
        icon: <Database className="text-[#00A1E0]" />
    },
    { 
        id: "zapier", 
        name: "Zapier", 
        category: "Automation", 
        status: "Connected", 
        description: "Connect LegalInspect with 5000+ apps to automate your entire document workflow.",
        icon: <ZapierIcon className="text-[#FF4A00]" />
    },
    { 
        id: "clio", 
        name: "Clio", 
        category: "Practice Management", 
        status: "Disconnected", 
        description: "Sync case documents and metadata with your Clio practice management suite.",
        icon: <LinkIcon className="text-[#003462]" />
    }
];

function ZapierIcon({ className }: { className?: string }) {
    return (
        <svg viewBox="0 0 24 24" className={`w-6 h-6 fill-current ${className}`}>
            <path d="M12 0L3.5 12h7V24L19 12h-7V0z" />
        </svg>
    );
}

const CATEGORIES = ["All", "Communication", "Cloud Storage", "CRM", "Automation", "Practice Management"];

export default function IntegrationsPage() {
    const [selectedCategory, setSelectedCategory] = useState("All");

    const filteredIntegrations = INTEGRATIONS.filter(item => 
        selectedCategory === "All" || item.category === selectedCategory
    );

    return (
        <div className="min-h-screen bg-[#f3f4f6] font-sans flex text-slate-900">
            <Sidebar />
            <div className="flex-1 flex flex-col h-screen overflow-y-auto">
                {/* Header */}
                <div className="bg-white/70 backdrop-blur-md sticky top-0 z-10 px-8 py-5 border-b border-slate-200 flex justify-between items-center">
                    <div>
                        <h1 className="text-xl font-bold tracking-tight text-slate-800">Integrations</h1>
                        <p className="text-xs text-slate-500 mt-0.5">Connect your legal workflow with third-party applications</p>
                    </div>
                    <button className="flex items-center gap-2 text-xs font-bold text-slate-600 bg-white border border-slate-200 px-4 py-2.5 rounded-xl hover:bg-slate-50 transition-colors">
                        <Settings size={14} /> Developer API
                    </button>
                </div>

                <div className="p-8 space-y-8">
                    {/* Filter Tabs */}
                    <div className="flex gap-2 bg-white/50 p-1 rounded-xl w-fit border border-slate-200">
                        {CATEGORIES.map(cat => (
                            <button 
                                key={cat}
                                onClick={() => setSelectedCategory(cat)}
                                className={`px-4 py-2 text-xs font-bold rounded-lg transition-all ${
                                    selectedCategory === cat 
                                    ? "bg-white shadow-sm text-slate-800 border border-slate-100" 
                                    : "text-slate-500 hover:text-slate-800"
                                }`}
                            >
                                {cat}
                            </button>
                        ))}
                    </div>

                    {/* Integration Grid */}
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                        {filteredIntegrations.map(app => (
                            <div key={app.id} className="bg-white rounded-3xl p-6 border border-slate-100 shadow-sm flex flex-col hover:border-blue-200 transition-colors group">
                                <div className="flex items-start justify-between mb-6">
                                    <div className="w-14 h-14 bg-slate-50 rounded-2xl flex items-center justify-center border border-slate-100">
                                        {app.icon}
                                    </div>
                                    {app.status === "Connected" ? (
                                        <span className="flex items-center gap-1.5 text-[10px] font-bold text-emerald-600 bg-emerald-50 px-2.5 py-1 rounded-full border border-emerald-100">
                                            <Check size={10} /> {app.status}
                                        </span>
                                    ) : (
                                        <button className="text-[10px] font-bold text-blue-600 bg-blue-50 px-3 py-1 rounded-full border border-blue-100 hover:bg-blue-100 transition-colors">
                                            Connect
                                        </button>
                                    )}
                                </div>
                                <div className="flex-1">
                                    <div className="flex items-center gap-2 mb-2">
                                        <h3 className="font-bold text-slate-800">{app.name}</h3>
                                        <span className="text-[9px] font-bold uppercase tracking-widest text-slate-400">{app.category}</span>
                                    </div>
                                    <p className="text-xs text-slate-500 leading-relaxed line-clamp-3">
                                        {app.description}
                                    </p>
                                </div>
                                <div className="mt-6 pt-6 border-t border-slate-50 flex items-center justify-between">
                                    <button className="text-[11px] font-bold text-slate-400 hover:text-slate-800 flex items-center gap-1">
                                        View Settings <ExternalLink size={12} />
                                    </button>
                                    {app.status === "Connected" && (
                                        <button className="text-[11px] font-bold text-red-400 hover:text-red-600">
                                            Disconnect
                                        </button>
                                    )}
                                </div>
                            </div>
                        ))}
                        
                        {/* Custom Webhook Card */}
                        <div className="bg-slate-900 rounded-3xl p-6 border border-slate-800 shadow-sm flex flex-col items-center justify-center text-center space-y-4 group cursor-pointer hover:bg-slate-800 transition-colors">
                            <div className="w-14 h-14 bg-white/10 rounded-2xl flex items-center justify-center">
                                <Plus size={24} className="text-white" />
                            </div>
                            <div>
                                <h3 className="font-bold text-white">Custom Webhook</h3>
                                <p className="text-xs text-slate-400 mt-1">Connect any service with HTTP webhooks</p>
                            </div>
                        </div>
                    </div>

                    {/* API Alert */}
                    <div className="bg-blue-50 rounded-2xl p-6 border border-blue-100 flex items-start gap-4">
                        <div className="w-10 h-10 bg-blue-100 rounded-xl flex items-center justify-center shrink-0">
                            <AlertCircle size={20} className="text-blue-600" />
                        </div>
                        <div>
                            <h4 className="font-bold text-blue-900 text-sm">Need a custom integration?</h4>
                            <p className="text-xs text-blue-700 mt-1 leading-relaxed">
                                Our Developer API allows you to build custom workflows and integrate LegalInspect into your proprietary software.
                                Access comprehensive documentation and SDKs in our Developer Portal.
                            </p>
                            <button className="mt-4 text-xs font-bold text-blue-800 flex items-center gap-1 hover:underline">
                                Visit Documentation <ChevronRight size={14} />
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
