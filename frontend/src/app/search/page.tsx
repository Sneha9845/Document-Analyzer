"use client";

import React, { useState } from 'react';
import Sidebar from '../../components/Sidebar';
import { Search, Filter, BookOpen, Calendar, MapPin, ChevronRight, ExternalLink, Tag, Scale } from 'lucide-react';

const RESULTS = [
  { id: 1, title: "Smith v. Jones Enterprises LLC", citation: "2024 US App LEXIS 4821", court: "9th Circuit", date: "Mar 12, 2024", type: "Contract Dispute", relevance: 97, tags: ["Indemnity", "IP Rights"], summary: "Court ruled that broad indemnification clauses must be explicitly negotiated and cannot be implied from general contract language." },
  { id: 2, title: "DataCorp Inc. v. Nexus Systems", citation: "2023 Del. Ch. LEXIS 312", court: "Delaware Chancery", date: "Nov 8, 2023", type: "IP Licensing", relevance: 91, tags: ["License", "Non-compete"], summary: "Non-exclusive software license held unenforceable due to ambiguous scope of use provisions in SaaS agreement." },
  { id: 3, title: "Meridian Partners v. Global Tech", citation: "2024 UKSC 17", court: "UK Supreme Court", date: "Jan 22, 2024", type: "Employment", relevance: 88, tags: ["Termination", "Severance"], summary: "Implied duty of good faith applies to termination clauses even where contract is silent on the matter." },
  { id: 4, title: "Apex Holdings v. Frontier Capital", citation: "2023 NY Slip Op 5521", court: "NY Appellate", date: "Sep 3, 2023", type: "M&A", relevance: 84, tags: ["Representations", "Warranties"], summary: "Materiality scrape provisions must be clearly defined or risk-shifting intended by parties may be nullified." },
  { id: 5, title: "Chen v. Pacific Ventures Corp", citation: "2024 Cal. App. LEXIS 2191", court: "California Court of Appeals", date: "Feb 14, 2024", type: "Real Estate", relevance: 79, tags: ["Force Majeure", "Delay"], summary: "COVID-19 classified as force majeure event only where contract explicitly lists epidemic/pandemic as qualifying event." },
  { id: 6, title: "Blackstone Legal LLP v. Thornton", citation: "2023 EWHC 4402 (Comm)", court: "English Commercial Court", date: "Dec 1, 2023", type: "Professional Services", relevance: 74, tags: ["Liability Cap", "Negligence"], summary: "Liability caps in professional service agreements enforceable provided they are brought to client's attention pre-contract." },
];

const TYPES = ["All Types", "Contract Dispute", "IP Licensing", "Employment", "M&A", "Real Estate", "Professional Services"];
const COURTS = ["All Courts", "9th Circuit", "Delaware Chancery", "UK Supreme Court", "NY Appellate", "California Court of Appeals", "English Commercial Court"];

export default function SearchPage() {
  const [query, setQuery] = useState('');
  const [selectedType, setSelectedType] = useState('All Types');
  const [selectedCourt, setSelectedCourt] = useState('All Courts');
  const [searched, setSearched] = useState(false);

  const filtered = RESULTS.filter(r => {
    const matchQ = !query || r.title.toLowerCase().includes(query.toLowerCase()) || r.summary.toLowerCase().includes(query.toLowerCase()) || r.tags.some(t => t.toLowerCase().includes(query.toLowerCase()));
    const matchT = selectedType === 'All Types' || r.type === selectedType;
    const matchC = selectedCourt === 'All Courts' || r.court === selectedCourt;
    return matchQ && matchT && matchC;
  });

  const handleSearch = () => setSearched(true);

  return (
    <div className="min-h-screen bg-[#f3f4f6] font-sans flex text-slate-900">
      <Sidebar />
      <div className="flex-1 flex flex-col h-screen overflow-y-auto">
        {/* Header */}
        <div className="bg-white/70 backdrop-blur-md sticky top-0 z-10 px-8 py-5 border-b border-slate-200 flex justify-between items-center">
          <div>
            <h1 className="text-xl font-bold tracking-tight text-slate-800">Legal Search</h1>
            <p className="text-xs text-slate-500 mt-0.5">Search across global case law, statutes, and precedents</p>
          </div>
          <div className="flex items-center gap-3">
            <span className="text-xs text-slate-500 bg-slate-100 px-3 py-1.5 rounded-full font-medium">12,847 cases indexed</span>
          </div>
        </div>

        <div className="p-8 space-y-6">
          {/* Search Bar */}
          <div className="bg-white rounded-2xl p-6 border border-slate-100 shadow-sm">
            <div className="flex gap-3">
              <div className="relative flex-1">
                <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 w-5 h-5" />
                <input
                  type="text"
                  value={query}
                  onChange={e => setQuery(e.target.value)}
                  onKeyDown={e => e.key === 'Enter' && handleSearch()}
                  placeholder='Search cases, statutes, or legal concepts (e.g. "indemnity clause enforceability")'
                  className="w-full pl-12 pr-4 py-3.5 border border-slate-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 bg-slate-50"
                />
              </div>
              <button onClick={handleSearch} className="bg-slate-900 text-white px-8 py-3.5 rounded-xl text-sm font-semibold hover:bg-slate-700 transition-colors flex items-center gap-2">
                <Search size={16} /> Search
              </button>
            </div>

            {/* Filters */}
            <div className="flex gap-4 mt-4 flex-wrap">
              <div className="flex items-center gap-2">
                <Filter size={14} className="text-slate-400" />
                <span className="text-xs text-slate-500 font-medium">Filters:</span>
              </div>
              <select value={selectedType} onChange={e => setSelectedType(e.target.value)} className="text-xs border border-slate-200 rounded-lg px-3 py-1.5 bg-white text-slate-700 focus:outline-none focus:ring-1 focus:ring-blue-500">
                {TYPES.map(t => <option key={t}>{t}</option>)}
              </select>
              <select value={selectedCourt} onChange={e => setSelectedCourt(e.target.value)} className="text-xs border border-slate-200 rounded-lg px-3 py-1.5 bg-white text-slate-700 focus:outline-none focus:ring-1 focus:ring-blue-500">
                {COURTS.map(c => <option key={c}>{c}</option>)}
              </select>
              <button onClick={() => { setQuery(''); setSelectedType('All Types'); setSelectedCourt('All Courts'); }} className="text-xs text-blue-600 hover:underline">Clear all</button>
            </div>
          </div>

          {/* Quick Search Suggestions */}
          {!searched && (
            <div className="bg-white rounded-2xl p-6 border border-slate-100 shadow-sm">
              <h2 className="text-sm font-semibold text-slate-700 mb-4">Popular searches</h2>
              <div className="flex flex-wrap gap-2">
                {["Indemnification clauses", "Non-compete enforceability", "Force majeure COVID-19", "IP ownership work-for-hire", "Liquidated damages", "Termination for convenience", "GDPR data processing", "Warranty disclaimers"].map(s => (
                  <button key={s} onClick={() => { setQuery(s); setSearched(true); }} className="text-xs px-4 py-2 bg-slate-50 border border-slate-200 rounded-full text-slate-600 hover:bg-blue-50 hover:border-blue-200 hover:text-blue-700 transition-all">
                    {s}
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* Results */}
          {(searched || query) && (
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <h2 className="text-sm font-semibold text-slate-700">{filtered.length} results found</h2>
                <span className="text-xs text-slate-500">Sorted by relevance</span>
              </div>
              {filtered.length === 0 ? (
                <div className="bg-white rounded-2xl p-12 border border-slate-100 shadow-sm text-center">
                  <Scale size={40} className="mx-auto text-slate-300 mb-4" />
                  <p className="text-slate-500 text-sm">No cases found matching your criteria.</p>
                </div>
              ) : filtered.map(r => (
                <div key={r.id} className="bg-white rounded-2xl p-6 border border-slate-100 shadow-sm hover:shadow-md transition-shadow group">
                  <div className="flex items-start justify-between gap-4">
                    <div className="flex-1">
                      <div className="flex items-center gap-3 mb-2 flex-wrap">
                        <span className="text-xs bg-blue-50 text-blue-700 border border-blue-100 px-2.5 py-0.5 rounded-full font-medium">{r.type}</span>
                        {r.tags.map(tag => (
                          <span key={tag} className="text-xs bg-slate-50 text-slate-600 border border-slate-200 px-2.5 py-0.5 rounded-full flex items-center gap-1">
                            <Tag size={10} />{tag}
                          </span>
                        ))}
                      </div>
                      <h3 className="font-semibold text-slate-800 text-base group-hover:text-blue-700 transition-colors mb-1">{r.title}</h3>
                      <div className="flex items-center gap-4 text-xs text-slate-500 mb-3">
                        <span className="flex items-center gap-1"><BookOpen size={12} />{r.citation}</span>
                        <span className="flex items-center gap-1"><MapPin size={12} />{r.court}</span>
                        <span className="flex items-center gap-1"><Calendar size={12} />{r.date}</span>
                      </div>
                      <p className="text-sm text-slate-600 leading-relaxed">{r.summary}</p>
                    </div>
                    <div className="flex flex-col items-end gap-3 shrink-0">
                      <div className="text-center">
                        <div className="text-2xl font-black text-emerald-600">{r.relevance}%</div>
                        <div className="text-[10px] text-slate-400 font-medium">Relevance</div>
                      </div>
                      <button className="flex items-center gap-1 text-xs text-blue-600 hover:text-blue-800 font-medium">
                        Full Text <ExternalLink size={11} />
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}

          {/* Default state */}
          {!searched && !query && (
            <div className="grid grid-cols-3 gap-4">
              {[
                { label: "Recent Precedents", count: "284 new this month", color: "blue" },
                { label: "Statute Updates", count: "12 jurisdictions updated", color: "emerald" },
                { label: "AI-Curated Insights", count: "47 relevant to your cases", color: "purple" },
              ].map(c => (
                <div key={c.label} className="bg-white rounded-2xl p-6 border border-slate-100 shadow-sm">
                  <div className={`w-10 h-10 rounded-xl mb-4 flex items-center justify-center ${c.color === 'blue' ? 'bg-blue-50' : c.color === 'emerald' ? 'bg-emerald-50' : 'bg-purple-50'}`}>
                    <Scale size={20} className={c.color === 'blue' ? 'text-blue-500' : c.color === 'emerald' ? 'text-emerald-500' : 'text-purple-500'} />
                  </div>
                  <h3 className="font-semibold text-slate-800 text-sm mb-1">{c.label}</h3>
                  <p className="text-xs text-slate-500">{c.count}</p>
                  <button className="mt-4 text-xs text-blue-600 font-medium flex items-center gap-1 hover:gap-2 transition-all">Browse <ChevronRight size={12} /></button>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
