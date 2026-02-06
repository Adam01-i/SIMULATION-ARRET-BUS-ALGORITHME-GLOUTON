"use client";

import { motion } from "framer-motion";
import {
  Home,
  MapPin,
  Clock,
  Zap,
  Target,
  TrendingUp,
  Award,
} from "lucide-react";

interface StatsPanelProps {
  houseCount: number;
  stopCount: number;
  userStopCount: number;
  naiveStopCount: number;
  d: number;
  executionTime: number;
  isOptimal: boolean;
  language: "fr" | "en";
}

export function StatsPanel({
  houseCount,
  stopCount,
  userStopCount,
  naiveStopCount,
  d,
  executionTime,
  isOptimal,
  language,
}: StatsPanelProps) {
  const stats = [
    {
      icon: <Home className="w-5 h-5" />,
      label: language === "fr" ? "Maisons" : "Houses",
      value: houseCount,
      color: "text-violet-400",
      bg: "bg-violet-500/10",
    },
    {
      icon: <MapPin className="w-5 h-5" />,
      label: language === "fr" ? "Arrêts (Glouton)" : "Stops (Greedy)",
      value: stopCount,
      color: "text-cyan-400",
      bg: "bg-cyan-500/10",
    },
    {
      icon: <Target className="w-5 h-5" />,
      label: language === "fr" ? "Distance max (d)" : "Max distance (d)",
      value: `${d} km`,
      color: "text-amber-400",
      bg: "bg-amber-500/10",
    },
    {
      icon: <Clock className="w-5 h-5" />,
      label: language === "fr" ? "Temps d'exécution" : "Execution time",
      value: `${executionTime.toFixed(2)} ms`,
      color: "text-emerald-400",
      bg: "bg-emerald-500/10",
    },
  ];

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="bg-card/50 backdrop-blur-md border border-border/50 rounded-2xl p-6 space-y-5"
    >
      <div className="flex items-center gap-3">
        <div className="w-10 h-10 rounded-xl bg-primary/20 flex items-center justify-center">
          <TrendingUp className="w-5 h-5 text-primary" />
        </div>
        <div>
          <h3 className="font-semibold text-foreground">
            {language === "fr" ? "Statistiques" : "Statistics"}
          </h3>
          <p className="text-xs text-muted-foreground">
            {language === "fr" ? "Résultats de l'algorithme" : "Algorithm results"}
          </p>
        </div>
      </div>

      <div className="grid grid-cols-2 gap-3">
        {stats.map((stat, index) => (
          <motion.div
            key={stat.label}
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: index * 0.1 }}
            className={`${stat.bg} rounded-xl p-4`}
          >
            <div className={`${stat.color} mb-2`}>{stat.icon}</div>
            <p className="text-xs text-muted-foreground">{stat.label}</p>
            <p className="text-lg font-bold text-foreground">{stat.value}</p>
          </motion.div>
        ))}
      </div>

      {/* Comparison Section */}
      <div className="space-y-3">
        <h4 className="text-sm font-medium text-foreground">
          {language === "fr" ? "Comparaison" : "Comparison"}
        </h4>

        <div className="space-y-2">
          <div className="flex items-center justify-between p-3 rounded-xl bg-cyan-500/10">
            <div className="flex items-center gap-2">
              <Zap className="w-4 h-4 text-cyan-400" />
              <span className="text-sm text-foreground">
                {language === "fr" ? "Algorithme Glouton" : "Greedy Algorithm"}
              </span>
            </div>
            <span className="font-bold text-cyan-400">
              {stopCount} {language === "fr" ? "arrêts" : "stops"}
            </span>
          </div>

          <div className="flex items-center justify-between p-3 rounded-xl bg-orange-500/10">
            <div className="flex items-center gap-2">
              <Target className="w-4 h-4 text-orange-400" />
              <span className="text-sm text-foreground">
                {language === "fr" ? "Placement Naïf" : "Naive Placement"}
              </span>
            </div>
            <span className="font-bold text-orange-400">
              {naiveStopCount} {language === "fr" ? "arrêts" : "stops"}
            </span>
          </div>

          {userStopCount > 0 && (
            <div className="flex items-center justify-between p-3 rounded-xl bg-amber-500/10">
              <div className="flex items-center gap-2">
                <MapPin className="w-4 h-4 text-amber-400" />
                <span className="text-sm text-foreground">
                  {language === "fr" ? "Vos arrêts" : "Your Stops"}
                </span>
              </div>
              <span className="font-bold text-amber-400">
                {userStopCount} {language === "fr" ? "arrêts" : "stops"}
              </span>
            </div>
          )}
        </div>
      </div>

      {/* Optimality Badge */}
      {stopCount > 0 && (
        <motion.div
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 1, scale: 1 }}
          className={`flex items-center gap-3 p-4 rounded-xl ${
            isOptimal
              ? "bg-emerald-500/20 border border-emerald-500/50"
              : "bg-amber-500/20 border border-amber-500/50"
          }`}
        >
          <Award
            className={`w-6 h-6 ${
              isOptimal ? "text-emerald-400" : "text-amber-400"
            }`}
          />
          <div>
            <p
              className={`font-semibold ${
                isOptimal ? "text-emerald-400" : "text-amber-400"
              }`}
            >
              {isOptimal
                ? language === "fr"
                  ? "Solution Optimale!"
                  : "Optimal Solution!"
                : language === "fr"
                ? "Solution Valide"
                : "Valid Solution"}
            </p>
            <p className="text-xs text-muted-foreground">
              {isOptimal
                ? language === "fr"
                  ? "Minimum d'arrêts atteint"
                  : "Minimum stops achieved"
                : language === "fr"
                ? "Toutes les maisons sont couvertes"
                : "All houses are covered"}
            </p>
          </div>
        </motion.div>
      )}

      {/* Complexity Info */}
      <div className="bg-muted/30 rounded-xl p-4">
        <p className="text-xs text-muted-foreground">
          <span className="font-semibold text-foreground">
            {language === "fr" ? "Complexité:" : "Complexity:"}
          </span>{" "}
          O(n) {language === "fr" ? "où n est le nombre de maisons" : "where n is the number of houses"}
        </p>
      </div>
    </motion.div>
  );
}
