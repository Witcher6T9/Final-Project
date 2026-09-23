/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 * Debonair LTD (Unit-02) — IE Department
 * Role-Based Access Control (RBAC) Tier Summary Table Component
 */

import React, { useState } from 'react';
import {
  Shield,
  ShieldCheck,
  CheckCircle2,
  Lock,
  Edit3,
  CheckSquare,
  Users,
  Printer,
  ChevronDown,
  ChevronUp,
  Sparkles,
  Info,
  ArrowRight,
  Filter,
  Check
} from 'lucide-react';
import { RoleTier, UserProfile } from '../types';
import {
  ALL_FACTORY_LINES,
  BLUE_WING_LINES,
  GREEN_WING_LINES,
  FACTORY_BLOCKS,
  checkLineAccess,
  getLineWing,
  getLineBlock
} from '../utils/rbac';

interface RbacTierSummaryTableProps {
  roleTiers: RoleTier[];
  activeTierId: string;
  onSelectTier: (tier: RoleTier) => void;
  profile?: UserProfile;
  onOpenRoleEditor?: (tierId?: string) => void;
}

export const RbacTierSummaryTable: React.FC<RbacTierSummaryTableProps> = ({
  roleTiers,
  activeTierId,
  onSelectTier,
  profile,
  onOpenRoleEditor
}) => {
  const [selectedTestLine, setSelectedTestLine] = useState<string>('Line 04');
  const [showDetailedPermissions, setShowDetailedPermissions] = useState<boolean>(true);
  const [expandedTierId, setExpandedTierId] = useState<string | null>(null);

  // Active tier object
  const activeTier = roleTiers.find(t => t.id === activeTierId) || roleTiers[0];

  // Test line access for active tier
  const testAccess = checkLineAccess(profile, roleTiers, selectedTestLine);
  const testWing = getLineWing(selectedTestLine);
  const testBlock = getLineBlock(selectedTestLine);

  const handlePrint = () => {
    window.print();
  };

  return (
    <div className="space-y-6">
      {/* Official RBAC Banner & Header Container */}
      <div className="rounded-3xl bg-white border border-[#d9d2c2] shadow-sm overflow-hidden">
        {/* Top Header matching exact style in prompt image */}
        <div className="bg-[#1e3a8a] text-white px-6 sm:px-8 py-5 flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-[#172554]">
          <div>
            <div className="flex items-center gap-2">
              <span className="px-2 py-0.5 rounded text-[10px] font-extrabold uppercase bg-white/20 text-white tracking-wider border border-white/20">
                Official Factory Policy
              </span>
              <span className="text-xs text-blue-200 font-medium">
                Standard Operating Procedure (SOP-IE-04)
              </span>
            </div>
            <h1 className="font-serif text-xl sm:text-2xl lg:text-3xl font-bold tracking-tight text-white mt-1">
              DEBONAIR LTD (UNIT-02) — IE DEPARTMENT
            </h1>
            <h2 className="italic text-blue-100 text-sm sm:text-base font-serif tracking-normal mt-0.5">
              Role-Based Access Control (RBAC) Tier Summary Table
            </h2>
          </div>

          {/* Quick Actions */}
          <div className="flex items-center gap-2 self-start sm:self-auto shrink-0">
            <button
              type="button"
              onClick={handlePrint}
              className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-white/15 hover:bg-white/25 text-white text-xs font-bold transition-colors cursor-pointer border border-white/20"
              title="Print RBAC Tier Summary Table"
            >
              <Printer className="w-3.5 h-3.5" />
              <span>Print Table</span>
            </button>
            {onOpenRoleEditor && (
              <button
                type="button"
                onClick={() => onOpenRoleEditor(activeTierId)}
                className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-white text-[#1e3a8a] hover:bg-blue-50 text-xs font-bold transition-all shadow-xs cursor-pointer"
              >
                <Edit3 className="w-3.5 h-3.5" />
                <span>Configure Tiers</span>
              </button>
            )}
          </div>
        </div>

        {/* Current Active Simulation Indicator */}
        <div className="bg-[#f0f7ff] px-6 py-3 border-b border-[#dbeafe] flex flex-wrap items-center justify-between gap-3 text-xs">
          <div className="flex items-center gap-2">
            <span className="font-bold text-[#1e3a8a] uppercase tracking-wide text-[11px]">
              Current Active Role:
            </span>
            <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-lg bg-[#1e3a8a] text-white font-bold text-xs shadow-xs">
              <ShieldCheck className="w-3.5 h-3.5" />
              {activeTier?.tierLevelLabel || `Tier ${activeTier?.level}`}: {activeTier?.roleTitle || activeTier?.name}
            </span>
            <span className="text-slate-600 hidden md:inline">
              • Scope: <strong className="text-slate-900">{activeTier?.reportingScope}</strong>
            </span>
          </div>

          <div className="flex items-center gap-2 text-[11px] text-slate-500">
            <span>Click any tier below to simulate live access</span>
          </div>
        </div>

        {/* Main RBAC Summary Table directly matching the user's uploaded image */}
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse min-w-[700px]">
            <thead>
              <tr className="bg-[#1e40af] text-white text-xs sm:text-sm font-semibold border-b border-[#1e3a8a]">
                <th className="py-3.5 px-6 font-bold tracking-wide w-[15%] text-center sm:text-left">
                  Tier Level
                </th>
                <th className="py-3.5 px-6 font-bold tracking-wide w-[25%]">
                  Role Title
                </th>
                <th className="py-3.5 px-6 font-bold tracking-wide w-[30%]">
                  Reporting Scope
                </th>
                <th className="py-3.5 px-6 font-bold tracking-wide w-[30%]">
                  Access Control Level
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-blue-100 text-xs sm:text-sm">
              {roleTiers.map((tier, idx) => {
                const isActive = tier.id === activeTierId;
                // Alternating row styling: Row 1 & 3: #f0f7ff (soft blue), Row 2 & 4: #ffffff (clean white)
                const isOdd = idx % 2 === 0;
                const rowBg = isActive
                  ? 'bg-amber-50/70 hover:bg-amber-50'
                  : isOdd
                  ? 'bg-[#f0f7ff] hover:bg-[#e4efff]'
                  : 'bg-white hover:bg-slate-50';

                return (
                  <tr
                    key={tier.id}
                    onClick={() => onSelectTier(tier)}
                    className={`transition-colors cursor-pointer group ${rowBg}`}
                  >
                    {/* Column 1: Tier Level */}
                    <td className="py-4 px-6 align-middle">
                      <div className="flex items-center gap-2 font-bold text-slate-900">
                        <span>{tier.tierLevelLabel || `Tier ${tier.level}`}</span>
                        {isActive && (
                          <span className="inline-flex items-center px-2 py-0.5 rounded-full text-[10px] font-extrabold uppercase bg-emerald-100 text-emerald-800 border border-emerald-300">
                            Active
                          </span>
                        )}
                      </div>
                    </td>

                    {/* Column 2: Role Title */}
                    <td className="py-4 px-6 align-middle">
                      <div className="font-semibold text-slate-900 group-hover:text-[#1e3a8a] transition-colors flex items-center gap-2">
                        <span>{tier.roleTitle || tier.name}</span>
                        <span className="text-[10px] font-mono px-1.5 py-0.5 rounded bg-white/80 border border-slate-200 text-slate-600">
                          {tier.shortCode}
                        </span>
                      </div>
                    </td>

                    {/* Column 3: Reporting Scope */}
                    <td className="py-4 px-6 align-middle text-slate-800">
                      <div className="font-medium flex items-center gap-1.5">
                        <span>{tier.reportingScope}</span>
                      </div>
                      {/* Sub-scope hints */}
                      <span className="text-[11px] text-slate-500 block mt-0.5">
                        {tier.level === 1 && '34 Lines (Lines 01–34 full visibility)'}
                        {tier.level === 2 && 'Blue Wing (01–18) or Green Wing (19–34)'}
                        {tier.level === 3 && 'Blocks 1–6 (5–6 Lines per floor block)'}
                        {tier.level === 4 && '2 Dedicated Assigned Sewing Lines'}
                      </span>
                    </td>

                    {/* Column 4: Access Control Level */}
                    <td className="py-4 px-6 align-middle">
                      <div className="flex items-center justify-between gap-3">
                        <span className="font-semibold text-slate-900 leading-snug">
                          {tier.accessControlLevel}
                        </span>

                        <div className="flex items-center gap-1 shrink-0">
                          {isActive ? (
                            <span className="px-2.5 py-1 rounded-lg bg-emerald-600 text-white font-bold text-[11px] flex items-center gap-1 shadow-xs">
                              <Check className="w-3 h-3 stroke-[3]" />
                              <span>Active</span>
                            </span>
                          ) : (
                            <button
                              type="button"
                              onClick={(e) => {
                                e.stopPropagation();
                                onSelectTier(tier);
                              }}
                              className="px-2.5 py-1 rounded-lg bg-white group-hover:bg-[#1e3a8a] group-hover:text-white text-slate-700 font-bold text-[11px] border border-slate-300 group-hover:border-[#1e3a8a] flex items-center gap-1 transition-all shadow-2xs"
                            >
                              <span>Switch</span>
                              <ArrowRight className="w-3 h-3" />
                            </button>
                          )}

                          <button
                            type="button"
                            onClick={(e) => {
                              e.stopPropagation();
                              setExpandedTierId(expandedTierId === tier.id ? null : tier.id);
                            }}
                            className="p-1 rounded text-slate-400 hover:text-slate-700"
                            title="Toggle details"
                          >
                            {expandedTierId === tier.id ? (
                              <ChevronUp className="w-4 h-4" />
                            ) : (
                              <ChevronDown className="w-4 h-4" />
                            )}
                          </button>
                        </div>
                      </div>

                      {/* Expandable details when selected */}
                      {expandedTierId === tier.id && (
                        <div className="mt-3 p-3 rounded-xl bg-white border border-blue-200 text-xs text-slate-700 space-y-2 animate-fadeIn">
                          <p className="text-[11px] text-slate-600 leading-relaxed font-normal">
                            {tier.description}
                          </p>
                          <div className="grid grid-cols-2 gap-2 pt-1 font-medium text-[11px]">
                            <div>
                              System Edit: <strong className="text-slate-900">{tier.systemEdit}</strong>
                            </div>
                            <div>
                              Checklist Sign-off: <strong className="text-slate-900">{tier.checklistSignoff}</strong>
                            </div>
                            <div>
                              Deletion / Reset: <strong className="text-slate-900">{tier.deletionReset}</strong>
                            </div>
                            <div>
                              Manages Tiers: <strong className="text-slate-900">{tier.managesTiers}</strong>
                            </div>
                          </div>
                        </div>
                      )}
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>

      {/* Interactive Scope & Permissions Tester */}
      <div className="p-5 sm:p-6 rounded-3xl bg-white border border-[#d9d2c2] shadow-sm space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-3 border-b border-[#f1eee6]">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-xl bg-[#1e3a8a] text-white flex items-center justify-center">
              <Shield className="w-4 h-4" />
            </div>
            <div>
              <h3 className="font-bold text-sm sm:text-base text-[#17343a]">
                Live RBAC Scope &amp; Permission Audit Tester
              </h3>
              <p className="text-xs text-[#527078]">
                Select any factory line to test whether the active role ({activeTier?.roleTitle}) can edit, approve, or delete data.
              </p>
            </div>
          </div>

          {/* Line Selector for Testing */}
          <div className="flex items-center gap-2 self-start sm:self-auto">
            <label className="text-xs font-bold text-slate-600">Test Line:</label>
            <select
              value={selectedTestLine}
              onChange={(e) => setSelectedTestLine(e.target.value)}
              className="px-3 py-1.5 rounded-xl border border-[#d9d2c2] text-xs font-bold text-[#17343a] bg-[#fbfaf6] focus:outline-hidden focus:ring-2 focus:ring-[#1e3a8a]"
            >
              {ALL_FACTORY_LINES.map((line) => (
                <option key={line} value={line}>
                  {line} ({getLineWing(line)} - {getLineBlock(line).label.split('—')[0].trim()})
                </option>
              ))}
            </select>
          </div>
        </div>

        {/* Live Permission Feedback Box */}
        <div
          className={`p-4 rounded-2xl border transition-all ${
            testAccess.inScope
              ? 'bg-[#f0fdf4] border-emerald-200 text-emerald-950'
              : 'bg-rose-50 border-rose-200 text-rose-950'
          }`}
        >
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
            <div className="space-y-1">
              <div className="flex items-center gap-2">
                <span className="font-bold text-sm">
                  {selectedTestLine} Audit Result:
                </span>
                <span
                  className={`px-2 py-0.5 rounded-full text-[11px] font-bold ${
                    testAccess.inScope
                      ? 'bg-emerald-600 text-white'
                      : 'bg-rose-600 text-white'
                  }`}
                >
                  {testAccess.inScope ? 'In Scope (Authorized)' : 'Out of Scope (Restricted)'}
                </span>
                <span className="text-xs font-medium text-slate-600">
                  [{testWing} • {testBlock.label}]
                </span>
              </div>
              <p className="text-xs text-slate-700">
                {testAccess.reason ||
                  `User possesses authorized ${testAccess.accessControlLevel} for ${selectedTestLine}.`}
              </p>
            </div>

            {/* Permission Check Icons */}
            <div className="flex items-center gap-3 shrink-0 text-xs font-medium">
              <div className="flex items-center gap-1">
                {testAccess.canEdit ? (
                  <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                ) : (
                  <Lock className="w-4 h-4 text-rose-500" />
                )}
                <span>Data Entry: <strong>{testAccess.canEdit ? 'Allowed' : 'Locked'}</strong></span>
              </div>

              <div className="flex items-center gap-1">
                {testAccess.canApprove ? (
                  <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                ) : (
                  <Lock className="w-4 h-4 text-rose-500" />
                )}
                <span>Approval: <strong>{testAccess.canApprove ? 'Authorized' : 'Restricted'}</strong></span>
              </div>
            </div>
          </div>
        </div>

        {/* Quick Line Jump Chips for Testing */}
        <div className="space-y-1.5 pt-2">
          <span className="text-[11px] font-bold uppercase text-slate-500 tracking-wider">
            Quick Test Shortcuts:
          </span>
          <div className="flex flex-wrap items-center gap-1.5">
            {['Line 01', 'Line 04', 'Line 08', 'Line 12', 'Line 18', 'Line 19', 'Line 24', 'Line 30', 'Line 34'].map(
              (ln) => {
                const isCurrent = selectedTestLine === ln;
                const lnAccess = checkLineAccess(profile, roleTiers, ln);
                return (
                  <button
                    key={ln}
                    type="button"
                    onClick={() => setSelectedTestLine(ln)}
                    className={`px-2.5 py-1 rounded-xl text-xs font-bold transition-all cursor-pointer flex items-center gap-1 ${
                      isCurrent
                        ? 'bg-[#1e3a8a] text-white shadow-xs'
                        : lnAccess.inScope
                        ? 'bg-[#f0fdf4] text-emerald-800 border border-emerald-200 hover:bg-emerald-100'
                        : 'bg-rose-50 text-rose-800 border border-rose-200 hover:bg-rose-100'
                    }`}
                  >
                    <span>{ln}</span>
                    <span className="text-[10px] opacity-75">
                      ({lnAccess.inScope ? '✓' : '🔒'})
                    </span>
                  </button>
                );
              }
            )}
          </div>
        </div>
      </div>

      {/* Comprehensive Operational Privileges Matrix */}
      <div className="p-5 sm:p-6 rounded-3xl bg-white border border-[#d9d2c2] shadow-sm space-y-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <CheckSquare className="w-5 h-5 text-[#1e3a8a]" />
            <h3 className="font-bold text-base text-[#17343a]">
              Debonair LTD Operational Authority Matrix
            </h3>
          </div>
          <button
            type="button"
            onClick={() => setShowDetailedPermissions(!showDetailedPermissions)}
            className="text-xs font-bold text-[#1e3a8a] hover:underline flex items-center gap-1"
          >
            <span>{showDetailedPermissions ? 'Hide Details' : 'Show Detailed Matrix'}</span>
            {showDetailedPermissions ? (
              <ChevronUp className="w-4 h-4" />
            ) : (
              <ChevronDown className="w-4 h-4" />
            )}
          </button>
        </div>

        {showDetailedPermissions && (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 pt-2">
            {roleTiers.map((tier) => {
              const isCurrent = tier.id === activeTierId;
              return (
                <div
                  key={tier.id}
                  className={`p-4 rounded-2xl border transition-all ${
                    isCurrent
                      ? 'border-[#1e3a8a] bg-blue-50/50 ring-2 ring-[#1e3a8a]/20 shadow-xs'
                      : 'border-slate-200 bg-[#fbfaf6] hover:border-slate-300'
                  }`}
                >
                  <div className="flex items-center justify-between pb-2 border-b border-slate-200">
                    <span className="font-bold text-xs text-slate-900">
                      {tier.tierLevelLabel || `Tier ${tier.level}`}
                    </span>
                    <span className="font-mono text-[10px] font-extrabold uppercase px-1.5 py-0.5 rounded bg-white border border-slate-200 text-slate-700">
                      {tier.shortCode}
                    </span>
                  </div>

                  <h4 className="font-bold text-sm text-[#1e3a8a] mt-2 leading-tight">
                    {tier.roleTitle || tier.name}
                  </h4>
                  <p className="text-[11px] text-slate-600 mt-1 font-medium">
                    Scope: <strong>{tier.reportingScope}</strong>
                  </p>

                  <div className="mt-3 space-y-1.5 text-xs text-slate-700">
                    <div className="flex items-center justify-between">
                      <span className="text-[11px] text-slate-500">Edit Rights:</span>
                      <span className="font-bold text-[11px] text-slate-900 truncate max-w-[120px]" title={tier.systemEdit}>
                        {tier.systemEdit}
                      </span>
                    </div>

                    <div className="flex items-center justify-between">
                      <span className="text-[11px] text-slate-500">Sign-off:</span>
                      <span
                        className={`font-bold text-[11px] ${
                          tier.checklistSignoff === 'Authorized'
                            ? 'text-emerald-700'
                            : 'text-amber-800'
                        }`}
                      >
                        {tier.checklistSignoff}
                      </span>
                    </div>

                    <div className="flex items-center justify-between">
                      <span className="text-[11px] text-slate-500">Delete/Reset:</span>
                      <span
                        className={`font-bold text-[11px] ${
                          tier.deletionReset === 'Authorized'
                            ? 'text-emerald-700'
                            : 'text-slate-500'
                        }`}
                      >
                        {tier.deletionReset}
                      </span>
                    </div>

                    <div className="flex items-center justify-between">
                      <span className="text-[11px] text-slate-500">Supervises:</span>
                      <span className="font-mono font-bold text-[11px] text-slate-900">
                        {tier.managesTiers}
                      </span>
                    </div>
                  </div>

                  <div className="mt-4 pt-3 border-t border-slate-200">
                    {isCurrent ? (
                      <div className="w-full py-1.5 text-center rounded-xl bg-emerald-600 text-white font-bold text-xs flex items-center justify-center gap-1 shadow-2xs">
                        <Check className="w-3.5 h-3.5 stroke-[2.5]" />
                        <span>Active Role</span>
                      </div>
                    ) : (
                      <button
                        type="button"
                        onClick={() => onSelectTier(tier)}
                        className="w-full py-1.5 text-center rounded-xl bg-white hover:bg-[#1e3a8a] hover:text-white text-slate-700 font-bold text-xs border border-slate-300 transition-all cursor-pointer"
                      >
                        Switch to {tier.tierLevelLabel || `Tier ${tier.level}`}
                      </button>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
};
