/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 * Debonair LTD (Unit-02) — IE Department
 * Role-Based Access Control (RBAC) Security & Scoping Engine
 */

import { RoleTier, UserProfile } from '../types';

export interface LineScopeCheckResult {
  inScope: boolean;
  canEdit: boolean;
  canApprove: boolean;
  canDelete: boolean;
  accessControlLevel: string;
  scopeType: 'all' | 'wing' | 'block' | 'line';
  reason?: string;
  badgeLabel: string;
  badgeColor: 'emerald' | 'blue' | 'amber' | 'slate';
}

/**
 * Wing mappings for Debonair LTD (Unit-02)
 * Total 34 Production Lines:
 * - Blue Wing (Mgr 1): Lines 01 to 18
 * - Green Wing (Mgr 2): Lines 19 to 34
 */
export const BLUE_WING_LINES = Array.from({ length: 18 }, (_, i) => {
  const num = i + 1;
  return num < 10 ? `Line 0${num}` : `Line ${num}`;
});

export const GREEN_WING_LINES = Array.from({ length: 16 }, (_, i) => {
  const num = i + 19;
  return `Line ${num}`;
});

export const ALL_FACTORY_LINES = [...BLUE_WING_LINES, ...GREEN_WING_LINES];

/**
 * Block / Floor Mappings (5–6 Lines Each) for IE Incharges / Assistant Managers:
 * - Block 1 (Floor 1 / Sec 1): Lines 01–06 (Blue Wing)
 * - Block 2 (Floor 2 / Sec 2): Lines 07–12 (Blue Wing)
 * - Block 3 (Floor 3 / Sec 3): Lines 13–18 (Blue Wing)
 * - Block 4 (Floor 4 / Sec 4): Lines 19–24 (Green Wing)
 * - Block 5 (Floor 5 / Sec 5): Lines 25–29 (Green Wing)
 * - Block 6 (Floor 6 / Sec 6): Lines 30–34 (Green Wing)
 */
export interface LineBlockDefinition {
  blockId: string;
  blockNo: number;
  label: string;
  wing: 'Blue Wing' | 'Green Wing';
  floor: string;
  lines: string[];
}

export const FACTORY_BLOCKS: LineBlockDefinition[] = [
  {
    blockId: 'block_1',
    blockNo: 1,
    label: 'Block 1 — Floor 1 (Lines 01–06)',
    wing: 'Blue Wing',
    floor: 'Floor 1 (Ground / Cutting Feed)',
    lines: ['Line 01', 'Line 02', 'Line 03', 'Line 04', 'Line 05', 'Line 06']
  },
  {
    blockId: 'block_2',
    blockNo: 2,
    label: 'Block 2 — Floor 2 (Lines 07–12)',
    wing: 'Blue Wing',
    floor: 'Floor 2 (Padma Floor)',
    lines: ['Line 07', 'Line 08', 'Line 09', 'Line 10', 'Line 11', 'Line 12']
  },
  {
    blockId: 'block_3',
    blockNo: 3,
    label: 'Block 3 — Floor 3 (Lines 13–18)',
    wing: 'Blue Wing',
    floor: 'Floor 3 (Meghna Floor)',
    lines: ['Line 13', 'Line 14', 'Line 15', 'Line 16', 'Line 17', 'Line 18']
  },
  {
    blockId: 'block_4',
    blockNo: 4,
    label: 'Block 4 — Floor 4 (Lines 19–24)',
    wing: 'Green Wing',
    floor: 'Floor 4 (Jamuna Floor)',
    lines: ['Line 19', 'Line 20', 'Line 21', 'Line 22', 'Line 23', 'Line 24']
  },
  {
    blockId: 'block_5',
    blockNo: 5,
    label: 'Block 5 — Floor 5 (Lines 25–29)',
    wing: 'Green Wing',
    floor: 'Floor 5 (Karnaphuli Floor)',
    lines: ['Line 25', 'Line 26', 'Line 27', 'Line 28', 'Line 29']
  },
  {
    blockId: 'block_6',
    blockNo: 6,
    label: 'Block 6 — Floor 6 (Lines 30–34)',
    wing: 'Green Wing',
    floor: 'Floor 6 (Surma Floor)',
    lines: ['Line 30', 'Line 31', 'Line 32', 'Line 33', 'Line 34']
  }
];

/**
 * Standardize line number string (e.g. '18' -> 'Line 18', 'Line 04' -> 'Line 04')
 */
export function normalizeLineNo(lineNo: string | number): string {
  if (typeof lineNo === 'number') {
    return lineNo < 10 ? `Line 0${lineNo}` : `Line ${lineNo}`;
  }
  const clean = String(lineNo).trim();
  if (clean.toLowerCase().startsWith('line')) {
    const digits = clean.replace(/[^0-9]/g, '');
    const n = parseInt(digits, 10);
    if (!isNaN(n)) {
      return n < 10 ? `Line 0${n}` : `Line ${n}`;
    }
    return clean;
  }
  const n = parseInt(clean, 10);
  if (!isNaN(n)) {
    return n < 10 ? `Line 0${n}` : `Line ${n}`;
  }
  return clean;
}

/**
 * Get Wing for a specific production line
 */
export function getLineWing(lineNo: string | number): 'Blue Wing' | 'Green Wing' {
  const norm = normalizeLineNo(lineNo);
  const digits = parseInt(norm.replace(/[^0-9]/g, ''), 10);
  if (isNaN(digits) || digits <= 18) {
    return 'Blue Wing';
  }
  return 'Green Wing';
}

/**
 * Get Block definition for a line
 */
export function getLineBlock(lineNo: string | number): LineBlockDefinition {
  const norm = normalizeLineNo(lineNo);
  const found = FACTORY_BLOCKS.find(b => b.lines.includes(norm));
  if (found) return found;
  const digits = parseInt(norm.replace(/[^0-9]/g, ''), 10);
  if (!isNaN(digits)) {
    if (digits <= 6) return FACTORY_BLOCKS[0];
    if (digits <= 12) return FACTORY_BLOCKS[1];
    if (digits <= 18) return FACTORY_BLOCKS[2];
    if (digits <= 24) return FACTORY_BLOCKS[3];
    if (digits <= 29) return FACTORY_BLOCKS[4];
    return FACTORY_BLOCKS[5];
  }
  return FACTORY_BLOCKS[0];
}

export const SYSTEM_ADMIN_EMAIL = 'ashikur.rahman.0971@gmail.com';
export const SYSTEM_ADMIN_PASSCODE = '911999';

export function isSystemAdmin(profile?: UserProfile): boolean {
  if (!profile) return false;
  return (
    profile.role === 'admin' ||
    profile.tierId === 'tier_0' ||
    profile.email?.toLowerCase().trim() === SYSTEM_ADMIN_EMAIL.toLowerCase()
  );
}

export function verifySystemAdminPasscode(passcode: string): boolean {
  return (passcode || '').trim() === SYSTEM_ADMIN_PASSCODE;
}

/**
 * Check if the current user profile has access to edit or approve data for a given line
 */
export function checkLineAccess(
  profile: UserProfile | undefined,
  roleTiers: RoleTier[],
  lineNo: string | number
): LineScopeCheckResult {
  const normLine = normalizeLineNo(lineNo);
  const lineWing = getLineWing(normLine);
  const lineBlock = getLineBlock(normLine);

  // Check if System Admin with root authority
  if (isSystemAdmin(profile)) {
    return {
      inScope: true,
      canEdit: true,
      canApprove: true,
      canDelete: true,
      accessControlLevel: 'System Administrator (Full Root Authority)',
      scopeType: 'all',
      badgeLabel: 'System Admin • Root Access',
      badgeColor: 'emerald'
    };
  }

  // Find active tier
  const tier = roleTiers.find(t => t.id === profile?.tierId) || roleTiers[0];
  const level = tier.level;

  // TIER 0: System Admin
  if (level === 0 || tier.id === 'tier_0') {
    return {
      inScope: true,
      canEdit: true,
      canApprove: true,
      canDelete: true,
      accessControlLevel: 'System Administrator (Full Root Authority)',
      scopeType: 'all',
      badgeLabel: 'System Admin • Root Access',
      badgeColor: 'emerald'
    };
  }

  // TIER 1: Sr. Manager — All Factory Lines (Department Administrator)
  if (level <= 1 || tier.scopeType === 'all') {
    return {
      inScope: true,
      canEdit: true,
      canApprove: true,
      canDelete: true,
      accessControlLevel: 'Department Administrator (Full System Access)',
      scopeType: 'all',
      badgeLabel: 'Tier 1 • Full Access',
      badgeColor: 'emerald'
    };
  }

  // TIER 2: Manager — Assigned Wing - Lines (Wing Super-User)
  if (level === 2 || tier.scopeType === 'wing') {
    const userWing = profile?.assignedWing || 'Blue Wing';
    const isAssignedWing = userWing === 'All' || userWing === lineWing;

    if (isAssignedWing) {
      return {
        inScope: true,
        canEdit: true,
        canApprove: true,
        canDelete: false,
        accessControlLevel: 'Wing Super-User (Assigned Wing Control Write & Approve)',
        scopeType: 'wing',
        badgeLabel: `Tier 2 • ${userWing} Super-User`,
        badgeColor: 'blue'
      };
    }

    return {
      inScope: false,
      canEdit: false,
      canApprove: false,
      canDelete: false,
      accessControlLevel: 'Wing Super-User (Assigned Wing Control Write & Approve)',
      scopeType: 'wing',
      reason: `${normLine} is in ${lineWing}. Your scope is restricted to ${userWing}.`,
      badgeLabel: `Tier 2 • Outside Wing (${userWing})`,
      badgeColor: 'slate'
    };
  }

  // TIER 3: IE Incharges/Assistant Manager's — Assigned Line Blocks/Floor (5–6 Lines Each)
  if (level === 3 || tier.scopeType === 'block') {
    const assignedBlockId = profile?.assignedBlock || 'block_2';
    const activeBlockDef =
      FACTORY_BLOCKS.find(b => b.blockId === assignedBlockId || b.label === profile?.assignedBlock) ||
      FACTORY_BLOCKS[1]; // default Floor 2 / Lines 07-12

    const isInsideBlock = activeBlockDef.lines.includes(normLine);

    if (isInsideBlock) {
      return {
        inScope: true,
        canEdit: true,
        canApprove: true,
        canDelete: false,
        accessControlLevel: 'Section Moderator (Assigned Block/Floor Write & Approve)',
        scopeType: 'block',
        badgeLabel: `Tier 3 • ${activeBlockDef.label.split('—')[0].trim()} Moderator`,
        badgeColor: 'blue'
      };
    }

    return {
      inScope: false,
      canEdit: false,
      canApprove: false,
      canDelete: false,
      accessControlLevel: 'Section Moderator (Assigned Block/Floor Write & Approve)',
      scopeType: 'block',
      reason: `${normLine} belongs to ${lineBlock.label}. Your assigned block is ${activeBlockDef.label}.`,
      badgeLabel: `Tier 3 • Outside Assigned Block`,
      badgeColor: 'slate'
    };
  }

  // TIER 4: Line IEs — Assigned Line's (Standard IE - Data Entry Only)
  const userAssignedLines =
    profile?.assignedLines && profile.assignedLines.length > 0
      ? profile.assignedLines.map(normalizeLineNo)
      : ['Line 01', 'Line 02']; // standard default for Line IE

  const isMyAssignedLine = userAssignedLines.includes(normLine);

  if (isMyAssignedLine) {
    return {
      inScope: true,
      canEdit: true, // Data entry permitted
      canApprove: false, // Cannot approve checklists, only Submit
      canDelete: false,
      accessControlLevel: 'Standard IE (Assigned Lines Data Entry Only)',
      scopeType: 'line',
      badgeLabel: 'Tier 4 • Data Entry Only',
      badgeColor: 'amber'
    };
  }

  return {
    inScope: false,
    canEdit: false,
    canApprove: false,
    canDelete: false,
    accessControlLevel: 'Standard IE (Assigned Lines Data Entry Only)',
    scopeType: 'line',
    reason: `${normLine} is not in your assigned lines (${userAssignedLines.join(', ')}). Tier 4 has data entry access only for assigned lines.`,
    badgeLabel: 'Tier 4 • View-Only (Restricted)',
    badgeColor: 'slate'
  };
}

/**
 * Return all lines within the user's reporting scope
 */
export function getLinesInUserScope(
  profile: UserProfile | undefined,
  roleTiers: RoleTier[]
): string[] {
  const tier = roleTiers.find(t => t.id === profile?.tierId) || roleTiers[0];
  const level = tier.level;

  if (isSystemAdmin(profile) || level <= 1 || tier.scopeType === 'all') {
    return ALL_FACTORY_LINES;
  }

  if (level === 2 || tier.scopeType === 'wing') {
    const wing = profile?.assignedWing || 'Blue Wing';
    if (wing === 'Green Wing') return GREEN_WING_LINES;
    if (wing === 'All') return ALL_FACTORY_LINES;
    return BLUE_WING_LINES;
  }

  if (level === 3 || tier.scopeType === 'block') {
    const assignedBlockId = profile?.assignedBlock || 'block_2';
    const found =
      FACTORY_BLOCKS.find(b => b.blockId === assignedBlockId || b.label === profile?.assignedBlock) ||
      FACTORY_BLOCKS[1];
    return found.lines;
  }

  // Tier 4: Line IEs
  if (profile?.assignedLines && profile.assignedLines.length > 0) {
    return profile.assignedLines.map(normalizeLineNo);
  }
  return ['Line 01', 'Line 02'];
}
