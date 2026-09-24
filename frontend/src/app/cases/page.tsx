"use client";

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import Sidebar from '../../components/Sidebar';
import { Briefcase, Plus, Search, Filter, ChevronDown, MoreHorizontal, AlertTriangle, CheckCircle, Clock, XCircle, User, Calendar } from 'lucide-react';

const CASES = [
  { id: "C-2024-001", name: "Meridian Tech v. Apex Holdings", type: "Contract Dispute", status: "Active", risk: "High", attorney: "Sarah Chen", deadline: "Jun 30, 2024", pages: 84, progress: 72 },
  { id: "C-2024-002", name: "Global IP Licensing Agreement", type: "IP Licensing", status: "Under Review", risk: "Medium", attorney: "James Park", deadline: "Jul 15, 2024", pages: 42, progress: 45 },
  { id: "C-2024-003", name: "DataStream Employment NDA", type: "Employment", status: "Completed", risk: "Low", attorney: "Emily Roberts", deadline: "May 1, 2024", pages: 18, progress: 100 },
  { id: "C-2024-004", name: "Frontier Capital M&A Due Diligence", type: "M&A", status: "Active", risk: "Critical", attorney: "Marcus Liu", deadline: "Aug 5, 2024", pages: 210, progress: 28 },
  { id: "C-2024-005", name: "Pacific Ventures Real Estate Lease", type: "Real Estate", status: "Pending", risk: "Low", attorney: "Sarah Chen", deadline: "Sep 1, 2024", pages: 36, progress: 10 },
  { id: "C-2024-006", name: "Thornton Professional Services Agreement", type: "Professional Services", status: "Under Review", risk: "Medium", attorney: "James Park", deadline: "Jul 28, 2024", pages: 22, progress: 60 },
  { id: "C-2024-007", name: "Nexus Systems Software License", type: "IP Licensing", status: "Active", risk: "High", attorney: "Emily Roberts", deadline: "Jun 15, 2024", pages: 58, progress: 83 },
  { id: "C-2024-008", name: "Chen Industries Supply Agreement", type: "Contract Dispute", status: "Completed", risk: "Low", attorney: "Marcus Liu", deadline: "Apr 20, 2024", pages: 31, progress: 100 },
];

const STATUS_STYLES: Record<string, string> = {
  "Active": "bg-blue-50 text-blue-700 border-blue-200",
  "Under Review": "bg-amber-50 text-amber-700 border-amber-200",
  "Completed": "bg-emerald-50 text-emerald-700 border-emerald-200",
  "Pending": "bg-slate-50 text-slate-600 border-slate-200",
};

const RISK_STYLES: Record<string, string> = {
  "Critical": "bg-red-100 text-red-700",
  "High": "bg-orange-100 text-orange-700",
  "Medium": "bg-amber-100 text-amber-700",
  "Low": "bg-emerald-100 text-emerald-700",
};

const STATUS_ICON: Record<string, React.ReactNode> = {
  "Active": <Clock size={11} />,
  "Under Review": <AlertTriangle size={11} />,
  "Completed": <CheckCircle size={11} />,
  "Pending": <XCircle size={11} />,
};

export default function CasesPage() {
  const router = useRouter();
  const [cases, setCases] = useState<any[]>(CASES);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState('All');
  const [selected, setSelected] = useState<string[]>([]);

  React.useEffect(() => {
    const fetchCases = async () => {
      try {
        const res = await fetch('/api/documents/cases');
        if (!res.ok) throw new Error("Failed to fetch");
        const data = await res.json();
        
        // Merge real data with mock data if real data is empty, 
        // or just show real data if available.
        // For this project, we'll show real data + mock data as "Example Cases"
        if (data && Array.isArray(data)) {
          // Combine real database records with the default mock cases
          setCases([...data, ...CASES]);
        }
      } catch (err) {
        console.error("Failed to fetch cases:", err);
      } finally {
        setLoading(false);
      }
    };
    fetchCases();
  }, []);

  const filtered = cases.filter(c => {
    const matchQ = !search || c.name.toLowerCase().includes(search.toLowerCase()) || c.id.toLowerCase().includes(search.toLowerCase());
    const matchS = statusFilter === 'All' || c.status === statusFilter;
    return matchQ && matchS;
  });

  const toggleSelect = (id: string) => setSelected(prev => prev.includes(id) ? prev.filter(x => x !== id) : [...prev, id]);

  const stats = [
    { label: "Total Cases", value: cases.length, sub: "+3 this month", color: "blue" },
    { label: "Active", value: cases.filter(c => c.status === "Active").length, sub: "In progress", color: "emerald" },
    { label: "High / Critical Risk", value: cases.filter(c => c.risk === "High" || c.risk === "Critical").length, sub: "Needs attention", color: "red" },
    { label: "Completed", value: cases.filter(c => c.status === "Completed").length, sub: "This quarter", color: "slate" },
  ];

  return (
    <div className="min-h-screen bg-[#f3f4f6] font-sans flex text-slate-900">
      <Sidebar />
      <div className="flex-1 flex flex-col h-screen overflow-y-auto">
        {/* Header */}
        <div className="bg-white/70 backdrop-blur-md sticky top-0 z-10 px-8 py-5 border-b border-slate-200 flex justify-between items-center">
          <div>
            <h1 className="text-xl font-bold tracking-tight text-slate-800">Cases</h1>
            <p className="text-xs text-slate-500 mt-0.5">Manage and track all legal matters</p>
          </div>
          <button className="flex items-center gap-2 bg-slate-900 text-white px-5 py-2.5 rounded-xl text-sm font-semibold hover:bg-slate-700 transition-colors">
            <Plus size={16} /> New Case
          </button>
        </div>

        <div className="p-8 space-y-6">
          {/* Stats */}
          <div className="grid grid-cols-4 gap-4">
            {stats.map(s => (
              <div key={s.label} className="bg-white rounded-2xl p-5 border border-slate-100 shadow-sm">
                <p className="text-xs text-slate-500 font-medium mb-2">{s.label}</p>
                <div className="flex items-baseline gap-2">
                  <span className="text-3xl font-black text-slate-800">{s.value}</span>
                </div>
                <p className="text-[11px] text-slate-400 mt-1">{s.sub}</p>
              </div>
            ))}
          </div>

          {/* Table */}
          <div className="bg-white rounded-2xl border border-slate-100 shadow-sm overflow-hidden">
            {/* Toolbar */}
            <div className="flex items-center justify-between px-6 py-4 border-b border-slate-100 gap-4">
              <div className="relative flex-1 max-w-xs">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 w-4 h-4" />
                <input value={search} onChange={e => setSearch(e.target.value)} placeholder="Search cases..." className="w-full pl-9 pr-4 py-2 border border-slate-200 rounded-xl text-sm focus:outline-none focus:ring-1 focus:ring-blue-500 bg-slate-50" />
              </div>
              <div className="flex items-center gap-2">
                <Filter size={14} className="text-slate-400" />
                {['All', 'Active', 'Under Review', 'Pending', 'Completed'].map(s => (
                  <button key={s} onClick={() => setStatusFilter(s)} className={`text-xs px-3 py-1.5 rounded-lg font-medium transition-colors ${statusFilter === s ? 'bg-slate-900 text-white' : 'bg-slate-100 text-slate-600 hover:bg-slate-200'}`}>{s}</button>
                ))}
              </div>
            </div>

            <table className="w-full">
              <thead className="bg-slate-50 border-b border-slate-100">
                <tr>
                  <th className="w-10 px-6 py-3"><input type="checkbox" className="rounded" /></th>
                  {["Case ID", "Case Name", "Type", "Status", "Risk", "Attorney", "Deadline", "Progress"].map(h => (
                    <th key={h} className="px-4 py-3 text-left text-[11px] font-bold text-slate-500 uppercase tracking-wide">
                      <span className="flex items-center gap-1">{h} <ChevronDown size={10} /></span>
                    </th>
                  ))}
                  <th className="px-4 py-3"></th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-50">
                {filtered.map(c => (
                  <tr 
                    key={c.id} 
                    onClick={() => router.push(`/?fileId=${c.id}`)}
                    className={`hover:bg-slate-50 cursor-pointer transition-colors ${selected.includes(c.id) ? 'bg-blue-50/30' : ''}`}
                  >
                    <td className="px-6 py-4"><input type="checkbox" checked={selected.includes(c.id)} onChange={() => toggleSelect(c.id)} className="rounded" /></td>
                    <td className="px-4 py-4 text-xs font-mono text-slate-500">{c.id}</td>
                    <td className="px-4 py-4">
                      <div className="flex items-center gap-2">
                        <div className="w-7 h-7 bg-slate-100 rounded-lg flex items-center justify-center shrink-0"><Briefcase size={13} className="text-slate-500" /></div>
                        <span className="text-sm font-semibold text-slate-800 max-w-[180px] truncate">{c.name}</span>
                      </div>
                    </td>
                    <td className="px-4 py-4 text-xs text-slate-500">{c.type}</td>
                    <td className="px-4 py-4">
                      <span className={`inline-flex items-center gap-1 text-[11px] font-semibold px-2.5 py-1 rounded-full border ${STATUS_STYLES[c.status]}`}>
                        {STATUS_ICON[c.status]}{c.status}
                      </span>
                    </td>
                    <td className="px-4 py-4">
                      <span className={`inline-flex items-center text-[11px] font-bold px-2.5 py-1 rounded-full ${RISK_STYLES[c.risk]}`}>{c.risk}</span>
                    </td>
                    <td className="px-4 py-4">
                      <div className="flex items-center gap-2">
                        <div className="w-6 h-6 bg-slate-200 rounded-full overflow-hidden"><img src={`https://i.pravatar.cc/30?u=${c.attorney}`} alt={c.attorney} className="w-full h-full object-cover" /></div>
                        <span className="text-xs text-slate-600 whitespace-nowrap">{c.attorney}</span>
                      </div>
                    </td>
                    <td className="px-4 py-4">
                      <span className={`text-xs font-medium flex items-center gap-1 ${new Date(c.deadline) < new Date() ? 'text-red-500' : 'text-slate-600'}`}>
                        <Calendar size={11} />{c.deadline}
                      </span>
                    </td>
                    <td className="px-4 py-4">
                      <div className="flex items-center gap-2">
                        <div className="w-20 h-1.5 bg-slate-100 rounded-full overflow-hidden">
                          <div className={`h-full rounded-full transition-all ${c.progress === 100 ? 'bg-emerald-400' : c.risk === 'Critical' ? 'bg-red-400' : 'bg-blue-400'}`} style={{ width: `${c.progress}%` }} />
                        </div>
                        <span className="text-xs text-slate-500 font-medium">{c.progress}%</span>
                      </div>
                    </td>
                    <td className="px-4 py-4"><button className="text-slate-400 hover:text-slate-700"><MoreHorizontal size={16} /></button></td>
                  </tr>
                ))}
              </tbody>
            </table>

            <div className="px-6 py-4 border-t border-slate-100 flex items-center justify-between text-xs text-slate-500">
              <span>Showing {filtered.length} of {CASES.length} cases</span>
              <div className="flex gap-2">
                <button className="px-3 py-1.5 border border-slate-200 rounded-lg hover:bg-slate-50">Previous</button>
                <button className="px-3 py-1.5 bg-slate-900 text-white rounded-lg">1</button>
                <button className="px-3 py-1.5 border border-slate-200 rounded-lg hover:bg-slate-50">Next</button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
