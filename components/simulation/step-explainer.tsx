"use client";

import React from "react"

import { motion, AnimatePresence } from "framer-motion";
import { AlgorithmStep } from "@/lib/algorithm";
import {
  Lightbulb,
  MapPin,
  Scan,
  Check,
  ArrowRight,
  Home,
} from "lucide-react";

interface StepExplainerProps {
  currentStep: AlgorithmStep | null;
  stepIndex: number;
  totalSteps: number;
  language: "fr" | "en";
}

const stepIcons: Record<AlgorithmStep["type"], React.ReactNode> = {
  select_house: <Home className="w-5 h-5" />,
  expand_coverage: <Scan className="w-5 h-5" />,
  place_stop: <MapPin className="w-5 h-5" />,
  cover_remaining: <Check className="w-5 h-5" />,
  complete: <Lightbulb className="w-5 h-5" />,
};

const stepColors: Record<AlgorithmStep["type"], string> = {
  select_house: "from-violet-500/20 to-purple-500/20 border-violet-500/50",
  expand_coverage: "from-blue-500/20 to-cyan-500/20 border-blue-500/50",
  place_stop: "from-cyan-500/20 to-teal-500/20 border-cyan-500/50",
  cover_remaining: "from-emerald-500/20 to-green-500/20 border-emerald-500/50",
  complete: "from-amber-500/20 to-yellow-500/20 border-amber-500/50",
};

const stepIconColors: Record<AlgorithmStep["type"], string> = {
  select_house: "text-violet-400",
  expand_coverage: "text-blue-400",
  place_stop: "text-cyan-400",
  cover_remaining: "text-emerald-400",
  complete: "text-amber-400",
};

export function StepExplainer({
  currentStep,
  stepIndex,
  totalSteps,
  language,
}: StepExplainerProps) {
  if (!currentStep) {
    return (
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        className="bg-card/50 backdrop-blur-md border border-border/50 rounded-2xl p-6"
      >
        <div className="flex items-center gap-3 mb-4">
          <div className="w-10 h-10 rounded-xl bg-muted/50 flex items-center justify-center">
            <ArrowRight className="w-5 h-5 text-muted-foreground" />
          </div>
          <div>
            <h3 className="font-semibold text-foreground">
              {language === "fr" ? "Prêt à démarrer" : "Ready to Start"}
            </h3>
            <p className="text-xs text-muted-foreground">
              {language === "fr"
                ? "Lancez la simulation pour voir l'algorithme en action"
                : "Start the simulation to see the algorithm in action"}
            </p>
          </div>
        </div>
        <div className="bg-muted/30 rounded-xl p-4">
          <p className="text-sm text-muted-foreground leading-relaxed">
            {language === "fr"
              ? "L'algorithme glouton va placer les arrêts de bus de manière optimale, en s'assurant que chaque maison soit couverte avec un minimum d'arrêts."
              : "The greedy algorithm will place bus stops optimally, ensuring each house is covered with minimum stops."}
          </p>
        </div>
      </motion.div>
    );
  }

  const message = language === "fr" ? currentStep.message : currentStep.messageEn;

  return (
    <AnimatePresence mode="wait">
      <motion.div
        key={stepIndex}
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        exit={{ opacity: 0, y: -20 }}
        transition={{ duration: 0.3 }}
        className={`bg-gradient-to-br ${stepColors[currentStep.type]} backdrop-blur-md border rounded-2xl p-6`}
      >
        <div className="flex items-center gap-3 mb-4">
          <div
            className={`w-10 h-10 rounded-xl bg-background/50 flex items-center justify-center ${stepIconColors[currentStep.type]}`}
          >
            {stepIcons[currentStep.type]}
          </div>
          <div>
            <h3 className="font-semibold text-foreground">
              {language === "fr" ? "Étape" : "Step"} {stepIndex + 1}/{totalSteps}
            </h3>
            <p className="text-xs text-muted-foreground capitalize">
              {currentStep.type.replace(/_/g, " ")}
            </p>
          </div>
        </div>

        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.1 }}
          className="bg-background/30 rounded-xl p-4"
        >
          <p className="text-sm text-foreground leading-relaxed">{message}</p>
        </motion.div>

        {currentStep.stopPosition !== undefined && (
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.2 }}
            className="mt-4 flex items-center gap-2"
          >
            <MapPin className="w-4 h-4 text-cyan-400" />
            <span className="text-sm font-medium text-foreground">
              {language === "fr" ? "Position de l'arrêt:" : "Stop position:"}{" "}
              <span className="text-cyan-400 font-bold">{currentStep.stopPosition}</span>
            </span>
          </motion.div>
        )}

        {currentStep.coveredRange && (
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.3 }}
            className="mt-2 flex items-center gap-2"
          >
            <Scan className="w-4 h-4 text-violet-400" />
            <span className="text-sm font-medium text-foreground">
              {language === "fr" ? "Zone couverte:" : "Covered range:"}{" "}
              <span className="text-violet-400 font-bold">
                [{currentStep.coveredRange[0]}, {currentStep.coveredRange[1]}]
              </span>
            </span>
          </motion.div>
        )}
      </motion.div>
    </AnimatePresence>
  );
}
