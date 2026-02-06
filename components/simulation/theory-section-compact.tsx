"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Button } from "@/components/ui/button";
import {
  BookOpen,
  ChevronDown,
  ChevronUp,
  Code2,
  Lightbulb,
  Building2,
  Wifi,
  Truck,
} from "lucide-react";

interface TheorySectionCompactProps {
  language: "fr" | "en";
}

export function TheorySectionCompact({ language }: TheorySectionCompactProps) {
  const [expandedSection, setExpandedSection] = useState<string | null>("greedy");

  const sections = [
    {
      id: "problem",
      icon: <BookOpen className="w-4 h-4" />,
      title: language === "fr" ? "Le Problème" : "The Problem",
      content:
        language === "fr"
          ? "On souhaite placer le minimum d'arrêts de bus de sorte que chaque maison soit à une distance d'au plus d kilomètres d'un arrêt."
          : "We want to place the minimum number of bus stops such that each house is at most d kilometers from a stop.",
    },
    {
      id: "greedy",
      icon: <Lightbulb className="w-4 h-4" />,
      title: language === "fr" ? "L'Approche Gloutonne" : "Greedy Approach",
      content:
        language === "fr"
          ? "1) Trier les maisons par position\n2) Prendre la maison la plus à gauche non couverte\n3) Placer un arrêt le plus à droite possible (à distance d)\n4) Répéter jusqu'à couverture totale"
          : "1) Sort houses by position\n2) Take the leftmost uncovered house\n3) Place a stop as far right as possible (at distance d)\n4) Repeat until all covered",
    },
    {
      id: "proof",
      icon: <Code2 className="w-4 h-4" />,
      title: language === "fr" ? "Optimalité" : "Optimality",
      content:
        language === "fr"
          ? "L'algorithme est optimal car en plaçant l'arrêt le plus à droite possible, on maximise la couverture vers la droite. Chaque choix local optimal contribue à une solution globale optimale."
          : "The algorithm is optimal because by placing the stop as far right as possible, we maximize coverage to the right. Each locally optimal choice contributes to a globally optimal solution.",
    },
    {
      id: "applications",
      icon: <Building2 className="w-4 h-4" />,
      title: language === "fr" ? "Applications" : "Applications",
      content: "apps",
    },
  ];

  const applications = [
    {
      icon: <Building2 className="w-3.5 h-3.5" />,
      title: language === "fr" ? "Urbanisme" : "Urban Planning",
      desc: language === "fr" ? "Services publics, écoles" : "Public services, schools",
    },
    {
      icon: <Wifi className="w-3.5 h-3.5" />,
      title: language === "fr" ? "Télécoms" : "Telecom",
      desc: language === "fr" ? "Antennes relais" : "Cell towers",
    },
    {
      icon: <Truck className="w-3.5 h-3.5" />,
      title: language === "fr" ? "Logistique" : "Logistics",
      desc: language === "fr" ? "Centres de distribution" : "Distribution centers",
    },
  ];

  return (
    <motion.div
      initial={{ opacity: 0, x: 20 }}
      animate={{ opacity: 1, x: 0 }}
      className="h-full bg-card/50 backdrop-blur-md border border-border/50 rounded-xl p-4 flex flex-col gap-3 overflow-hidden"
    >
      {/* Header */}
      <div className="flex items-center gap-2 shrink-0">
        <div className="w-8 h-8 rounded-lg bg-violet-500/20 flex items-center justify-center">
          <BookOpen className="w-4 h-4 text-violet-400" />
        </div>
        <div>
          <h3 className="font-semibold text-sm text-foreground">
            {language === "fr" ? "Théorie" : "Theory"}
          </h3>
          <p className="text-xs text-muted-foreground">
            {language === "fr" ? "Concepts clés" : "Key concepts"}
          </p>
        </div>
      </div>

      {/* Expandable Sections */}
      <div className="flex-1 overflow-auto space-y-1.5">
        {sections.map((section) => (
          <div key={section.id} className="rounded-lg overflow-hidden">
            <Button
              variant="ghost"
              onClick={() =>
                setExpandedSection(expandedSection === section.id ? null : section.id)
              }
              className="w-full justify-between p-2.5 h-auto rounded-lg bg-muted/30 hover:bg-muted/50 text-xs"
            >
              <div className="flex items-center gap-2">
                <span className="text-primary">{section.icon}</span>
                <span className="font-medium text-foreground">{section.title}</span>
              </div>
              {expandedSection === section.id ? (
                <ChevronUp className="w-3.5 h-3.5 text-muted-foreground" />
              ) : (
                <ChevronDown className="w-3.5 h-3.5 text-muted-foreground" />
              )}
            </Button>

            <AnimatePresence>
              {expandedSection === section.id && (
                <motion.div
                  initial={{ height: 0, opacity: 0 }}
                  animate={{ height: "auto", opacity: 1 }}
                  exit={{ height: 0, opacity: 0 }}
                  transition={{ duration: 0.2 }}
                  className="overflow-hidden"
                >
                  <div className="p-3 bg-muted/20 text-xs text-muted-foreground leading-relaxed">
                    {section.content === "apps" ? (
                      <div className="space-y-2">
                        {applications.map((app) => (
                          <div
                            key={app.title}
                            className="flex items-center gap-2 p-2 bg-background/30 rounded-md"
                          >
                            <span className="text-primary">{app.icon}</span>
                            <div>
                              <p className="font-medium text-foreground text-xs">{app.title}</p>
                              <p className="text-[10px] text-muted-foreground">{app.desc}</p>
                            </div>
                          </div>
                        ))}
                      </div>
                    ) : (
                      <p className="whitespace-pre-line">{section.content}</p>
                    )}
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        ))}
      </div>

      {/* Algorithm Code */}
      <div className="shrink-0">
        <div className="flex items-center gap-1.5 mb-2">
          <Code2 className="w-3.5 h-3.5 text-cyan-400" />
          <span className="text-xs font-medium text-foreground">
            {language === "fr" ? "Pseudocode" : "Pseudocode"}
          </span>
        </div>
        <div className="bg-slate-900 rounded-lg p-3 overflow-x-auto">
          <pre className="text-[10px] text-slate-300 font-mono leading-relaxed">
            <code>{`function busStops(houses, d):
  stops = []
  i = 0
  while i < houses.length:
    start = houses[i]
    // Expand to furthest house within d
    while houses[i] <= start + d:
      i++
    stop = houses[i-1]
    stops.push(stop)
    // Skip covered houses
    while houses[i] <= stop + d:
      i++
  return stops`}</code>
          </pre>
        </div>
      </div>
    </motion.div>
  );
}
