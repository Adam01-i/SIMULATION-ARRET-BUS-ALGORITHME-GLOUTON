"use client";

import { useState, useCallback, useEffect, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Play, Globe } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  busStopsGreedy,
  generateRandomHouses,
  type AlgorithmResult,
  type AlgorithmStep,
} from "@/lib/algorithm";
import { TopDownCanvas } from "@/components/bus-simulation/top-down-canvas";
import { ControlSidebar } from "@/components/bus-simulation/control-sidebar";
import { StatsSidebar } from "@/components/bus-simulation/stats-sidebar";
import { TheorySidebar } from "@/components/bus-simulation/theory-sidebar";

export default function BusStopsSimulation() {
  // Language
  const [language, setLanguage] = useState<"fr" | "en">("fr");

  // Parameters
  const [d, setD] = useState(10);
  const [houseCount, setHouseCount] = useState(8);
  const [speed, setSpeed] = useState(1);
  const maxPosition = 80;

  // Simulation state
  const [houses, setHouses] = useState<number[]>([]);
  const [greedyResult, setGreedyResult] = useState<AlgorithmResult | null>(null);
  const [displayedStops, setDisplayedStops] = useState<number[]>([]);
  const [currentStep, setCurrentStep] = useState(0);
  const [currentStepData, setCurrentStepData] = useState<AlgorithmStep | null>(null);
  const [highlightedHouseIndex, setHighlightedHouseIndex] = useState<number | null>(null);
  const [busPosition, setBusPosition] = useState<number | null>(null);
  const [isRunning, setIsRunning] = useState(false);
  const [isComplete, setIsComplete] = useState(false);
  const [showStartOverlay, setShowStartOverlay] = useState(true);
  const [executionTime, setExecutionTime] = useState(0);

  // Challenge mode
  const [userStops, setUserStops] = useState<number[]>([]);
  const [challengeMode, setChallengeMode] = useState(false);

  // Refs
  const animationRef = useRef<NodeJS.Timeout | null>(null);
  const startTimeRef = useRef<number>(0);

  // Initialize houses
  useEffect(() => {
    const initialHouses = generateRandomHouses(houseCount, maxPosition);
    setHouses(initialHouses);
    const greedy = busStopsGreedy(initialHouses, d);
    setGreedyResult(greedy);
  }, []);

  // Recalculate when parameters change (only when not running)
  useEffect(() => {
    if (houses.length > 0 && !isRunning) {
      const greedy = busStopsGreedy(houses, d);
      setGreedyResult(greedy);
    }
  }, [houses, d, isRunning]);

  // Randomize houses
  const handleRandomize = useCallback(() => {
    const newHouses = generateRandomHouses(houseCount, maxPosition);
    setHouses(newHouses);
    setDisplayedStops([]);
    setCurrentStep(0);
    setCurrentStepData(null);
    setHighlightedHouseIndex(null);
    setBusPosition(null);
    setIsComplete(false);
    setUserStops([]);
    setShowStartOverlay(true);
    setExecutionTime(0);
  }, [houseCount, maxPosition]);

  // Update houses when count changes
  useEffect(() => {
    if (!isRunning) {
      handleRandomize();
    }
  }, [houseCount]);

  // Start simulation
  const handleStart = useCallback(() => {
    if (!greedyResult) return;

    setShowStartOverlay(false);
    setIsRunning(true);
    setIsComplete(false);
    setDisplayedStops([]);
    setCurrentStep(0);
    setHighlightedHouseIndex(null);
    startTimeRef.current = performance.now();

    let stepIndex = 0;
    const steps = greedyResult.steps;
    const stopsToAdd: number[] = [];

    const runStep = () => {
      if (stepIndex >= steps.length) {
        setIsRunning(false);
        setIsComplete(true);
        setCurrentStepData(steps[steps.length - 1]);
        setBusPosition(null);
        setExecutionTime(performance.now() - startTimeRef.current);
        return;
      }

      const step = steps[stepIndex];
      setCurrentStepData(step);
      setCurrentStep(stepIndex + 1);

      // Update visualization based on step type
      if (step.type === "select_house") {
        const housePos = houses[step.houseIndex];
        setHighlightedHouseIndex(step.houseIndex);
        setBusPosition(housePos);
      } else if (step.type === "expand_coverage") {
        setHighlightedHouseIndex(step.houseIndex);
      } else if (step.type === "place_stop" && step.stopPosition !== undefined) {
        stopsToAdd.push(step.stopPosition);
        setDisplayedStops([...stopsToAdd]);
        setBusPosition(step.stopPosition);
        setHighlightedHouseIndex(null);
      } else if (step.type === "cover_remaining") {
        setHighlightedHouseIndex(null);
      }

      stepIndex++;
      animationRef.current = setTimeout(runStep, 1500 / speed);
    };

    runStep();
  }, [greedyResult, speed, houses]);

  // Pause simulation
  const handlePause = useCallback(() => {
    if (animationRef.current) {
      clearTimeout(animationRef.current);
      animationRef.current = null;
    }
    setIsRunning(false);
  }, []);

  // Reset simulation
  const handleReset = useCallback(() => {
    if (animationRef.current) {
      clearTimeout(animationRef.current);
      animationRef.current = null;
    }
    setDisplayedStops([]);
    setCurrentStep(0);
    setCurrentStepData(null);
    setHighlightedHouseIndex(null);
    setBusPosition(null);
    setIsRunning(false);
    setIsComplete(false);
    setUserStops([]);
    setShowStartOverlay(true);
    setExecutionTime(0);
  }, []);

  // Step through simulation manually
  const handleStep = useCallback(() => {
    if (!greedyResult || isRunning) return;

    const steps = greedyResult.steps;
    if (currentStep >= steps.length) {
      setIsComplete(true);
      return;
    }

    setShowStartOverlay(false);
    const step = steps[currentStep];
    setCurrentStepData(step);

    if (step.type === "select_house") {
      const housePos = houses[step.houseIndex];
      setHighlightedHouseIndex(step.houseIndex);
      setBusPosition(housePos);
    } else if (step.type === "expand_coverage") {
      setHighlightedHouseIndex(step.houseIndex);
    } else if (step.type === "place_stop" && step.stopPosition !== undefined) {
      setDisplayedStops((prev) => [...prev, step.stopPosition!]);
      setBusPosition(step.stopPosition);
      setHighlightedHouseIndex(null);
    } else if (step.type === "cover_remaining") {
      setHighlightedHouseIndex(null);
    } else if (step.type === "complete") {
      setIsComplete(true);
      setBusPosition(null);
    }

    setCurrentStep((prev) => prev + 1);
  }, [greedyResult, currentStep, isRunning, houses]);

  // Add user stop (challenge mode)
  const handleAddUserStop = useCallback(
    (position: number) => {
      if (challengeMode) {
        setUserStops((prev) => [...prev, position]);
      }
    },
    [challengeMode]
  );

  // Cleanup on unmount
  useEffect(() => {
    return () => {
      if (animationRef.current) {
        clearTimeout(animationRef.current);
      }
    };
  }, []);

  return (
    <div className="fixed inset-0 bg-background overflow-hidden">
      {/* Main Canvas */}
      <TopDownCanvas
        houses={houses}
        stops={displayedStops}
        d={d}
        maxPosition={maxPosition}
        currentStep={currentStep}
        currentStepData={currentStepData}
        highlightedHouseIndex={highlightedHouseIndex}
        busPosition={busPosition}
        userStops={userStops}
        isInteractive={challengeMode}
        onAddUserStop={handleAddUserStop}
        language={language}
      />

      {/* Title */}
      {/* <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        className="absolute top-4 left-1/2 -translate-x-1/2 z-30"
      >
        <div className="bg-card/80 backdrop-blur-xl border border-border/50 rounded-2xl px-6 py-3 shadow-xl">
          <h1 className="text-lg font-bold text-foreground text-center">
            {language === "fr" ? "Arrets de Bus" : "Bus Stops"}
            <span className="text-primary ml-2">
              {language === "fr" ? "Algorithme Glouton" : "Greedy Algorithm"}
            </span>
          </h1>
        </div>
      </motion.div> */}

      {/* Language Toggle */}
      <motion.button
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        onClick={() => setLanguage((prev) => (prev === "fr" ? "en" : "fr"))}
        className="absolute top-4 left-4 z-30 flex items-center gap-2 px-3 py-2 bg-card/80 backdrop-blur-xl border border-border/50 rounded-xl hover:bg-card transition-colors"
      >
        <Globe className="w-4 h-4 text-muted-foreground" />
        <span className="text-sm font-medium text-foreground uppercase">{language}</span>
      </motion.button>

      {/* Control Sidebar (Left) */}
      <ControlSidebar
        d={d}
        onDChange={setD}
        houseCount={houseCount}
        onHouseCountChange={setHouseCount}
        speed={speed}
        onSpeedChange={setSpeed}
        isRunning={isRunning}
        onStart={handleStart}
        onPause={handlePause}
        onReset={handleReset}
        onStep={handleStep}
        onRandomize={handleRandomize}
        canStep={currentStep < (greedyResult?.steps.length ?? 0)}
        isComplete={isComplete}
        language={language}
      />

      {/* Stats Sidebar (Bottom right) */}
      <StatsSidebar
        houses={houses}
        stops={displayedStops}
        d={d}
        executionTime={executionTime}
        currentStep={currentStep}
        totalSteps={greedyResult?.steps.length ?? 0}
        language={language}
      />

      {/* Theory Sidebar (Right) */}
      <TheorySidebar language={language} />

      {/* Start Overlay */}
      <AnimatePresence>
        {showStartOverlay && !isRunning && !isComplete && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="absolute inset-0 flex items-center justify-center z-20 pointer-events-none"
          >
            <motion.div
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              className="text-center pointer-events-auto"
            >
              <motion.div
                animate={{ scale: [1, 1.05, 1] }}
                transition={{ duration: 2, repeat: Number.POSITIVE_INFINITY }}
                className="w-20 h-20 mx-auto mb-4 rounded-full bg-primary/10 border border-primary/30 flex items-center justify-center"
              >
                <Play className="w-8 h-8 text-primary ml-1" />
              </motion.div>
              <p className="text-muted-foreground text-sm mb-4">
                {language === "fr"
                  ? "Cliquez pour lancer la simulation"
                  : "Click to start the simulation"}
              </p>
              <Button
                onClick={handleStart}
                size="lg"
                className="px-8 py-6 text-lg rounded-xl shadow-xl"
              >
                <Play className="w-5 h-5 mr-2" />
                {language === "fr" ? "Demarrer" : "Start"}
              </Button>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Completion Overlay */}
      <AnimatePresence>
        {isComplete && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 20 }}
            className="absolute bottom-24 left-1/2 -translate-x-1/2 z-30"
          >
            <div className="flex items-center gap-4 px-6 py-4 bg-emerald-500/20 backdrop-blur-xl border border-emerald-500/30 rounded-2xl shadow-xl">
              <div className="w-12 h-12 rounded-full bg-emerald-500/20 flex items-center justify-center text-2xl">
                🎉
              </div>
              <div>
                <p className="text-emerald-400 font-semibold">
                  {language === "fr" ? "Simulation terminee!" : "Simulation complete!"}
                </p>
                <p className="text-sm text-muted-foreground">
                  {language === "fr"
                    ? `${displayedStops.length} arret(s) place(s)`
                    : `${displayedStops.length} stop(s) placed`}
                </p>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
