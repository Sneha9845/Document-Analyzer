"use client";

import React, { useState, useEffect } from 'react';
import { AnalysisSocket } from '../lib/socket';
import Sidebar from './Sidebar';
import TrendChart from './TrendChart';
import RelevantCasesTable from './RelevantCasesTable';
import EntityView from './EntityView';
import { Search, Plus, Bell, Settings, Eye, Download, MoreHorizontal, AlertTriangle, Volume2, Globe, Mic } from 'lucide-react';

interface AgentUpdate {
    agent: string;
    status: string;
    progress: number;
    data?: any;
}

export default function AnalysisDashboard({ fileId }: { fileId: string }) {
    const [language, setLanguage] = useState<'en' | 'es' | 'fr' | 'hi'>('en');
    const [updates, setUpdates] = useState<AgentUpdate[]>([]);
    const [findings, setFindings] = useState<any[]>([]);
    const [summary, setSummary] = useState<string>("");
    const [progress, setProgress] = useState<number>(0);
    const [docType, setDocType] = useState<string>("Detecting...");
    const [extractedIntel, setExtractedIntel] = useState<any>(null);
    const [methodologies, setMethodologies] = useState<any>(null);
    const [activeTab, setActiveTab] = useState<'overview' | 'entities'>('overview');
    const [isListening, setIsListening] = useState(false);
    const [searchQuery, setSearchQuery] = useState("");

    useEffect(() => {
        const socket = new AnalysisSocket(fileId);

        socket.connect((data) => {
            if (data.error) {
                console.error(data.error);
                return;
            }

            setUpdates(prev => [...prev, data]);
            setProgress(data.progress);

            if (data.agent === "summarizer") {
                setSummary(data.data.summary);
            }
            if (data.agent === "cross_validator") {
                setFindings(data.data.cross_validation.results || []);
            }
            if (data.agent === "parser") {
                const type = data.data.metadata?.doc_type;
                if (type) setDocType(type);
                if (data.data.metadata?.extracted_intelligence) {
                    setExtractedIntel(data.data.metadata.extracted_intelligence);
                }
                if (data.data.metadata?.methodologies) {
                    setMethodologies(data.data.metadata.methodologies);
                }
            }
        });

        return () => socket.disconnect();
    }, [fileId]);

    const numRisks = findings.filter(f => f.conclusion.toLowerCase().includes('critical') || f.conclusion.toLowerCase().includes('high')).length;

    const handleSpeak = (text: string) => {
        if (!window.speechSynthesis) return;
        window.speechSynthesis.cancel();
        const utterance = new SpeechSynthesisUtterance(text);
        utterance.rate = 1.0;
        utterance.pitch = 1.0;
        // Map language to voice
        if (language === 'es') utterance.lang = 'es-ES';
        else if (language === 'fr') utterance.lang = 'fr-FR';
        else if (language === 'hi') utterance.lang = 'hi-IN';
        else utterance.lang = 'en-US';
        
        window.speechSynthesis.speak(utterance);
    };

    const handleVoiceSearch = () => {
        const SpeechRecognition = (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;
        if (!SpeechRecognition) return;

        const recognition = new SpeechRecognition();
        recognition.lang = language === 'hi' ? 'hi-IN' : language === 'es' ? 'es-ES' : language === 'fr' ? 'fr-FR' : 'en-US';
        
        recognition.onstart = () => setIsListening(true);
        recognition.onend = () => setIsListening(false);
        recognition.onresult = (event: any) => {
            const transcript = event.results[0][0].transcript;
            setSearchQuery(transcript);
        };
        recognition.start();
    };

    const t: any = {
        en: { summary: "AI Summary", status: "Document Status", recommendation: "Recommendation", speak: "Read Aloud", riskZone: "Risk Zone" },
        es: { summary: "Resumen de IA", status: "Estado del Documento", recommendation: "Recomendación", speak: "Leer en voz alta", riskZone: "Zona de Riesgo" },
        fr: { summary: "Résumé IA", status: "État du Document", recommendation: "Recommandation", speak: "Lire à haute voix", riskZone: "Zone de Risque" },
        hi: { summary: "एआई सारांश", status: "दस्तावेज़ स्थिति", recommendation: "सिफारिश", speak: "ज़ोर से पढ़ें", riskZone: "जोखिम क्षेत्र" }
    };

    return (
        <div className="min-h-screen bg-[#f3f4f6] font-sans flex text-slate-900">
            {/* Global Sidebar layout */}
            <Sidebar />

            <div className="flex-1 flex flex-col h-screen overflow-y-auto w-full max-w-[1400px]">
                {/* Global Header */}
                <div className="bg-white/50 backdrop-blur-md sticky top-0 z-10 px-8 py-5 border-b border-slate-200 flex justify-between items-center">
                    <div className="flex items-center gap-6">
                        <h1 className="text-xl font-bold tracking-tight text-slate-800">
                            {activeTab === 'overview' ? 'AI Analysis Overview' : 'Extracted Entities'}
                        </h1>
                        <div className="flex bg-slate-100 rounded-lg p-1">
                            <button
                                onClick={() => setActiveTab('overview')}
                                className={`px-4 py-1.5 text-xs font-semibold rounded-md transition-colors ${activeTab === 'overview' ? 'bg-white shadow pointer-events-none' : 'text-slate-500 hover:text-slate-800'}`}
                            >
                                Overview
                            </button>
                            <button
                                onClick={() => setActiveTab('entities')}
                                className={`px-4 py-1.5 text-xs font-semibold rounded-md transition-colors ${activeTab === 'entities' ? 'bg-white shadow pointer-events-none' : 'text-slate-500 hover:text-slate-800'}`}
                            >
                                Entities & Context
                            </button>
                        </div>
                    </div>

                    <div className="flex items-center gap-6">
                        <div className="flex items-center gap-2 bg-slate-100 rounded-full px-3 py-1.5 border border-slate-200">
                            <Globe size={14} className="text-slate-500" />
                            <select 
                                value={language} 
                                onChange={(e) => setLanguage(e.target.value as any)}
                                className="bg-transparent text-xs font-bold focus:outline-none cursor-pointer"
                            >
                                <option value="en">English</option>
                                <option value="es">Español</option>
                                <option value="fr">Français</option>
                                <option value="hi">हिन्दी</option>
                            </select>
                        </div>
                        <div className="relative group">
                            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 w-4 h-4" />
                            <input 
                                type="text" 
                                value={searchQuery}
                                onChange={(e) => setSearchQuery(e.target.value)}
                                placeholder={language === 'hi' ? 'खोजें...' : language === 'es' ? 'Buscar...' : language === 'fr' ? 'Chercher...' : "Search..."} 
                                className="bg-white border border-slate-200 rounded-full pl-10 pr-10 py-1.5 text-sm w-64 focus:outline-none focus:ring-1 focus:ring-blue-500" 
                            />
                            <button 
                                onClick={handleVoiceSearch}
                                className={`absolute right-3 top-1/2 -translate-y-1/2 transition-colors ${isListening ? 'text-red-500 animate-pulse' : 'text-slate-400 hover:text-blue-500'}`}
                            >
                                <Mic size={14} />
                            </button>
                        </div>
                        <div className="flex items-center gap-4 text-slate-600">
                            <button className="hover:text-slate-900"><Plus size={18} /></button>
                            <button className="hover:text-slate-900"><Settings size={18} /></button>
                            <button className="hover:text-slate-900"><Bell size={18} /></button>
                        </div>
                        <div className="w-8 h-8 bg-slate-800 rounded-full overflow-hidden shrink-0">
                            {/* Avatar placeholder */}
                            <img src="https://i.pravatar.cc/100" alt="Avatar" className="w-full h-full object-cover" />
                        </div>
                    </div>
                </div>

                <div className="p-8">
                    {activeTab === 'entities' ? (
                        <EntityView extractedIntel={extractedIntel} methodologies={methodologies} />
                    ) : (
                        <div className="grid grid-cols-12 gap-6 w-full">
                            {/* Left Column */}
                            <div className="col-span-12 xl:col-span-4 space-y-6">
                                {/* Document Status Card */}
                                <div className="bg-white rounded-2xl p-6 border border-slate-100 shadow-sm">
                                    <div className="flex justify-between items-start mb-6">
                                        <h2 className="font-semibold text-slate-800">{t[language].status}</h2>
                                        <button className="text-slate-400 hover:text-slate-600"><MoreHorizontal size={18} /></button>
                                    </div>
                                    <div className="flex items-center justify-between bg-slate-50 border border-slate-100 p-3 rounded-xl mb-4">
                                        <div className="flex items-center gap-3">
                                            <div className="w-8 h-8 bg-red-100 text-red-500 rounded text-xs font-black flex justify-center items-center">PDF</div>
                                            <div>
                                                <div className="text-xs font-semibold text-slate-800 truncate w-32" title={fileId}>{fileId}</div>
                                                <div className="text-[10px] text-slate-500">PDF · 1.1 MB</div>
                                            </div>
                                        </div>
                                        <div className="flex gap-2 text-slate-400">
                                            <button className="hover:text-slate-800"><Eye size={16} /></button>
                                            <button className="hover:text-slate-800"><Download size={16} /></button>
                                        </div>
                                    </div>
                                    <div className="space-y-4">
                                        <div className="flex justify-between text-xs border-b border-slate-100 pb-2">
                                            <span className="text-slate-500">Analyzed:</span>
                                            <span className="font-medium text-slate-800">Just Now</span>
                                        </div>
                                        <div className="flex justify-between text-xs border-b border-slate-100 pb-2">
                                            <span className="text-slate-500">Document Type:</span>
                                            <span className="font-medium text-slate-800 truncate">{docType}</span>
                                        </div>
                                    </div>

                                    <div className="mt-6">
                                        <div className="flex justify-between text-xs font-semibold mb-2">
                                            <span className="text-slate-800">AI Review Progress</span>
                                            <span className="text-emerald-500">{progress}% complete</span>
                                        </div>
                                        <div className="w-full h-1.5 bg-slate-100 rounded-full overflow-hidden">
                                            <div className="h-full bg-emerald-400 transition-all duration-500" style={{ width: `${progress}%` }}></div>
                                        </div>
                                        <div className="mt-3 flex gap-2">
                                            <span className="px-3 py-1 bg-slate-50 border border-slate-100 text-slate-500 rounded-full text-[10px] font-medium tracking-wide">Stage: Deep Analysis</span>
                                        </div>
                                    </div>
                                </div>

                                {/* AI Summary Card */}
                                <div className="bg-white rounded-2xl p-6 border border-slate-100 shadow-sm relative overflow-hidden">
                                    <div className="absolute top-0 right-0 w-32 h-32 bg-blue-50 rounded-full blur-3xl -z-10 translate-x-10 -translate-y-10"></div>
                                    <div className="flex justify-between items-start mb-6">
                                        <h2 className="font-semibold text-slate-800">{t[language].summary}</h2>
                                        <button 
                                            onClick={() => handleSpeak(summary || "No summary available yet.")}
                                            className="flex items-center gap-1.5 text-[10px] font-bold text-blue-600 bg-blue-50 px-2.5 py-1 rounded-lg border border-blue-100 hover:bg-blue-100 transition-colors"
                                        >
                                            <Volume2 size={12} /> {t[language].speak}
                                        </button>
                                    </div>
                                    <div className="space-y-4 text-sm mb-6">
                                        <div className="flex justify-between items-center border-b border-slate-50 pb-2">
                                            <span className="text-slate-500">Risk Zone:</span>
                                            <span className="text-[10px] font-bold text-red-500 bg-red-50 px-2 py-0.5 rounded-full border border-red-100 flex items-center gap-1">
                                                <AlertTriangle size={10} /> Medium {numRisks > 0 ? 2.3 : 1.1}
                                            </span>
                                        </div>
                                        <div className="flex justify-between items-center border-b border-slate-50 pb-2">
                                            <span className="text-slate-500">Clause Type:</span>
                                            <span className="font-medium text-slate-800">License / IP</span>
                                        </div>
                                        <div className="flex justify-between items-center border-b border-slate-50 pb-2">
                                            <span className="text-slate-500">Impact:</span>
                                            <span className="font-medium text-slate-800 text-right">May affect exclusivity rights</span>
                                        </div>
                                    </div>

                                    <div className="bg-[#f0f4fa] rounded-xl p-4 border border-blue-100/50">
                                        <div className="flex items-center gap-2 mb-2">
                                            <div className="w-1.5 h-1.5 rounded-full bg-blue-500"></div>
                                            <span className="text-xs font-bold text-blue-900">{t[language].recommendation}</span>
                                        </div>
                                        <p className="text-xs text-blue-800/80 leading-relaxed font-medium">
                                            {findings.length > 0 ? "Identify potentially broad indemnity terms and clarify 'limited license' explicitly." : "Clarify the term 'limited license' or replace with 'non-exclusive use right'."}
                                        </p>
                                    </div>

                                    <button className="w-full mt-4 bg-slate-950 text-white font-semibold text-xs py-3 rounded-xl hover:bg-slate-800 transition-colors">
                                        See Suggested Rewrite
                                    </button>
                                </div>
                            </div>

                            {/* Right Column */}
                            <div className="col-span-12 xl:col-span-8 flex flex-col gap-6">
                                {/* Top Stats Row */}
                                <div className="grid grid-cols-4 gap-4">
                                    <div className="bg-white rounded-xl py-4 px-5 border border-slate-100 shadow-sm flex flex-col justify-center">
                                        <span className="text-xs text-slate-500 mb-2 font-medium">Pages Analyzed</span>
                                        <div className="flex items-baseline gap-2">
                                            <span className="text-3xl font-bold text-slate-800">47</span>
                                            <span className="text-xs font-bold text-emerald-500">+6 pages</span>
                                        </div>
                                    </div>
                                    <div className="bg-white rounded-xl py-4 px-5 border border-slate-100 shadow-sm flex flex-col justify-center">
                                        <span className="text-xs text-slate-500 mb-2 font-medium">Relevant Precedents</span>
                                        <div className="flex items-baseline gap-2">
                                            <span className="text-3xl font-bold text-slate-800">12</span>
                                            <span className="text-xs font-bold text-red-500">+3 cases</span>
                                        </div>
                                    </div>
                                    <div className="bg-white rounded-xl py-4 px-5 border border-slate-100 shadow-sm flex flex-col justify-center">
                                        <span className="text-xs text-slate-500 mb-2 font-medium">Identified Risks</span>
                                        <div className="flex items-baseline gap-2">
                                            <span className="text-3xl font-bold text-slate-800">{numRisks || 5}</span>
                                            <span className="text-xs font-bold text-red-500">+2 this week</span>
                                        </div>
                                    </div>
                                    <div className="bg-white rounded-xl py-4 px-5 border border-slate-100 shadow-sm flex flex-col justify-center">
                                        <span className="text-xs text-slate-500 mb-2 font-medium">AI Confidence</span>
                                        <div className="flex items-baseline gap-2">
                                            <span className="text-3xl font-bold text-slate-800">92%</span>
                                            <span className="text-xs font-bold text-emerald-500">+4%</span>
                                        </div>
                                    </div>
                                </div>

                                {/* Risk Trend Chart */}
                                <div className="bg-white rounded-2xl p-6 border border-slate-100 shadow-sm flex-1">
                                    <div className="flex justify-between items-start mb-2">
                                        <h2 className="font-semibold text-slate-800">AI Risk Trend</h2>
                                        <div className="flex gap-2">
                                            <span className="text-[10px] font-bold uppercase tracking-wide text-blue-600 bg-blue-50 px-3 py-1 rounded-full border border-blue-200">Documents analyzed</span>
                                            <span className="text-[10px] font-bold uppercase tracking-wide text-red-500 bg-red-50 px-3 py-1 rounded-full border border-red-200">With risks</span>
                                        </div>
                                    </div>
                                    <TrendChart />
                                </div>

                                {/* Relevant Cases Table */}
                                <div className="bg-white rounded-2xl p-6 border border-slate-100 shadow-sm">
                                    <div className="flex justify-between items-start mb-6">
                                        <h2 className="font-semibold text-slate-800">Relevant Cases</h2>
                                        <button className="text-slate-400 hover:text-slate-600"><MoreHorizontal size={18} /></button>
                                    </div>
                                    <RelevantCasesTable />
                                </div>
                            </div>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
}
