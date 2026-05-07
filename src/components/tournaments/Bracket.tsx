'use client';

import { motion } from 'framer-motion';

export function TournamentBracket() {
  const rounds = [
    {
      name: 'Quarter Finals',
      matches: [
        { team1: 'PHOENIX', team2: 'RAVEN', score1: 2, score2: 1, winner: 1 },
        { team1: 'HYDRA', team2: 'ZERO_D', score1: 0, score2: 2, winner: 2 },
        { team1: 'VOID_R', team2: 'ROOT_A', score1: 3, score2: 0, winner: 1 },
        { team1: 'GHOST', team2: 'CYBER', score1: 1, score2: 2, winner: 2 },
      ]
    },
    {
      name: 'Semi Finals',
      matches: [
        { team1: 'PHOENIX', team2: 'ZERO_D', score1: 0, score2: 0, winner: null },
        { team1: 'VOID_R', team2: 'CYBER', score1: 0, score2: 0, winner: null },
      ]
    },
    {
      name: 'Finals',
      matches: [
        { team1: 'TBD', team2: 'TBD', score1: 0, score2: 0, winner: null },
      ]
    }
  ];

  return (
    <div className="flex justify-between items-stretch gap-12 overflow-x-auto pb-12 py-8">
      {rounds.map((round, rIndex) => (
        <div key={rIndex} className="flex flex-col gap-8 min-w-[280px]">
          <div className="text-center">
            <h4 className="text-[10px] font-black uppercase tracking-[0.4em] text-zinc-500 mb-6">{round.name}</h4>
          </div>
          <div className="flex flex-col justify-around flex-1 gap-12 relative">
            {round.matches.map((match, mIndex) => (
              <div key={mIndex} className="relative">
                <motion.div 
                  initial={{ opacity: 0, x: -20 }}
                  whileInView={{ opacity: 1, x: 0 }}
                  className="bg-[#0B1020] border border-white/5 p-4 space-y-2 relative z-10 group hover:border-primary/30 transition-all"
                >
                  <MatchTeam name={match.team1} score={match.score1} winner={match.winner === 1} />
                  <div className="h-[1px] bg-white/5 w-full" />
                  <MatchTeam name={match.team2} score={match.score2} winner={match.winner === 2} />
                </motion.div>
                
                {/* Connector Lines */}
                {rIndex < rounds.length - 1 && (
                  <div className="absolute top-1/2 -right-12 w-12 h-px bg-white/10" />
                )}
              </div>
            ))}
          </div>
        </div>
      ))}
    </div>
  );
}

function MatchTeam({ name, score, winner }: any) {
  return (
    <div className="flex items-center justify-between">
      <div className="flex items-center gap-3">
        <div className={`w-1.5 h-6 ${winner ? 'bg-primary' : 'bg-zinc-800'}`} />
        <span className={`text-xs font-black italic uppercase ${winner ? 'text-white' : 'text-zinc-500'}`}>{name}</span>
      </div>
      <span className={`font-mono text-sm font-bold ${winner ? 'text-primary' : 'text-zinc-700'}`}>{score}</span>
    </div>
  );
}
