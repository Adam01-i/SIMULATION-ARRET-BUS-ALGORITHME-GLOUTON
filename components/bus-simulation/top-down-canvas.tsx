"use client";

import React from "react"

import { useRef, useEffect, useCallback } from "react";
import { motion } from "framer-motion";
import type { AlgorithmStep } from "@/lib/algorithm";

interface TopDownCanvasProps {
  houses: number[];
  stops: number[];
  d: number;
  maxPosition: number;
  currentStep: number;
  currentStepData?: AlgorithmStep | null;
  highlightedHouseIndex: number | null;
  busPosition: number | null;
  userStops: number[];
  isInteractive: boolean;
  onAddUserStop?: (position: number) => void;
  language: "fr" | "en";
}

export function TopDownCanvas({
  houses,
  stops,
  d,
  maxPosition,
  currentStep,
  currentStepData,
  highlightedHouseIndex,
  busPosition,
  userStops,
  isInteractive,
  onAddUserStop,
  language,
}: TopDownCanvasProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);

  // Colors
  const colors = {
    background: "#0f1419",
    road: "#1a1f26",
    roadLine: "#3b4654",
    roadLineCenter: "#f7c948",
    sidewalk: "#252d38",
    grass: "#1a2e1a",
    house: {
      walls: ["#e74c3c", "#3498db", "#9b59b6", "#1abc9c", "#f39c12", "#e67e22"],
      roof: "#2c3e50",
      window: "#f1c40f",
      door: "#8b4513",
    },
    busStop: {
      pole: "#7f8c8d",
      sign: "#3498db",
      zone: "rgba(52, 152, 219, 0.15)",
      zoneBorder: "rgba(52, 152, 219, 0.4)",
    },
    bus: {
      body: "#f1c40f",
      stripe: "#2c3e50",
      window: "#3498db",
      wheel: "#2c3e50",
    },
    userStop: {
      zone: "rgba(231, 76, 60, 0.15)",
      zoneBorder: "rgba(231, 76, 60, 0.4)",
      marker: "#e74c3c",
    },
    highlight: "#00ff88",
    covered: "rgba(46, 204, 113, 0.3)",
  };

  const draw = useCallback(() => {
    const canvas = canvasRef.current;
    const container = containerRef.current;
    if (!canvas || !container) return;

    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    // Set canvas size
    const rect = container.getBoundingClientRect();
    const dpr = window.devicePixelRatio || 1;
    canvas.width = rect.width * dpr;
    canvas.height = rect.height * dpr;
    canvas.style.width = `${rect.width}px`;
    canvas.style.height = `${rect.height}px`;
    ctx.scale(dpr, dpr);

    const width = rect.width;
    const height = rect.height;

    // Calculate scale - route verticale
    const padding = 80;
    const roadWidth = 80;
    const scaleY = (height - padding * 2) / (maxPosition + 20);
    const centerX = width / 2;

    // Clear background
    ctx.fillStyle = colors.background;
    ctx.fillRect(0, 0, width, height);

    // Draw grass areas
    ctx.fillStyle = colors.grass;
    ctx.fillRect(0, 0, centerX - roadWidth - 40, height);
    ctx.fillRect(centerX + roadWidth + 40, 0, width - (centerX + roadWidth + 40), height);

    // Draw sidewalks
    ctx.fillStyle = colors.sidewalk;
    ctx.fillRect(centerX - roadWidth - 40, 0, 40, height);
    ctx.fillRect(centerX + roadWidth, 0, 40, height);

    // Draw road
    ctx.fillStyle = colors.road;
    ctx.fillRect(centerX - roadWidth, 0, roadWidth * 2, height);

    // Draw road lines
    ctx.strokeStyle = colors.roadLine;
    ctx.lineWidth = 2;
    ctx.setLineDash([20, 15]);
    
    // Left lane line
    ctx.beginPath();
    ctx.moveTo(centerX - roadWidth / 2, 0);
    ctx.lineTo(centerX - roadWidth / 2, height);
    ctx.stroke();
    
    // Right lane line
    ctx.beginPath();
    ctx.moveTo(centerX + roadWidth / 2, 0);
    ctx.lineTo(centerX + roadWidth / 2, height);
    ctx.stroke();

    // Center line (yellow)
    ctx.strokeStyle = colors.roadLineCenter;
    ctx.lineWidth = 3;
    ctx.setLineDash([30, 20]);
    ctx.beginPath();
    ctx.moveTo(centerX, 0);
    ctx.lineTo(centerX, height);
    ctx.stroke();
    ctx.setLineDash([]);

    // Function to get Y position from house position
    const getY = (pos: number) => padding + pos * scaleY;

    // Draw coverage zones for placed stops
    stops.forEach((stopPos) => {
      const y = getY(stopPos);
      const coverageHeight = d * 2 * scaleY;
      
      ctx.fillStyle = colors.busStop.zone;
      ctx.fillRect(centerX - roadWidth - 60, y - d * scaleY, roadWidth * 2 + 120, coverageHeight);
      
      ctx.strokeStyle = colors.busStop.zoneBorder;
      ctx.lineWidth = 2;
      ctx.strokeRect(centerX - roadWidth - 60, y - d * scaleY, roadWidth * 2 + 120, coverageHeight);
    });

    // Draw coverage zones for user stops
    userStops.forEach((stopPos) => {
      const y = getY(stopPos);
      const coverageHeight = d * 2 * scaleY;
      
      ctx.fillStyle = colors.userStop.zone;
      ctx.fillRect(centerX - roadWidth - 60, y - d * scaleY, roadWidth * 2 + 120, coverageHeight);
      
      ctx.strokeStyle = colors.userStop.zoneBorder;
      ctx.lineWidth = 2;
      ctx.strokeRect(centerX - roadWidth - 60, y - d * scaleY, roadWidth * 2 + 120, coverageHeight);
    });

    // Draw houses
    houses.forEach((housePos, index) => {
      const y = getY(housePos);
      const isLeft = index % 2 === 0;
      const houseX = isLeft ? centerX - roadWidth - 100 : centerX + roadWidth + 40;
      const houseWidth = 50;
      const houseHeight = 40;
      
      // Check if covered
      const isCovered = stops.some(s => Math.abs(housePos - s) <= d) || 
                        userStops.some(s => Math.abs(housePos - s) <= d);
      const isHighlighted = highlightedHouseIndex === index;

      // House shadow
      ctx.fillStyle = "rgba(0,0,0,0.3)";
      ctx.fillRect(houseX + 4, y - houseHeight / 2 + 4, houseWidth, houseHeight);

      // House body
      const houseColor = colors.house.walls[index % colors.house.walls.length];
      ctx.fillStyle = houseColor;
      ctx.fillRect(houseX, y - houseHeight / 2, houseWidth, houseHeight);

      // Roof (triangle from top)
      ctx.fillStyle = colors.house.roof;
      ctx.beginPath();
      ctx.moveTo(houseX - 5, y - houseHeight / 2);
      ctx.lineTo(houseX + houseWidth / 2, y - houseHeight / 2 - 15);
      ctx.lineTo(houseX + houseWidth + 5, y - houseHeight / 2);
      ctx.closePath();
      ctx.fill();

      // Windows
      ctx.fillStyle = colors.house.window;
      ctx.fillRect(houseX + 8, y - houseHeight / 2 + 8, 12, 10);
      ctx.fillRect(houseX + houseWidth - 20, y - houseHeight / 2 + 8, 12, 10);

      // Door
      ctx.fillStyle = colors.house.door;
      ctx.fillRect(houseX + houseWidth / 2 - 6, y - houseHeight / 2 + 15, 12, 25);

      // Highlight effect
      if (isHighlighted) {
        ctx.strokeStyle = colors.highlight;
        ctx.lineWidth = 3;
        ctx.strokeRect(houseX - 5, y - houseHeight / 2 - 20, houseWidth + 10, houseHeight + 25);
        
        // Glow effect
        ctx.shadowColor = colors.highlight;
        ctx.shadowBlur = 15;
        ctx.strokeRect(houseX - 5, y - houseHeight / 2 - 20, houseWidth + 10, houseHeight + 25);
        ctx.shadowBlur = 0;
      }

      // Covered indicator
      if (isCovered) {
        ctx.fillStyle = "rgba(46, 204, 113, 0.8)";
        ctx.beginPath();
        ctx.arc(houseX + houseWidth + 10, y - houseHeight / 2 - 10, 8, 0, Math.PI * 2);
        ctx.fill();
        
        // Checkmark
        ctx.strokeStyle = "#fff";
        ctx.lineWidth = 2;
        ctx.beginPath();
        ctx.moveTo(houseX + houseWidth + 6, y - houseHeight / 2 - 10);
        ctx.lineTo(houseX + houseWidth + 9, y - houseHeight / 2 - 7);
        ctx.lineTo(houseX + houseWidth + 14, y - houseHeight / 2 - 13);
        ctx.stroke();
      }

      // Position label
      ctx.fillStyle = "#fff";
      ctx.font = "bold 11px system-ui";
      ctx.textAlign = "center";
      ctx.fillText(`${housePos}`, houseX + houseWidth / 2, y + houseHeight / 2 + 15);
    });

    // Draw bus stops
    stops.forEach((stopPos, index) => {
      const y = getY(stopPos);
      const stopX = centerX + roadWidth - 15;

      // Stop pole
      ctx.fillStyle = colors.busStop.pole;
      ctx.fillRect(stopX, y - 25, 4, 50);

      // Stop sign
      ctx.fillStyle = colors.busStop.sign;
      ctx.beginPath();
      ctx.roundRect(stopX - 12, y - 35, 28, 20, 4);
      ctx.fill();

      // Bus icon on sign
      ctx.fillStyle = "#fff";
      ctx.font = "bold 12px system-ui";
      ctx.textAlign = "center";
      ctx.fillText("BUS", stopX + 2, y - 21);

      // Stop number
      ctx.fillStyle = colors.busStop.sign;
      ctx.beginPath();
      ctx.arc(stopX + 2, y + 5, 12, 0, Math.PI * 2);
      ctx.fill();
      ctx.fillStyle = "#fff";
      ctx.font = "bold 14px system-ui";
      ctx.fillText(`${index + 1}`, stopX + 2, y + 10);
    });

    // Draw user stops
    userStops.forEach((stopPos, index) => {
      const y = getY(stopPos);
      const stopX = centerX - roadWidth + 10;

      // Stop marker
      ctx.fillStyle = colors.userStop.marker;
      ctx.beginPath();
      ctx.arc(stopX, y, 15, 0, Math.PI * 2);
      ctx.fill();

      ctx.fillStyle = "#fff";
      ctx.font = "bold 12px system-ui";
      ctx.textAlign = "center";
      ctx.fillText(`${index + 1}`, stopX, y + 4);
    });

    // Draw bus if position is set
    if (busPosition !== null) {
      const busY = getY(busPosition);
      const busWidth = 30;
      const busHeight = 60;
      const busX = centerX - busWidth / 2;

      // Bus shadow
      ctx.fillStyle = "rgba(0,0,0,0.4)";
      ctx.beginPath();
      ctx.roundRect(busX + 4, busY - busHeight / 2 + 4, busWidth, busHeight, 8);
      ctx.fill();

      // Bus body
      ctx.fillStyle = colors.bus.body;
      ctx.beginPath();
      ctx.roundRect(busX, busY - busHeight / 2, busWidth, busHeight, 8);
      ctx.fill();

      // Bus stripe
      ctx.fillStyle = colors.bus.stripe;
      ctx.fillRect(busX, busY - 5, busWidth, 10);

      // Bus windows
      ctx.fillStyle = colors.bus.window;
      ctx.beginPath();
      ctx.roundRect(busX + 4, busY - busHeight / 2 + 6, busWidth - 8, 15, 3);
      ctx.fill();
      ctx.beginPath();
      ctx.roundRect(busX + 4, busY + busHeight / 2 - 21, busWidth - 8, 15, 3);
      ctx.fill();

      // Bus headlights
      ctx.fillStyle = "#fff";
      ctx.beginPath();
      ctx.arc(busX + 8, busY - busHeight / 2 + 3, 3, 0, Math.PI * 2);
      ctx.arc(busX + busWidth - 8, busY - busHeight / 2 + 3, 3, 0, Math.PI * 2);
      ctx.fill();
    }

    // Draw scale/legend
    ctx.fillStyle = "rgba(255,255,255,0.1)";
    ctx.beginPath();
    ctx.roundRect(10, height - 60, 150, 50, 8);
    ctx.fill();

    ctx.fillStyle = "#fff";
    ctx.font = "12px system-ui";
    ctx.textAlign = "left";
    ctx.fillText(`d = ${d}`, 20, height - 40);
    ctx.fillText(language === "fr" ? `Maisons: ${houses.length}` : `Houses: ${houses.length}`, 20, height - 22);

  }, [houses, stops, d, maxPosition, highlightedHouseIndex, busPosition, userStops, colors, language]);

  useEffect(() => {
    draw();
    const handleResize = () => draw();
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, [draw]);

  const handleClick = useCallback(
    (e: React.MouseEvent<HTMLCanvasElement>) => {
      if (!isInteractive || !onAddUserStop) return;

      const canvas = canvasRef.current;
      const container = containerRef.current;
      if (!canvas || !container) return;

      const rect = container.getBoundingClientRect();
      const y = e.clientY - rect.top;
      const height = rect.height;
      const padding = 80;
      const scaleY = (height - padding * 2) / (maxPosition + 20);

      const position = Math.round((y - padding) / scaleY);
      if (position >= 0 && position <= maxPosition) {
        onAddUserStop(position);
      }
    },
    [isInteractive, onAddUserStop, maxPosition]
  );

  return (
    <motion.div
      ref={containerRef}
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className="relative w-full h-full rounded-xl overflow-hidden"
    >
      <canvas
        ref={canvasRef}
        onClick={handleClick}
        className={`w-full h-full ${isInteractive ? "cursor-crosshair" : "cursor-default"}`}
      />

      {/* Step explanation overlay */}
      {currentStepData && (
        <motion.div
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          className="absolute top-4 left-1/2 -translate-x-1/2 max-w-md"
        >
          <div className="bg-card/90 backdrop-blur-md border border-border/50 rounded-xl px-5 py-3 shadow-xl">
            <div className="flex items-center gap-3">
              <div
                className={`w-3 h-3 rounded-full ${
                  currentStepData.type === "complete"
                    ? "bg-emerald-400"
                    : currentStepData.type === "place_stop"
                    ? "bg-cyan-400"
                    : "bg-amber-400"
                } animate-pulse`}
              />
              <p className="text-sm text-foreground">
                {language === "fr" ? currentStepData.message : currentStepData.messageEn}
              </p>
            </div>
          </div>
        </motion.div>
      )}
    </motion.div>
  );
}
