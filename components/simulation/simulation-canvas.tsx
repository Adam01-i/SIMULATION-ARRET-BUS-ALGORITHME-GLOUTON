"use client";

import type React from "react";

import { useRef, useEffect, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import type { AlgorithmStep } from "@/lib/algorithm";

interface SimulationCanvasProps {
  houses: number[];
  stops: number[];
  d: number;
  maxPosition: number;
  currentStep: number;
  highlightedHouseIndex: number | null;
  highlightedStopIndex: number | null;
  coveredRange: [number, number] | null;
  userStops: number[];
  onAddHouse: (position: number) => void;
  onRemoveHouse: (index: number) => void;
  onAddUserStop: (position: number) => void;
  isInteractive: boolean;
  showCoverageZones: boolean;
  currentStepData?: AlgorithmStep | null;
  language?: "fr" | "en";
}

export function SimulationCanvas({
  houses,
  stops,
  d,
  maxPosition,
  currentStep,
  highlightedHouseIndex,
  highlightedStopIndex,
  coveredRange,
  userStops,
  onAddHouse,
  onRemoveHouse,
  onAddUserStop,
  isInteractive,
  showCoverageZones,
  currentStepData,
  language = "fr",
}: SimulationCanvasProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);

  const positionToX = useCallback(
    (position: number, width: number) => {
      const padding = 60;
      return padding + (position / maxPosition) * (width - 2 * padding);
    },
    [maxPosition]
  );

  const xToPosition = useCallback(
    (x: number, width: number) => {
      const padding = 60;
      return ((x - padding) / (width - 2 * padding)) * maxPosition;
    },
    [maxPosition]
  );

  const draw = useCallback(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    const dpr = window.devicePixelRatio || 1;
    const rect = canvas.getBoundingClientRect();
    canvas.width = rect.width * dpr;
    canvas.height = rect.height * dpr;

    ctx.setTransform(1, 0, 0, 1, 0, 0); // RESET SCALE
    ctx.scale(dpr, dpr);

    const width = rect.width;
    const height = rect.height;

    // Clear canvas
    ctx.clearRect(0, 0, width, height);

    // Draw gradient background
    const gradient = ctx.createLinearGradient(0, 0, 0, height);
    gradient.addColorStop(0, "rgba(15, 23, 42, 0.8)");
    gradient.addColorStop(1, "rgba(30, 41, 59, 0.6)");
    ctx.fillStyle = gradient;
    ctx.fillRect(0, 0, width, height);

    const roadY = height * 0.6;
    const padding = 60;

    // Draw road
    ctx.fillStyle = "#334155";
    ctx.fillRect(padding - 20, roadY - 8, width - 2 * padding + 40, 16);

    // Road markings
    ctx.strokeStyle = "#fbbf24";
    ctx.lineWidth = 2;
    ctx.setLineDash([20, 15]);
    ctx.beginPath();
    ctx.moveTo(padding - 20, roadY);
    ctx.lineTo(width - padding + 20, roadY);
    ctx.stroke();
    ctx.setLineDash([]);

    // Draw coverage zones for stops
    if (showCoverageZones) {
      stops.forEach((stop, index) => {
        const x = positionToX(stop, width);
        const rangeStart = positionToX(Math.max(0, stop - d), width);
        const rangeEnd = positionToX(Math.min(maxPosition, stop + d), width);

        const isHighlighted = highlightedStopIndex === index;

        // Coverage zone
        const zoneGradient = ctx.createRadialGradient(
          x,
          roadY,
          0,
          x,
          roadY,
          rangeEnd - rangeStart
        );
        zoneGradient.addColorStop(0, isHighlighted ? "rgba(34, 211, 238, 0.4)" : "rgba(34, 211, 238, 0.2)");
        zoneGradient.addColorStop(1, "rgba(34, 211, 238, 0)");
        ctx.fillStyle = zoneGradient;
        ctx.fillRect(rangeStart, roadY - 80, rangeEnd - rangeStart, 160);

        // Coverage boundary
        ctx.strokeStyle = isHighlighted ? "rgba(34, 211, 238, 0.8)" : "rgba(34, 211, 238, 0.3)";
        ctx.lineWidth = isHighlighted ? 2 : 1;
        ctx.beginPath();
        ctx.moveTo(rangeStart, roadY - 80);
        ctx.lineTo(rangeStart, roadY + 80);
        ctx.moveTo(rangeEnd, roadY - 80);
        ctx.lineTo(rangeEnd, roadY + 80);
        ctx.stroke();
      });
    }

    // Draw user stops coverage
    userStops.forEach((stop) => {
      const x = positionToX(stop, width);
      const rangeStart = positionToX(Math.max(0, stop - d), width);
      const rangeEnd = positionToX(Math.min(maxPosition, stop + d), width);

      const zoneGradient = ctx.createRadialGradient(
        x,
        roadY,
        0,
        x,
        roadY,
        rangeEnd - rangeStart
      );
      zoneGradient.addColorStop(0, "rgba(251, 146, 60, 0.3)");
      zoneGradient.addColorStop(1, "rgba(251, 146, 60, 0)");
      ctx.fillStyle = zoneGradient;
      ctx.fillRect(rangeStart, roadY - 80, rangeEnd - rangeStart, 160);
    });

    // Draw highlighted coverage range
    if (coveredRange) {
      const rangeStart = positionToX(Math.max(0, coveredRange[0]), width);
      const rangeEnd = positionToX(Math.min(maxPosition, coveredRange[1]), width);

      ctx.fillStyle = "rgba(139, 92, 246, 0.3)";
      ctx.fillRect(rangeStart, roadY - 100, rangeEnd - rangeStart, 200);

      // Animated scan line
      const time = Date.now() / 1000;
      const scanX = rangeStart + ((time * 50) % (rangeEnd - rangeStart));
      ctx.strokeStyle = "rgba(139, 92, 246, 0.8)";
      ctx.lineWidth = 2;
      ctx.beginPath();
      ctx.moveTo(scanX, roadY - 100);
      ctx.lineTo(scanX, roadY + 100);
      ctx.stroke();
    }

    // Draw houses
    houses.forEach((house, index) => {
      const x = positionToX(house, width);
      const isHighlighted = highlightedHouseIndex === index;
      const isCovered =
        stops.some((stop) => Math.abs(house - stop) <= d) ||
        userStops.some((stop) => Math.abs(house - stop) <= d);

      // House shadow
      ctx.fillStyle = "rgba(0, 0, 0, 0.3)";
      ctx.fillRect(x - 12, roadY - 38, 28, 40);

      // House body
      const houseGradient = ctx.createLinearGradient(x - 15, roadY - 60, x + 15, roadY - 20);
      if (isHighlighted) {
        houseGradient.addColorStop(0, "#a78bfa");
        houseGradient.addColorStop(1, "#7c3aed");
      } else if (isCovered) {
        houseGradient.addColorStop(0, "#34d399");
        houseGradient.addColorStop(1, "#059669");
      } else {
        houseGradient.addColorStop(0, "#f87171");
        houseGradient.addColorStop(1, "#dc2626");
      }
      ctx.fillStyle = houseGradient;
      ctx.fillRect(x - 15, roadY - 40, 30, 35);

      // Roof
      ctx.beginPath();
      ctx.moveTo(x - 20, roadY - 40);
      ctx.lineTo(x, roadY - 65);
      ctx.lineTo(x + 20, roadY - 40);
      ctx.closePath();
      ctx.fillStyle = isHighlighted ? "#c4b5fd" : isCovered ? "#6ee7b7" : "#fca5a5";
      ctx.fill();

      // Door
      ctx.fillStyle = "#1e293b";
      ctx.fillRect(x - 5, roadY - 20, 10, 15);

      // Window
      ctx.fillStyle = isHighlighted ? "#fef3c7" : "#fef08a";
      ctx.fillRect(x - 12, roadY - 35, 8, 8);
      ctx.fillRect(x + 4, roadY - 35, 8, 8);

      // Highlight glow
      if (isHighlighted) {
        ctx.shadowColor = "#8b5cf6";
        ctx.shadowBlur = 20;
        ctx.strokeStyle = "#8b5cf6";
        ctx.lineWidth = 3;
        ctx.strokeRect(x - 18, roadY - 68, 36, 65);
        ctx.shadowBlur = 0;
      }

      // Position label
      ctx.fillStyle = "#94a3b8";
      ctx.font = "11px Inter, sans-serif";
      ctx.textAlign = "center";
      ctx.fillText(`${house}`, x, roadY + 25);
    });

    // Draw bus stops
    stops.forEach((stop, index) => {
      const x = positionToX(stop, width);
      const isHighlighted = highlightedStopIndex === index;

      // Stop pole
      ctx.fillStyle = "#64748b";
      ctx.fillRect(x - 3, roadY - 55, 6, 60);

      // Stop sign
      const signGradient = ctx.createLinearGradient(x - 18, roadY - 75, x + 18, roadY - 45);
      signGradient.addColorStop(0, isHighlighted ? "#06b6d4" : "#0891b2");
      signGradient.addColorStop(1, isHighlighted ? "#0e7490" : "#155e75");
      ctx.fillStyle = signGradient;
      ctx.beginPath();
      ctx.roundRect(x - 18, roadY - 75, 36, 25, 4);
      ctx.fill();

      // Bus icon
      ctx.fillStyle = "#ffffff";
      ctx.font = "bold 12px Inter, sans-serif";
      ctx.textAlign = "center";
      ctx.textBaseline = "middle";
      ctx.fillText("BUS", x, roadY - 62);

      // Highlight glow
      if (isHighlighted) {
        ctx.shadowColor = "#22d3ee";
        ctx.shadowBlur = 25;
        ctx.strokeStyle = "#22d3ee";
        ctx.lineWidth = 3;
        ctx.beginPath();
        ctx.roundRect(x - 20, roadY - 77, 40, 29, 6);
        ctx.stroke();
        ctx.shadowBlur = 0;
      }

      // Position label
      ctx.fillStyle = "#22d3ee";
      ctx.font = "bold 12px Inter, sans-serif";
      ctx.fillText(`${stop}`, x, roadY + 40);
    });

    // Draw user stops
    userStops.forEach((stop) => {
      const x = positionToX(stop, width);

      // Stop pole
      ctx.fillStyle = "#92400e";
      ctx.fillRect(x - 3, roadY - 55, 6, 60);

      // Stop sign
      const signGradient = ctx.createLinearGradient(x - 18, roadY - 75, x + 18, roadY - 45);
      signGradient.addColorStop(0, "#fb923c");
      signGradient.addColorStop(1, "#ea580c");
      ctx.fillStyle = signGradient;
      ctx.beginPath();
      ctx.roundRect(x - 18, roadY - 75, 36, 25, 4);
      ctx.fill();

      // User icon
      ctx.fillStyle = "#ffffff";
      ctx.font = "bold 10px Inter, sans-serif";
      ctx.textAlign = "center";
      ctx.textBaseline = "middle";
      ctx.fillText("USER", x, roadY - 62);
    });

    // Draw scale markers
    ctx.fillStyle = "#475569";
    ctx.font = "10px Inter, sans-serif";
    ctx.textAlign = "center";
    for (let i = 0; i <= maxPosition; i += Math.ceil(maxPosition / 10)) {
      const x = positionToX(i, width);
      ctx.fillRect(x - 1, roadY + 12, 2, 8);
      ctx.fillText(`${i}`, x, roadY + 60);
    }
  }, [
    houses,
    stops,
    d,
    maxPosition,
    highlightedHouseIndex,
    highlightedStopIndex,
    coveredRange,
    userStops,
    showCoverageZones,
    positionToX,
  ]);

  useEffect(() => {
    let frame: number;

    const loop = () => {
      draw();
      frame = requestAnimationFrame(loop);
    };

    loop();
    return () => cancelAnimationFrame(frame);
  }, [draw]);


  useEffect(() => {
    const handleResize = () => draw();
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, [draw]);

  const handleCanvasClick = (e: React.MouseEvent<HTMLCanvasElement>) => {
    if (!isInteractive) return;

    const canvas = canvasRef.current;
    if (!canvas) return;

    const rect = canvas.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;
    const position = Math.round(xToPosition(x, rect.width));

    if (position < 0 || position > maxPosition) return;

    const roadY = rect.height * 0.6;

    // Check if clicking on existing house
    const clickedHouseIndex = houses.findIndex((house) => {
      const houseX = positionToX(house, rect.width);
      return Math.abs(x - houseX) < 20 && Math.abs(y - roadY + 30) < 40;
    });

    if (clickedHouseIndex !== -1) {
      onRemoveHouse(clickedHouseIndex);
    } else if (y > roadY - 10 && y < roadY + 50) {
      onAddUserStop(position);
    } else {
      onAddHouse(position);
    }
  };

  const getStepExplanation = (step: AlgorithmStep | null | undefined, lang: "fr" | "en") => {
    if (!step) return null;

    const explanations: Record<string, { fr: string; en: string }> = {
      select_house: {
        fr: `Selection de la maison a la position ${step.housePosition} (non couverte la plus a gauche)`,
        en: `Selecting house at position ${step.housePosition} (leftmost uncovered)`,
      },
      expand_coverage: {
        fr: `Extension de la couverture: recherche de la maison la plus a droite dans la zone [${step.coveredRange?.[0]}, ${step.coveredRange?.[1]}]`,
        en: `Expanding coverage: finding rightmost house in range [${step.coveredRange?.[0]}, ${step.coveredRange?.[1]}]`,
      },
      place_stop: {
        fr: `Placement de l'arret de bus a la position ${step.stopPosition} pour couvrir le maximum de maisons`,
        en: `Placing bus stop at position ${step.stopPosition} to cover maximum houses`,
      },
      cover_remaining: {
        fr: `Couverture des maisons restantes dans la zone [${step.coveredRange?.[0]}, ${step.coveredRange?.[1]}]`,
        en: `Covering remaining houses in range [${step.coveredRange?.[0]}, ${step.coveredRange?.[1]}]`,
      },
      complete: {
        fr: "Algorithme termine! Toutes les maisons sont couvertes avec le minimum d'arrets.",
        en: "Algorithm complete! All houses are covered with minimum stops.",
      },
    };

    return explanations[step.type]?.[lang] || "";
  };

  return (
    <motion.div
      ref={containerRef}
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="relative w-full h-full rounded-xl overflow-hidden border border-border/50 bg-card/30 backdrop-blur-sm flex flex-col"
    >
      <canvas
        ref={canvasRef}
        className="flex-1 w-full cursor-pointer"
        onClick={handleCanvasClick}
      />

      {/* Step Explanation Overlay */}
      <AnimatePresence mode="wait">
        {currentStepData && (
          <motion.div
            key={currentStepData.type + currentStep}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            className="absolute top-4 left-4 right-4"
          >
            <div className="bg-card/90 backdrop-blur-md border border-border/50 rounded-lg px-4 py-3 shadow-lg">
              <div className="flex items-center gap-3">
                <div
                  className={`w-2 h-2 rounded-full ${
                    currentStepData.type === "complete"
                      ? "bg-emerald-400"
                      : currentStepData.type === "place_stop"
                      ? "bg-cyan-400"
                      : "bg-violet-400"
                  } animate-pulse`}
                />
                <p className="text-sm text-foreground">
                  {getStepExplanation(currentStepData, language)}
                </p>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {isInteractive && !currentStepData && (
        <div className="absolute bottom-3 left-3 text-xs text-muted-foreground bg-background/80 backdrop-blur-sm px-3 py-1.5 rounded-full">
          {language === "fr"
            ? "Cliquez pour ajouter des maisons"
            : "Click to add houses"}
        </div>
      )}
    </motion.div>
  );
}
