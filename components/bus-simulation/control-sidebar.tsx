"use client";

import { motion } from "framer-motion";
import { Slider } from "@/components/ui/slider";
import { Button } from "@/components/ui/button";
import {
  Play,
  Pause,
  RotateCcw,
  SkipForward,
  Settings2,
  Shuffle,
  ChevronRight,
  ChevronLeft,
} from "lucide-react";
import { useState } from "react";

interface ControlSidebarProps {
  d: number;
  onDChange: (value: number) => void;
  houseCount: number;
  onHouseCountChange: (value: number) => void;
  speed: number;
  onSpeedChange: (value: number) => void;
  isRunning: boolean;
  onStart: () => void;
  onPause: () => void;
  onReset: () => void;
  onStep: () => void;
  onRandomize: () => void;
  canStep: boolean;
  isComplete: boolean;
  language: "fr" | "en";
}

export function ControlSidebar({
  d,
  onDChange,
  houseCount,
  onHouseCountChange,
  speed,
  onSpeedChange,
  isRunning,
  onStart,
  onPause,
  onReset,
  onStep,
  onRandomize,
  canStep,
  isComplete,
  language,
}: ControlSidebarProps) {
  const [isCollapsed, setIsCollapsed] = useState(false);

  const t = {
    fr: {
      controls: "Controles",
      distance: "Distance max (d)",
      houses: "Nombre de maisons",
      speed: "Vitesse",
      slow: "Lent",
      fast: "Rapide",
      start: "Demarrer",
      pause: "Pause",
      reset: "Reinitialiser",
      step: "Etape suivante",
      random: "Aleatoire",
      complete: "Termine !",
    },
    en: {
      controls: "Controls",
      distance: "Max distance (d)",
      houses: "Number of houses",
      speed: "Speed",
      slow: "Slow",
      fast: "Fast",
      start: "Start",
      pause: "Pause",
      reset: "Reset",
      step: "Next step",
      random: "Randomize",
      complete: "Complete!",
    },
  };

  const text = t[language];

  return (
    <motion.div
      initial={{ x: -300, opacity: 0 }}
      animate={{ x: 0, opacity: 1 }}
      transition={{ type: "spring", damping: 25 }}
      className={`absolute top-16 left-4 z-20 transition-all duration-300 ${
        isCollapsed ? "w-12" : "w-72"
      }`}
    >
      <div className="bg-card/90 backdrop-blur-xl border border-border/50 rounded-2xl shadow-2xl overflow-hidden">
        {/* Header */}
        <div className="flex items-center justify-between p-4 border-b border-border/30">
          {!isCollapsed && (
            <div className="flex items-center gap-2">
              <Settings2 className="w-5 h-5 text-primary" />
              <h2 className="font-semibold text-foreground">{text.controls}</h2>
            </div>
          )}
          <button
            onClick={() => setIsCollapsed(!isCollapsed)}
            className="p-1.5 hover:bg-muted rounded-lg transition-colors"
          >
            {isCollapsed ? (
              <ChevronRight className="w-4 h-4 text-muted-foreground" />
            ) : (
              <ChevronLeft className="w-4 h-4 text-muted-foreground" />
            )}
          </button>
        </div>

        {!isCollapsed && (
          <div className="p-4 space-y-6">
            {/* Distance slider */}
            <div className="space-y-3">
              <div className="flex justify-between items-center">
                <label className="text-sm font-medium text-foreground">
                  {text.distance}
                </label>
                <span className="text-sm font-mono text-primary bg-primary/10 px-2 py-0.5 rounded">
                  {d}
                </span>
              </div>
              <Slider
                value={[d]}
                onValueChange={([value]) => onDChange(value)}
                min={1}
                max={20}
                step={1}
                disabled={isRunning}
                className="w-full"
              />
            </div>

            {/* House count slider */}
            <div className="space-y-3">
              <div className="flex justify-between items-center">
                <label className="text-sm font-medium text-foreground">
                  {text.houses}
                </label>
                <span className="text-sm font-mono text-primary bg-primary/10 px-2 py-0.5 rounded">
                  {houseCount}
                </span>
              </div>
              <Slider
                value={[houseCount]}
                onValueChange={([value]) => onHouseCountChange(value)}
                min={3}
                max={15}
                step={1}
                disabled={isRunning}
                className="w-full"
              />
            </div>

            {/* Speed slider */}
            <div className="space-y-3">
              <div className="flex justify-between items-center">
                <label className="text-sm font-medium text-foreground">
                  {text.speed}
                </label>
              </div>
              <Slider
                value={[speed]}
                onValueChange={([value]) => onSpeedChange(value)}
                min={0.5}
                max={3}
                step={0.5}
                className="w-full"
              />
              <div className="flex justify-between text-xs text-muted-foreground">
                <span>{text.slow}</span>
                <span>{text.fast}</span>
              </div>
            </div>

            {/* Randomize button */}
            <Button
              variant="outline"
              onClick={onRandomize}
              disabled={isRunning}
              className="w-full gap-2 bg-transparent"
            >
              <Shuffle className="w-4 h-4" />
              {text.random}
            </Button>

            {/* Playback controls */}
            <div className="grid grid-cols-2 gap-2">
              {!isRunning && !isComplete ? (
                <Button onClick={onStart} className="col-span-2 gap-2 h-12">
                  <Play className="w-5 h-5" />
                  {text.start}
                </Button>
              ) : isComplete ? (
                <Button onClick={onReset} className="col-span-2 gap-2 h-12">
                  <RotateCcw className="w-5 h-5" />
                  {text.reset}
                </Button>
              ) : (
                <>
                  <Button onClick={onPause} variant="outline" className="gap-2 h-12 bg-transparent">
                    <Pause className="w-5 h-5" />
                    {text.pause}
                  </Button>
                  <Button onClick={onReset} variant="outline" className="gap-2 h-12 bg-transparent">
                    <RotateCcw className="w-5 h-5" />
                    {text.reset}
                  </Button>
                </>
              )}
            </div>

            {/* Step button */}
            <Button
              variant="secondary"
              onClick={onStep}
              disabled={!canStep || isRunning}
              className="w-full gap-2"
            >
              <SkipForward className="w-4 h-4" />
              {text.step}
            </Button>
          </div>
        )}
      </div>
    </motion.div>
  );
}
