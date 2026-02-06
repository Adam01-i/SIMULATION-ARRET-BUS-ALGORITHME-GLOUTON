"use client";

import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import {
  Trophy,
  Target,
  Zap,
  Star,
  Medal,
  RefreshCw,
} from "lucide-react";

interface ChallengeModeProps {
  isActive: boolean;
  onToggle: () => void;
  userStopCount: number;
  optimalStopCount: number;
  allHousesCovered: boolean;
  onClearUserStops: () => void;
  language: "fr" | "en";
}

export function ChallengeMode({
  isActive,
  onToggle,
  userStopCount,
  optimalStopCount,
  allHousesCovered,
  onClearUserStops,
  language,
}: ChallengeModeProps) {
  const userWon = allHousesCovered && userStopCount <= optimalStopCount && userStopCount > 0;
  const userTied = allHousesCovered && userStopCount === optimalStopCount && userStopCount > 0;
  const userLost = allHousesCovered && userStopCount > optimalStopCount;

  const getBadge = () => {
    if (!allHousesCovered || userStopCount === 0) return null;
    
    if (userStopCount < optimalStopCount) {
      return {
        icon: <Trophy className="w-6 h-6" />,
        title: language === "fr" ? "Impossible!" : "Impossible!",
        desc: language === "fr" 
          ? "Vérifiez que toutes les maisons sont couvertes" 
          : "Check that all houses are covered",
        color: "text-red-400",
        bg: "bg-red-500/20",
      };
    }
    
    if (userTied) {
      return {
        icon: <Medal className="w-6 h-6" />,
        title: language === "fr" ? "Maître du Glouton!" : "Greedy Master!",
        desc: language === "fr" 
          ? "Vous avez égalé l'algorithme optimal!" 
          : "You matched the optimal algorithm!",
        color: "text-amber-400",
        bg: "bg-amber-500/20",
      };
    }
    
    if (userLost) {
      return {
        icon: <Star className="w-6 h-6" />,
        title: language === "fr" ? "Bien essayé!" : "Nice try!",
        desc: language === "fr" 
          ? `L'algorithme glouton utilise ${optimalStopCount - userStopCount} arrêt(s) de moins` 
          : `The greedy algorithm uses ${userStopCount - optimalStopCount} fewer stop(s)`,
        color: "text-blue-400",
        bg: "bg-blue-500/20",
      };
    }

    return null;
  };

  const badge = getBadge();

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className={`border rounded-2xl p-6 transition-all duration-300 ${
        isActive
          ? "bg-gradient-to-br from-amber-500/10 to-orange-500/10 border-amber-500/50"
          : "bg-card/50 border-border/50"
      } backdrop-blur-md`}
    >
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-3">
          <div
            className={`w-10 h-10 rounded-xl flex items-center justify-center ${
              isActive ? "bg-amber-500/20" : "bg-muted/50"
            }`}
          >
            <Target
              className={`w-5 h-5 ${
                isActive ? "text-amber-400" : "text-muted-foreground"
              }`}
            />
          </div>
          <div>
            <h3 className="font-semibold text-foreground">
              {language === "fr" ? "Mode Challenge" : "Challenge Mode"}
            </h3>
            <p className="text-xs text-muted-foreground">
              {language === "fr"
                ? "Pouvez-vous battre l'algorithme?"
                : "Can you beat the algorithm?"}
            </p>
          </div>
        </div>
        <Button
          variant={isActive ? "default" : "outline"}
          size="sm"
          onClick={onToggle}
          className="rounded-xl"
        >
          {isActive
            ? language === "fr"
              ? "Actif"
              : "Active"
            : language === "fr"
            ? "Activer"
            : "Activate"}
        </Button>
      </div>

      {isActive && (
        <motion.div
          initial={{ opacity: 0, height: 0 }}
          animate={{ opacity: 1, height: "auto" }}
          className="space-y-4"
        >
          <div className="bg-background/30 rounded-xl p-4">
            <p className="text-sm text-muted-foreground leading-relaxed">
              {language === "fr"
                ? "Cliquez sur la route pour placer vos propres arrêts de bus. Essayez d'utiliser le moins d'arrêts possible tout en couvrant toutes les maisons!"
                : "Click on the road to place your own bus stops. Try to use as few stops as possible while covering all houses!"}
            </p>
          </div>

          {/* Score Display */}
          <div className="grid grid-cols-2 gap-3">
            <div className="bg-cyan-500/10 rounded-xl p-4 text-center">
              <Zap className="w-5 h-5 text-cyan-400 mx-auto mb-2" />
              <p className="text-xs text-muted-foreground mb-1">
                {language === "fr" ? "Algorithme" : "Algorithm"}
              </p>
              <p className="text-2xl font-bold text-cyan-400">{optimalStopCount}</p>
            </div>
            <div className="bg-amber-500/10 rounded-xl p-4 text-center">
              <Target className="w-5 h-5 text-amber-400 mx-auto mb-2" />
              <p className="text-xs text-muted-foreground mb-1">
                {language === "fr" ? "Vos arrêts" : "Your stops"}
              </p>
              <p className="text-2xl font-bold text-amber-400">{userStopCount}</p>
            </div>
          </div>

          {/* Coverage Status */}
          <div
            className={`rounded-xl p-3 text-center text-sm font-medium ${
              allHousesCovered
                ? "bg-emerald-500/20 text-emerald-400"
                : "bg-red-500/20 text-red-400"
            }`}
          >
            {allHousesCovered
              ? language === "fr"
                ? "Toutes les maisons sont couvertes!"
                : "All houses are covered!"
              : language === "fr"
              ? "Certaines maisons ne sont pas couvertes"
              : "Some houses are not covered"}
          </div>

          {/* Badge */}
          {badge && (
            <motion.div
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              className={`${badge.bg} rounded-xl p-4 flex items-center gap-3`}
            >
              <span className={badge.color}>{badge.icon}</span>
              <div>
                <p className={`font-semibold ${badge.color}`}>{badge.title}</p>
                <p className="text-xs text-muted-foreground">{badge.desc}</p>
              </div>
            </motion.div>
          )}

          {/* Clear Button */}
          {userStopCount > 0 && (
            <Button
              variant="outline"
              size="sm"
              onClick={onClearUserStops}
              className="w-full rounded-xl gap-2 bg-transparent"
            >
              <RefreshCw className="w-4 h-4" />
              {language === "fr" ? "Effacer mes arrêts" : "Clear my stops"}
            </Button>
          )}
        </motion.div>
      )}
    </motion.div>
  );
}
