import React from 'react';

export default function TrendChart() {
    // A pure SVG mockup for AI Risk Trend showing blue and red wave lines overlapping
    return (
        <div className="w-full h-48 relative mt-4">
            {/* Chart Grid Lines */}
            <div className="absolute inset-0 flex flex-col justify-between pt-2 pb-6">
                {[40, 30, 20, 10, 0].map((val) => (
                    <div key={val} className="flex relative w-full items-center">
                        <span className="text-[10px] text-slate-400 font-mono w-6 text-right shrink-0 pr-2">{val}</span>
                        <div className="w-full border-t border-slate-200 border-dashed" />
                    </div>
                ))}
            </div>

            {/* SVG Waves */}
            <svg className="absolute inset-0 w-full h-[85%] ml-6" preserveAspectRatio="none" viewBox="0 0 1000 100">
                <filter id="shadow">
                    <feDropShadow dx="0" dy="8" stdDeviation="4" floodColor="#0ea5e9" floodOpacity="0.2" />
                </filter>

                {/* Red Wave (Risk Exposure) */}
                <path
                    d="M 0,30 Q 50,60 100,50 T 200,90 T 300,70 T 400,90 T 500,85 T 600,10 T 700,75 T 800,40 T 900,80 T 1000,70"
                    fill="none"
                    stroke="#ef4444"
                    strokeWidth="3"
                    strokeLinecap="round"
                />

                {/* Red Data Point Marker */}
                <circle cx="600" cy="10" r="4" fill="white" stroke="#ef4444" strokeWidth="2" />

                {/* Blue Wave (Documents Analyzed) */}
                <path
                    d="M 0,80 Q 50,40 100,50 T 200,45 T 300,30 T 400,40 T 500,20 T 600,60 T 700,50 T 800,20 T 900,50 T 1000,25"
                    fill="none"
                    stroke="#0284c7"
                    strokeWidth="3"
                    strokeLinecap="round"
                    filter="url(#shadow)"
                />
            </svg>

            {/* Custom Tooltip */}
            <div className="absolute top-[3%] left-[55%] -translate-x-1/2 bg-white border border-red-200 shadow-xl rounded-full px-3 py-1 text-xs text-red-500 font-medium whitespace-nowrap">
                Risk exposure: 25%
                <div className="absolute top-full left-1/2 -translate-x-1/2 w-0.5 h-16 bg-red-100 -z-10"></div>
                <div className="absolute top-12 left-1/2 -translate-x-1/2 w-6 h-12 bg-blue-50/50 rounded-full -z-20"></div>
            </div>

            {/* X Axis Labels */}
            <div className="absolute bottom-0 left-6 right-0 flex justify-between text-[10px] text-slate-400 font-mono">
                {['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'].map((month) => (
                    <span key={month}>{month}</span>
                ))}
            </div>
        </div>
    );
}
