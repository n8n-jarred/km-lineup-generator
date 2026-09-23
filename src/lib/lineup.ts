export interface Player {
  id: string;
  name: string;
  nickname?: string;
  role: 'handler' | 'cutter' | 'hybrid' | 'defender';
  primaryAttributes: string[];
  weaknesses: string[];
  currentFatigue: 'Fresh' | 'Moderate' | 'Gassed';
  consecutivePoints: number;
  recentForm: 'Hot' | 'Neutral' | 'Cold';
  notes?: string;
  // Legacy stats compatibility
  stats?: {
    goals?: number;
    assists?: number;
    blocks?: number;
    turnovers?: number;
    played?: number;
  };
}

export interface PlayerStats {
  pointsPlayed: number;
  holds: number;
  breaks: number;
  turnovers: number;
  assists: number;
  goals: number;
  blocks: number;
}

export interface LineupMetrics {
  hasHistory: boolean;
  successRate: string;
  conversionRate: string;
  turnoversPerPoint: string;
  lineRating: string;
  mainStrength: string;
  mainWeakness: string;
}

export type PointStrategy = 'O-Line Hold' | 'D-Line Break' | 'Anti-Zone' | 'High Pressure';

// Alias array exported for legacy index.tsx route compatibility
export const STRATEGIES: PointStrategy[] = [
  'O-Line Hold',
  'D-Line Break',
  'Anti-Zone',
  'High Pressure',
];

/**
 * Calculates individual player overall impact score.
 * Fixes missing export for RosterTable and Player detail routes.
 */
export function playerScore(player: Partial<Player>): number {
  if (!player) return 0;
  
  // Return baseline if no stats or points exist
  const stats = player.stats;
  if (!stats || !stats.played || stats.played === 0) {
    return 50; // Baseline unrated score
  }

  const goals = stats.goals || 0;
  const assists = stats.assists || 0;
  const blocks = stats.blocks || 0;
  const turnovers = stats.turnovers || 0;

  const score = 50 + (goals * 3) + (assists * 2.5) + (blocks * 4) - (turnovers * 3);
  return Math.min(100, Math.max(0, Math.round(score)));
}

/**
 * Calculates lineup performance metrics. 
 * Strictly returns "N/A" for stats if no game or point history exists.
 */
export function calculateLineupMetrics(
  players: Player[],
  stats?: PlayerStats
): LineupMetrics {
  if (!stats || stats.pointsPlayed === 0) {
    return {
      hasHistory: false,
      successRate: 'N/A',
      conversionRate: 'N/A',
      turnoversPerPoint: 'N/A',
      lineRating: 'N/A',
      mainStrength: deriveLineupStrengths(players),
      mainWeakness: deriveLineupWeaknesses(players),
    };
  }

  const totalWins = stats.holds + stats.breaks;
  const successPct = Math.round((totalWins / stats.pointsPlayed) * 100);
  const conversionPct = Math.round((stats.holds / (stats.holds + stats.turnovers || 1)) * 100);
  const top = (stats.turnovers / stats.pointsPlayed).toFixed(1);
  const baseRating = Math.min(100, Math.max(30, successPct + (stats.blocks * 3) - (stats.turnovers * 2)));

  return {
    hasHistory: true,
    successRate: `${successPct}%`,
    conversionRate: `${conversionPct}%`,
    turnoversPerPoint: top,
    lineRating: `${baseRating}`,
    mainStrength: deriveLineupStrengths(players),
    mainWeakness: deriveLineupWeaknesses(players),
  };
}

// Alias export to support existing lineMetrics callers in routes
export const lineMetrics = calculateLineupMetrics;

/**
 * Dynamically derives lineup Strengths based on active player traits.
 */
export function deriveLineupStrengths(players: Player[]): string {
  if (!players || players.length === 0) return 'No players selected';

  const attrCounts: Record<string, number> = {};
  players.forEach((p) => {
    (p.primaryAttributes || []).forEach((attr) => {
      attrCounts[attr] = (attrCounts[attr] || 0) + 1;
    });
  });

  if ((attrCounts['elite_huck'] || 0) >= 2) return 'Stacked with elite throwers — can win deep matchups';
  if ((attrCounts['tight_mark'] || 0) >= 3) return 'High pressure mark — forces contested throws';
  if ((attrCounts['high_stamina'] || 0) >= 4) return 'Relentless energy — excels in long, grindy points';

  return 'Balanced composition across handlers and cutters';
}

/**
 * Dynamically derives lineup Weaknesses based on active player drawbacks.
 */
export function deriveLineupWeaknesses(players: Player[]): string {
  if (!players || players.length === 0) return 'No players selected';

  const weakCounts: Record<string, number> = {};
  players.forEach((p) => {
    (p.weaknesses || []).forEach((w) => {
      weakCounts[w] = (weakCounts[w] || 0) + 1;
    });
  });

  if ((weakCounts['soft_mark'] || 0) >= 2) return 'Soft marks, gives up easy unders';
  if ((weakCounts['turnover_prone'] || 0) >= 2) return 'High turnover risk under tight pressure';
  if (players.filter((p) => p.currentFatigue === 'Gassed').length >= 2) return 'Line fatigue — multiple players gassed';

  return 'Minor vulnerability to high-speed fast breaks';
}

/**
 * Regenerates or generates a recommended Set Lineup 
 * matching the user's targeted point strategy and player conditions.
 */
export function generateTacticalSet(
  availablePlayers: Player[],
  strategy: PointStrategy
): Player[] {
  if (!availablePlayers) return [];

  const eligible = availablePlayers.filter((p) => p.currentFatigue !== 'Gassed');
  let selected: Player[] = [];

  switch (strategy) {
    case 'O-Line Hold':
      selected = eligible
        .slice()
        .sort((a, b) => (b.role === 'handler' ? 1 : -1))
        .slice(0, 7);
      break;
    case 'D-Line Break':
      selected = eligible
        .slice()
        .sort((a, b) => (b.role === 'defender' || (b.primaryAttributes || []).includes('tight_mark') ? 1 : -1))
        .slice(0, 7);
      break;
    case 'Anti-Zone':
      selected = eligible
        .filter((p) => (p.primaryAttributes || []).includes('elite_huck') || p.role === 'hybrid')
        .slice(0, 7);
      break;
    case 'High Pressure':
    default:
      selected = eligible
        .slice()
        .sort((a, b) => ((a.consecutivePoints || 0) - (b.consecutivePoints || 0)))
        .slice(0, 7);
      break;
  }

  return selected;
}

// Alias export to support existing buildLine callers in routes
export const buildLine = generateTacticalSet;
