"use client";

import React, { useState } from 'react';
import Sidebar from '../../components/Sidebar';
import { 
    HelpCircle, 
    Search, 
    Book, 
    MessageSquare, 
    Mail, 
    FileText, 
    ChevronRight, 
    ExternalLink, 
    Zap, 
    PlayCircle,
    MessageCircle
} from 'lucide-react';

const FAQS = [
    { q: "How accurate is the AI in detecting legal risks?", a: "LegalInspect uses state-of-the-art LLMs (Claude 3.5, GPT-4o) combined with a proprietary legal knowledge graph. While highly accurate, we always recommend a final review by a qualified attorney for critical decisions." },
    { q: "Can I customize the risk parameters?", a: "Yes, in the Settings > Analysis module, you can adjust risk sensitivity and define specific keywords or clauses that should always be flagged." },
    { q: "Which document formats are supported?", a: "Currently, we support PDF, DOCX, and TXT files. OCR is automatically performed on scanned PDFs to ensure all text is analyzed." },
    { q: "Is my data secure and confidential?", a: "Data security is our top priority. All documents are encrypted at rest and in transit. We do not use your private contracts to train public models." },
    { q: "How do I integrate with our existing CRM?", a: "Visit the Integrations page to see native connectors for Salesforce, Slack, and Google Drive. For custom needs, you can use our REST API." }
];

export default function SupportPage() {
    const [searchQuery, setSearchQuery] = useState('');
    const [openFaq, setOpenFaq] = useState<number | null>(0);

    return (
        <div className="min-h-screen bg-[#f3f4f6] font-sans flex text-slate-900">
            <Sidebar />
            <div className="flex-1 flex flex-col h-screen overflow-y-auto">
                {/* Hero Header */}
                <div className="bg-slate-900 text-white p-12 relative overflow-hidden shrink-0">
                    <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-blue-600/20 rounded-full blur-[120px] -translate-y-1/2 translate-x-1/4"></div>
                    <div className="relative z-10 max-w-2xl">
                        <h1 className="text-4xl font-black mb-4">How can we help you?</h1>
                        <p className="text-slate-400 text-lg mb-8">Search our knowledge base or contact our support team for specialized assistance.</p>
                        
                        <div className="relative">
                            <Search className="absolute left-5 top-1/2 -translate-y-1/2 text-slate-400 w-5 h-5" />
                            <input 
                                type="text" 
                                placeholder="Search for articles, guides, and tutorials..." 
                                className="w-full pl-14 pr-6 py-4 bg-white/10 backdrop-blur-md border border-white/10 rounded-2xl text-white focus:outline-none focus:ring-2 focus:ring-blue-500 placeholder:text-slate-500 transition-all"
                                value={searchQuery}
                                onChange={(e) => setSearchQuery(e.target.value)}
                            />
                        </div>
                    </div>
                </div>

                <div className="p-8 space-y-12">
                    {/* Quick Resource Grid */}
                    <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                        {[
                            { icon: <Book className="text-blue-500" />, label: "Documentation", desc: "Detailed API & user guides", color: "bg-blue-50" },
                            { icon: <PlayCircle className="text-purple-500" />, label: "Video Tutorials", desc: "Learn the basics in minutes", color: "bg-purple-50" },
                            { icon: <Zap className="text-amber-500" />, label: "Best Practices", desc: "Tips for better legal reviews", color: "bg-amber-50" },
                            { icon: <MessageCircle className="text-emerald-500" />, label: "Community", desc: "Discuss with other legal pros", color: "bg-emerald-50" },
                        ].map(item => (
                            <button key={item.label} className="bg-white rounded-2xl p-6 border border-slate-100 shadow-sm hover:shadow-md hover:border-blue-100 transition-all text-left group">
                                <div className={`w-12 h-12 ${item.color} rounded-xl flex items-center justify-center mb-4 group-hover:scale-110 transition-transform`}>
                                    {item.icon}
                                </div>
                                <h3 className="font-bold text-slate-800 text-sm mb-1">{item.label}</h3>
                                <p className="text-[11px] text-slate-500">{item.desc}</p>
                            </button>
                        ))}
                    </div>

                    <div className="grid grid-cols-1 lg:grid-cols-3 gap-12">
                        {/* FAQ Section */}
                        <div className="lg:col-span-2 space-y-6">
                            <div className="flex items-center justify-between">
                                <h2 className="text-xl font-black text-slate-800">Frequently Asked Questions</h2>
                                <button className="text-xs font-bold text-blue-600 hover:underline">View all FAQs</button>
                            </div>
                            
                            <div className="space-y-3">
                                {FAQS.map((faq, idx) => (
                                    <div key={idx} className="bg-white rounded-2xl border border-slate-100 shadow-sm overflow-hidden">
                                        <button 
                                            onClick={() => setOpenFaq(openFaq === idx ? null : idx)}
                                            className="w-full flex items-center justify-between px-6 py-4 hover:bg-slate-50 transition-colors text-left"
                                        >
                                            <span className="text-sm font-bold text-slate-700">{faq.q}</span>
                                            <ChevronRight size={18} className={`text-slate-400 transition-transform ${openFaq === idx ? "rotate-90" : ""}`} />
                                        </button>
                                        {openFaq === idx && (
                                            <div className="px-6 pb-4 border-t border-slate-50 pt-3">
                                                <p className="text-sm text-slate-500 leading-relaxed">{faq.a}</p>
                                            </div>
                                        )}
                                    </div>
                                ))}
                            </div>
                        </div>

                        {/* Contact Section */}
                        <div className="space-y-6">
                            <h2 className="text-xl font-black text-slate-800">Still need help?</h2>
                            
                            <div className="space-y-4">
                                <div className="bg-white rounded-2xl p-6 border border-slate-100 shadow-sm relative overflow-hidden group">
                                    <div className="absolute top-0 right-0 w-24 h-24 bg-blue-50 rounded-full blur-3xl -translate-y-1/2 translate-x-1/2 group-hover:scale-150 transition-transform"></div>
                                    <div className="w-10 h-10 bg-blue-50 rounded-xl flex items-center justify-center mb-4">
                                        <MessageSquare size={20} className="text-blue-500" />
                                    </div>
                                    <h3 className="font-bold text-slate-800 mb-1">Live Chat</h3>
                                    <p className="text-xs text-slate-500 mb-4">Available Mon-Fri, 9am - 6pm EST.</p>
                                    <button className="w-full py-2.5 bg-slate-900 text-white rounded-xl text-xs font-bold hover:bg-slate-700 transition-colors">
                                        Start Conversation
                                    </button>
                                </div>

                                <div className="bg-white rounded-2xl p-6 border border-slate-100 shadow-sm relative overflow-hidden group">
                                    <div className="absolute top-0 right-0 w-24 h-24 bg-emerald-50 rounded-full blur-3xl -translate-y-1/2 translate-x-1/2 group-hover:scale-150 transition-transform"></div>
                                    <div className="w-10 h-10 bg-emerald-50 rounded-xl flex items-center justify-center mb-4">
                                        <Mail size={20} className="text-emerald-500" />
                                    </div>
                                    <h3 className="font-bold text-slate-800 mb-1">Email Support</h3>
                                    <p className="text-xs text-slate-500 mb-4">Response time: Usually within 4 hours.</p>
                                    <button className="w-full py-2.5 border border-slate-200 text-slate-800 rounded-xl text-xs font-bold hover:bg-slate-50 transition-colors">
                                        Send an Email
                                    </button>
                                </div>

                                <div className="bg-slate-50 rounded-2xl p-6 border border-slate-200 border-dashed text-center">
                                    <FileText size={24} className="text-slate-300 mx-auto mb-3" />
                                    <h4 className="text-xs font-bold text-slate-800 mb-1">System Status</h4>
                                    <div className="flex items-center justify-center gap-2 mb-3">
                                        <div className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></div>
                                        <span className="text-[10px] font-bold text-emerald-600 uppercase">All Systems Operational</span>
                                    </div>
                                    <button className="text-[10px] text-blue-600 font-bold flex items-center gap-1 mx-auto hover:underline">
                                        View Status Page <ExternalLink size={10} />
                                    </button>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Footer Quote */}
                <div className="p-12 text-center text-slate-400 border-t border-slate-200 mt-auto">
                    <HelpCircle size={24} className="mx-auto mb-4 opacity-20" />
                    <p className="text-sm font-medium italic">"Empowering legal professionals through intelligent automation."</p>
                    <p className="text-xs mt-2 font-bold uppercase tracking-widest opacity-40">LegalInspect Elite v2.4.0</p>
                </div>
            </div>
        </div>
    );
}
