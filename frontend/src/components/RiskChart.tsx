"use client";

import React from 'react';

interface RiskData {
    severity: 'Low' | 'Medium' | 'High' | 'Critical';
    count: number;
}

export default function RiskChart({ data }: { data: RiskData[] }) {
    const total = data.reduce((acc, curr) => acc + curr.count, 0);

    const colors = {
        Low: 'bg-emerald-500',
        Medium: 'bg-yellow-500',
        High: 'bg-orange-500',
        Critical: 'bg-red-500'
    };

    return (
        <div className="space-y-4">
            <div className="flex justify-between items-end h-32 gap-2">
                {data.map((item) => (
                    <div key={item.severity} className="flex-1 flex flex-col items-center gap-2 group">
                        <div
                            className={`${colors[item.severity]} w-full rounded-t-lg transition-all duration-500 ease-out relative`}
                            style={{ height: total > 0 ? `${(item.count / total) * 100}%` : '0%' }}
                        >
                            <div className="absolute -top-8 left-1/2 -translate-x-1/2 bg-slate-800 text-white text-[10px] py-1 px-2 rounded opacity-0 group-hover:opacity-100 transition-opacity">
                                {item.count} findings
                            </div>
                        </div>
                        <span className="text-[10px] font-bold uppercase tracking-tighter text-slate-500">
                            {item.severity[0]}
                        </span>
                    </div>
                ))}
            </div>
            <div className="pt-2 border-t border-slate-800 flex justify-around">
                {data.map((item) => (
                    <div key={item.severity} className="flex items-center gap-1">
                        <div className={`w-2 h-2 rounded-full ${colors[item.severity]}`}></div>
                        <span className="text-[10px] text-slate-400">{item.severity}</span>
                    </div>
                ))}
            </div>
        </div>
    );
}
