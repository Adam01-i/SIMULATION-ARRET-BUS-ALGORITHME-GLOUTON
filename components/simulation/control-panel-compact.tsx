"use client";

import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Slider } from "@/components/ui/slider";
import {
  Play,
  Pause,
  SkipForward,
  SkipBack,
  RotateCcw,
  Shuffle,
  Eye,
  EyeOff,
  Zap,
  Home,
  Ruler,
  Gauge,
} from "lucide-react";

interface ControlPanelCompactProps {
  d: number;
  onDChange: (value: number) => void;
  houseCount: number;
  onHouseCountChange: (value: number) => void;
  isPlaying: boolean;
  onPlayPause: () => void;
  onStepForward: () => void;
  onStepBack: () => void;
  onReset: () => void;
  onGenerateRandom: () => void;
  currentStep: number;
  totalSteps: number;
  speed: number;
  onSpeedChange: (value: number) => void;
  showCoverageZones: boolean;
  onToggleCoverageZones: () => void;
  canPlay: boolean;
  language: "fr" | "en";
}

export function ControlPanelCompact({
  d,
  onDChange,
  houseCount,
  onHouseCountChange,
  isPlaying,
  onPlayPause,
  onStepForward,
  onStepBack,
  onReset,
  onGenerateRandom,
  currentStep,
  totalSteps,
  speed,
  onSpeedChange,
  showCoverageZones,
  onToggleCoverageZones,
  canPlay,
  language,
}: ControlPanelCompactProps) {
  return (
    <motion.div
      initial={{ opacity: 0, x: -20 }}
      animate={{ opacity: 1, x: 0 }}
      className="h-full bg-card/50 backdrop-blur-md border border-border/50 rounded-xl p-4 flex flex-col gap-4"
    >
      {/* Header */}
      <div className="flex items-center gap-2">
        <div className="w-8 h-8 rounded-lg bg-primary/20 flex items-center justify-center">
          <Zap className="w-4 h-4 text-primary" />
        </div>
        <div>
          <h3 className="font-semibold text-sm text-foreground">
            {language === "fr" ? "Contrôles" : "Controls"}
          </h3>
          <p className="text-xs text-muted-foreground">
            {language === "fr" ? "Paramètres" : "Parameters"}
          </p>
        </div>
      </div>

      {/* Parameters Section */}
      <div className="space-y-4 flex-1">
        {/* Distance Slider */}
        <div className="space-y-2">
          <div className="flex items-center gap-2">
            <Ruler className="w-3.5 h-3.5 text-cyan-400" />
            <span className="text-xs font-medium text-foreground flex-1">
              {language === "fr" ? "Distance (d)" : "Distance (d)"}
            </span>
            <span className="text-xs font-bold text-primary bg-primary/10 px-1.5 py-0.5 rounded">
              {d} km
            </span>
          </div>
          <Slider
            value={[d]}
            onValueChange={(values) => onDChange(values[0])}
            min={5}
            max={50}
            step={1}
            className="w-full"
          />
        </div>

        {/* House Count */}
        <div className="space-y-2">
          <div className="flex items-center gap-2">
            <Home className="w-3.5 h-3.5 text-violet-400" />
            <span className="text-xs font-medium text-foreground flex-1">
              {language === "fr" ? "Maisons" : "Houses"}
            </span>
            <span className="text-xs font-bold text-accent bg-accent/10 px-1.5 py-0.5 rounded">
              {houseCount}
            </span>
          </div>
          <Slider
            value={[houseCount]}
            onValueChange={(values) => onHouseCountChange(values[0])}
            min={3}
            max={15}
            step={1}
            className="w-full"
          />
        </div>

        {/* Speed */}
        <div className="space-y-2">
          <div className="flex items-center gap-2">
            <Gauge className="w-3.5 h-3.5 text-amber-400" />
            <span className="text-xs font-medium text-foreground flex-1">
              {language === "fr" ? "Vitesse" : "Speed"}
            </span>
            <span className="text-xs font-bold text-secondary-foreground bg-secondary px-1.5 py-0.5 rounded">
              {speed}x
            </span>
          </div>
          <Slider
            value={[speed]}
            onValueChange={(values) => onSpeedChange(values[0])}
            min={0.5}
            max={3}
            step={0.5}
            className="w-full"
          />
        </div>

        {/* Progress */}
        <div className="space-y-1.5">
          <div className="flex justify-between items-center text-xs">
            <span className="text-muted-foreground">
              {language === "fr" ? "Progression" : "Progress"}
            </span>
            <span className="font-medium text-foreground">
              {currentStep} / {totalSteps}
            </span>
          </div>
          <div className="h-1.5 bg-muted rounded-full overflow-hidden">
            <motion.div
              className="h-full bg-gradient-to-r from-primary to-accent"
              initial={{ width: 0 }}
              animate={{ width: totalSteps > 0 ? `${(currentStep / totalSteps) * 100}%` : "0%" }}
              transition={{ duration: 0.3 }}
            />
          </div>
        </div>
      </div>

      {/* Playback Controls */}
      <div className="space-y-3">
        <div className="flex items-center justify-center gap-1.5">
          <Button
            variant="outline"
            size="icon"
            onClick={onStepBack}
            disabled={currentStep <= 0}
            className="rounded-lg w-9 h-9 bg-transparent"
          >
            <SkipBack className="w-4 h-4" />
          </Button>
          <Button
            size="icon"
            onClick={onPlayPause}
            disabled={!canPlay}
            className="rounded-lg w-10 h-10 bg-primary hover:bg-primary/90"
          >
            {isPlaying ? <Pause className="w-4 h-4" /> : <Play className="w-4 h-4 ml-0.5" />}
          </Button>
          <Button
            variant="outline"
            size="icon"
            onClick={onStepForward}
            disabled={currentStep >= totalSteps}
            className="rounded-lg w-9 h-9 bg-transparent"
          >
            <SkipForward className="w-4 h-4" />
          </Button>
        </div>

        {/* Action Buttons */}
        <div className="grid grid-cols-2 gap-2">
          <Button
            variant="outline"
            size="sm"
            onClick={onGenerateRandom}
            className="rounded-lg gap-1.5 text-xs bg-transparent"
          >
            <Shuffle className="w-3.5 h-3.5" />
            {language === "fr" ? "Aléatoire" : "Random"}
          </Button>
          <Button
            variant="outline"
            size="sm"
            onClick={onReset}
            className="rounded-lg gap-1.5 text-xs bg-transparent"
          >
            <RotateCcw className="w-3.5 h-3.5" />
            {language === "fr" ? "Reset" : "Reset"}
          </Button>
        </div>

        {/* Toggle Coverage */}
        <Button
          variant="ghost"
          size="sm"
          onClick={onToggleCoverageZones}
          className="w-full rounded-lg gap-2 justify-start text-xs h-8"
        >
          {showCoverageZones ? (
            <>
              <Eye className="w-3.5 h-3.5" />
              {language === "fr" ? "Zones visibles" : "Zones visible"}
            </>
          ) : (
            <>
              <EyeOff className="w-3.5 h-3.5" />
              {language === "fr" ? "Zones masquées" : "Zones hidden"}
            </>
          )}
        </Button>
      </div>
    </motion.div>
  );
}
