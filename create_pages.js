const fs = require('fs');
const path = require('path');

const pages = [
    { path: 'cases', title: 'Cases' },
    { path: 'search', title: 'Legal Search' },
    { path: 'review', title: 'Smart Review' },
    { path: 'compliance', title: 'Compliance View' },
    { path: 'forms', title: 'Legal Forms' },
    { path: 'team', title: 'Team' },
    { path: 'integrations', title: 'Integrations' },
    { path: 'settings', title: 'Settings' },
    { path: 'support', title: 'Support Center' }
];

pages.forEach(p => {
    const dir = path.join('c:/Document Analyzer/frontend/src/app', p.path);
    if (!fs.existsSync(dir)) fs.mkdirSync(dir, { recursive: true });

    const content = `import React from 'react';
import Sidebar from '../../components/Sidebar';

export default function ${p.path.charAt(0).toUpperCase() + p.path.slice(1)}Page() {
    return (
        <div className="min-h-screen bg-[#f3f4f6] font-sans flex text-slate-900">
            <Sidebar />
            <div className="flex-1 flex flex-col h-screen overflow-y-auto w-full max-w-[1400px] p-8">
                <div className="bg-white rounded-2xl p-8 border border-slate-100 shadow-sm flex flex-col items-center justify-center min-h-[500px]">
                    <div className="w-16 h-16 bg-slate-100 rounded-full flex items-center justify-center mb-6">
                        <svg className="w-8 h-8 text-slate-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 002-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10"></path>
                        </svg>
                    </div>
                    <h1 className="text-2xl font-bold text-slate-800 mb-2">${p.title}</h1>
                    <p className="text-slate-500 text-center max-w-md">This module is currently under active development. Relevant analytics and tools will appear here soon.</p>
                </div>
            </div>
        </div>
    );
}
`;
    fs.writeFileSync(path.join(dir, 'page.tsx'), content);
});
console.log('Pages created successfully.');
