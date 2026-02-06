"use client";

import { motion } from "framer-motion";
import {
  Home,
  MapPin,
  Clock,
  Target,
  TrendingUp,
  Zap,
} from "lucide-react";

interface StatsPanelCompactProps {
  houseCount: number;
  stopCount: number;
  naiveStopCount: number;
  d: number;
  executionTime: number;
  currentStep: number;
  totalSteps: number;
  language: "fr" | "en";
}

export function StatsPanelCompact({
  houseCount,
  stopCount,
  naiveStopCount,
  d,
  executionTime,
  currentStep,
  totalSteps,
  language,
}: StatsPanelCompactProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="h-full bg-card/50 backdrop-blur-md border border-border/50 rounded-xl p-4"
    >
      <div className="flex items-center gap-6 h-full">
        {/* Header */}
        <div className="flex items-center gap-2 shrink-0">
          <div className="w-8 h-8 rounded-lg bg-primary/20 flex items-center justify-center">
            <TrendingUp className="w-4 h-4 text-primary" />
          </div>
          <div>
            <h3 className="font-semibold text-sm text-foreground">
              {language === "fr" ? "Statistiques" : "Statistics"}
            </h3>
          </div>
        </div>

        {/* Stats Grid */}
        <div className="flex-1 flex items-center gap-4">
          {/* Houses */}
          <div className="flex items-center gap-2 px-3 py-2 rounded-lg bg-violet-500/10">
            <Home className="w-4 h-4 text-violet-400" />
            <div>
              <p className="text-xs text-muted-foreground">
                {language === "fr" ? "Maisons" : "Houses"}
              </p>
              <p className="text-sm font-bold text-foreground">{houseCount}</p>
            </div>
          </div>

          {/* Greedy Stops */}
          <div className="flex items-center gap-2 px-3 py-2 rounded-lg bg-cyan-500/10">
            <Zap className="w-4 h-4 text-cyan-400" />
            <div>
              <p className="text-xs text-muted-foreground">
                {language === "fr" ? "Glouton" : "Greedy"}
              </p>
              <p className="text-sm font-bold text-cyan-400">{stopCount} {language === "fr" ? "arrêts" : "stops"}</p>
            </div>
          </div>

          {/* Naive Stops */}
          <div className="flex items-center gap-2 px-3 py-2 rounded-lg bg-orange-500/10">
            <Target className="w-4 h-4 text-orange-400" />
            <div>
              <p className="text-xs text-muted-foreground">
                {language === "fr" ? "Naïf" : "Naive"}
              </p>
              <p className="text-sm font-bold text-orange-400">{naiveStopCount} {language === "fr" ? "arrêts" : "stops"}</p>
            </div>
          </div>

          {/* Distance */}
          <div className="flex items-center gap-2 px-3 py-2 rounded-lg bg-amber-500/10">
            <MapPin className="w-4 h-4 text-amber-400" />
            <div>
              <p className="text-xs text-muted-foreground">
                {language === "fr" ? "Distance" : "Distance"}
              </p>
              <p className="text-sm font-bold text-foreground">{d} km</p>
            </div>
          </div>

          {/* Execution Time */}
          <div className="flex items-center gap-2 px-3 py-2 rounded-lg bg-emerald-500/10">
            <Clock className="w-4 h-4 text-emerald-400" />
            <div>
              <p className="text-xs text-muted-foreground">
                {language === "fr" ? "Temps" : "Time"}
              </p>
              <p className="text-sm font-bold text-foreground">{executionTime.toFixed(2)} ms</p>
            </div>
          </div>
        </div>

        {/* Optimality Badge */}
        {stopCount > 0 && (
          <div className="shrink-0 flex items-center gap-2 px-3 py-2 rounded-lg bg-emerald-500/20 border border-emerald-500/50">
            <div className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
            <span className="text-xs font-semibold text-emerald-400">
              {language === "fr" ? "Solution Optimale" : "Optimal Solution"}
            </span>
          </div>
        )}
      </div>
    </motion.div>
  );
}
