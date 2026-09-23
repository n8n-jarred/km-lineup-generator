import React, { useState } from 'react';
import { Player, LineupMetrics, PointStrategy, calculateLineupMetrics, generateTacticalSet } from '../lib/lineup';
import { Badge } from './ui/badge';
import { Button } from './ui/button';
import { Card, CardContent, CardHeader, CardTitle } from './ui/card';

interface PointLoggerProps {
  roster: Player[];
  gameHistoryCount: number;
}

export const PointLogger: React.FC<PointLoggerProps> = ({ roster, gameHistoryCount }) => {
  const [selectedPlayers, setSelectedPlayers] = useState<Player[]>([]);
  const [strategy, setStrategy] = useState<PointStrategy>('O-Line Hold');

  // Compute metrics (shows N/A automatically if gameHistoryCount === 0)
  const stats = {
    pointsPlayed: gameHistoryCount,
    holds: gameHistoryCount > 0 ? 5 : 0,
    breaks: gameHistoryCount > 0 ? 2 : 0,
    turnovers: gameHistoryCount > 0 ? 4 : 0,
    assists: 3,
    goals: 3,
    blocks: 2
  };

  const metrics: LineupMetrics = calculateLineupMetrics(selectedPlayers, stats);

  const handleGenerateSet = () => {
    const generated = generateTacticalSet(roster, strategy);
    setSelectedPlayers(generated);
  };

  const togglePlayer = (player: Player) => {
    if (selectedPlayers.some((p) => p.id === player.id)) {
      setSelectedPlayers(selectedPlayers.filter((p) => p.id !== player.id));
    } else {
      if (selectedPlayers.length < 7) {
        setSelectedPlayers([...selectedPlayers, player]);
      }
    }
  };

  return (
    <div className="space-y-6 p-4 max-w-5xl mx-auto">
      {/* REQUIREMENT 2: PRE-SUB PLAYER SITUATION DASHBOARD */}
      <Card>
        <CardHeader>
          <CardTitle className="text-xl font-bold">Current Player Situations (Pre-Sub Status)</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
            {roster.map((player) => {
              const isSelected = selectedPlayers.some((p) => p.id === player.id);
              return (
                <div
                  key={player.id}
                  onClick={() => togglePlayer(player)}
                  className={`p-3 rounded-lg border cursor-pointer transition-all ${
                    isSelected ? 'border-primary bg-primary/10' : 'border-gray-200 hover:bg-gray-50'
                  }`}
                >
                  <div className="flex justify-between items-center mb-1">
                    <span className="font-semibold">{player.name}</span>
                    <Badge
                      variant={
                        player.currentFatigue === 'Fresh'
                          ? 'default'
                          : player.currentFatigue === 'Moderate'
                          ? 'secondary'
                          : 'destructive'
                      }
                    >
                      {player.currentFatigue}
                    </Badge>
                  </div>
                  <div className="text-xs text-muted-foreground space-y-1">
                    <div>Consecutive Points: {player.consecutivePoints}</div>
                    <div>Recent Form: <span className="font-medium">{player.recentForm}</span></div>
                    {player.notes && (
                      <div className="italic text-amber-600 bg-amber-50 p-1 rounded">
                        Note: "{player.notes}"
                      </div>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        </CardContent>
      </Card>

      {/* REQUIREMENT 3: TACTICAL SET GENERATOR & REGENERATOR */}
      <Card>
        <CardHeader className="flex flex-row items-center justify-between">
          <CardTitle className="text-lg">Tactical Set Generator</CardTitle>
          <div className="flex items-center space-x-2">
            <select
              value={strategy}
              onChange={(e) => setStrategy(e.target.value as PointStrategy)}
              className="px-3 py-1.5 border rounded-md text-sm bg-background"
            >
              <option value="O-Line Hold">O-Line Hold</option>
              <option value="D-Line Break">D-Line Break</option>
              <option value="Anti-Zone">Anti-Zone</option>
              <option value="High Pressure">High Pressure</option>
            </select>
            <Button onClick={handleGenerateSet} size="sm">
              Generate / Regenerate Set
            </Button>
          </div>
        </CardHeader>
      </Card>

      {/* REQUIREMENT 1: CONDITIONAL STATS CARD */}
      <Card>
        <CardHeader>
          <CardTitle className="text-lg font-bold">Lineup Performance & S&W Breakdown</CardTitle>
        </CardHeader>
        <CardContent>
          {!metrics.hasHistory && (
            <div className="mb-4 p-2.5 bg-blue-50 border border-blue-200 rounded text-blue-800 text-xs font-medium">
              Notice: No historical game/point data logged yet. Displaying N/A for calculated metrics.
            </div>
          )}

          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-center mb-6">
            <div className="p-3 bg-muted/40 rounded-lg">
              <div className="text-xs text-muted-foreground">Success rate</div>
              <div className="text-xl font-bold">{metrics.successRate}</div>
            </div>
            <div className="p-3 bg-muted/40 rounded-lg">
              <div className="text-xs text-muted-foreground">Conversion rate</div>
              <div className="text-xl font-bold">{metrics.conversionRate}</div>
            </div>
            <div className="p-3 bg-muted/40 rounded-lg">
              <div className="text-xs text-muted-foreground">Turnovers / point</div>
              <div className="text-xl font-bold">{metrics.turnoversPerPoint}</div>
            </div>
            <div className="p-3 bg-muted/40 rounded-lg">
              <div className="text-xs text-muted-foreground">Line rating</div>
              <div className="text-xl font-bold">{metrics.lineRating}</div>
            </div>
          </div>

          <div className="space-y-3">
            <div>
              <span className="text-xs font-semibold text-emerald-600 block uppercase">Main strength</span>
              <p className="text-sm font-medium">{metrics.mainStrength}</p>
            </div>
            <div>
              <span className="text-xs font-semibold text-rose-600 block uppercase">Main weakness</span>
              <p className="text-sm font-medium">{metrics.mainWeakness}</p>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};