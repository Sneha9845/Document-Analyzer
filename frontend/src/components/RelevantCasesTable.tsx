import React from 'react';

const cases = [
    { name: "Nova Systems Corp", jurisdiction: "UK", year: "2025", relevance: "93 %", clauseMatch: "Clause 5.1", outcome: "Win" },
    { name: "Confidentiality Clause Dispute", jurisdiction: "EU", year: "2022", relevance: "89 %", clauseMatch: "Clause 5.2", outcome: "Settled" },
    { name: "TechSoft vs. Orion Ltd", jurisdiction: "UK", year: "2024", relevance: "94 %", clauseMatch: "Clause 2.3", outcome: "Win" },
    { name: "Clause 2.3 Interpretation", jurisdiction: "US", year: "2023", relevance: "86 %", clauseMatch: "-", outcome: "Loss" },
    { name: "Helix Innovations Inc", jurisdiction: "EU", year: "2025", relevance: "88 %", clauseMatch: "Clause 7.4", outcome: "Settled" },
];

const jurisdictionFlags: Record<string, string> = {
    "UK": "🇬🇧",
    "EU": "🇪🇺",
    "US": "🇺🇸"
};

export default function RelevantCasesTable() {
    return (
        <div className="w-full">
            <div className="grid grid-cols-6 gap-2 text-xs font-semibold text-slate-500 mb-3 border-b border-slate-100 pb-3">
                <div className="col-span-2">Case Name ↓↑</div>
                <div>Jurisdiction</div>
                <div>Year ↓↑</div>
                <div>Relevance ↓↑</div>
                <div>Clause Match</div>
                <div className="text-right">Outcome</div>
            </div>

            <div className="space-y-4">
                {cases.map((c, i) => (
                    <div key={i} className="grid grid-cols-6 gap-2 text-sm items-center hover:bg-slate-50/50 p-1 -mx-1 rounded-lg transition-colors">
                        <div className="col-span-2 font-medium text-slate-700 truncate">{c.name}</div>
                        <div className="flex items-center gap-1.5 text-slate-600">
                            {jurisdictionFlags[c.jurisdiction]} {c.jurisdiction}
                        </div>
                        <div className="text-slate-600">{c.year}</div>
                        <div className="text-slate-600">{c.relevance}</div>
                        <div className="text-slate-600">{c.clauseMatch}</div>
                        <div className="text-right flex justify-end">
                            <span className={`px-2.5 py-0.5 rounded-full text-xs font-semibold border ${c.outcome === 'Win' ? 'bg-emerald-50 text-emerald-600 border-emerald-200' :
                                    c.outcome === 'Loss' ? 'bg-red-50 text-red-600 border-red-200' :
                                        'bg-yellow-50 text-yellow-600 border-yellow-200'
                                }`}>
                                {c.outcome}
                            </span>
                        </div>
                    </div>
                ))}
            </div>
            <div className="mt-6 text-[10px] text-slate-400 font-medium">Last precedent update: Nov 2025</div>
        </div>
    );
}
