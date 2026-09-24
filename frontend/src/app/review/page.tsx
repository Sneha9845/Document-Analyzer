"use client";

import React, { useState } from 'react';
import Sidebar from '../../components/Sidebar';
import { Upload, Eye, AlertTriangle, CheckCircle, ChevronRight, FileText, Zap, MessageSquare, ThumbsUp, ThumbsDown, RotateCcw } from 'lucide-react';

const CLAUSES = [
  { id: 1, title: "Indemnification Clause", text: "Party A shall indemnify, defend, and hold harmless Party B and its affiliates, officers, directors, employees, agents, and successors from and against any and all claims, damages, losses, costs, and expenses (including reasonable attorneys' fees) arising out of or related to any breach of this Agreement by Party A.", risk: "High", suggestion: "Narrow the scope — consider mutual indemnification and cap total liability at contract value.", category: "Liability" },
  { id: 2, title: "Intellectual Property Assignment", text: "All work product, inventions, discoveries, improvements, and other intellectual property created by Party A during the term of this Agreement shall be deemed work-made-for-hire and shall be the exclusive property of Party B.", risk: "Medium", suggestion: "Clarify whether pre-existing IP is excluded. Add carve-out for inventions unrelated to the engagement.", category: "IP Rights" },
  { id: 3, title: "Non-Compete Covenant", text: "For a period of two (2) years following termination of this Agreement for any reason, Party A shall not directly or indirectly engage in any business activity that competes with Party B's business within the Territory.", risk: "High", suggestion: "2-year restriction may be unenforceable in CA/UK. Consider reducing to 12 months and narrowing the Territory definition.", category: "Restrictions" },
  { id: 4, title: "Force Majeure", text: "Neither party shall be liable for any delay or failure to perform its obligations under this Agreement to the extent such delay or failure is caused by circumstances beyond its reasonable control, including but not limited to acts of God, war, terrorism, or natural disasters.", risk: "Low", suggestion: "Consider explicitly including pandemic/epidemic and supply chain disruptions for broader coverage.", category: "Risk Allocation" },
  { id: 5, title: "Limitation of Liability", text: "In no event shall either party be liable to the other for any indirect, incidental, consequential, special, or punitive damages, even if advised of the possibility of such damages.", risk: "Medium", suggestion: "Ensure carve-outs exist for gross negligence and willful misconduct to protect against bad-faith conduct.", category: "Liability" },
  { id: 6, title: "Governing Law & Jurisdiction", text: "This Agreement shall be governed by and construed in accordance with the laws of the State of Delaware, without regard to conflict of laws principles. Any disputes shall be resolved exclusively in the courts of Delaware.", risk: "Low", suggestion: "Clause is standard and enforceable. Consider adding arbitration as a faster alternative dispute mechanism.", category: "Dispute Resolution" },
];

const RISK_COLOR: Record<string, { bg: string; text: string; border: string; dot: string }> = {
  "High": { bg: "bg-red-50", text: "text-red-700", border: "border-red-200", dot: "bg-red-500" },
  "Medium": { bg: "bg-amber-50", text: "text-amber-700", border: "border-amber-200", dot: "bg-amber-500" },
  "Low": { bg: "bg-emerald-50", text: "text-emerald-700", border: "border-emerald-200", dot: "bg-emerald-500" },
};

export default function ReviewPage() {
  const [active, setActive] = useState(CLAUSES[0]);
  const [filter, setFilter] = useState('All');
  const [uploaded, setUploaded] = useState(false);
  const [feedback, setFeedback] = useState<Record<number, 'up' | 'down' | null>>({});

  const filtered = CLAUSES.filter(c => filter === 'All' || c.risk === filter);

  if (!uploaded) {
    return (
      <div className="min-h-screen bg-[#f3f4f6] font-sans flex text-slate-900">
        <Sidebar />
        <div className="flex-1 flex flex-col h-screen overflow-y-auto">
          <div className="bg-white/70 backdrop-blur-md sticky top-0 z-10 px-8 py-5 border-b border-slate-200">
            <h1 className="text-xl font-bold tracking-tight text-slate-800">Smart Review</h1>
            <p className="text-xs text-slate-500 mt-0.5">AI-powered clause-by-clause contract analysis</p>
          </div>
          <div className="flex-1 flex items-center justify-center p-8">
            <div className="max-w-lg w-full text-center space-y-6">
              <div className="relative group">
                <div className="absolute -inset-1 bg-gradient-to-r from-blue-500 to-emerald-500 rounded-3xl blur opacity-20 group-hover:opacity-40 transition duration-700"></div>
                <div className="relative bg-white rounded-3xl p-12 border border-slate-100 shadow-sm">
                  <div className="w-16 h-16 bg-gradient-to-br from-blue-100 to-emerald-100 rounded-2xl flex items-center justify-center mx-auto mb-6">
                    <FileText size={32} className="text-blue-600" />
                  </div>
                  <h2 className="text-2xl font-bold text-slate-800 mb-2">Upload for Smart Review</h2>
                  <p className="text-slate-500 text-sm mb-8">Our AI will read every clause, flag risks, and suggest rewrites in seconds.</p>
                  <div className="grid grid-cols-3 gap-3 mb-8 text-left">
                    {[["Clause Detection", "Auto-identify all key clauses"], ["Risk Scoring", "High/Medium/Low per clause"], ["AI Suggestions", "Rewrite recommendations"]].map(([t, d]) => (
                      <div key={t} className="bg-slate-50 rounded-xl p-3 border border-slate-100">
                        <div className="w-6 h-6 bg-blue-100 rounded-lg flex items-center justify-center mb-2"><Zap size={12} className="text-blue-600" /></div>
                        <p className="text-xs font-semibold text-slate-700">{t}</p>
                        <p className="text-[11px] text-slate-400 mt-0.5">{d}</p>
                      </div>
                    ))}
                  </div>
                  <label className="cursor-pointer w-full flex items-center justify-center gap-2 bg-slate-900 text-white font-semibold py-3.5 px-6 rounded-xl hover:bg-slate-700 transition-colors">
                    <Upload size={16} /> Upload Contract
                    <input type="file" className="hidden" onChange={() => setUploaded(true)} />
                  </label>
                  <button onClick={() => setUploaded(true)} className="mt-3 w-full text-sm text-blue-600 hover:underline font-medium">Use demo document →</button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#f3f4f6] font-sans flex text-slate-900">
      <Sidebar />
      <div className="flex-1 flex flex-col h-screen overflow-y-auto">
        <div className="bg-white/70 backdrop-blur-md sticky top-0 z-10 px-8 py-5 border-b border-slate-200 flex justify-between items-center">
          <div>
            <h1 className="text-xl font-bold tracking-tight text-slate-800">Smart Review</h1>
            <p className="text-xs text-slate-500 mt-0.5">Master Services Agreement · 84 pages · 6 clauses flagged</p>
          </div>
          <div className="flex items-center gap-3">
            <button onClick={() => setUploaded(false)} className="flex items-center gap-2 text-xs text-slate-600 border border-slate-200 rounded-xl px-4 py-2 hover:bg-slate-50 transition-colors"><RotateCcw size={13} /> New Document</button>
            <button className="flex items-center gap-2 bg-slate-900 text-white px-5 py-2.5 rounded-xl text-sm font-semibold hover:bg-slate-700 transition-colors">Export Report</button>
          </div>
        </div>

        <div className="flex gap-0 flex-1 overflow-hidden" style={{ height: 'calc(100vh - 81px)' }}>
          {/* Clause List */}
          <div className="w-80 bg-white border-r border-slate-100 flex flex-col overflow-hidden shrink-0">
            <div className="p-4 border-b border-slate-100">
              <div className="flex gap-1 bg-slate-100 rounded-lg p-1">
                {['All', 'High', 'Medium', 'Low'].map(f => (
                  <button key={f} onClick={() => setFilter(f)} className={`flex-1 text-xs py-1.5 rounded-md font-medium transition-all ${filter === f ? 'bg-white shadow text-slate-800' : 'text-slate-500 hover:text-slate-700'}`}>{f}</button>
                ))}
              </div>
            </div>
            <div className="overflow-y-auto flex-1 divide-y divide-slate-50">
              {filtered.map(c => (
                <button key={c.id} onClick={() => setActive(c)} className={`w-full text-left p-4 hover:bg-slate-50 transition-colors ${active.id === c.id ? 'bg-blue-50/50 border-l-2 border-blue-500' : ''}`}>
                  <div className="flex items-center justify-between mb-1.5">
                    <span className="text-xs font-medium text-slate-400">{c.category}</span>
                    <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${RISK_COLOR[c.risk].bg} ${RISK_COLOR[c.risk].text}`}>{c.risk}</span>
                  </div>
                  <p className="text-sm font-semibold text-slate-800 leading-tight">{c.title}</p>
                  <p className="text-xs text-slate-500 mt-1 line-clamp-2">{c.text.substring(0, 80)}…</p>
                </button>
              ))}
            </div>
          </div>

          {/* Clause Detail */}
          <div className="flex-1 overflow-y-auto p-8 space-y-6">
            {/* Original Text */}
            <div className="bg-white rounded-2xl p-6 border border-slate-100 shadow-sm">
              <div className="flex items-center justify-between mb-4">
                <div>
                  <span className="text-xs font-medium text-slate-400 uppercase tracking-wide">{active.category}</span>
                  <h2 className="text-lg font-bold text-slate-800">{active.title}</h2>
                </div>
                <span className={`flex items-center gap-1.5 text-xs font-bold px-3 py-1.5 rounded-full border ${RISK_COLOR[active.risk].bg} ${RISK_COLOR[active.risk].text} ${RISK_COLOR[active.risk].border}`}>
                  <div className={`w-1.5 h-1.5 rounded-full ${RISK_COLOR[active.risk].dot}`}></div>
                  {active.risk} Risk
                </span>
              </div>
              <div className="bg-slate-50 rounded-xl p-4 border border-slate-200">
                <p className="text-xs font-bold text-slate-400 uppercase tracking-wide mb-2">Original Text</p>
                <p className="text-sm text-slate-700 leading-relaxed">{active.text}</p>
              </div>
            </div>

            {/* AI Suggestion */}
            <div className="bg-white rounded-2xl p-6 border border-slate-100 shadow-sm">
              <div className="flex items-center gap-2 mb-4">
                <div className="w-7 h-7 bg-blue-100 rounded-lg flex items-center justify-center"><Zap size={14} className="text-blue-600" /></div>
                <h3 className="font-semibold text-slate-800">AI Analysis & Recommendation</h3>
              </div>
              <div className="bg-blue-50 border border-blue-100 rounded-xl p-4 mb-4">
                <p className="text-sm text-blue-800 leading-relaxed">{active.suggestion}</p>
              </div>

              {active.risk !== 'Low' && (
                <div className="bg-amber-50 border border-amber-200 rounded-xl p-4 flex gap-3">
                  <AlertTriangle size={16} className="text-amber-600 shrink-0 mt-0.5" />
                  <div>
                    <p className="text-xs font-bold text-amber-800 mb-1">Action Required</p>
                    <p className="text-xs text-amber-700">This clause has been flagged for attorney review before signing. Consider negotiating revised language.</p>
                  </div>
                </div>
              )}
              {active.risk === 'Low' && (
                <div className="bg-emerald-50 border border-emerald-200 rounded-xl p-4 flex gap-3">
                  <CheckCircle size={16} className="text-emerald-600 shrink-0 mt-0.5" />
                  <p className="text-xs text-emerald-700">This clause is standard and appears enforceable. Minor optimizations available but not critical.</p>
                </div>
              )}

              <div className="flex items-center gap-3 mt-4 pt-4 border-t border-slate-100">
                <span className="text-xs text-slate-500">Was this helpful?</span>
                <button onClick={() => setFeedback(p => ({...p, [active.id]: 'up'}))} className={`flex items-center gap-1 text-xs px-3 py-1.5 rounded-lg border transition-colors ${feedback[active.id] === 'up' ? 'bg-emerald-50 border-emerald-200 text-emerald-700' : 'border-slate-200 text-slate-500 hover:bg-slate-50'}`}><ThumbsUp size={12} /> Yes</button>
                <button onClick={() => setFeedback(p => ({...p, [active.id]: 'down'}))} className={`flex items-center gap-1 text-xs px-3 py-1.5 rounded-lg border transition-colors ${feedback[active.id] === 'down' ? 'bg-red-50 border-red-200 text-red-700' : 'border-slate-200 text-slate-500 hover:bg-slate-50'}`}><ThumbsDown size={12} /> No</button>
              </div>
            </div>

            {/* Navigation */}
            <div className="flex justify-between">
              <button onClick={() => { const idx = CLAUSES.findIndex(c => c.id === active.id); if (idx > 0) setActive(CLAUSES[idx - 1]); }} className="flex items-center gap-2 text-sm text-slate-600 border border-slate-200 rounded-xl px-5 py-2.5 hover:bg-slate-50 transition-colors">← Previous Clause</button>
              <button onClick={() => { const idx = CLAUSES.findIndex(c => c.id === active.id); if (idx < CLAUSES.length - 1) setActive(CLAUSES[idx + 1]); }} className="flex items-center gap-2 text-sm text-slate-900 bg-slate-900 text-white rounded-xl px-5 py-2.5 hover:bg-slate-700 transition-colors font-semibold">Next Clause <ChevronRight size={16} /></button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
