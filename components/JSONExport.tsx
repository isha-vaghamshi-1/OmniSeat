
import React, { useState, useMemo } from 'react';
import { Download, Check, X, FileJson, Database, Terminal } from 'lucide-react';

const JSONExport = ({ config }) => {
  const [showModal, setShowModal] = useState(false);
  const [copied, setCopied] = useState(false);

  const payload = useMemo(() => {
    let totalSeats = 0;
    const sectionBreakdown = config.sections.map(s => {
      let sectionSeats = 0;
      for (let i = 0; i < s.rows; i++) {
        sectionSeats += s.rowSettings?.[i]?.cols ?? s.cols;
      }
      totalSeats += sectionSeats;
      return { id: s.id, name: s.name, seatCount: sectionSeats };
    });

    return {
      version: "2.1.0",
      hallName: "Theatre Alpha - Main Layout",
      generatedAt: new Date().toISOString(),
      config,
      calculatedStats: {
        totalSeats,
        sectionsCount: config.sections.length,
        sectionBreakdown
      }
    };
  }, [config]);

  const jsonString = JSON.stringify(payload, null, 2);

  const handleCopy = () => {
    navigator.clipboard.writeText(jsonString);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleDownload = () => {
    const blob = new Blob([jsonString], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `hall-payload-v${payload.version}.json`;
    a.click();
    URL.revokeObjectURL(url);
  };

  return (
    <>
      <button 
        onClick={() => setShowModal(true)}
        className="flex items-center gap-2 px-6 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-500 transition-all shadow-lg shadow-emerald-500/20 text-xs font-black text-white uppercase tracking-widest"
      >
        <FileJson className="w-4 h-4" /> Export Payload
      </button>

      {showModal && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-8">
          <div className="absolute inset-0 bg-slate-950/90 backdrop-blur-md" onClick={() => setShowModal(false)} />
          <div className="relative w-full max-w-3xl bg-slate-900 border border-slate-800 rounded-3xl shadow-2xl flex flex-col max-h-[85vh] animate-in zoom-in duration-300">
            <div className="p-6 border-b border-slate-800 flex items-center justify-between">
              <div className="flex items-center gap-4">
                <Database className="w-5 h-5 text-emerald-400" />
                <h2 className="text-lg font-black text-white">Payload</h2>
              </div>
              <button onClick={() => setShowModal(false)} className="text-slate-500 hover:text-white">
                <X className="w-6 h-6" />
              </button>
            </div>
            <div className="p-6 flex-1 overflow-auto custom-scrollbar">
              <pre className="text-xs text-emerald-500 font-mono bg-slate-950 p-4 rounded-xl">{jsonString}</pre>
            </div>
            <div className="p-6 border-t border-slate-800 flex justify-end gap-3">
              <button onClick={handleCopy} className="px-4 py-2 bg-slate-800 rounded-xl text-xs font-bold">{copied ? 'Copied' : 'Copy JSON'}</button>
              <button onClick={handleDownload} className="px-4 py-2 bg-emerald-600 rounded-xl text-xs font-bold text-white">Download</button>
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default JSONExport;
