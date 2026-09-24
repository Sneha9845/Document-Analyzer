"use client";

import React, { useState, useEffect, Suspense } from 'react';
import { useSearchParams } from 'next/navigation';
import AnalysisDashboard from '../components/AnalysisDashboard';
import Sidebar from '../components/Sidebar';

function HomeContent() {
  const searchParams = useSearchParams();
  const [fileId, setFileId] = useState<string | null>(null);
  const [uploading, setUploading] = useState(false);

  useEffect(() => {
    const id = searchParams.get('fileId');
    if (id) setFileId(id);
  }, [searchParams]);

  const handleUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    if (!e.target.files) return;
    setUploading(true);

    const formData = new FormData();
    formData.append('file', e.target.files[0]);

    try {
      const res = await fetch('/upload', {
        method: 'POST',
        body: formData,
      });
      const data = await res.json();
      setFileId(data.file_id);
    } catch (err) {
      console.error("Upload failed", err);
    } finally {
      setUploading(false);
    }
  };

  if (fileId) {
    return <AnalysisDashboard fileId={fileId} />;
  }

  return (
    <div className="min-h-screen bg-[#f3f4f6] font-sans flex text-slate-900">
      <Sidebar />
      <div className="flex-1 flex flex-col items-center justify-center p-8 h-screen overflow-y-auto">
        <div className="max-w-2xl w-full text-center space-y-8">
          <div className="space-y-4">
            <h1 className="text-6xl font-black bg-clip-text text-transparent bg-gradient-to-b from-slate-900 to-slate-500">
              ELITE DOCUMENT INTELLIGENCE
            </h1>
            <p className="text-slate-500 text-lg">
              High-performance legal analysis powered by LangGraph, Claude 3.5, and GPT-4o.
            </p>
          </div>

          <div className="relative group">
            <div className="absolute -inset-1 bg-gradient-to-r from-blue-600 to-emerald-600 rounded-3xl blur opacity-25 group-hover:opacity-50 transition duration-1000"></div>
            <div className="relative bg-white border border-slate-200 p-12 rounded-3xl flex flex-col items-center gap-6 shadow-xl">
              <svg className="w-16 h-16 text-slate-300 mb-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2"></path>
              </svg>
              <label className="cursor-pointer bg-slate-900 text-white font-bold py-4 px-10 rounded-full hover:scale-105 transition-transform shadow-lg">
                {uploading ? "Uploading..." : "Upload Contract"}
                <input type="file" className="hidden" onChange={handleUpload} disabled={uploading} />
              </label>
              <p className="text-xs text-slate-400">Supported formats: PDF, DOCX, TXT</p>
            </div>
          </div>
          
          <div className="grid grid-cols-3 gap-4 pt-8">
            {[
              { label: "Deep Analysis", desc: "Clause-by-clause review" },
              { label: "Risk Detection", desc: "Auto-flag legal hazards" },
              { label: "Smart Search", desc: "Global case law access" }
            ].map(f => (
              <div key={f.label} className="bg-white/50 border border-slate-100 rounded-xl p-4">
                <div className="text-xs font-bold text-slate-800">{f.label}</div>
                <div className="text-[10px] text-slate-400 mt-0.5">{f.desc}</div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

export default function Home() {
  return (
    <Suspense fallback={<div className="min-h-screen bg-[#f3f4f6] flex items-center justify-center font-bold text-slate-400">Loading Intelligence...</div>}>
      <HomeContent />
    </Suspense>
  );
}
