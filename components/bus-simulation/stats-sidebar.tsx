"use client";

import { motion } from "framer-motion";
import { BarChart3, TrendingUp, Clock, CheckCircle2, ChevronUp, ChevronDown } from "lucide-react";
import { useState } from "react";

interface StatsSidebarProps {
  houses: number[];
  stops: number[];
  d: number;
  executionTime: number;
  currentStep: number;
  totalSteps: number;
  language: "fr" | "en";
}

export function StatsSidebar({
  houses,
  stops,
  d,
  executionTime,
  currentStep,
  totalSteps,
  language,
}: StatsSidebarProps) {
  const [isCollapsed, setIsCollapsed] = useState(false);

  // Calculate stats
  const coveredHouses = houses.filter((h) =>
    stops.some((s) => Math.abs(h - s) <= d)
  ).length;

  const coveragePercent = houses.length > 0 ? Math.round((coveredHouses / houses.length) * 100) : 0;

  // Naive algorithm would place a stop at each house
  const naiveStops = houses.length;
  const efficiency = naiveStops > 0 ? Math.round(((naiveStops - stops.length) / naiveStops) * 100) : 0;

  const t = {
    fr: {
      stats: "Statistiques",
      stops: "Arrets places",
      covered: "Maisons couvertes",
      progress: "Progression",
      time: "Temps",
      efficiency: "Efficacite",
      vsNaive: "vs solution naive",
      optimal: "Solution optimale",
    },
    en: {
      stats: "Statistics",
      stops: "Stops placed",
      covered: "Houses covered",
      progress: "Progress",
      time: "Time",
      efficiency: "Efficiency",
      vsNaive: "vs naive solution",
      optimal: "Optimal solution",
    },
  };

  const text = t[language];

  return (
    <motion.div
      initial={{ y: 100, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ type: "spring", damping: 25, delay: 0.1 }}
      className="absolute bottom-4 right-4 z-20"
    >
      <div className="bg-card/90 backdrop-blur-xl border border-border/50 rounded-2xl shadow-2xl overflow-hidden w-72">
        {/* Header */}
        <button
          onClick={() => setIsCollapsed(!isCollapsed)}
          className="w-full flex items-center justify-between p-4 border-b border-border/30 hover:bg-muted/30 transition-colors"
        >
          <div className="flex items-center gap-2">
            <BarChart3 className="w-5 h-5 text-emerald-400" />
            <h2 className="font-semibold text-foreground">{text.stats}</h2>
          </div>
          {isCollapsed ? (
            <ChevronUp className="w-4 h-4 text-muted-foreground" />
          ) : (
            <ChevronDown className="w-4 h-4 text-muted-foreground" />
          )}
        </button>

        {!isCollapsed && (
          <div className="p-4 space-y-4">
            {/* Stops count */}
            <div className="flex items-center justify-between">
              <span className="text-sm text-muted-foreground">{text.stops}</span>
              <span className="text-2xl font-bold text-primary">{stops.length}</span>
            </div>

            {/* Coverage */}
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <span className="text-sm text-muted-foreground">{text.covered}</span>
                <span className="text-sm font-medium text-foreground">
                  {coveredHouses}/{houses.length}
                </span>
              </div>
              <div className="h-2 bg-muted rounded-full overflow-hidden">
                <motion.div
                  initial={{ width: 0 }}
                  animate={{ width: `${coveragePercent}%` }}
                  transition={{ duration: 0.5, ease: "easeOut" }}
                  className="h-full bg-gradient-to-r from-emerald-500 to-cyan-500 rounded-full"
                />
              </div>
            </div>

            {/* Progress */}
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <span className="text-sm text-muted-foreground">{text.progress}</span>
                <span className="text-sm font-medium text-foreground">
                  {currentStep}/{totalSteps}
                </span>
              </div>
              <div className="h-2 bg-muted rounded-full overflow-hidden">
                <motion.div
                  initial={{ width: 0 }}
                  animate={{ width: totalSteps > 0 ? `${(currentStep / totalSteps) * 100}%` : "0%" }}
                  transition={{ duration: 0.3 }}
                  className="h-full bg-gradient-to-r from-violet-500 to-purple-500 rounded-full"
                />
              </div>
            </div>

            {/* Time */}
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Clock className="w-4 h-4 text-muted-foreground" />
                <span className="text-sm text-muted-foreground">{text.time}</span>
              </div>
              <span className="text-sm font-mono text-foreground">{executionTime.toFixed(1)}ms</span>
            </div>

            {/* Efficiency */}
            {stops.length > 0 && (
              <div className="p-3 bg-emerald-500/10 border border-emerald-500/30 rounded-xl">
                <div className="flex items-center gap-2 mb-1">
                  <TrendingUp className="w-4 h-4 text-emerald-400" />
                  <span className="text-sm font-medium text-emerald-400">{text.efficiency}</span>
                </div>
                <div className="flex items-baseline gap-2">
                  <span className="text-2xl font-bold text-emerald-400">{efficiency}%</span>
                  <span className="text-xs text-emerald-400/70">{text.vsNaive}</span>
                </div>
                <p className="text-xs text-emerald-400/70 mt-1">
                  {stops.length} vs {naiveStops} {language === "fr" ? "arrets" : "stops"}
                </p>
              </div>
            )}

            {/* Optimal badge */}
            {coveragePercent === 100 && stops.length > 0 && (
              <motion.div
                initial={{ scale: 0.8, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                className="flex items-center justify-center gap-2 p-2 bg-primary/10 border border-primary/30 rounded-xl"
              >
                <CheckCircle2 className="w-5 h-5 text-primary" />
                <span className="text-sm font-medium text-primary">{text.optimal}</span>
              </motion.div>
            )}
          </div>
        )}
      </div>
    </motion.div>
  );
}
