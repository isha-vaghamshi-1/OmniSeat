
import React, { useState } from 'react';
/* Fix: Import AppStep from types instead of constants */
import { AppStep } from '../types';
import { SECTION_COLORS } from '../constants';
import { 
  Plus, 
  Trash2, 
  Edit3, 
  Monitor, 
  ChevronDown, 
  ListOrdered, 
  FlipHorizontal, 
  FlipVertical, 
  ArrowLeftRight, 
  ArrowUpDown, 
  AlignRight, 
  Hash as HashIcon, 
  Settings
} from 'lucide-react';

const Sidebar = ({
  activeStep,
  config,
  setConfig,
  selectedSectionId,
  setSelectedSectionId,
  onUpdateSection,
  onAddSection,
  onDeleteSection,
}) => {
  const [expandRows, setExpandRows] = useState(false);
  const currentSection = config.sections.find(s => s.id === selectedSectionId);

  const updateSection = (updates) => {
    if (currentSection) {
      onUpdateSection({ ...currentSection, ...updates });
    }
  };

  const getRowLabel = (prefix, index) => {
    if (prefix.length === 1 && /[A-Za-z]/.test(prefix)) {
      return String.fromCharCode(prefix.charCodeAt(0) + index);
    }
    return `${prefix}${index + 1}`;
  };

  const renderSectionControls = () => (
    <div className="space-y-6 animate-in slide-in-from-left duration-300">
      <div className="space-y-2">
        <label className="text-xs font-bold text-slate-500 uppercase tracking-widest">Section List</label>
        <div className="grid grid-cols-1 gap-2">
          {config.sections.map(sec => (
            <button
              key={sec.id}
              onClick={() => setSelectedSectionId(sec.id)}
              className={`flex items-center justify-between p-3 rounded-xl border transition-all ${
                selectedSectionId === sec.id 
                ? 'bg-slate-800 border-slate-600 shadow-lg' 
                : 'bg-slate-900 border-slate-800 hover:border-slate-700'
              }`}
            >
              <div className="flex items-center gap-3">
                <div className="w-3 h-3 rounded-full" style={{ backgroundColor: sec.color }} />
                <span className="text-sm font-semibold truncate max-w-[120px]">{sec.name}</span>
              </div>
              <div className="flex items-center gap-1 opacity-100 transition-opacity">
                 {selectedSectionId === sec.id && (
                    <span className="text-[10px] bg-slate-700 text-slate-300 px-1.5 py-0.5 rounded font-bold">ACTIVE</span>
                 )}
              </div>
            </button>
          ))}
          <button 
            onClick={onAddSection}
            className="flex items-center justify-center gap-2 p-3 rounded-xl border border-dashed border-slate-700 hover:border-slate-500 hover:bg-slate-900 transition-all text-slate-400 hover:text-slate-200"
          >
            <Plus className="w-4 h-4" />
            <span className="text-sm font-semibold">Add Section</span>
          </button>
        </div>
      </div>

      {currentSection && (
        <div className="space-y-6 pt-4 border-t border-slate-800">
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <label className="text-xs font-bold text-slate-500 uppercase tracking-widest">Section Props</label>
              <button 
                onClick={() => onDeleteSection(currentSection.id)}
                className="text-red-400 hover:text-red-300 transition-colors"
              >
                <Trash2 className="w-4 h-4" />
              </button>
            </div>
            
            <div className="space-y-4">
              <div className="flex flex-col gap-1">
                <span className="text-xs text-slate-400">Name</span>
                <input 
                  type="text" 
                  value={currentSection.name}
                  onChange={e => updateSection({ name: e.target.value })}
                  className="bg-slate-800 border border-slate-700 rounded-lg px-3 py-2 text-sm outline-none focus:ring-2 focus:ring-blue-500 transition-all"
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="flex flex-col gap-1">
                  <span className="text-xs text-slate-400">Total Rows</span>
                  <input 
                    type="number" 
                    value={currentSection.rows}
                    onChange={e => updateSection({ rows: Math.max(1, parseInt(e.target.value) || 1) })}
                    className="bg-slate-800 border border-slate-700 rounded-lg px-3 py-2 text-sm outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>
                <div className="flex flex-col gap-1">
                  <span className="text-xs text-slate-400">Default Cols</span>
                  <input 
                    type="number" 
                    value={currentSection.cols}
                    onChange={e => updateSection({ cols: Math.max(1, parseInt(e.target.value) || 1) })}
                    className="bg-slate-800 border border-slate-700 rounded-lg px-3 py-2 text-sm outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>
              </div>

              <div className="space-y-3 pt-2">
                <label className="text-xs font-bold text-slate-500 uppercase tracking-widest block mb-2">Numbering Strategy</label>
                <div className="grid grid-cols-1 gap-3">
                  <div className="flex flex-col gap-1">
                    <span className="text-[10px] text-slate-400 uppercase">Start Number</span>
                    <div className="relative">
                      <input 
                        type="number" 
                        value={currentSection.startNumber ?? 1}
                        onChange={e => updateSection({ startNumber: parseInt(e.target.value) || 1 })}
                        className="w-full bg-slate-800 border border-slate-700 rounded-lg px-3 py-2 text-sm outline-none focus:ring-2 focus:ring-blue-500 pl-8"
                      />
                      <HashIcon className="absolute left-2.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-500" />
                    </div>
                  </div>
                  <div className="flex flex-col gap-1">
                    <span className="text-[10px] text-slate-400 uppercase">Mode</span>
                    <select 
                      value={currentSection.numberingMode ?? 'RESET_PER_ROW'}
                      onChange={e => updateSection({ numberingMode: e.target.value })}
                      className="bg-slate-800 border border-slate-700 rounded-lg px-3 py-2 text-sm outline-none focus:ring-2 focus:ring-blue-500 appearance-none cursor-pointer"
                    >
                      <option value="RESET_PER_ROW">Reset per Row</option>
                      <option value="CONTINUOUS">Continuous across Section</option>
                    </select>
                  </div>
                </div>
              </div>

              <div className="space-y-3 pt-2">
                <label className="text-xs font-bold text-slate-500 uppercase tracking-widest block mb-2">Orientation & Mirroring</label>
                <div className="grid grid-cols-2 gap-2">
                   <button 
                    onClick={() => updateSection({ flipHorizontal: !currentSection.flipHorizontal })}
                    className={`flex items-center gap-2 p-2 rounded-lg border text-[11px] font-bold transition-all ${currentSection.flipHorizontal ? 'bg-blue-600/20 border-blue-500 text-blue-400' : 'bg-slate-900 border-slate-800 text-slate-400 hover:border-slate-700'}`}
                   >
                     <FlipHorizontal className="w-3.5 h-3.5" /> flip UI Horiz
                   </button>
                   <button 
                    onClick={() => updateSection({ flipVertical: !currentSection.flipVertical })}
                    className={`flex items-center gap-2 p-2 rounded-lg border text-[11px] font-bold transition-all ${currentSection.flipVertical ? 'bg-blue-600/20 border-blue-500 text-blue-400' : 'bg-slate-900 border-slate-800 text-slate-400 hover:border-slate-700'}`}
                   >
                     <FlipVertical className="w-3.5 h-3.5" /> flip Ui Vert
                   </button>
                   <button 
                    onClick={() => updateSection({ flipSeatNumbers: !currentSection.flipSeatNumbers })}
                    className={`flex items-center gap-2 p-2 rounded-lg border text-[11px] font-bold transition-all ${currentSection.flipSeatNumbers ? 'bg-blue-600/20 border-blue-500 text-blue-400' : 'bg-slate-900 border-slate-800 text-slate-400 hover:border-slate-700'}`}
                   >
                     <ArrowLeftRight className="w-3.5 h-3.5" /> Flip Seats
                   </button>
                </div>
              </div>

              <div className="space-y-3 pt-2">
                <label className="text-xs font-bold text-slate-500 uppercase tracking-widest block mb-2">Label Alignment & Order</label>
                <div className="grid grid-cols-2 gap-2">
                   <button 
                    onClick={() => updateSection({ flipLabelsHorizontal: !currentSection.flipLabelsHorizontal })}
                    className={`flex items-center gap-2 p-2 rounded-lg border text-[11px] font-bold transition-all ${currentSection.flipLabelsHorizontal ? 'bg-indigo-600/20 border-indigo-500 text-indigo-400' : 'bg-slate-900 border-slate-800 text-slate-400 hover:border-slate-700'}`}
                   >
                     <AlignRight className="w-3.5 h-3.5" /> Flip Labels Horiz
                   </button>
                   <button 
                    onClick={() => updateSection({ flipRowLabels: !currentSection.flipRowLabels })}
                    className={`flex items-center gap-2 p-2 rounded-lg border text-[11px] font-bold transition-all ${currentSection.flipRowLabels ? 'bg-indigo-600/20 border-indigo-500 text-indigo-400' : 'bg-slate-900 border-slate-800 text-slate-400 hover:border-slate-700'}`}
                   >
                     <ArrowUpDown className="w-3.5 h-3.5" /> Flip Labels Vert
                   </button>
                </div>
              </div>

              <div className="space-y-2">
                <button 
                  onClick={() => setExpandRows(!expandRows)}
                  className="w-full flex items-center justify-between p-3 rounded-lg bg-slate-900 border border-slate-800 hover:border-slate-700 transition-colors group"
                >
                  <div className="flex items-center gap-2">
                    <ListOrdered className="w-4 h-4 text-blue-400" />
                    <span className="text-xs font-bold text-slate-300">Configure Individual Rows</span>
                  </div>
                  <ChevronDown className={`w-4 h-4 text-slate-500 transition-transform ${expandRows ? 'rotate-180' : ''}`} />
                </button>

                {expandRows && (
                  <div className="space-y-2 p-3 bg-slate-950 rounded-lg border border-slate-800 animate-in fade-in slide-in-from-top-2 duration-200">
                    <p className="text-[10px] text-slate-500 mb-3 italic">Override settings for specific rows.</p>
                    <div className="space-y-4 max-h-[400px] overflow-y-auto pr-2 custom-scrollbar text-slate-300">
                      {Array.from({ length: currentSection.rows }).map((_, idx) => {
                        const defaultLabel = getRowLabel(currentSection.rowLabelPrefix, idx);
                        const rowSetting = currentSection.rowSettings?.[idx];
                        const customCols = rowSetting?.cols ?? currentSection.cols;
                        const customLabel = rowSetting?.label ?? defaultLabel;
                        const customStart = rowSetting?.startNumber;

                        return (
                          <div key={idx} className="p-3 bg-slate-900/50 rounded-lg border border-slate-800/50 space-y-3">
                            <div className="flex items-center justify-between gap-4">
                              <div className="flex flex-col gap-1 flex-1">
                                <span className="text-[10px] uppercase font-bold text-slate-500">Row Label</span>
                                <input 
                                  type="text" 
                                  value={customLabel}
                                  onChange={(e) => {
                                    const val = e.target.value;
                                    const newSettings = { ...currentSection.rowSettings };
                                    newSettings[idx] = { ...(newSettings[idx] || { cols: currentSection.cols }), label: val };
                                    updateSection({ rowSettings: newSettings });
                                  }}
                                  className="w-full bg-slate-800 border border-slate-700 rounded-lg px-3 py-1.5 text-xs outline-none focus:ring-1 focus:ring-blue-500"
                                />
                              </div>
                              
                              <div className="flex flex-col gap-1 w-20">
                                <span className="text-[10px] uppercase font-bold text-slate-500">Seats</span>
                                <input 
                                  type="number" 
                                  value={customCols}
                                  onChange={(e) => {
                                    const val = Math.max(1, parseInt(e.target.value) || 1);
                                    const newSettings = { ...currentSection.rowSettings };
                                    newSettings[idx] = { ...(newSettings[idx] || { label: defaultLabel }), cols: val };
                                    updateSection({ rowSettings: newSettings });
                                  }}
                                  className="w-full bg-slate-800 border border-slate-700 rounded-lg px-3 py-1.5 text-xs outline-none focus:ring-1 focus:ring-blue-500"
                                />
                              </div>
                            </div>
                            
                            <div className="flex flex-col gap-1">
                              <span className="text-[10px] uppercase font-bold text-slate-500">Start Number</span>
                              <input 
                                type="number" 
                                value={customStart ?? ''}
                                placeholder="Default"
                                onChange={(e) => {
                                  const val = e.target.value === '' ? undefined : parseInt(e.target.value);
                                  const newSettings = { ...currentSection.rowSettings };
                                  newSettings[idx] = { ...(newSettings[idx] || { label: defaultLabel, cols: currentSection.cols }), startNumber: val };
                                  updateSection({ rowSettings: newSettings });
                                }}
                                className="w-full bg-slate-800 border border-slate-700 rounded-lg px-3 py-1.5 text-xs outline-none focus:ring-1 focus:ring-blue-500"
                              />
                            </div>
                          </div>
                        );
                      })}
                    </div>
                  </div>
                )}
              </div>

              <div className="flex flex-col gap-1">
                <span className="text-xs text-slate-400">Row Prefix</span>
                <input 
                  type="text" 
                  value={currentSection.rowLabelPrefix}
                  onChange={e => updateSection({ rowLabelPrefix: e.target.value })}
                  placeholder="e.g. A"
                  className="bg-slate-800 border border-slate-700 rounded-lg px-3 py-2 text-sm outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>

              <div className="flex flex-col gap-2">
                <span className="text-xs text-slate-400">Color</span>
                <div className="flex flex-wrap gap-2">
                  {SECTION_COLORS.map(c => (
                    <button 
                      key={c}
                      onClick={() => updateSection({ color: c })}
                      className={`w-6 h-6 rounded-full border-2 transition-transform hover:scale-110 ${currentSection.color === c ? 'border-white' : 'border-transparent'}`}
                      style={{ backgroundColor: c }}
                    />
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );

  const renderDesignControls = () => (
    <div className="space-y-8 animate-in slide-in-from-left duration-300">
      {currentSection ? (
        <div className="space-y-6">
          <div className="flex items-center gap-2 mb-2">
            <div className="w-2 h-2 rounded-full" style={{ backgroundColor: currentSection.color }} />
            <h3 className="text-sm font-bold uppercase tracking-wide">{currentSection.name}</h3>
          </div>

          <div className="space-y-6">
            <div className="space-y-3">
              <div className="flex justify-between items-center">
                <label className="text-xs font-medium text-slate-400">Rotation</label>
                <span className="text-[10px] bg-slate-800 text-blue-400 px-2 py-0.5 rounded-full font-bold">{currentSection.rotation}°</span>
              </div>
              <input 
                type="range" min="-180" max="180" 
                value={currentSection.rotation}
                onChange={e => updateSection({ rotation: parseInt(e.target.value) })}
                className="w-full h-1.5 bg-slate-800 rounded-lg appearance-none cursor-pointer accent-blue-600"
              />
            </div>

            <div className="space-y-3">
              <div className="flex justify-between items-center">
                <label className="text-xs font-medium text-slate-400">Curve Intensity</label>
                <span className="text-[10px] bg-slate-800 text-blue-400 px-2 py-0.5 rounded-full font-bold">{currentSection.curveIntensity}%</span>
              </div>
              <input 
                type="range" min="0" max="200" 
                value={currentSection.curveIntensity}
                onChange={e => updateSection({ curveIntensity: parseInt(e.target.value) })}
                className="w-full h-1.5 bg-slate-800 rounded-lg appearance-none cursor-pointer accent-blue-600"
              />
            </div>

            <div className="space-y-3">
              <div className="flex justify-between items-center">
                <label className="text-xs font-medium text-slate-400">Seat Spacing</label>
                <span className="text-[10px] bg-slate-800 text-blue-400 px-2 py-0.5 rounded-full font-bold">{currentSection.spacing}px</span>
              </div>
              <input 
                type="range" min="2" max="30" 
                value={currentSection.spacing}
                onChange={e => updateSection({ spacing: parseInt(e.target.value) })}
                className="w-full h-1.5 bg-slate-800 rounded-lg appearance-none cursor-pointer accent-blue-600"
              />
            </div>

            <div className="space-y-3">
              <div className="flex justify-between items-center">
                <label className="text-xs font-medium text-slate-400">Seat Size</label>
                <span className="text-[10px] bg-slate-800 text-blue-400 px-2 py-0.5 rounded-full font-bold">{currentSection.seatSize}px</span>
              </div>
              <input 
                type="range" min="10" max="60" 
                value={currentSection.seatSize}
                onChange={e => updateSection({ seatSize: parseInt(e.target.value) })}
                className="w-full h-1.5 bg-slate-800 rounded-lg appearance-none cursor-pointer accent-blue-600"
              />
            </div>
          </div>
        </div>
      ) : (
        <div className="text-center py-12 text-slate-500">
          <Edit3 className="w-10 h-10 mx-auto mb-4 opacity-20" />
          <p className="text-sm">Select a section to customize its layout</p>
        </div>
      )}

      <div className="pt-8 border-t border-slate-800 space-y-4">
        <label className="text-xs font-bold text-slate-500 uppercase tracking-widest">Hall Layout</label>
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Monitor className="w-4 h-4 text-slate-400" />
              <span className="text-xs text-slate-300">Screen/Stage</span>
            </div>
            <button 
              onClick={() => setConfig({ ...config, screen: { ...config.screen, visible: !config.screen.visible }})}
              className={`w-10 h-5 rounded-full relative transition-colors ${config.screen.visible ? 'bg-blue-600' : 'bg-slate-700'}`}
            >
              <div className={`absolute top-1 w-3 h-3 rounded-full bg-white transition-all ${config.screen.visible ? 'right-1' : 'left-1'}`} />
            </button>
          </div>
          {config.screen.visible && (
            <div className="space-y-3 animate-in fade-in zoom-in duration-200">
              <input 
                type="text" 
                value={config.screen.label}
                onChange={e => setConfig({ ...config, screen: { ...config.screen, label: e.target.value }})}
                placeholder="Stage Name"
                className="w-full bg-slate-800 border border-slate-700 rounded-lg px-3 py-1.5 text-xs outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>
          )}
        </div>
      </div>
    </div>
  );

  const renderPreviewInfo = () => (
    <div className="space-y-6 animate-in slide-in-from-left duration-300">
      <div className="bg-blue-600/10 border border-blue-500/20 rounded-xl p-4">
        <div className="flex items-center gap-3 text-blue-400 mb-2">
          <Settings className="w-5 h-5" />
          <h3 className="font-bold text-sm">Design Locked</h3>
        </div>
        <p className="text-xs text-slate-400 leading-relaxed">
          The hall layout is now locked for preview. You can simulate bookings by clicking on available seats.
        </p>
      </div>

      <div className="space-y-4">
        <label className="text-xs font-bold text-slate-500 uppercase tracking-widest">Hall Statistics</label>
        <div className="grid grid-cols-2 gap-3">
          <div className="bg-slate-900 border border-slate-800 rounded-xl p-3 flex flex-col">
            <span className="text-[10px] text-slate-500 uppercase font-bold">Total Sections</span>
            <span className="text-xl font-bold">{config.sections.length}</span>
          </div>
          <div className="bg-slate-900 border border-slate-800 rounded-xl p-3 flex flex-col">
            <span className="text-[10px] text-slate-500 uppercase font-bold">Total Seats</span>
            <span className="text-xl font-bold">{config.sections.reduce((acc, s) => {
              let count = 0;
              for (let i = 0; i < s.rows; i++) {
                count += s.rowSettings?.[i]?.cols ?? s.cols;
              }
              return acc + count;
            }, 0)}</span>
          </div>
        </div>
      </div>
    </div>
  );

  return (
    <aside className="w-[320px] h-full bg-slate-900 border-r border-slate-800 flex flex-col z-20 overflow-y-auto custom-scrollbar">
      <div className="p-6 space-y-6">
        <div className="flex items-center gap-3 mb-2 border-b border-slate-800 pb-4">
          <Settings className="w-5 h-5 text-blue-400" />
          <div>
            <h2 className="text-sm font-black uppercase tracking-widest text-white">Configurator</h2>
            <p className="text-[10px] font-bold text-slate-500">
              {activeStep === AppStep.SETUP ? 'HALL SETUP' : activeStep === AppStep.DESIGN ? 'LAYOUT DESIGN' : 'PREVIEW MODE'}
            </p>
          </div>
        </div>

        {activeStep === AppStep.SETUP && renderSectionControls()}
        {activeStep === AppStep.DESIGN && renderDesignControls()}
        {activeStep === AppStep.PREVIEW && renderPreviewInfo()}
      </div>

      <div className="mt-auto p-6 border-t border-slate-800 bg-slate-900/80 backdrop-blur sticky bottom-0 z-30">
        <div className="flex items-center justify-between mb-4">
          <span className="text-xs text-slate-500 font-semibold uppercase">Workspace Scale</span>
          <span className="text-[10px] bg-slate-800 px-2 py-0.5 rounded text-slate-300">100%</span>
        </div>
        <div className="w-full h-1 bg-slate-800 rounded-full">
           <div className="w-full h-full bg-blue-600 rounded-full" />
        </div>
      </div>
    </aside>
  );
};

export default Sidebar;
