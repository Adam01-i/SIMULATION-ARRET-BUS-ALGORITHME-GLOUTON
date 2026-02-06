"use client";

import { motion } from "framer-motion";
import { BookOpen, Lightbulb, Code2, ChevronRight, ChevronLeft } from "lucide-react";
import { useState } from "react";

interface TheorySidebarProps {
  language: "fr" | "en";
}

export function TheorySidebar({ language }: TheorySidebarProps) {
  const [isCollapsed, setIsCollapsed] = useState(false);
  const [activeTab, setActiveTab] = useState<"problem" | "algorithm" | "proof">("problem");

  const content = {
    fr: {
      title: "Theorie",
      tabs: {
        problem: "Probleme",
        algorithm: "Algorithme",
        proof: "Preuve",
      },
      problem: {
        title: "Le probleme des arrets de bus",
        content: [
          "On a n maisons situees aux positions k(1) < k(2) < ... < k(n) le long d'une route.",
          "Un arret de bus a la position x couvre toutes les maisons dans l'intervalle [x-d, x+d].",
          "Objectif: Placer le minimum d'arrets pour couvrir toutes les maisons.",
        ],
      },
      algorithm: {
        title: "Algorithme glouton",
        steps: [
          "1. Trier les maisons par position",
          "2. Prendre la maison non couverte la plus a gauche",
          "3. Placer un arret a position + d",
          "4. Marquer toutes les maisons couvertes",
          "5. Repeter jusqu'a ce que tout soit couvert",
        ],
        complexity: "Complexite: O(n log n) pour le tri, O(n) pour le placement",
      },
      proof: {
        title: "Pourquoi c'est optimal?",
        content: [
          "Lemme d'echange: Si une solution optimale n'utilise pas notre arret, on peut l'echanger sans augmenter le nombre total.",
          "La strategie gloutonne maximise la couverture a chaque etape, garantissant le minimum d'arrets.",
        ],
      },
    },
    en: {
      title: "Theory",
      tabs: {
        problem: "Problem",
        algorithm: "Algorithm",
        proof: "Proof",
      },
      problem: {
        title: "The Bus Stops Problem",
        content: [
          "We have n houses at positions k(1) < k(2) < ... < k(n) along a road.",
          "A bus stop at position x covers all houses in the interval [x-d, x+d].",
          "Goal: Place the minimum number of stops to cover all houses.",
        ],
      },
      algorithm: {
        title: "Greedy Algorithm",
        steps: [
          "1. Sort houses by position",
          "2. Take the leftmost uncovered house",
          "3. Place a stop at position + d",
          "4. Mark all covered houses",
          "5. Repeat until everything is covered",
        ],
        complexity: "Complexity: O(n log n) for sorting, O(n) for placement",
      },
      proof: {
        title: "Why is it optimal?",
        content: [
          "Exchange Lemma: If an optimal solution doesn't use our stop, we can exchange it without increasing the total count.",
          "The greedy strategy maximizes coverage at each step, guaranteeing minimum stops.",
        ],
      },
    },
  };

  const text = content[language];

  return (
    <motion.div
      initial={{ x: 300, opacity: 0 }}
      animate={{ x: 0, opacity: 1 }}
      transition={{ type: "spring", damping: 25 }}
      className={`absolute top-4 right-4 z-20 transition-all duration-300 ${
        isCollapsed ? "w-12" : "w-80"
      }`}
    >
      <div className="bg-card/90 backdrop-blur-xl border border-border/50 rounded-2xl shadow-2xl overflow-hidden max-h-[calc(100vh-120px)]">
        {/* Header */}
        <div className="flex items-center justify-between p-4 border-b border-border/30">
          <button
            onClick={() => setIsCollapsed(!isCollapsed)}
            className="p-1.5 hover:bg-muted rounded-lg transition-colors"
          >
            {isCollapsed ? (
              <ChevronLeft className="w-4 h-4 text-muted-foreground" />
            ) : (
              <ChevronRight className="w-4 h-4 text-muted-foreground" />
            )}
          </button>
          {!isCollapsed && (
            <div className="flex items-center gap-2">
              <h2 className="font-semibold text-foreground">{text.title}</h2>
              <BookOpen className="w-5 h-5 text-violet-400" />
            </div>
          )}
        </div>

        {!isCollapsed && (
          <div className="overflow-y-auto max-h-[calc(100vh-200px)]">
            {/* Tabs */}
            <div className="flex border-b border-border/30">
              {(["problem", "algorithm", "proof"] as const).map((tab) => (
                <button
                  key={tab}
                  onClick={() => setActiveTab(tab)}
                  className={`flex-1 py-3 text-xs font-medium transition-colors ${
                    activeTab === tab
                      ? "text-primary border-b-2 border-primary bg-primary/5"
                      : "text-muted-foreground hover:text-foreground hover:bg-muted/30"
                  }`}
                >
                  {text.tabs[tab]}
                </button>
              ))}
            </div>

            {/* Content */}
            <div className="p-4">
              {activeTab === "problem" && (
                <motion.div
                  key="problem"
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="space-y-4"
                >
                  <div className="flex items-center gap-2">
                    <Lightbulb className="w-4 h-4 text-amber-400" />
                    <h3 className="font-semibold text-foreground text-sm">
                      {text.problem.title}
                    </h3>
                  </div>
                  <div className="space-y-3">
                    {text.problem.content.map((item, i) => (
                      <p key={i} className="text-xs text-muted-foreground leading-relaxed">
                        {item}
                      </p>
                    ))}
                  </div>
                </motion.div>
              )}

              {activeTab === "algorithm" && (
                <motion.div
                  key="algorithm"
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="space-y-4"
                >
                  <div className="flex items-center gap-2">
                    <Code2 className="w-4 h-4 text-cyan-400" />
                    <h3 className="font-semibold text-foreground text-sm">
                      {text.algorithm.title}
                    </h3>
                  </div>
                  <div className="space-y-2 bg-muted/30 rounded-xl p-3">
                    {text.algorithm.steps.map((step, i) => (
                      <p key={i} className="text-xs text-foreground font-mono">
                        {step}
                      </p>
                    ))}
                  </div>
                  <p className="text-xs text-muted-foreground italic">
                    {text.algorithm.complexity}
                  </p>
                </motion.div>
              )}

              {activeTab === "proof" && (
                <motion.div
                  key="proof"
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="space-y-4"
                >
                  <h3 className="font-semibold text-foreground text-sm">
                    {text.proof.title}
                  </h3>
                  <div className="space-y-3">
                    {text.proof.content.map((item, i) => (
                      <p key={i} className="text-xs text-muted-foreground leading-relaxed">
                        {item}
                      </p>
                    ))}
                  </div>
                </motion.div>
              )}
            </div>
          </div>
        )}
      </div>
    </motion.div>
  );
}
