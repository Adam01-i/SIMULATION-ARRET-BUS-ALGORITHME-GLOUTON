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
} from "lucide-react";

interface ControlPanelProps {
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
}

export function ControlPanel({
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
}: ControlPanelProps) {
  return (
    <motion.div
      initial={{ opacity: 0, x: -20 }}
      animate={{ opacity: 1, x: 0 }}
      className="bg-card/50 backdrop-blur-md border border-border/50 rounded-2xl p-6 space-y-6"
    >
      <div className="flex items-center gap-3">
        <div className="w-10 h-10 rounded-xl bg-primary/20 flex items-center justify-center">
          <Zap className="w-5 h-5 text-primary" />
        </div>
        <div>
          <h3 className="font-semibold text-foreground">Contrôles</h3>
          <p className="text-xs text-muted-foreground">Paramètres de simulation</p>
        </div>
      </div>

      {/* Distance Slider */}
      <div className="space-y-3">
        <div className="flex justify-between items-center">
          <label className="text-sm font-medium text-foreground">Distance maximale (d)</label>
          <span className="text-sm font-bold text-primary bg-primary/10 px-2 py-0.5 rounded-md">
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
        <p className="text-xs text-muted-foreground">
          Chaque maison doit être à moins de {d} km d&apos;un arrêt
        </p>
      </div>

      {/* House Count */}
      <div className="space-y-3">
        <div className="flex justify-between items-center">
          <label className="text-sm font-medium text-foreground">Nombre de maisons</label>
          <span className="text-sm font-bold text-accent bg-accent/10 px-2 py-0.5 rounded-md">
            {houseCount}
          </span>
        </div>
        <Slider
          value={[houseCount]}
          onValueChange={(values) => onHouseCountChange(values[0])}
          min={3}
          max={20}
          step={1}
          className="w-full"
        />
      </div>

      {/* Animation Speed */}
      <div className="space-y-3">
        <div className="flex justify-between items-center">
          <label className="text-sm font-medium text-foreground">Vitesse d&apos;animation</label>
          <span className="text-sm font-bold text-secondary-foreground bg-secondary px-2 py-0.5 rounded-md">
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
      <div className="space-y-2">
        <div className="flex justify-between items-center text-sm">
          <span className="text-muted-foreground">Progression</span>
          <span className="font-medium text-foreground">
            {currentStep} / {totalSteps}
          </span>
        </div>
        <div className="h-2 bg-muted rounded-full overflow-hidden">
          <motion.div
            className="h-full bg-gradient-to-r from-primary to-accent"
            initial={{ width: 0 }}
            animate={{ width: totalSteps > 0 ? `${(currentStep / totalSteps) * 100}%` : "0%" }}
            transition={{ duration: 0.3 }}
          />
        </div>
      </div>

      {/* Playback Controls */}
      <div className="flex items-center justify-center gap-2">
        <Button
          variant="outline"
          size="icon"
          onClick={onStepBack}
          disabled={currentStep <= 0}
          className="rounded-xl bg-transparent"
        >
          <SkipBack className="w-4 h-4" />
        </Button>
        <Button
          size="icon"
          onClick={onPlayPause}
          disabled={!canPlay}
          className="rounded-xl w-12 h-12 bg-primary hover:bg-primary/90"
        >
          {isPlaying ? <Pause className="w-5 h-5" /> : <Play className="w-5 h-5 ml-0.5" />}
        </Button>
        <Button
          variant="outline"
          size="icon"
          onClick={onStepForward}
          disabled={currentStep >= totalSteps}
          className="rounded-xl"
        >
          <SkipForward className="w-4 h-4" />
        </Button>
      </div>

      {/* Action Buttons */}
      <div className="grid grid-cols-2 gap-3">
        <Button
          variant="outline"
          onClick={onGenerateRandom}
          className="rounded-xl gap-2 bg-transparent"
        >
          <Shuffle className="w-4 h-4" />
          Aléatoire
        </Button>
        <Button
          variant="outline"
          onClick={onReset}
          className="rounded-xl gap-2 bg-transparent"
        >
          <RotateCcw className="w-4 h-4" />
          Réinitialiser
        </Button>
      </div>

      {/* Toggle Coverage */}
      <Button
        variant="ghost"
        onClick={onToggleCoverageZones}
        className="w-full rounded-xl gap-2 justify-start"
      >
        {showCoverageZones ? (
          <>
            <Eye className="w-4 h-4" />
            Zones de couverture visibles
          </>
        ) : (
          <>
            <EyeOff className="w-4 h-4" />
            Zones de couverture masquées
          </>
        )}
      </Button>
    </motion.div>
  );
}
