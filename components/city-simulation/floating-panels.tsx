"use client";

import type React from "react";

import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  Play,
  Pause,
  RotateCcw,
  ChevronDown,
  ChevronUp,
  Settings,
  BarChart3,
  BookOpen,
  Zap,
  Trophy,
  X,
  Minus,
  GripVertical,
  Home,
  MapPin,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Slider } from "@/components/ui/slider";
import { Switch } from "@/components/ui/switch";
import type { AlgorithmResult } from "@/lib/algorithm";

// ============================================================================
// FLOATING PANEL WRAPPER
// ============================================================================

interface FloatingPanelProps {
  title: string;
  icon: React.ReactNode;
  children: React.ReactNode;
  defaultPosition?: { x: number; y: number };
  defaultMinimized?: boolean;
  className?: string;
  accentColor?: string;
}

function FloatingPanel({
  title,
  icon,
  children,
  defaultPosition = { x: 20, y: 20 },
  defaultMinimized = false,
  className = "",
  accentColor = "cyan",
}: FloatingPanelProps) {
  const [isMinimized, setIsMinimized] = useState(defaultMinimized);
  const [position, setPosition] = useState(defaultPosition);
  const [isDragging, setIsDragging] = useState(false);

  const accentClasses: Record<string, string> = {
    cyan: "border-cyan-500/30 shadow-cyan-500/10",
    violet: "border-violet-500/30 shadow-violet-500/10",
    emerald: "border-emerald-500/30 shadow-emerald-500/10",
    amber: "border-amber-500/30 shadow-amber-500/10",
  };

  return (
    <motion.div
      drag
      dragMomentum={false}
      onDragStart={() => setIsDragging(true)}
      onDragEnd={() => setIsDragging(false)}
      initial={{ opacity: 0, scale: 0.9 }}
      animate={{ opacity: 1, scale: 1 }}
      className={`absolute z-50 ${className}`}
      style={{ left: position.x, top: position.y }}
    >
      <div
        className={`bg-card/90 backdrop-blur-xl border ${accentClasses[accentColor]} rounded-xl shadow-2xl overflow-hidden transition-all duration-300`}
      >
        {/* Header */}
        <div className="flex items-center justify-between px-3 py-2 bg-muted/50 cursor-grab active:cursor-grabbing border-b border-border/30">
          <div className="flex items-center gap-2">
            <GripVertical className="w-4 h-4 text-muted-foreground" />
            <span className="text-muted-foreground">{icon}</span>
            <span className="text-sm font-medium text-foreground">{title}</span>
          </div>
          <button
            onClick={() => setIsMinimized(!isMinimized)}
            className="p-1 hover:bg-muted rounded transition-colors"
          >
            {isMinimized ? (
              <ChevronDown className="w-4 h-4 text-muted-foreground" />
            ) : (
              <Minus className="w-4 h-4 text-muted-foreground" />
            )}
          </button>
        </div>

        {/* Content */}
        <AnimatePresence>
          {!isMinimized && (
            <motion.div
              initial={{ height: 0, opacity: 0 }}
              animate={{ height: "auto", opacity: 1 }}
              exit={{ height: 0, opacity: 0 }}
              transition={{ duration: 0.2 }}
              className="overflow-hidden"
            >
              <div className="p-4">{children}</div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </motion.div>
  );
}

// ============================================================================
// CONTROL PANEL
// ============================================================================

interface ControlPanelProps {
  d: number;
  setD: (d: number) => void;
  houseCount: number;
  setHouseCount: (count: number) => void;
  speed: number;
  setSpeed: (speed: number) => void;
  showCoverage: boolean;
  setShowCoverage: (show: boolean) => void;
  isRunning: boolean;
  onStart: () => void;
  onPause: () => void;
  onReset: () => void;
  onRandomize: () => void;
  language: "fr" | "en";
}

export function ControlPanel({
  d,
  setD,
  houseCount,
  setHouseCount,
  speed,
  setSpeed,
  showCoverage,
  setShowCoverage,
  isRunning,
  onStart,
  onPause,
  onReset,
  onRandomize,
  language,
}: ControlPanelProps) {
  const t = {
    fr: {
      distance: "Distance (d)",
      houses: "Maisons",
      speed: "Vitesse",
      coverage: "Zones de couverture",
      randomize: "Aleatoire",
      start: "Demarrer",
      pause: "Pause",
      reset: "Reset",
    },
    en: {
      distance: "Distance (d)",
      houses: "Houses",
      speed: "Speed",
      coverage: "Coverage zones",
      randomize: "Randomize",
      start: "Start",
      pause: "Pause",
      reset: "Reset",
    },
  };

  return (
    <FloatingPanel
      title={language === "fr" ? "Controles" : "Controls"}
      icon={<Settings className="w-4 h-4" />}
      defaultPosition={{ x: 20, y: 80 }}
      accentColor="cyan"
    >
      <div className="space-y-5 w-64">
        {/* Distance slider */}
        <div className="space-y-2">
          <div className="flex justify-between text-sm">
            <span className="text-muted-foreground">{t[language].distance}</span>
            <span className="text-cyan-400 font-mono font-bold">{d}</span>
          </div>
          <Slider
            value={[d]}
            onValueChange={([v]) => setD(v)}
            min={5}
            max={30}
            step={1}
            disabled={isRunning}
            className="cursor-pointer"
          />
        </div>

        {/* House count slider */}
        <div className="space-y-2">
          <div className="flex justify-between text-sm">
            <span className="text-muted-foreground">{t[language].houses}</span>
            <span className="text-violet-400 font-mono font-bold">{houseCount}</span>
          </div>
          <Slider
            value={[houseCount]}
            onValueChange={([v]) => setHouseCount(v)}
            min={3}
            max={20}
            step={1}
            disabled={isRunning}
            className="cursor-pointer"
          />
        </div>

        {/* Speed slider */}
        <div className="space-y-2">
          <div className="flex justify-between text-sm">
            <span className="text-muted-foreground">{t[language].speed}</span>
            <span className="text-emerald-400 font-mono font-bold">{speed}x</span>
          </div>
          <Slider
            value={[speed]}
            onValueChange={([v]) => setSpeed(v)}
            min={0.5}
            max={3}
            step={0.5}
            className="cursor-pointer"
          />
        </div>

        {/* Coverage toggle */}
        <div className="flex items-center justify-between">
          <span className="text-sm text-muted-foreground">{t[language].coverage}</span>
          <Switch checked={showCoverage} onCheckedChange={setShowCoverage} />
        </div>

        {/* Action buttons */}
        <div className="grid grid-cols-2 gap-2 pt-2">
          <Button
            variant="outline"
            size="sm"
            onClick={onRandomize}
            disabled={isRunning}
            className="border-violet-500/30 hover:bg-violet-500/10 bg-transparent"
          >
            <Zap className="w-4 h-4 mr-1" />
            {t[language].randomize}
          </Button>
          <Button
            variant="outline"
            size="sm"
            onClick={onReset}
            className="border-amber-500/30 hover:bg-amber-500/10 bg-transparent"
          >
            <RotateCcw className="w-4 h-4 mr-1" />
            {t[language].reset}
          </Button>
        </div>

        {/* Main action button */}
        <Button
          onClick={isRunning ? onPause : onStart}
          className={`w-full ${
            isRunning
              ? "bg-amber-500 hover:bg-amber-600"
              : "bg-gradient-to-r from-cyan-500 to-violet-500 hover:from-cyan-600 hover:to-violet-600"
          }`}
        >
          {isRunning ? (
            <>
              <Pause className="w-4 h-4 mr-2" />
              {t[language].pause}
            </>
          ) : (
            <>
              <Play className="w-4 h-4 mr-2" />
              {t[language].start}
            </>
          )}
        </Button>
      </div>
    </FloatingPanel>
  );
}

// ============================================================================
// STATISTICS PANEL
// ============================================================================

interface StatsPanelProps {
  greedyResult: AlgorithmResult | null;
  naiveStops: number;
  housesCount: number;
  currentStep: number;
  totalSteps: number;
  language: "fr" | "en";
}

export function StatsPanel({
  greedyResult,
  naiveStops,
  housesCount,
  currentStep,
  totalSteps,
  language,
}: StatsPanelProps) {
  const t = {
    fr: {
      greedy: "Algorithme Glouton",
      naive: "Approche Naive",
      houses: "Maisons",
      stops: "Arrets",
      efficiency: "Efficacite",
      progress: "Progression",
    },
    en: {
      greedy: "Greedy Algorithm",
      naive: "Naive Approach",
      houses: "Houses",
      stops: "Stops",
      efficiency: "Efficiency",
      progress: "Progress",
    },
  };

  const greedyStops = greedyResult?.stops.length ?? 0;
  const efficiency = naiveStops > 0 ? ((1 - greedyStops / naiveStops) * 100).toFixed(0) : 0;
  const progressPercent = totalSteps > 0 ? (currentStep / totalSteps) * 100 : 0;

  return (
    <FloatingPanel
      title={language === "fr" ? "Statistiques" : "Statistics"}
      icon={<BarChart3 className="w-4 h-4" />}
      defaultPosition={{ x: 20, y: 450 }}
      accentColor="emerald"
    >
      <div className="space-y-4 w-64">
        {/* Comparison cards */}
        <div className="grid grid-cols-2 gap-3">
          <div className="bg-cyan-500/10 border border-cyan-500/30 rounded-lg p-3 text-center">
            <div className="text-2xl font-bold text-cyan-400">{greedyStops}</div>
            <div className="text-xs text-muted-foreground">{t[language].greedy}</div>
          </div>
          <div className="bg-violet-500/10 border border-violet-500/30 rounded-lg p-3 text-center">
            <div className="text-2xl font-bold text-violet-400">{naiveStops}</div>
            <div className="text-xs text-muted-foreground">{t[language].naive}</div>
          </div>
        </div>

        {/* Stats row */}
        <div className="flex justify-between text-sm">
          <div className="flex items-center gap-2">
            <Home className="w-4 h-4 text-pink-400" />
            <span className="text-muted-foreground">{t[language].houses}:</span>
            <span className="text-foreground font-bold">{housesCount}</span>
          </div>
          <div className="flex items-center gap-2">
            <MapPin className="w-4 h-4 text-emerald-400" />
            <span className="text-muted-foreground">{t[language].stops}:</span>
            <span className="text-foreground font-bold">{greedyStops}</span>
          </div>
        </div>

        {/* Efficiency */}
        <div className="bg-emerald-500/10 border border-emerald-500/30 rounded-lg p-3">
          <div className="flex items-center justify-between">
            <span className="text-sm text-muted-foreground">{t[language].efficiency}</span>
            <span className="text-lg font-bold text-emerald-400">+{efficiency}%</span>
          </div>
          <div className="text-xs text-emerald-400/70 mt-1">
            {language === "fr"
              ? `${naiveStops - greedyStops} arret(s) economise(s)`
              : `${naiveStops - greedyStops} stop(s) saved`}
          </div>
        </div>

        {/* Progress bar */}
        <div className="space-y-1">
          <div className="flex justify-between text-xs">
            <span className="text-muted-foreground">{t[language].progress}</span>
            <span className="text-foreground">{currentStep}/{totalSteps}</span>
          </div>
          <div className="h-2 bg-muted rounded-full overflow-hidden">
            <motion.div
              className="h-full bg-gradient-to-r from-cyan-500 to-violet-500"
              initial={{ width: 0 }}
              animate={{ width: `${progressPercent}%` }}
              transition={{ duration: 0.3 }}
            />
          </div>
        </div>
      </div>
    </FloatingPanel>
  );
}

// ============================================================================
// THEORY PANEL
// ============================================================================

interface TheoryPanelProps {
  language: "fr" | "en";
}

export function TheoryPanel({ language }: TheoryPanelProps) {
  const [activeTab, setActiveTab] = useState<"problem" | "algorithm" | "complexity">("problem");
  const [rightPosition, setRightPosition] = useState(1000);

  useEffect(() => {
    setRightPosition(window.innerWidth - 320);
    const handleResize = () => setRightPosition(window.innerWidth - 320);
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  const content = {
    fr: {
      problem: {
        title: "Le Probleme",
        text: "Etant donne un ensemble de maisons sur une route et une distance maximale d, trouver le nombre minimum d'arrets de bus necessaires pour que chaque maison soit a distance d'au moins un arret.",
      },
      algorithm: {
        title: "L'Algorithme Glouton",
        steps: [
          "Trier les maisons par position",
          "Selectionner la maison non couverte la plus a gauche",
          "Trouver la maison la plus a droite a distance <= d",
          "Placer l'arret a cette position",
          "Marquer les maisons couvertes",
          "Repeter jusqu'a couverture totale",
        ],
      },
      complexity: {
        title: "Complexite",
        time: "O(n log n)",
        space: "O(n)",
        optimal: "Oui, prouve par echange",
      },
    },
    en: {
      problem: {
        title: "The Problem",
        text: "Given a set of houses on a road and a maximum distance d, find the minimum number of bus stops needed so that each house is within distance d of at least one stop.",
      },
      algorithm: {
        title: "Greedy Algorithm",
        steps: [
          "Sort houses by position",
          "Select leftmost uncovered house",
          "Find rightmost house at distance <= d",
          "Place stop at that position",
          "Mark covered houses",
          "Repeat until full coverage",
        ],
      },
      complexity: {
        title: "Complexity",
        time: "O(n log n)",
        space: "O(n)",
        optimal: "Yes, proven by exchange",
      },
    },
  };

  const c = content[language];

  return (
    <FloatingPanel
      title={language === "fr" ? "Theorie & Concepts" : "Theory & Concepts"}
      icon={<BookOpen className="w-4 h-4" />}
      defaultPosition={{ x: rightPosition, y: 80 }}
      accentColor="violet"
    >
      <div className="space-y-4 w-72">
        {/* Tabs */}
        <div className="flex gap-1 p-1 bg-muted rounded-lg">
          {(["problem", "algorithm", "complexity"] as const).map((tab) => (
            <button
              key={tab}
              onClick={() => setActiveTab(tab)}
              className={`flex-1 px-2 py-1.5 text-xs font-medium rounded-md transition-colors ${
                activeTab === tab
                  ? "bg-violet-500 text-white"
                  : "text-muted-foreground hover:text-foreground"
              }`}
            >
              {tab === "problem"
                ? language === "fr"
                  ? "Probleme"
                  : "Problem"
                : tab === "algorithm"
                ? language === "fr"
                  ? "Algo"
                  : "Algo"
                : language === "fr"
                ? "Complexite"
                : "Complexity"}
            </button>
          ))}
        </div>

        {/* Content */}
        <AnimatePresence mode="wait">
          <motion.div
            key={activeTab}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            transition={{ duration: 0.2 }}
          >
            {activeTab === "problem" && (
              <div className="space-y-3">
                <h4 className="text-sm font-semibold text-foreground">{c.problem.title}</h4>
                <p className="text-xs text-muted-foreground leading-relaxed">{c.problem.text}</p>
                <div className="flex items-center gap-2 p-2 bg-cyan-500/10 border border-cyan-500/30 rounded-lg">
                  <span className="text-lg">🎯</span>
                  <span className="text-xs text-cyan-400">
                    {language === "fr" ? "Objectif: Minimiser les arrets" : "Goal: Minimize stops"}
                  </span>
                </div>
              </div>
            )}

            {activeTab === "algorithm" && (
              <div className="space-y-3">
                <h4 className="text-sm font-semibold text-foreground">{c.algorithm.title}</h4>
                <ol className="space-y-2">
                  {c.algorithm.steps.map((step, i) => (
                    <li key={i} className="flex items-start gap-2 text-xs">
                      <span className="w-5 h-5 flex-shrink-0 flex items-center justify-center bg-violet-500/20 text-violet-400 rounded-full text-[10px] font-bold">
                        {i + 1}
                      </span>
                      <span className="text-muted-foreground pt-0.5">{step}</span>
                    </li>
                  ))}
                </ol>
              </div>
            )}

            {activeTab === "complexity" && (
              <div className="space-y-3">
                <h4 className="text-sm font-semibold text-foreground">{c.complexity.title}</h4>
                <div className="grid grid-cols-2 gap-2">
                  <div className="p-2 bg-muted rounded-lg">
                    <div className="text-xs text-muted-foreground">
                      {language === "fr" ? "Temps" : "Time"}
                    </div>
                    <div className="text-sm font-mono font-bold text-cyan-400">
                      {c.complexity.time}
                    </div>
                  </div>
                  <div className="p-2 bg-muted rounded-lg">
                    <div className="text-xs text-muted-foreground">
                      {language === "fr" ? "Espace" : "Space"}
                    </div>
                    <div className="text-sm font-mono font-bold text-violet-400">
                      {c.complexity.space}
                    </div>
                  </div>
                </div>
                <div className="p-2 bg-emerald-500/10 border border-emerald-500/30 rounded-lg">
                  <div className="text-xs text-muted-foreground">
                    {language === "fr" ? "Optimal?" : "Optimal?"}
                  </div>
                  <div className="text-sm font-bold text-emerald-400">{c.complexity.optimal}</div>
                </div>
              </div>
            )}
          </motion.div>
        </AnimatePresence>
      </div>
    </FloatingPanel>
  );
}

// ============================================================================
// CHALLENGE MODE PANEL
// ============================================================================

interface ChallengePanelProps {
  isActive: boolean;
  onToggle: () => void;
  userStops: number;
  greedyStops: number;
  allCovered: boolean;
  language: "fr" | "en";
}

export function ChallengePanel({
  isActive,
  onToggle,
  userStops,
  greedyStops,
  allCovered,
  language,
}: ChallengePanelProps) {
  const [rightPosition, setRightPosition] = useState(1000);

  useEffect(() => {
    setRightPosition(window.innerWidth - 320);
    const handleResize = () => setRightPosition(window.innerWidth - 320);
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  const t = {
    fr: {
      title: "Mode Defi",
      description: "Pouvez-vous faire mieux que l'algorithme?",
      yourStops: "Vos arrets",
      greedyStops: "Algorithme",
      status: allCovered
        ? userStops <= greedyStops
          ? "Bravo! Vous avez egalise ou battu l'algorithme!"
          : "Toutes les maisons sont couvertes!"
        : "Certaines maisons ne sont pas couvertes",
      activate: "Activer le defi",
      deactivate: "Desactiver",
    },
    en: {
      title: "Challenge Mode",
      description: "Can you beat the algorithm?",
      yourStops: "Your stops",
      greedyStops: "Algorithm",
      status: allCovered
        ? userStops <= greedyStops
          ? "Amazing! You matched or beat the algorithm!"
          : "All houses are covered!"
        : "Some houses are not covered",
      activate: "Activate challenge",
      deactivate: "Deactivate",
    },
  };

  return (
    <FloatingPanel
      title={t[language].title}
      icon={<Trophy className="w-4 h-4" />}
      defaultPosition={{ x: rightPosition, y: 450 }}
      accentColor="amber"
      defaultMinimized={!isActive}
    >
      <div className="space-y-4 w-64">
        <p className="text-xs text-muted-foreground">{t[language].description}</p>

        {isActive && (
          <>
            <div className="grid grid-cols-2 gap-3">
              <div className="bg-amber-500/10 border border-amber-500/30 rounded-lg p-3 text-center">
                <div className="text-2xl font-bold text-amber-400">{userStops}</div>
                <div className="text-xs text-muted-foreground">{t[language].yourStops}</div>
              </div>
              <div className="bg-cyan-500/10 border border-cyan-500/30 rounded-lg p-3 text-center">
                <div className="text-2xl font-bold text-cyan-400">{greedyStops}</div>
                <div className="text-xs text-muted-foreground">{t[language].greedyStops}</div>
              </div>
            </div>

            <div
              className={`p-2 rounded-lg text-xs text-center ${
                allCovered
                  ? userStops <= greedyStops
                    ? "bg-emerald-500/20 text-emerald-400"
                    : "bg-cyan-500/20 text-cyan-400"
                  : "bg-amber-500/20 text-amber-400"
              }`}
            >
              {t[language].status}
            </div>
          </>
        )}

        <Button
          onClick={onToggle}
          variant={isActive ? "outline" : "default"}
          className={`w-full ${
            isActive
              ? "border-amber-500/30 hover:bg-amber-500/10"
              : "bg-gradient-to-r from-amber-500 to-orange-500"
          }`}
        >
          {isActive ? t[language].deactivate : t[language].activate}
        </Button>
      </div>
    </FloatingPanel>
  );
}

// ============================================================================
// STEP EXPLANATION OVERLAY
// ============================================================================

interface StepOverlayProps {
  step: {
    type: string;
    message: string;
    messageEn: string;
  } | null;
  language: "fr" | "en";
}

export function StepOverlay({ step, language }: StepOverlayProps) {
  if (!step) return null;

  const getStepColor = (type: string) => {
    switch (type) {
      case "select_house":
        return "from-pink-500 to-violet-500";
      case "expand_coverage":
        return "from-violet-500 to-cyan-500";
      case "place_stop":
        return "from-cyan-500 to-emerald-500";
      case "cover_remaining":
        return "from-emerald-500 to-cyan-500";
      case "complete":
        return "from-emerald-400 to-cyan-400";
      default:
        return "from-cyan-500 to-violet-500";
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: 20 }}
      className="absolute bottom-24 left-1/2 -translate-x-1/2 z-50"
    >
      <div
        className={`px-6 py-3 bg-gradient-to-r ${getStepColor(step.type)} rounded-2xl shadow-2xl`}
      >
        <p className="text-white text-sm font-medium text-center max-w-md">
          {language === "fr" ? step.message : step.messageEn}
        </p>
      </div>
    </motion.div>
  );
}

// ============================================================================
// LANGUAGE TOGGLE
// ============================================================================

interface LanguageToggleProps {
  language: "fr" | "en";
  onChange: (lang: "fr" | "en") => void;
}

export function LanguageToggle({ language, onChange }: LanguageToggleProps) {
  return (
    <div className="absolute top-4 right-4 z-50">
      <div className="flex items-center gap-1 p-1 bg-card/80 backdrop-blur-md border border-border/50 rounded-lg">
        <button
          onClick={() => onChange("fr")}
          className={`px-3 py-1.5 text-xs font-medium rounded-md transition-colors ${
            language === "fr"
              ? "bg-cyan-500 text-white"
              : "text-muted-foreground hover:text-foreground"
          }`}
        >
          FR
        </button>
        <button
          onClick={() => onChange("en")}
          className={`px-3 py-1.5 text-xs font-medium rounded-md transition-colors ${
            language === "en"
              ? "bg-cyan-500 text-white"
              : "text-muted-foreground hover:text-foreground"
          }`}
        >
          EN
        </button>
      </div>
    </div>
  );
}

// ============================================================================
// TITLE OVERLAY
// ============================================================================

interface TitleOverlayProps {
  language: "fr" | "en";
}

export function TitleOverlay({ language }: TitleOverlayProps) {
  return (
    <div className="absolute top-4 left-1/2 -translate-x-1/2 z-40">
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        className="text-center"
      >
        <h1 className="text-2xl font-bold bg-gradient-to-r from-cyan-400 via-violet-400 to-pink-400 bg-clip-text text-transparent">
          {language === "fr" ? "Arrets de Bus" : "Bus Stops"}
        </h1>
        <p className="text-xs text-muted-foreground mt-1">
          {language === "fr"
            ? "Visualisation de l'Algorithme Glouton"
            : "Greedy Algorithm Visualization"}
        </p>
      </motion.div>
    </div>
  );
}
