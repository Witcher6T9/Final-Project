/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect } from 'react';
import {
  X,
  Settings,
  Layout,
  Palette,
  Check,
  Volume2,
  VolumeX,
  BellRing,
  Play,
  Shield,
  Factory,
  Building2,
  Plus,
  Trash2,
  Edit2,
  RotateCcw,
  Sparkles,
  MapPin,
  Tag,
  Briefcase,
  CheckCircle2,
  Layers,
  ArrowRight
} from 'lucide-react';
import { ThemeType, DashboardLayout, FactoryIndustryProfile } from '../types';
import { playWipAlertSound, playBottleneckAlertSound } from '../utils/audioAlert';
import {
  DEFAULT_FACTORY_PROFILE,
  PRESET_FACTORIES,
  INDUSTRY_SECTORS
} from '../data/factoryProfiles';

export type SettingsTab = 'factory' | 'themes' | 'alerts' | 'layout';

interface SettingsModalProps {
  isOpen: boolean;
  onClose: () => void;
  currentTheme: ThemeType;
  onSelectTheme: (theme: ThemeType) => void;
  layout: DashboardLayout;
  onUpdateLayout: (layout: DashboardLayout) => void;
  auditoryAlertsEnabled?: boolean;
  onToggleAuditoryAlerts?: (enabled: boolean) => void;
  onOpenPrivacySecurity?: () => void;
  factoryProfile: FactoryIndustryProfile;
  onUpdateFactoryProfile: (updated: FactoryIndustryProfile) => void;
  savedFactories: FactoryIndustryProfile[];
  onSaveFactoryList: (list: FactoryIndustryProfile[]) => void;
  initialTab?: SettingsTab;
}

export const SettingsModal: React.FC<SettingsModalProps> = ({
  isOpen,
  onClose,
  currentTheme,
  onSelectTheme,
  layout,
  onUpdateLayout,
  auditoryAlertsEnabled = false,
  onToggleAuditoryAlerts,
  onOpenPrivacySecurity,
  factoryProfile,
  onUpdateFactoryProfile,
  savedFactories,
  onSaveFactoryList,
  initialTab = 'factory'
}) => {
  const [activeTab, setActiveTab] = useState<SettingsTab>(initialTab);
  const [playingTestSound, setPlayingTestSound] = useState<'wip' | 'bottleneck' | null>(null);

  // Factory creation / edit form state
  const [isCreatingFactory, setIsCreatingFactory] = useState<boolean>(false);
  const [editingFactoryId, setEditingFactoryId] = useState<string | null>(null);
  const [formName, setFormName] = useState<string>('');
  const [formUnitName, setFormUnitName] = useState<string>('');
  const [formSector, setFormSector] = useState<string>(INDUSTRY_SECTORS[0]);
  const [formCustomSector, setFormCustomSector] = useState<string>('');
  const [formDepartment, setFormDepartment] = useState<string>('Industrial Engineering (IE) Dept.');
  const [formCode, setFormCode] = useState<string>('');
  const [formAddress, setFormAddress] = useState<string>('');
  const [formLinesCount, setFormLinesCount] = useState<number>(34);
  const [formEmail, setFormEmail] = useState<string>('');
  const [formSuccessMessage, setFormSuccessMessage] = useState<string | null>(null);

  // Sync initial tab when opened
  useEffect(() => {
    if (isOpen && initialTab) {
      setActiveTab(initialTab);
    }
  }, [isOpen, initialTab]);

  if (!isOpen) return null;

  const handleTestSound = (type: 'wip' | 'bottleneck') => {
    setPlayingTestSound(type);
    if (type === 'wip') {
      playWipAlertSound(true);
    } else {
      playBottleneckAlertSound(true);
    }
    setTimeout(() => {
      setPlayingTestSound(null);
    }, 700);
  };

  const handleToggleAudio = () => {
    if (onToggleAuditoryAlerts) {
      const nextState = !auditoryAlertsEnabled;
      onToggleAuditoryAlerts(nextState);
      if (nextState) {
        playWipAlertSound(true);
      }
    }
  };

  const startCreateNewFactory = () => {
    setEditingFactoryId(null);
    setFormName('');
    setFormUnitName('Unit-01');
    setFormSector(INDUSTRY_SECTORS[0]);
    setFormCustomSector('');
    setFormDepartment('Industrial Engineering (IE) Dept.');
    setFormCode('FAC-01');
    setFormAddress('Industrial Zone, Dhaka');
    setFormLinesCount(24);
    setFormEmail('');
    setIsCreatingFactory(true);
    setFormSuccessMessage(null);
  };

  const startEditFactory = (item: FactoryIndustryProfile) => {
    setEditingFactoryId(item.id);
    setFormName(item.name);
    setFormUnitName(item.unitName);
    if (INDUSTRY_SECTORS.includes(item.industrySector)) {
      setFormSector(item.industrySector);
      setFormCustomSector('');
    } else {
      setFormSector('Custom Industrial Manufacturing');
      setFormCustomSector(item.industrySector);
    }
    setFormDepartment(item.department || 'Industrial Engineering (IE) Dept.');
    setFormCode(item.factoryCode || '');
    setFormAddress(item.addressLocation || '');
    setFormLinesCount(item.totalLinesCount || 34);
    setFormEmail(item.contactEmail || '');
    setIsCreatingFactory(true);
    setFormSuccessMessage(null);
  };

  const handleSaveFactoryForm = (e: React.FormEvent) => {
    e.preventDefault();
    const finalSector =
      formSector === 'Custom Industrial Manufacturing' && formCustomSector.trim()
        ? formCustomSector.trim()
        : formSector;

    if (!formName.trim()) {
      alert('Please provide a valid Factory / Industry Name.');
      return;
    }

    const newProfile: FactoryIndustryProfile = {
      id: editingFactoryId || `custom_factory_${Date.now()}`,
      name: formName.trim(),
      unitName: formUnitName.trim() || 'Unit-01',
      industrySector: finalSector,
      department: formDepartment.trim() || 'Industrial Engineering (IE) Dept.',
      factoryCode: formCode.trim().toUpperCase() || 'PLANT-01',
      addressLocation: formAddress.trim(),
      shortTag: formCode.trim() ? formCode.trim().toUpperCase() : formName.trim().slice(0, 4).toUpperCase(),
      totalLinesCount: Number(formLinesCount) || 34,
      contactEmail: formEmail.trim(),
      isCustom: true
    };

    // Update active factory
    onUpdateFactoryProfile(newProfile);

    // Update saved factories list
    const existingIndex = savedFactories.findIndex(f => f.id === newProfile.id);
    let updatedList: FactoryIndustryProfile[];
    if (existingIndex >= 0) {
      updatedList = [...savedFactories];
      updatedList[existingIndex] = newProfile;
    } else {
      updatedList = [newProfile, ...savedFactories];
    }
    onSaveFactoryList(updatedList);

    setFormSuccessMessage(`Enterprise profile "${newProfile.name} • ${newProfile.unitName}" activated successfully!`);
    setIsCreatingFactory(false);
    setEditingFactoryId(null);

    setTimeout(() => {
      setFormSuccessMessage(null);
    }, 4000);
  };

  const handleSelectActiveFactory = (selected: FactoryIndustryProfile) => {
    onUpdateFactoryProfile(selected);
    setFormSuccessMessage(`Switched active factory to "${selected.name} (${selected.unitName})"`);
    setTimeout(() => {
      setFormSuccessMessage(null);
    }, 3500);
  };

  const handleDeleteFactory = (id: string, name: string) => {
    if (id === factoryProfile.id) {
      alert('Cannot delete the currently active factory profile. Please switch to another factory first.');
      return;
    }
    if (window.confirm(`Are you sure you want to remove "${name}" from your saved factories directory?`)) {
      const filtered = savedFactories.filter(f => f.id !== id);
      onSaveFactoryList(filtered);
    }
  };

  const handleResetToDebonair = () => {
    onUpdateFactoryProfile(DEFAULT_FACTORY_PROFILE);
    onSaveFactoryList(PRESET_FACTORIES);
    setFormSuccessMessage('Reset to Debonair LTD (Unit-02) standard factory profile.');
    setIsCreatingFactory(false);
    setTimeout(() => {
      setFormSuccessMessage(null);
    }, 3500);
  };

  const themes: { id: ThemeType; label: string; desc: string; previewClass: string }[] = [
    {
      id: 'light',
      label: 'Standard Warm Cream (Default)',
      desc: 'Eye-comfortable warm neutral canvas optimized for long shift operations',
      previewClass: 'bg-[#f5f3ec] border-[#176f78] text-[#17343a]'
    },
    {
      id: 'dark',
      label: 'Night Shift Darkroom',
      desc: 'Low-glare high contrast slate theme for evening shifts and dimmer monitoring rooms',
      previewClass: 'bg-[#182026] border-teal-500 text-slate-100'
    },
    {
      id: 'forest',
      label: 'Lean Emerald Kaizen',
      desc: 'Crisp green hues highlighting continuous improvement and zero-defect focus',
      previewClass: 'bg-[#f0f7f3] border-emerald-700 text-emerald-950'
    },
    {
      id: 'sunset',
      label: 'Amber Production Floor',
      desc: 'Warm amber tones designed for high-density line management and urgent alerting',
      previewClass: 'bg-[#fffaf2] border-amber-600 text-amber-950'
    },
    {
      id: 'industrial',
      label: 'Industrial Monolith',
      desc: 'Technical steel and graphite theme inspired by modern Japanese sewing equipment',
      previewClass: 'bg-[#eef2f5] border-slate-700 text-slate-900'
    }
  ];

  const layoutToggles: { key: keyof DashboardLayout; label: string; desc: string }[] = [
    {
      key: 'showHero',
      label: 'Executive Overview Header Card',
      desc: 'Top summary banner with live date and real-time operational status badge'
    },
    {
      key: 'showStats',
      label: 'KPI Metrics & Attainment Strip',
      desc: '6 core factory indicators: Factory Eff %, Target vs Achieved, WIP buffer, Attendance'
    },
    {
      key: 'showQuickActions',
      label: 'Frontline Quick Actions Bar',
      desc: 'Fast shortcuts for checklist logging, daily report downloads, and team setup'
    },
    {
      key: 'showAbsents',
      label: 'Operator & Helper Absenteeism Breakdown',
      desc: 'Floor-by-floor manpower attendance rates with shortage impact analysis'
    },
    {
      key: 'showBalancingGraph',
      label: 'Line Balancing Loss & Bottleneck Alerts',
      desc: 'Real-time bottleneck warnings, cycle time deviations, and balancing status'
    },
    {
      key: 'showIO',
      label: 'Input / Output (I/O) Production Flow',
      desc: 'Hourly pacing tracking input vs output pieces with WIP threshold monitoring'
    },
    {
      key: 'showUpcoming',
      label: 'Upcoming Style Transitions & Changeover',
      desc: 'Notice board for next scheduled style inputs and pre-production sample readiness'
    },
    {
      key: 'showQuickReports',
      label: 'Quick Reports & Executive Rollup Widget',
      desc: 'Instant 3-pillar summary of plant efficiency, WIP count, and manpower across all active lines with export'
    }
  ];

  const handleToggleLayout = (key: keyof DashboardLayout) => {
    onUpdateLayout({
      ...layout,
      [key]: !layout[key]
    });
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-black/60 backdrop-blur-xs animate-fadeIn">
      <div className="relative w-full max-w-3xl rounded-3xl bg-[#fbfaf6] border border-[#d9d2c2] shadow-2xl flex flex-col max-h-[92vh] overflow-hidden">
        {/* Modal Header */}
        <div className="flex items-center justify-between px-5 sm:px-6 py-4 border-b border-[#e7e1d5] bg-white">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-[#176f78] text-white flex items-center justify-center shadow-xs">
              <Settings className="w-5 h-5" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h2 className="font-display text-base sm:text-lg font-bold uppercase text-[#17343a]">
                  System Settings &amp; Factory Identity
                </h2>
                <span className="px-2 py-0.5 rounded-md text-[10px] font-bold bg-[#176f78]/10 text-[#176f78] border border-[#176f78]/20 font-mono">
                  {factoryProfile.unitName || 'Unit-02'}
                </span>
              </div>
              <p className="text-xs text-[#527078]">
                Configure enterprise factory name, industry sector, operational appearance, and telemetry
              </p>
            </div>
          </div>

          <button
            onClick={onClose}
            className="p-2 rounded-xl text-[#527078] hover:text-[#17343a] hover:bg-[#f1eee6] transition-colors cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Tab Navigation Bar */}
        <div className="flex items-center gap-1.5 px-4 sm:px-6 py-2 border-b border-[#e7e1d5] bg-[#f5f3ec] overflow-x-auto no-scrollbar">
          <button
            type="button"
            onClick={() => setActiveTab('factory')}
            className={`flex items-center gap-2 px-3 sm:px-4 py-2 rounded-xl text-xs font-bold transition-all cursor-pointer whitespace-nowrap ${
              activeTab === 'factory'
                ? 'bg-[#176f78] text-white shadow-xs'
                : 'text-[#17343a] hover:bg-white/80'
            }`}
          >
            <Factory className="w-3.5 h-3.5" />
            <span>Factory &amp; Industry Name</span>
            <span className="text-[10px] px-1.5 py-0.2 rounded-full bg-white/20 text-white font-mono">
              Live
            </span>
          </button>

          <button
            type="button"
            onClick={() => setActiveTab('themes')}
            className={`flex items-center gap-2 px-3 sm:px-4 py-2 rounded-xl text-xs font-bold transition-all cursor-pointer whitespace-nowrap ${
              activeTab === 'themes'
                ? 'bg-[#176f78] text-white shadow-xs'
                : 'text-[#17343a] hover:bg-white/80'
            }`}
          >
            <Palette className="w-3.5 h-3.5" />
            <span>Themes &amp; Styling</span>
          </button>

          <button
            type="button"
            onClick={() => setActiveTab('alerts')}
            className={`flex items-center gap-2 px-3 sm:px-4 py-2 rounded-xl text-xs font-bold transition-all cursor-pointer whitespace-nowrap ${
              activeTab === 'alerts'
                ? 'bg-[#176f78] text-white shadow-xs'
                : 'text-[#17343a] hover:bg-white/80'
            }`}
          >
            <Volume2 className="w-3.5 h-3.5" />
            <span>Auditory Alerts</span>
            {auditoryAlertsEnabled && (
              <span className="w-2 h-2 rounded-full bg-emerald-400" />
            )}
          </button>

          <button
            type="button"
            onClick={() => setActiveTab('layout')}
            className={`flex items-center gap-2 px-3 sm:px-4 py-2 rounded-xl text-xs font-bold transition-all cursor-pointer whitespace-nowrap ${
              activeTab === 'layout'
                ? 'bg-[#176f78] text-white shadow-xs'
                : 'text-[#17343a] hover:bg-white/80'
            }`}
          >
            <Layout className="w-3.5 h-3.5" />
            <span>Dashboard Layout</span>
          </button>
        </div>

        {/* Global Feedback Banner */}
        {formSuccessMessage && (
          <div className="mx-6 mt-4 p-3 rounded-2xl bg-emerald-50 border border-emerald-300 text-emerald-900 text-xs font-bold flex items-center gap-2 animate-fadeIn shadow-2xs">
            <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
            <span>{formSuccessMessage}</span>
          </div>
        )}

        {/* Scrollable Modal Content Body */}
        <div className="flex-1 overflow-y-auto p-5 sm:p-6 space-y-6">
          {/* TAB 1: FACTORY & INDUSTRY IDENTITY */}
          {activeTab === 'factory' && (
            <div className="space-y-6">
              {/* Active Enterprise Banner Card */}
              <div className="p-4 sm:p-5 rounded-3xl bg-gradient-to-br from-[#176f78]/10 via-white to-[#f5f3ec] border border-[#176f78]/30 shadow-xs space-y-4">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                  <div className="flex items-center gap-3">
                    <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-[#176f78] to-[#0f4e55] text-white flex items-center justify-center shadow-md shrink-0">
                      <Building2 className="w-6 h-6 stroke-[2]" />
                    </div>
                    <div>
                      <div className="flex items-center gap-2 flex-wrap">
                        <span className="text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded-full bg-[#176f78] text-white font-mono">
                          Active Enterprise Plant
                        </span>
                        <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-emerald-100 text-emerald-800 border border-emerald-200">
                          Live Cockpit Brand
                        </span>
                      </div>
                      <h3 className="text-lg font-black text-[#17343a] mt-0.5 font-display flex items-center gap-2">
                        <span>{factoryProfile.name}</span>
                        <span className="text-sm font-semibold text-[#176f78] bg-[#176f78]/10 px-2 py-0.5 rounded-lg border border-[#176f78]/20">
                          {factoryProfile.unitName}
                        </span>
                      </h3>
                    </div>
                  </div>

                  <div className="flex items-center gap-2 self-start sm:self-auto">
                    <button
                      type="button"
                      onClick={() => startEditFactory(factoryProfile)}
                      className="px-3 py-1.5 rounded-xl border border-[#176f78] text-[#176f78] hover:bg-[#176f78] hover:text-white transition-all text-xs font-bold flex items-center gap-1.5 cursor-pointer shadow-2xs"
                    >
                      <Edit2 className="w-3.5 h-3.5" />
                      <span>Edit Info</span>
                    </button>
                    <button
                      type="button"
                      onClick={startCreateNewFactory}
                      className="px-3.5 py-1.5 rounded-xl bg-[#176f78] text-white hover:bg-[#12555c] transition-all text-xs font-bold flex items-center gap-1.5 cursor-pointer shadow-xs"
                    >
                      <Plus className="w-3.5 h-3.5" />
                      <span>+ Create Factory</span>
                    </button>
                  </div>
                </div>

                {/* Key metadata grid */}
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5 pt-2 text-xs border-t border-[#d9d2c2]">
                  <div className="p-2.5 rounded-xl bg-white border border-[#e7e1d5]">
                    <span className="text-[10px] text-[#527078] font-semibold block uppercase">Sector / Industry</span>
                    <span className="font-bold text-[#17343a] truncate block mt-0.5">
                      {factoryProfile.industrySector}
                    </span>
                  </div>
                  <div className="p-2.5 rounded-xl bg-white border border-[#e7e1d5]">
                    <span className="text-[10px] text-[#527078] font-semibold block uppercase">Governing Dept.</span>
                    <span className="font-bold text-[#17343a] truncate block mt-0.5">
                      {factoryProfile.department}
                    </span>
                  </div>
                  <div className="p-2.5 rounded-xl bg-white border border-[#e7e1d5]">
                    <span className="text-[10px] text-[#527078] font-semibold block uppercase">Plant Code</span>
                    <span className="font-bold text-[#176f78] font-mono block mt-0.5">
                      {factoryProfile.factoryCode || 'DBN-U02'}
                    </span>
                  </div>
                  <div className="p-2.5 rounded-xl bg-white border border-[#e7e1d5]">
                    <span className="text-[10px] text-[#527078] font-semibold block uppercase">Production Lines</span>
                    <span className="font-bold text-[#17343a] block mt-0.5">
                      {factoryProfile.totalLinesCount || 34} Sewing Lines
                    </span>
                  </div>
                </div>

                {factoryProfile.addressLocation && (
                  <div className="text-[11px] text-[#527078] flex items-center gap-1.5 pt-1">
                    <MapPin className="w-3.5 h-3.5 text-[#176f78] shrink-0" />
                    <span>{factoryProfile.addressLocation}</span>
                  </div>
                )}
              </div>

              {/* Create / Edit Form Drawer */}
              {isCreatingFactory && (
                <form
                  onSubmit={handleSaveFactoryForm}
                  className="p-5 rounded-3xl bg-white border-2 border-[#176f78]/40 shadow-md space-y-4 animate-fadeIn"
                >
                  <div className="flex items-center justify-between border-b border-[#e7e1d5] pb-3">
                    <div className="flex items-center gap-2">
                      <div className="w-8 h-8 rounded-xl bg-[#176f78] text-white flex items-center justify-center">
                        <Factory className="w-4 h-4" />
                      </div>
                      <h4 className="font-bold text-sm text-[#17343a]">
                        {editingFactoryId ? 'Edit Factory / Industry Profile' : 'Create New Factory / Industry Profile'}
                      </h4>
                    </div>
                    <button
                      type="button"
                      onClick={() => setIsCreatingFactory(false)}
                      className="text-xs text-[#527078] hover:text-[#17343a] font-bold p-1 rounded-lg hover:bg-[#f1eee6]"
                    >
                      Cancel
                    </button>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
                    <div>
                      <label className="block text-[11px] font-bold uppercase text-[#527078] mb-1">
                        Factory / Enterprise Name *
                      </label>
                      <input
                        type="text"
                        required
                        value={formName}
                        onChange={e => setFormName(e.target.value)}
                        placeholder="e.g. Debonair LTD or Apex Apparels"
                        className="w-full px-3 py-2 rounded-xl border border-[#d9d2c2] text-xs font-semibold text-[#17343a] focus:ring-2 focus:ring-[#176f78] focus:border-[#176f78] bg-[#fbfaf6]"
                      />
                    </div>

                    <div>
                      <label className="block text-[11px] font-bold uppercase text-[#527078] mb-1">
                        Unit / Facility / Plant Designation *
                      </label>
                      <input
                        type="text"
                        required
                        value={formUnitName}
                        onChange={e => setFormUnitName(e.target.value)}
                        placeholder="e.g. Unit-02 or Plant-04"
                        className="w-full px-3 py-2 rounded-xl border border-[#d9d2c2] text-xs font-semibold text-[#17343a] focus:ring-2 focus:ring-[#176f78] focus:border-[#176f78] bg-[#fbfaf6]"
                      />
                    </div>

                    <div>
                      <label className="block text-[11px] font-bold uppercase text-[#527078] mb-1">
                        Industry Sector / Product Classification
                      </label>
                      <select
                        value={formSector}
                        onChange={e => setFormSector(e.target.value)}
                        className="w-full px-3 py-2 rounded-xl border border-[#d9d2c2] text-xs font-semibold text-[#17343a] focus:ring-2 focus:ring-[#176f78] focus:border-[#176f78] bg-[#fbfaf6]"
                      >
                        {INDUSTRY_SECTORS.map(sec => (
                          <option key={sec} value={sec}>
                            {sec}
                          </option>
                        ))}
                      </select>
                    </div>

                    {formSector === 'Custom Industrial Manufacturing' ? (
                      <div>
                        <label className="block text-[11px] font-bold uppercase text-[#527078] mb-1">
                          Specify Custom Industry Name
                        </label>
                        <input
                          type="text"
                          value={formCustomSector}
                          onChange={e => setFormCustomSector(e.target.value)}
                          placeholder="e.g. Precision Medical Device Assembly"
                          className="w-full px-3 py-2 rounded-xl border border-[#d9d2c2] text-xs font-semibold text-[#17343a] bg-[#fbfaf6]"
                        />
                      </div>
                    ) : (
                      <div>
                        <label className="block text-[11px] font-bold uppercase text-[#527078] mb-1">
                          Department / Division
                        </label>
                        <input
                          type="text"
                          value={formDepartment}
                          onChange={e => setFormDepartment(e.target.value)}
                          placeholder="Industrial Engineering (IE) Dept."
                          className="w-full px-3 py-2 rounded-xl border border-[#d9d2c2] text-xs font-semibold text-[#17343a] bg-[#fbfaf6]"
                        />
                      </div>
                    )}

                    <div>
                      <label className="block text-[11px] font-bold uppercase text-[#527078] mb-1">
                        Factory Code / Prefix ID
                      </label>
                      <input
                        type="text"
                        value={formCode}
                        onChange={e => setFormCode(e.target.value)}
                        placeholder="e.g. DBN-U02 or APX-01"
                        className="w-full px-3 py-2 rounded-xl border border-[#d9d2c2] text-xs font-mono font-bold text-[#176f78] bg-[#fbfaf6]"
                      />
                    </div>

                    <div>
                      <label className="block text-[11px] font-bold uppercase text-[#527078] mb-1">
                        Total Production Lines
                      </label>
                      <input
                        type="number"
                        min="1"
                        max="120"
                        value={formLinesCount}
                        onChange={e => setFormLinesCount(Number(e.target.value))}
                        className="w-full px-3 py-2 rounded-xl border border-[#d9d2c2] text-xs font-semibold text-[#17343a] bg-[#fbfaf6]"
                      />
                    </div>

                    <div className="sm:col-span-2">
                      <label className="block text-[11px] font-bold uppercase text-[#527078] mb-1">
                        Factory Geographical Location &amp; Address
                      </label>
                      <input
                        type="text"
                        value={formAddress}
                        onChange={e => setFormAddress(e.target.value)}
                        placeholder="e.g. Gorai, Mirzapur, Tangail / Gazipur Industrial Zone, Bangladesh"
                        className="w-full px-3 py-2 rounded-xl border border-[#d9d2c2] text-xs font-semibold text-[#17343a] bg-[#fbfaf6]"
                      />
                    </div>
                  </div>

                  <div className="flex items-center justify-end gap-2 pt-2 border-t border-[#e7e1d5]">
                    <button
                      type="button"
                      onClick={() => setIsCreatingFactory(false)}
                      className="px-4 py-2 rounded-xl text-xs font-bold text-[#527078] hover:bg-[#f1eee6] cursor-pointer"
                    >
                      Cancel
                    </button>
                    <button
                      type="submit"
                      className="px-5 py-2 rounded-xl bg-[#176f78] text-white hover:bg-[#12555c] transition-colors text-xs font-bold shadow-xs cursor-pointer flex items-center gap-1.5"
                    >
                      <Check className="w-4 h-4" />
                      <span>{editingFactoryId ? 'Save & Update Factory' : 'Create & Activate Factory'}</span>
                    </button>
                  </div>
                </form>
              )}

              {/* Saved Factories & Enterprise Directory */}
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <Layers className="w-4 h-4 text-[#176f78]" />
                    <h4 className="text-xs font-bold uppercase tracking-wider text-[#17343a]">
                      Saved Factories &amp; Enterprise Presets ({savedFactories.length})
                    </h4>
                  </div>
                  <button
                    type="button"
                    onClick={handleResetToDebonair}
                    className="text-[11px] font-bold text-[#176f78] hover:underline flex items-center gap-1 cursor-pointer"
                  >
                    <RotateCcw className="w-3 h-3" />
                    <span>Reset to Debonair Default</span>
                  </button>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  {savedFactories.map(item => {
                    const isActive = item.id === factoryProfile.id;
                    return (
                      <div
                        key={item.id}
                        className={`p-4 rounded-2xl border text-left transition-all relative flex flex-col justify-between gap-3 ${
                          isActive
                            ? 'border-[#176f78] ring-2 ring-[#176f78]/25 bg-white shadow-xs'
                            : 'border-[#d9d2c2] bg-white/80 hover:bg-white hover:border-[#176f78]/60'
                        }`}
                      >
                        <div>
                          <div className="flex items-start justify-between gap-2">
                            <div className="flex items-center gap-2">
                              <div
                                className={`w-8 h-8 rounded-xl flex items-center justify-center shrink-0 ${
                                  isActive ? 'bg-[#176f78] text-white' : 'bg-[#f1eee6] text-[#527078]'
                                }`}
                              >
                                <Building2 className="w-4 h-4" />
                              </div>
                              <div>
                                <h5 className="font-bold text-xs text-[#17343a] leading-tight">
                                  {item.name}
                                </h5>
                                <span className="text-[10px] font-semibold text-[#176f78] font-mono">
                                  {item.unitName}
                                </span>
                              </div>
                            </div>

                            {isActive ? (
                              <span className="px-2 py-0.5 rounded-full text-[9px] font-bold bg-emerald-100 text-emerald-800 border border-emerald-300">
                                ACTIVE
                              </span>
                            ) : (
                              <button
                                type="button"
                                onClick={() => handleSelectActiveFactory(item)}
                                className="px-2.5 py-1 rounded-lg bg-[#f1eee6] hover:bg-[#176f78] text-[#17343a] hover:text-white text-[10px] font-bold transition-colors cursor-pointer"
                              >
                                Switch
                              </button>
                            )}
                          </div>

                          <div className="mt-2 text-[11px] text-[#527078] space-y-0.5">
                            <p className="truncate">
                              <strong className="text-slate-700">Sector:</strong> {item.industrySector}
                            </p>
                            {item.addressLocation && (
                              <p className="truncate text-[10px] text-slate-500">
                                📍 {item.addressLocation}
                              </p>
                            )}
                          </div>
                        </div>

                        <div className="flex items-center justify-between pt-2 border-t border-[#f1eee6] text-[10px]">
                          <span className="font-mono text-slate-500">
                            {item.totalLinesCount ? `${item.totalLinesCount} Lines` : '34 Lines'}
                          </span>
                          <div className="flex items-center gap-1">
                            <button
                              type="button"
                              onClick={() => startEditFactory(item)}
                              title="Edit profile"
                              className="p-1 rounded-md text-[#527078] hover:text-[#176f78] hover:bg-[#f1eee6]"
                            >
                              <Edit2 className="w-3 h-3" />
                            </button>
                            {item.id !== 'factory_debonair_u02' && (
                              <button
                                type="button"
                                onClick={() => handleDeleteFactory(item.id, item.name)}
                                title="Remove from list"
                                className="p-1 rounded-md text-rose-500 hover:text-rose-700 hover:bg-rose-50"
                              >
                                <Trash2 className="w-3 h-3" />
                              </button>
                            )}
                          </div>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>
            </div>
          )}

          {/* TAB 2: THEMES & STYLING */}
          {activeTab === 'themes' && (
            <div className="space-y-4">
              <div className="flex items-center gap-2 text-xs font-bold uppercase text-[#17343a]">
                <Palette className="w-4 h-4 text-[#176f78]" />
                <span>Color Atmosphere &amp; Visual Theme</span>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
                {themes.map(t => {
                  const isSelected = currentTheme === t.id;
                  return (
                    <button
                      key={t.id}
                      type="button"
                      onClick={() => onSelectTheme(t.id)}
                      className={`p-3 rounded-xl border text-left transition-all cursor-pointer flex items-start justify-between gap-2 ${
                        isSelected
                          ? 'border-[#176f78] ring-2 ring-[#176f78]/20 bg-white shadow-xs'
                          : 'border-[#d9d2c2] bg-white/70 hover:bg-white hover:border-[#527078]'
                      }`}
                    >
                      <div>
                        <div className="flex items-center gap-1.5">
                          <span className={`w-3 h-3 rounded-full border ${t.previewClass}`} />
                          <span className="font-bold text-xs text-[#17343a]">{t.label}</span>
                        </div>
                        <p className="text-[10px] text-[#527078] mt-1 leading-normal">{t.desc}</p>
                      </div>

                      {isSelected && (
                        <div className="w-4 h-4 rounded-full bg-[#176f78] text-white flex items-center justify-center shrink-0">
                          <Check className="w-2.5 h-2.5" />
                        </div>
                      )}
                    </button>
                  );
                })}
              </div>
            </div>
          )}

          {/* TAB 3: AUDITORY ALERTS */}
          {activeTab === 'alerts' && (
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2 text-xs font-bold uppercase text-[#17343a]">
                  {auditoryAlertsEnabled ? (
                    <Volume2 className="w-4 h-4 text-[#176f78]" />
                  ) : (
                    <VolumeX className="w-4 h-4 text-[#527078]" />
                  )}
                  <span>Auditory Floor Alerts (Line Monitor)</span>
                </div>
                <span
                  className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${
                    auditoryAlertsEnabled
                      ? 'bg-emerald-100 text-emerald-800 border border-emerald-200'
                      : 'bg-slate-100 text-slate-600 border border-slate-200'
                  }`}
                >
                  {auditoryAlertsEnabled ? 'Sound Active' : 'Sound Muted'}
                </span>
              </div>

              {/* Toggle Card */}
              <div
                id="auditory-alert-toggle-card"
                onClick={handleToggleAudio}
                className={`p-3.5 rounded-2xl border transition-all cursor-pointer flex items-center justify-between gap-3 ${
                  auditoryAlertsEnabled
                    ? 'border-[#176f78] bg-teal-50/25 shadow-xs'
                    : 'border-[#d9d2c2] bg-white hover:border-[#527078]'
                }`}
              >
                <div className="flex items-start gap-3">
                  <div
                    className={`p-2 rounded-xl shrink-0 mt-0.5 ${
                      auditoryAlertsEnabled ? 'bg-[#176f78] text-white' : 'bg-[#f1eee6] text-[#527078]'
                    }`}
                  >
                    <BellRing className="w-4 h-4" />
                  </div>
                  <div>
                    <div className="text-xs font-bold text-[#17343a]">
                      Auditory High WIP &amp; Bottleneck Alerts
                    </div>
                    <p className="text-[10px] text-[#527078] mt-0.5 leading-normal">
                      Triggers an acoustic alert chime whenever a sewing line breaches its style WIP buffer threshold or flags a critical workstation bottleneck.
                    </p>
                  </div>
                </div>

                {/* Toggle Switch */}
                <div
                  className={`w-11 h-6 flex items-center rounded-full p-1 transition-colors shrink-0 ${
                    auditoryAlertsEnabled ? 'bg-[#176f78]' : 'bg-[#d9d2c2]'
                  }`}
                >
                  <div
                    className={`bg-white w-4 h-4 rounded-full shadow-md transform transition-transform ${
                      auditoryAlertsEnabled ? 'translate-x-5' : 'translate-x-0'
                    }`}
                  />
                </div>
              </div>

              {/* Sound Testing Bar */}
              <div className="p-3.5 rounded-2xl border border-[#e7e1d5] bg-white flex flex-col sm:flex-row sm:items-center justify-between gap-2.5">
                <div className="text-[11px] text-[#527078]">
                  <span className="font-bold text-[#17343a]">Acoustic Test:</span> Verify alarm volume on your workstation:
                </div>

                <div className="flex items-center gap-2">
                  <button
                    type="button"
                    onClick={() => handleTestSound('wip')}
                    className={`px-3 py-1.5 rounded-xl text-[11px] font-bold flex items-center gap-1.5 transition-all cursor-pointer border ${
                      playingTestSound === 'wip'
                        ? 'bg-amber-100 text-amber-900 border-amber-300 ring-2 ring-amber-200'
                        : 'bg-[#f1eee6] text-[#17343a] border-[#d9d2c2] hover:bg-[#e6e2d8]'
                    }`}
                  >
                    <Play className="w-3 h-3 text-amber-700" />
                    <span>{playingTestSound === 'wip' ? 'Playing WIP...' : 'Test WIP Chime'}</span>
                  </button>

                  <button
                    type="button"
                    onClick={() => handleTestSound('bottleneck')}
                    className={`px-3 py-1.5 rounded-xl text-[11px] font-bold flex items-center gap-1.5 transition-all cursor-pointer border ${
                      playingTestSound === 'bottleneck'
                        ? 'bg-rose-100 text-rose-900 border-rose-300 ring-2 ring-rose-200'
                        : 'bg-[#f1eee6] text-[#17343a] border-[#d9d2c2] hover:bg-[#e6e2d8]'
                    }`}
                  >
                    <Play className="w-3 h-3 text-rose-700" />
                    <span>{playingTestSound === 'bottleneck' ? 'Playing Bottleneck...' : 'Test Bottleneck Chime'}</span>
                  </button>
                </div>
              </div>
            </div>
          )}

          {/* TAB 4: DASHBOARD LAYOUT */}
          {activeTab === 'layout' && (
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2 text-xs font-bold uppercase text-[#17343a]">
                  <Layout className="w-4 h-4 text-[#176f78]" />
                  <span>Dashboard Widget Modules</span>
                </div>
                <span className="text-[10px] text-[#527078]">Toggle view visibility</span>
              </div>

              <div className="space-y-2">
                {layoutToggles.map(item => {
                  const isChecked = layout[item.key];
                  return (
                    <div
                      key={item.key}
                      onClick={() => handleToggleLayout(item.key)}
                      className="p-3 rounded-xl border border-[#d9d2c2] bg-white flex items-center justify-between gap-3 cursor-pointer hover:border-[#176f78] transition-all"
                    >
                      <div>
                        <div className="text-xs font-bold text-[#17343a]">{item.label}</div>
                        <p className="text-[10px] text-[#527078] mt-0.5">{item.desc}</p>
                      </div>

                      <div
                        className={`w-11 h-6 flex items-center rounded-full p-1 transition-colors ${
                          isChecked ? 'bg-[#176f78]' : 'bg-[#d9d2c2]'
                        }`}
                      >
                        <div
                          className={`bg-white w-4 h-4 rounded-full shadow-md transform transition-transform ${
                            isChecked ? 'translate-x-5' : 'translate-x-0'
                          }`}
                        />
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          )}

          {/* Bottom Security Banner */}
          {onOpenPrivacySecurity && (
            <div className="pt-2">
              <div className="p-3.5 rounded-2xl border border-teal-200 bg-teal-50/50 flex items-center justify-between gap-3">
                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 rounded-xl bg-[#176f78] text-white flex items-center justify-center shrink-0">
                    <Shield className="w-4 h-4" />
                  </div>
                  <div>
                    <div className="text-xs font-bold text-[#17343a]">Data Privacy &amp; Terminal Security</div>
                    <p className="text-[10px] text-[#527078]">
                      Configure privacy blur shields, PIN protection, and terminal timeout
                    </p>
                  </div>
                </div>

                <button
                  type="button"
                  onClick={() => {
                    onClose();
                    onOpenPrivacySecurity();
                  }}
                  className="px-3 py-1.5 rounded-xl bg-[#176f78] text-white text-xs font-bold hover:bg-[#12555c] transition-colors cursor-pointer shrink-0 shadow-xs"
                >
                  Configure
                </button>
              </div>
            </div>
          )}
        </div>

        {/* Modal Footer */}
        <div className="px-6 py-3.5 border-t border-[#e7e1d5] bg-white flex items-center justify-between">
          <div className="text-[11px] text-[#527078] flex items-center gap-1.5 font-mono">
            <span>Plant:</span>
            <strong className="text-[#17343a]">{factoryProfile.name}</strong>
            <span className="text-[#176f78]">({factoryProfile.unitName})</span>
          </div>

          <button
            type="button"
            onClick={onClose}
            className="px-5 py-2 rounded-xl bg-[#176f78] text-white text-xs font-bold hover:bg-[#12555c] transition-colors cursor-pointer shadow-xs"
          >
            Apply &amp; Close
          </button>
        </div>
      </div>
    </div>
  );
};
