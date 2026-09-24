"use client";

import React, { useState } from 'react';
import Sidebar from '../../components/Sidebar';
import { ShieldCheck, AlertTriangle, CheckCircle, XCircle, ChevronDown, RefreshCw, Download } from 'lucide-react';

const REGULATIONS = [
  { name: "GDPR", region: "EU", status: "Compliant", score: 94, lastAudit: "May 1, 2024", items: [
    { check: "Data Processing Agreement in place", pass: true },
    { check: "Privacy notices updated", pass: true },
    { check: "Data retention policy defined", pass: true },
    { check: "DPO appointed and documented", pass: false },
    { check: "Cross-border transfer safeguards", pass: true },
  ]},
  { name: "CCPA", region: "California, USA", status: "Partial", score: 71, lastAudit: "Apr 18, 2024", items: [
    { check: "Consumer rights portal live", pass: false },
    { check: "Do Not Sell notice published", pass: true },
    { check: "Third-party data inventory", pass: false },
    { check: "Privacy policy updated", pass: true },
    { check: "Employee training completed", pass: true },
  ]},
  { name: "SOX", region: "USA", status: "Compliant", score: 89, lastAudit: "Mar 30, 2024", items: [
    { check: "Internal controls documented", pass: true },
    { check: "Audit trail enabled", pass: true },
    { check: "Financial reporting controls tested", pass: true },
    { check: "Management assessment complete", pass: true },
    { check: "External auditor sign-off", pass: false },
  ]},
  { name: "HIPAA", region: "USA (Healthcare)", status: "Non-Compliant", score: 41, lastAudit: "Apr 5, 2024", items: [
    { check: "Business Associate Agreements signed", pass: false },
    { check: "PHI access controls in place", pass: true },
    { check: "Breach notification procedure", pass: false },
    { check: "Workforce training completed", pass: false },
    { check: "Risk analysis performed", pass: true },
  ]},
];

const STATUS_CONFIG: Record<string, { color: string; bg: string; icon: React.ReactNode }> = {
  "Compliant": { color: "text-emerald-700", bg: "bg-emerald-50 border-emerald-200", icon: <CheckCircle size={14} className="text-emerald-600" /> },
  "Partial": { color: "text-amber-700", bg: "bg-amber-50 border-amber-200", icon: <AlertTriangle size={14} className="text-amber-600" /> },
  "Non-Compliant": { color: "text-red-700", bg: "bg-red-50 border-red-200", icon: <XCircle size={14} className="text-red-600" /> },
};

export default function CompliancePage() {
  const [expanded, setExpanded] = useState<string | null>("GDPR");

  const overallScore = Math.round(REGULATIONS.reduce((a, r) => a + r.score, 0) / REGULATIONS.length);

  return (
    <div className="min-h-screen bg-[#f3f4f6] font-sans flex text-slate-900">
      <Sidebar />
      <div className="flex-1 flex flex-col h-screen overflow-y-auto">
        <div className="bg-white/70 backdrop-blur-md sticky top-0 z-10 px-8 py-5 border-b border-slate-200 flex justify-between items-center">
          <div>
            <h1 className="text-xl font-bold tracking-tight text-slate-800">Compliance View</h1>
            <p className="text-xs text-slate-500 mt-0.5">Regulatory compliance tracking across all jurisdictions</p>
          </div>
          <div className="flex gap-3">
            <button className="flex items-center gap-2 text-xs text-slate-600 border border-slate-200 rounded-xl px-4 py-2.5 hover:bg-slate-50 transition-colors"><RefreshCw size={13} /> Run Audit</button>
            <button className="flex items-center gap-2 bg-slate-900 text-white px-5 py-2.5 rounded-xl text-sm font-semibold hover:bg-slate-700 transition-colors"><Download size={14} /> Export Report</button>
          </div>
        </div>

        <div className="p-8 space-y-6">
          {/* Overall Score */}
          <div className="grid grid-cols-4 gap-4">
            <div className="col-span-1 bg-white rounded-2xl p-6 border border-slate-100 shadow-sm flex flex-col items-center justify-center text-center">
              <div className="relative w-28 h-28 mb-3">
                <svg className="w-28 h-28 -rotate-90" viewBox="0 0 100 100">
                  <circle cx="50" cy="50" r="40" fill="none" stroke="#f1f5f9" strokeWidth="10" />
                  <circle cx="50" cy="50" r="40" fill="none" stroke={overallScore >= 80 ? '#10b981' : overallScore >= 60 ? '#f59e0b' : '#ef4444'} strokeWidth="10" strokeDasharray={`${overallScore * 2.51} 251`} strokeLinecap="round" />
                </svg>
                <div className="absolute inset-0 flex flex-col items-center justify-center">
                  <span className="text-3xl font-black text-slate-800">{overallScore}</span>
                  <span className="text-[10px] text-slate-400 font-medium">/ 100</span>
                </div>
              </div>
              <p className="text-sm font-semibold text-slate-700">Overall Compliance</p>
              <p className="text-xs text-slate-400 mt-1">Across {REGULATIONS.length} frameworks</p>
            </div>
            <div className="col-span-3 grid grid-cols-3 gap-4">
              {[
                { label: "Fully Compliant", value: REGULATIONS.filter(r => r.status === "Compliant").length, color: "emerald" },
                { label: "Partial Compliance", value: REGULATIONS.filter(r => r.status === "Partial").length, color: "amber" },
                { label: "Non-Compliant", value: REGULATIONS.filter(r => r.status === "Non-Compliant").length, color: "red" },
                { label: "Checks Passing", value: REGULATIONS.flatMap(r => r.items).filter(i => i.pass).length, color: "blue" },
                { label: "Checks Failing", value: REGULATIONS.flatMap(r => r.items).filter(i => !i.pass).length, color: "red" },
                { label: "Frameworks Tracked", value: REGULATIONS.length, color: "slate" },
              ].map(s => (
                <div key={s.label} className="bg-white rounded-xl p-5 border border-slate-100 shadow-sm">
                  <p className="text-xs text-slate-500 font-medium mb-2">{s.label}</p>
                  <p className={`text-3xl font-black ${s.color === 'emerald' ? 'text-emerald-600' : s.color === 'amber' ? 'text-amber-600' : s.color === 'red' ? 'text-red-600' : s.color === 'blue' ? 'text-blue-600' : 'text-slate-800'}`}>{s.value}</p>
                </div>
              ))}
            </div>
          </div>

          {/* Regulation Cards */}
          <div className="space-y-3">
            {REGULATIONS.map(reg => (
              <div key={reg.name} className="bg-white rounded-2xl border border-slate-100 shadow-sm overflow-hidden">
                <button
                  className="w-full flex items-center justify-between px-6 py-5 hover:bg-slate-50/50 transition-colors"
                  onClick={() => setExpanded(expanded === reg.name ? null : reg.name)}
                >
                  <div className="flex items-center gap-4">
                    <div className="w-10 h-10 bg-slate-100 rounded-xl flex items-center justify-center"><ShieldCheck size={20} className="text-slate-600" /></div>
                    <div className="text-left">
                      <div className="flex items-center gap-3">
                        <h3 className="font-bold text-slate-800">{reg.name}</h3>
                        <span className={`text-[11px] font-semibold px-2.5 py-0.5 rounded-full border flex items-center gap-1.5 ${STATUS_CONFIG[reg.status].bg} ${STATUS_CONFIG[reg.status].color}`}>
                          {STATUS_CONFIG[reg.status].icon}{reg.status}
                        </span>
                      </div>
                      <p className="text-xs text-slate-500">{reg.region} · Last audit: {reg.lastAudit}</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-6">
                    <div className="text-right">
                      <p className={`text-2xl font-black ${reg.score >= 80 ? 'text-emerald-600' : reg.score >= 60 ? 'text-amber-600' : 'text-red-600'}`}>{reg.score}%</p>
                      <div className="w-32 h-1.5 bg-slate-100 rounded-full mt-1.5 overflow-hidden">
                        <div className={`h-full rounded-full ${reg.score >= 80 ? 'bg-emerald-400' : reg.score >= 60 ? 'bg-amber-400' : 'bg-red-400'}`} style={{ width: `${reg.score}%` }} />
                      </div>
                    </div>
                    <ChevronDown size={18} className={`text-slate-400 transition-transform ${expanded === reg.name ? 'rotate-180' : ''}`} />
                  </div>
                </button>
                {expanded === reg.name && (
                  <div className="px-6 pb-5 border-t border-slate-100">
                    <div className="grid grid-cols-1 gap-2 mt-4">
                      {reg.items.map((item, i) => (
                        <div key={i} className={`flex items-center gap-3 p-3 rounded-xl ${item.pass ? 'bg-emerald-50' : 'bg-red-50'}`}>
                          {item.pass ? <CheckCircle size={16} className="text-emerald-500 shrink-0" /> : <XCircle size={16} className="text-red-500 shrink-0" />}
                          <span className={`text-sm ${item.pass ? 'text-emerald-800' : 'text-red-800'}`}>{item.check}</span>
                          {!item.pass && <span className="ml-auto text-xs font-semibold text-red-600 bg-red-100 px-2.5 py-0.5 rounded-full border border-red-200">Action Required</span>}
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
