"use client";

import React, { useState } from 'react';
import Sidebar from '../../components/Sidebar';
import { 
    FileText, 
    Search, 
    Download, 
    Eye, 
    Star, 
    Clock, 
    Folder, 
    ChevronRight,
    FilePlus,
    Filter
} from 'lucide-react';

const FORM_TEMPLATES = [
    { id: 1, title: "Non-Disclosure Agreement (NDA)", category: "General Business", popular: true, lastUsed: "2 days ago", description: "Standard mutual or one-way confidentiality agreement for business discussions." },
    { id: 2, title: "Master Services Agreement (MSA)", category: "Service Contracts", popular: true, lastUsed: "1 week ago", description: "Comprehensive framework for ongoing professional services and deliverables." },
    { id: 3, title: "Software License Agreement", category: "Technology", popular: false, lastUsed: "3 weeks ago", description: "End-user license agreement (EULA) for software products and SaaS." },
    { id: 4, title: "Employment Offer Letter", category: "Human Resources", popular: true, lastUsed: "Yesterday", description: "Standard offer of employment including compensation, benefits, and at-will status." },
    { id: 5, title: "Intellectual Property Assignment", category: "Technology", popular: false, lastUsed: "1 month ago", description: "Transfer of ownership for inventions, code, designs, and other creative works." },
    { id: 6, title: "Independent Contractor Agreement", category: "Service Contracts", popular: true, lastUsed: "4 days ago", description: "Agreement for hiring freelancers or external consultants for specific projects." },
    { id: 7, title: "Website Terms of Service", category: "Compliance", popular: false, lastUsed: "2 months ago", description: "Legal terms governing the use of a public website or web application." },
    { id: 8, title: "Privacy Policy (GDPR/CCPA)", category: "Compliance", popular: true, lastUsed: "10 days ago", description: "Legally required disclosure of data collection, use, and sharing practices." },
];

const CATEGORIES = ["All Categories", "General Business", "Service Contracts", "Technology", "Human Resources", "Compliance"];

export default function LegalFormsPage() {
    const [searchQuery, setSearchQuery] = useState('');
    const [selectedCategory, setSelectedCategory] = useState('All Categories');

    const filteredForms = FORM_TEMPLATES.filter(form => {
        const matchesSearch = form.title.toLowerCase().includes(searchQuery.toLowerCase()) || 
                             form.description.toLowerCase().includes(searchQuery.toLowerCase());
        const matchesCategory = selectedCategory === 'All Categories' || form.category === selectedCategory;
        return matchesSearch && matchesCategory;
    });

    return (
        <div className="min-h-screen bg-[#f3f4f6] font-sans flex text-slate-900">
            <Sidebar />
            <div className="flex-1 flex flex-col h-screen overflow-y-auto">
                {/* Header */}
                <div className="bg-white/70 backdrop-blur-md sticky top-0 z-10 px-8 py-5 border-b border-slate-200 flex justify-between items-center">
                    <div>
                        <h1 className="text-xl font-bold tracking-tight text-slate-800">Legal Forms & Templates</h1>
                        <p className="text-xs text-slate-500 mt-0.5">Access and customize pre-approved legal documents</p>
                    </div>
                    <button className="flex items-center gap-2 bg-slate-900 text-white px-5 py-2.5 rounded-xl text-sm font-semibold hover:bg-slate-700 transition-colors">
                        <FilePlus size={16} /> Create Custom Form
                    </button>
                </div>

                <div className="p-8 space-y-8">
                    {/* Search and Filters */}
                    <div className="bg-white rounded-2xl p-6 border border-slate-100 shadow-sm flex flex-col md:flex-row gap-4 items-center">
                        <div className="relative flex-1 w-full">
                            <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 w-5 h-5" />
                            <input 
                                type="text" 
                                placeholder="Search templates..." 
                                className="w-full pl-12 pr-4 py-3 border border-slate-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 bg-slate-50"
                                value={searchQuery}
                                onChange={(e) => setSearchQuery(e.target.value)}
                            />
                        </div>
                        <div className="flex items-center gap-3 w-full md:w-auto">
                            <Filter size={18} className="text-slate-400" />
                            <select 
                                className="bg-white border border-slate-200 rounded-xl px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 min-w-[200px]"
                                value={selectedCategory}
                                onChange={(e) => setSelectedCategory(e.target.value)}
                            >
                                {CATEGORIES.map(cat => <option key={cat} value={cat}>{cat}</option>)}
                            </select>
                        </div>
                    </div>

                    {/* Quick Access Grid */}
                    {!searchQuery && selectedCategory === 'All Categories' && (
                        <div className="space-y-4">
                            <h2 className="text-sm font-bold text-slate-500 uppercase tracking-wider flex items-center gap-2">
                                <Star size={14} className="text-amber-500 fill-amber-500" /> Popular Templates
                            </h2>
                            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                                {FORM_TEMPLATES.filter(f => f.popular).slice(0, 4).map(form => (
                                    <div key={form.id} className="bg-white rounded-2xl p-5 border border-slate-100 shadow-sm hover:shadow-md transition-all group cursor-pointer">
                                        <div className="w-10 h-10 bg-blue-50 rounded-xl flex items-center justify-center mb-4 group-hover:bg-blue-500 transition-colors">
                                            <FileText size={20} className="text-blue-500 group-hover:text-white" />
                                        </div>
                                        <h3 className="font-bold text-slate-800 text-sm mb-1 line-clamp-1">{form.title}</h3>
                                        <p className="text-[11px] text-slate-400 mb-4">{form.category}</p>
                                        <div className="flex items-center justify-between mt-auto">
                                            <span className="text-[10px] font-medium text-slate-400 flex items-center gap-1">
                                                <Clock size={10} /> {form.lastUsed}
                                            </span>
                                            <ChevronRight size={14} className="text-slate-300 group-hover:text-slate-600 group-hover:translate-x-1 transition-all" />
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>
                    )}

                    {/* All Templates List/Grid */}
                    <div className="space-y-4">
                        <div className="flex items-center justify-between">
                            <h2 className="text-sm font-bold text-slate-500 uppercase tracking-wider flex items-center gap-2">
                                <Folder size={14} className="text-slate-400" /> {selectedCategory === 'All Categories' ? 'All Templates' : selectedCategory}
                            </h2>
                            <span className="text-xs text-slate-400 font-medium">{filteredForms.length} templates found</span>
                        </div>
                        
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            {filteredForms.map(form => (
                                <div key={form.id} className="bg-white rounded-2xl p-6 border border-slate-100 shadow-sm flex gap-5 hover:border-blue-200 transition-colors">
                                    <div className="w-14 h-14 bg-slate-50 rounded-2xl flex items-center justify-center shrink-0">
                                        <FileText size={28} className="text-slate-400" />
                                    </div>
                                    <div className="flex-1">
                                        <div className="flex justify-between items-start mb-1">
                                            <h3 className="font-bold text-slate-800">{form.title}</h3>
                                            <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-slate-100 text-slate-500 uppercase">{form.category}</span>
                                        </div>
                                        <p className="text-xs text-slate-500 leading-relaxed mb-4">{form.description}</p>
                                        <div className="flex items-center gap-3">
                                            <button className="flex items-center gap-1.5 text-xs font-bold text-blue-600 bg-blue-50 px-3 py-1.5 rounded-lg hover:bg-blue-100 transition-colors">
                                                <Eye size={14} /> Preview
                                            </button>
                                            <button className="flex items-center gap-1.5 text-xs font-bold text-slate-700 bg-slate-100 px-3 py-1.5 rounded-lg hover:bg-slate-200 transition-colors">
                                                <Download size={14} /> Download (.docx)
                                            </button>
                                        </div>
                                    </div>
                                </div>
                            ))}
                        </div>

                        {filteredForms.length === 0 && (
                            <div className="bg-white rounded-3xl p-16 border border-dashed border-slate-200 text-center">
                                <div className="w-16 h-16 bg-slate-50 rounded-full flex items-center justify-center mx-auto mb-4">
                                    <Search size={24} className="text-slate-300" />
                                </div>
                                <h3 className="text-slate-800 font-bold">No templates found</h3>
                                <p className="text-slate-500 text-sm mt-1">Try adjusting your search or category filters.</p>
                                <button 
                                    onClick={() => {setSearchQuery(''); setSelectedCategory('All Categories');}}
                                    className="mt-4 text-blue-600 text-sm font-bold hover:underline"
                                >
                                    Reset all filters
                                </button>
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
}
