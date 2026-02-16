
import React, { useState, useCallback, useMemo } from 'react';
import { HashRouter, Routes, Route, NavLink, useLocation } from 'react-router-dom';
import { AppStep } from './types';
import { INITIAL_HALL_CONFIG } from './constants';
import Sidebar from './components/Sidebar';
import SeatingChart from './components/SeatingChart';
import JSONExport from './components/JSONExport';
import { 
  ChevronRight, 
  ChevronLeft, 
  Layers, 
  Calendar, 
  Settings2, 
  Construction, 
  Globe 
} from 'lucide-react';

// --- Example JSON Data for Web View ---
const EXAMPLE_PAYLOAD = {
  version: "2.1.0",
  hallName: "Grand Symphony Hall",
  config: {
    sections: [
      {
        id: "sec-1",
        name: "Premium Stalls",
        rows: 6,
        cols: 16,
        x: 120,
        y: 160,
        rotation: 0,
        curveIntensity: 80,
        seatSize: 24,
        spacing: 10,
        color: "#f59e0b",
        rowLabelPrefix: "A"
      },
      {
        id: "sec-2",
        name: "Front Left",
        rows: 8,
        cols: 8,
        x: 80,
        y: 420,
        rotation: -10,
        curveIntensity: 30,
        seatSize: 20,
        spacing: 8,
        color: "#3b82f6",
        rowLabelPrefix: "L"
      },
      {
        id: "sec-3",
        name: "Front Right",
        rows: 8,
        cols: 8,
        x: 580,
        y: 420,
        rotation: 10,
        curveIntensity: 30,
        seatSize: 20,
        spacing: 8,
        color: "#3b82f6",
        rowLabelPrefix: "R"
      }
    ],
    screen: {
      visible: true,
      label: "ORCHESTRA STAGE",
      width: 800,
      height: 60,
      x: 50,
      y: 40
    }
  }
};

// --- Shared Components ---

const Navbar = ({ activeStep, nextStep, prevStep, config }) => {
  const location = useLocation();
  const isSetup = location.pathname === '/';

  return (
    <header className="h-16 border-b border-slate-800 bg-slate-900/80 flex items-center justify-between px-8 z-50 backdrop-blur-xl shrink-0">
      <div className="flex items-center gap-8">
        <div className="flex items-center gap-3">
          <div className="bg-blue-600 p-2 rounded-xl shadow-lg shadow-blue-500/20">
            <Layers className="w-5 h-5 text-white" />
          </div>
          <h1 className="text-xl font-black tracking-tighter text-white">OmniSeat</h1>
        </div>

        <nav className="flex items-center gap-1 bg-slate-950/50 p-1 rounded-xl border border-slate-800/50">
          <NavLink
            to="/"
            className={({ isActive }) => `flex items-center gap-2 px-5 py-2 rounded-lg text-sm font-bold transition-all ${
              isActive
                ? 'bg-blue-600 text-white shadow-lg shadow-blue-600/20'
                : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800/50'
            }`}
          >
            <Settings2 className="w-4 h-4" />
            Hall Setup
          </NavLink>
          <NavLink
            to="/slot-management"
            className={({ isActive }) => `flex items-center gap-2 px-5 py-2 rounded-lg text-sm font-bold transition-all ${
              isActive
                ? 'bg-emerald-600 text-white shadow-lg shadow-emerald-600/20'
                : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800/50'
            }`}
          >
            <Calendar className="w-4 h-4" />
            Slot Management
          </NavLink>
          <NavLink
            to="/web-view"
            className={({ isActive }) => `flex items-center gap-2 px-5 py-2 rounded-lg text-sm font-bold transition-all ${
              isActive
                ? 'bg-indigo-600 text-white shadow-lg shadow-indigo-600/20'
                : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800/50'
            }`}
          >
            <Globe className="w-4 h-4" />
            Web View
          </NavLink>
        </nav>
      </div>

      {isSetup && (
        <div className="flex items-center gap-6">
          <div className="flex items-center bg-slate-800/50 rounded-full p-1 border border-slate-700/50">
            {['SETUP', 'DESIGN', 'PREVIEW'].map((step, idx) => (
              <span
                key={step}
                className={`px-4 py-1.5 rounded-full text-[11px] font-black uppercase tracking-wider transition-all ${
                  activeStep === AppStep[step]
                    ? 'bg-slate-700 text-white shadow-md'
                    : 'text-slate-500'
                }`}
              >
                {idx + 1}. {step}
              </span>
            ))}
          </div>

          <div className="h-6 w-[1px] bg-slate-800" />

          <div className="flex items-center gap-2">
            {activeStep !== AppStep.SETUP && (
              <button onClick={prevStep} className="flex items-center gap-2 px-4 py-2 rounded-xl bg-slate-800/80 hover:bg-slate-700 transition-colors border border-slate-700 text-xs font-bold">
                <ChevronLeft className="w-4 h-4" /> Back
              </button>
            )}
            {activeStep !== AppStep.PREVIEW ? (
              <button onClick={nextStep} className="flex items-center gap-2 px-6 py-2 rounded-xl bg-blue-600 hover:bg-blue-500 transition-all shadow-lg shadow-blue-500/20 text-xs font-black text-white uppercase tracking-widest">
                Continue <ChevronRight className="w-4 h-4" />
              </button>
            ) : (
              <JSONExport config={config} />
            )}
          </div>
        </div>
      )}
    </header>
  );
};

// --- Page Views ---

const HallSetupPage = ({ 
  config, setConfig, activeStep, setActiveStep, selectedSectionId, setSelectedSectionId,
  selectedSeatIds, handleToggleSeat, bookedSeatIds, handleUpdateSection, handleAddSection, handleDeleteSection
}) => {
  return (
    <div className="flex-1 flex overflow-hidden">
      <Sidebar
        activeStep={activeStep}
        config={config}
        setConfig={setConfig}
        selectedSectionId={selectedSectionId}
        setSelectedSectionId={setSelectedSectionId}
        onUpdateSection={handleUpdateSection}
        onAddSection={handleAddSection}
        onDeleteSection={handleDeleteSection}
      />
      <main className="flex-1 relative flex flex-col min-w-0 bg-[radial-gradient(#1e293b_1px,transparent_1px)] [background-size:32px_32px]">
        <SeatingChart
          config={config}
          activeStep={activeStep}
          onSectionMove={(id, x, y) => {
            setConfig((prev) => ({
              ...prev,
              sections: prev.sections.map(s => s.id === id ? { ...s, x, y } : s)
            }));
          }}
          onSeatClick={handleToggleSeat}
          selectedSeatIds={selectedSeatIds}
          bookedSeatIds={bookedSeatIds}
          selectedSectionId={selectedSectionId}
        />
        <div className="absolute bottom-8 left-8 right-8 flex justify-between items-end pointer-events-none">
          <Legend />
          {activeStep === AppStep.PREVIEW && <BookingBar selectedCount={selectedSeatIds.size} />}
        </div>
      </main>
    </div>
  );
};

const SlotManagementPage = () => (
  <main className="flex-1 flex flex-col items-center justify-center bg-slate-950 relative">
    <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,_var(--tw-gradient-stops))] from-emerald-500/5 via-transparent to-transparent pointer-events-none" />
    <div className="max-w-md w-full text-center space-y-8 p-12 rounded-3xl border border-slate-800 bg-slate-900/40 backdrop-blur-xl relative z-10">
      <div className="w-24 h-24 bg-emerald-500/10 rounded-full flex items-center justify-center mx-auto ring-8 ring-emerald-500/5">
        <Construction className="w-12 h-12 text-emerald-500 animate-bounce" />
      </div>
      <div className="space-y-4">
        <h2 className="text-3xl font-black tracking-tight text-white uppercase">Slot Management</h2>
        <div className="h-1 w-20 bg-emerald-500 mx-auto rounded-full" />
        <p className="text-slate-400 text-sm leading-relaxed font-medium">
          This module is currently under development. Slot management, time scheduling, and dynamic session pricing will be configured here in the future.
        </p>
      </div>
      <div className="pt-4">
        <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-slate-800 border border-slate-700 text-[10px] font-black text-slate-400 uppercase tracking-widest">
          <div className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
          Planned Feature
        </div>
      </div>
    </div>
  </main>
);

const WebViewPage = ({ selectedSeatIds, handleToggleSeat, bookedSeatIds }) => {
  // Use the provided EXAMPLE_PAYLOAD for rendering in Web View
  const config = EXAMPLE_PAYLOAD.config;

  return (
    <main className="flex-1 relative flex flex-col min-w-0 bg-[radial-gradient(#1e293b_1px,transparent_1px)] [background-size:32px_32px]">
      <div className="absolute top-6 left-6 z-10 pointer-events-none">
        <div className="bg-indigo-900/80 backdrop-blur border border-indigo-500/30 px-5 py-3 rounded-2xl shadow-2xl">
          <span className="text-[10px] font-black text-indigo-400 uppercase tracking-widest block mb-1">Live Web Interface</span>
          <h2 className="text-sm font-bold text-white uppercase">{EXAMPLE_PAYLOAD.hallName}</h2>
          <span className="text-[9px] text-indigo-300/60 font-mono">PAYLOAD V{EXAMPLE_PAYLOAD.version}</span>
        </div>
      </div>
      
      <SeatingChart
        config={config}
        activeStep={AppStep.PREVIEW} // Forced read-only view mode
        onSectionMove={() => {}} // Movement disabled in Web View
        onSeatClick={handleToggleSeat}
        selectedSeatIds={selectedSeatIds}
        bookedSeatIds={bookedSeatIds}
        selectedSectionId={null} // Selection highlight disabled
      />

      <div className="absolute bottom-8 left-8 right-8 flex justify-between items-end pointer-events-none">
        <Legend />
        <BookingBar selectedCount={selectedSeatIds.size} />
      </div>
    </main>
  );
};

const Legend = () => (
  <div className="bg-slate-900/90 backdrop-blur px-5 py-4 rounded-2xl border border-slate-800 shadow-2xl pointer-events-auto">
    <div className="text-[10px] font-black text-slate-500 uppercase tracking-widest mb-4">Seat Legend</div>
    <div className="flex gap-6">
      <div className="flex items-center gap-3">
        <div className="w-5 h-5 rounded-lg bg-slate-800 border border-slate-700"></div>
        <span className="text-xs font-bold text-slate-300">Available</span>
      </div>
      <div className="flex items-center gap-3">
        <div className="w-5 h-5 rounded-lg bg-blue-600 shadow-lg shadow-blue-600/30"></div>
        <span className="text-xs font-bold text-slate-300">Selected</span>
      </div>
      <div className="flex items-center gap-3">
        <div className="w-5 h-5 rounded-lg bg-slate-950 border border-slate-900 flex items-center justify-center opacity-60">
          <div className="w-3 h-[2px] bg-slate-600 rotate-45"></div>
        </div>
        <span className="text-xs font-bold text-slate-300">Booked</span>
      </div>
    </div>
  </div>
);

const BookingBar = ({ selectedCount }) => (
  <div className="bg-blue-600 px-6 py-4 rounded-2xl shadow-2xl shadow-blue-600/30 pointer-events-auto flex items-center gap-6 text-white border border-blue-400/20">
    <div className="flex flex-col">
      <span className="text-[10px] uppercase font-black opacity-70 tracking-tighter">Current Selection</span>
      <span className="text-xl font-black leading-tight tracking-tight">{selectedCount} Seats</span>
    </div>
    <div className="h-8 w-[1px] bg-white/20" />
    <button
      disabled={selectedCount === 0}
      className="bg-white text-blue-600 px-8 py-2.5 rounded-xl text-sm font-black disabled:opacity-50 disabled:cursor-not-allowed hover:scale-105 active:scale-95 transition-all shadow-xl shadow-black/20"
    >
      BOOK TICKETS
    </button>
  </div>
);

// --- Main App Component ---

const AppContent = () => {
  const [config, setConfig] = useState(INITIAL_HALL_CONFIG);
  const [activeStep, setActiveStep] = useState(AppStep.SETUP);
  const [selectedSectionId, setSelectedSectionId] = useState(config.sections[0]?.id || null);
  const [selectedSeatIds, setSelectedSeatIds] = useState(new Set());
  const [bookedSeatIds] = useState(new Set(['sec-1-0-5', 'sec-1-0-6']));

  const handleUpdateSection = useCallback((updatedSection) => {
    setConfig(prev => ({
      ...prev,
      sections: prev.sections.map(s => s.id === updatedSection.id ? updatedSection : s)
    }));
  }, []);

  const handleAddSection = useCallback(() => {
    const newId = `sec-${Date.now()}`;
    const newSection = {
      id: newId,
      name: `New Section ${config.sections.length + 1}`,
      rows: 5,
      cols: 10,
      x: 200,
      y: 400,
      rotation: 0,
      curveIntensity: 0,
      seatSize: 24,
      spacing: 8,
      color: '#3b82f6',
      rowLabelPrefix: 'A'
    };
    setConfig(prev => ({ ...prev, sections: [...prev.sections, newSection] }));
    setSelectedSectionId(newId);
  }, [config.sections.length]);

  const handleDeleteSection = useCallback((id) => {
    setConfig(prev => ({ ...prev, sections: prev.sections.filter(s => s.id !== id) }));
    if (selectedSectionId === id) setSelectedSectionId(null);
  }, [selectedSectionId]);

  const handleToggleSeat = useCallback((seatId) => {
    if (bookedSeatIds.has(seatId)) return;
    setSelectedSeatIds(prev => {
      const next = new Set(prev);
      if (next.has(seatId)) next.delete(seatId);
      else next.add(seatId);
      return next;
    });
  }, [bookedSeatIds]);

  const nextStep = () => {
    if (activeStep === AppStep.SETUP) setActiveStep(AppStep.DESIGN);
    else if (activeStep === AppStep.DESIGN) setActiveStep(AppStep.PREVIEW);
  };

  const prevStep = () => {
    if (activeStep === AppStep.PREVIEW) setActiveStep(AppStep.DESIGN);
    else if (activeStep === AppStep.DESIGN) setActiveStep(AppStep.SETUP);
  };

  return (
    <div className="flex flex-col h-screen w-screen overflow-hidden bg-slate-950 text-slate-200">
      <Navbar activeStep={activeStep} nextStep={nextStep} prevStep={prevStep} config={config} />
      <Routes>
        <Route path="/" element={
          <HallSetupPage 
            config={config} 
            setConfig={setConfig} 
            activeStep={activeStep} 
            setActiveStep={setActiveStep} 
            selectedSectionId={selectedSectionId} 
            setSelectedSectionId={setSelectedSectionId}
            selectedSeatIds={selectedSeatIds}
            handleToggleSeat={handleToggleSeat}
            bookedSeatIds={bookedSeatIds}
            handleUpdateSection={handleUpdateSection}
            handleAddSection={handleAddSection}
            handleDeleteSection={handleDeleteSection}
          />
        } />
        <Route path="/slot-management" element={<SlotManagementPage />} />
        <Route path="/web-view" element={
          <WebViewPage 
            selectedSeatIds={selectedSeatIds} 
            handleToggleSeat={handleToggleSeat} 
            bookedSeatIds={bookedSeatIds} 
          />
        } />
      </Routes>
    </div>
  );
};

const App = () => (
  <HashRouter>
    <AppContent />
  </HashRouter>
);

export default App;
