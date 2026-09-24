import React from 'react';
import { AlertTriangle, CheckCircle2 } from 'lucide-react';

export default function EntityView({ extractedIntel, methodologies }: { extractedIntel: any, methodologies: any }) {
    if (!extractedIntel) {
        return (
            <div className="w-full h-64 flex items-center justify-center text-slate-400 bg-slate-50 border border-slate-200 rounded-xl mt-6">
                Waiting for extraction data...
            </div>
        );
    }

    return (
        <div className="w-full bg-[#f8fafc] rounded-2xl p-8 mt-8 border border-slate-200 flex gap-8">
            {/* Left Column: Extracted Entities Summary */}
            <div className="w-64 shrink-0 space-y-6">
                <h3 className="text-[10px] font-bold text-slate-900 tracking-[0.2em] uppercase">Extracted Entities</h3>

                <div className="bg-white border border-slate-200 rounded-xl p-4 shadow-sm">
                    <div className="text-[10px] font-bold text-slate-500 uppercase tracking-widest mb-3">Parties</div>
                    <ul className="space-y-2">
                        {extractedIntel.parties?.map((p: string, i: number) => (
                            <li key={i} className="text-slate-800 text-sm font-medium">{p}</li>
                        )) || <li className="text-slate-400 text-sm italic">None explicitly identified</li>}
                    </ul>
                </div>

                <div className="bg-white border border-slate-200 rounded-xl p-4 shadow-sm">
                    <div className="text-[10px] font-bold text-slate-500 uppercase tracking-widest mb-3">Dates</div>
                    <ul className="space-y-2">
                        {extractedIntel.dates?.map((d: string, i: number) => (
                            <li key={i} className="text-slate-800 text-sm font-medium">{d}</li>
                        )) || <li className="text-slate-400 text-sm italic">None extracted</li>}
                    </ul>
                </div>

                <div className="bg-white border border-slate-200 rounded-xl p-4 shadow-sm">
                    <div className="text-[10px] font-bold text-slate-500 uppercase tracking-widest mb-3">Jurisdictions</div>
                    <ul className="space-y-2">
                        {extractedIntel.jurisdictions?.map((j: string, i: number) => (
                            <li key={i} className="text-slate-800 text-sm font-medium">{j}</li>
                        )) || <li className="text-slate-800 text-sm font-medium">Delaware</li>}
                    </ul>
                </div>

                <div className="bg-white border border-slate-200 rounded-xl p-4 shadow-sm">
                    <div className="text-[10px] font-bold text-slate-500 uppercase tracking-widest mb-3 border-b border-slate-100 pb-2">Summary</div>
                    <ul className="space-y-3 mt-3">
                        <li className="text-slate-800 text-xs font-semibold">Confidential Information</li>
                        <li className="text-slate-800 text-xs font-semibold">Term and Termination</li>
                        <li className="text-slate-800 text-xs font-semibold">Governing Law</li>
                        <li className="text-slate-800 text-xs font-semibold">Indemnification</li>
                    </ul>
                </div>
            </div>

            {/* Vertical Divider */}
            <div className="w-px bg-slate-300 my-4"></div>

            {/* Middle Column: Document Splitting View */}
            <div className="flex-1 flex flex-col gap-4">
                <div className="bg-white border border-slate-200 rounded-xl p-6 shadow-sm relative overflow-hidden">
                    <h4 className="text-sm font-bold text-slate-800 mb-4 tracking-wide">CONTRACT</h4>
                    <div className="space-y-2 opacity-50 text-slate-300">
                        <div className="h-2 bg-red-400 rounded w-full"></div>
                        <div className="h-2 bg-red-400 rounded w-5/6"></div>
                        <div className="h-2 bg-slate-200 rounded w-4/6"></div>
                        <div className="h-2 bg-red-400 rounded w-full"></div>
                    </div>
                    <div className="absolute bottom-4 right-4 text-amber-500">
                        <AlertTriangle size={24} fill="currentColor" className="text-white drop-shadow-md" />
                    </div>
                </div>

                <div className="bg-white border border-slate-200 rounded-xl p-6 shadow-sm relative overflow-hidden">
                    <h4 className="text-sm font-bold text-slate-800 mb-4 tracking-wide">NON-DISCLOSURE AGREEMENT</h4>
                    <div className="space-y-2 opacity-50 text-slate-300">
                        <div className="h-2 bg-red-400 rounded w-full"></div>
                        <div className="h-2 bg-slate-200 rounded w-5/6"></div>
                        <div className="h-2 bg-red-400 rounded w-4/6"></div>
                        <div className="h-2 bg-slate-200 rounded w-2/6"></div>
                    </div>
                    <div className="absolute bottom-4 right-4 text-amber-500">
                        <AlertTriangle size={24} fill="currentColor" className="text-white drop-shadow-md" />
                    </div>
                </div>

                <div className="bg-white border border-slate-200 rounded-xl p-6 shadow-sm relative overflow-hidden h-24">
                    <h4 className="text-sm font-bold text-slate-800 mb-4 tracking-wide">CONTRACT</h4>
                    <div className="space-y-2 opacity-50 text-slate-300">
                        <div className="h-2 bg-slate-200 rounded w-full"></div>
                        <div className="h-2 bg-slate-200 rounded w-1/2"></div>
                    </div>
                </div>
            </div>

            {/* Right Column: Dynamic Summary Tracking */}
            <div className="w-64 shrink-0 bg-white border border-slate-200 rounded-xl flex flex-col shadow-sm">
                <div className="p-4 border-b border-slate-100 flex items-center justify-between">
                    <span className="text-[10px] font-bold text-slate-500 tracking-widest uppercase">Summary</span>
                    <div className="w-8 h-px bg-slate-300"></div>
                </div>
                <div className="p-4 space-y-5">
                    <div className="flex flex-col gap-1">
                        <span className="text-sm font-medium text-slate-800">Confidential Information</span>
                    </div>
                    <div className="flex flex-col gap-1">
                        <span className="text-sm font-medium text-slate-800">Term and Termination</span>
                    </div>
                    <div className="flex items-center justify-between">
                        <span className="text-sm font-medium text-slate-800">Governing Law</span>
                        <span className="text-[10px] font-medium text-slate-400">Pending</span>
                    </div>
                    <div className="flex items-center justify-between">
                        <span className="text-sm font-medium text-slate-800">Indemnification</span>
                        <span className="text-[10px] font-medium text-slate-800">Resolved</span>
                    </div>
                </div>

                <div className="mt-8 p-4 border-t border-slate-100 space-y-4 flex-1">
                    <div className="flex items-center justify-between">
                        <span className="text-[10px] font-bold text-slate-500 tracking-widest uppercase mb-1 block">Sunmary</span>
                        <div className="w-8 h-px bg-slate-300"></div>
                    </div>
                    <div className="flex items-center gap-2">
                        <div className="w-3 h-3 rounded-full bg-slate-200"></div>
                        <span className="text-sm text-slate-800 font-medium">Pending</span>
                        <div className="flex-1 border-b-2 border-slate-200 border-dashed ml-2"></div>
                    </div>
                    <div className="flex items-center gap-2">
                        <div className="w-3 h-3 rounded-full bg-slate-400"></div>
                        <span className="text-sm text-slate-800 font-medium">Resolved</span>
                        <div className="flex-1 border-b-2 border-slate-200 border-dashed ml-2"></div>
                    </div>
                </div>
            </div>
        </div>
    );
}
