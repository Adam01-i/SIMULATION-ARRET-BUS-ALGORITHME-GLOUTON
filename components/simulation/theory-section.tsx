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

interface TheorySectionProps {
  language: "fr" | "en";
}

export function TheorySection({ language }: TheorySectionProps) {
  const [expandedSection, setExpandedSection] = useState<string | null>(null);

  const sections = [
    {
      id: "problem",
      icon: <BookOpen className="w-5 h-5" />,
      title: language === "fr" ? "Le Problème" : "The Problem",
      content:
        language === "fr"
          ? "Considérons une rue avec des maisons situées à différentes positions. On souhaite placer le minimum d'arrêts de bus de sorte que chaque maison soit à une distance d'au plus d kilomètres d'un arrêt. C'est un problème classique d'optimisation combinatoire."
          : "Consider a street with houses at various positions. We want to place the minimum number of bus stops such that each house is at most d kilometers from a stop. This is a classic combinatorial optimization problem.",
    },
    {
      id: "greedy",
      icon: <Lightbulb className="w-5 h-5" />,
      title: language === "fr" ? "L'Approche Gloutonne" : "The Greedy Approach",
      content:
        language === "fr"
          ? "L'algorithme glouton fonctionne ainsi: 1) Trier les maisons par position. 2) Prendre la maison la plus à gauche non couverte. 3) Placer un arrêt le plus à droite possible tout en couvrant cette maison (à distance d). 4) Marquer toutes les maisons couvertes par cet arrêt. 5) Répéter jusqu'à ce que toutes les maisons soient couvertes."
          : "The greedy algorithm works as follows: 1) Sort houses by position. 2) Take the leftmost uncovered house. 3) Place a stop as far right as possible while still covering this house (at distance d). 4) Mark all houses covered by this stop. 5) Repeat until all houses are covered.",
    },
    {
      id: "proof",
      icon: <Code2 className="w-5 h-5" />,
      title: language === "fr" ? "Preuve Intuitive" : "Intuitive Proof",
      content:
        language === "fr"
          ? "L'algorithme est optimal car: 1) On ne place jamais d'arrêt inutile - chaque arrêt couvre au moins une nouvelle maison. 2) En plaçant l'arrêt le plus à droite possible, on maximise le nombre de maisons couvertes vers la droite. 3) Cette stratégie \"greedy\" ne peut jamais faire pire qu'une solution optimale, car chaque choix local optimal contribue à une solution globale optimale."
          : "The algorithm is optimal because: 1) We never place an unnecessary stop - each stop covers at least one new house. 2) By placing the stop as far right as possible, we maximize coverage to the right. 3) This greedy strategy can never do worse than an optimal solution, as each locally optimal choice contributes to a globally optimal solution.",
    },
    {
      id: "applications",
      icon: <Building2 className="w-5 h-5" />,
      title: language === "fr" ? "Applications Réelles" : "Real Applications",
      content:
        language === "fr"
          ? "Ce problème a de nombreuses applications pratiques dans le monde réel, au-delà des simples arrêts de bus."
          : "This problem has many practical real-world applications beyond simple bus stops.",
    },
  ];

  const applications = [
    {
      icon: <Building2 className="w-4 h-4" />,
      title: language === "fr" ? "Urbanisme" : "Urban Planning",
      desc:
        language === "fr"
          ? "Placement optimal de services publics, écoles, hôpitaux"
          : "Optimal placement of public services, schools, hospitals",
    },
    {
      icon: <Wifi className="w-4 h-4" />,
      title: language === "fr" ? "Télécommunications" : "Telecommunications",
      desc:
        language === "fr"
          ? "Placement d'antennes relais pour couverture réseau"
          : "Placement of cell towers for network coverage",
    },
    {
      icon: <Truck className="w-4 h-4" />,
      title: language === "fr" ? "Logistique" : "Logistics",
      desc:
        language === "fr"
          ? "Centres de distribution, points de livraison"
          : "Distribution centers, delivery points",
    },
  ];

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="bg-card/50 backdrop-blur-md border border-border/50 rounded-2xl p-6 space-y-4"
    >
      <div className="flex items-center gap-3 mb-4">
        <div className="w-10 h-10 rounded-xl bg-violet-500/20 flex items-center justify-center">
          <BookOpen className="w-5 h-5 text-violet-400" />
        </div>
        <div>
          <h3 className="font-semibold text-foreground">
            {language === "fr" ? "Théorie & Concepts" : "Theory & Concepts"}
          </h3>
          <p className="text-xs text-muted-foreground">
            {language === "fr"
              ? "Comprendre l'algorithme glouton"
              : "Understanding the greedy algorithm"}
          </p>
        </div>
      </div>

      <div className="space-y-2">
        {sections.map((section) => (
          <div key={section.id} className="rounded-xl overflow-hidden">
            <Button
              variant="ghost"
              onClick={() =>
                setExpandedSection(
                  expandedSection === section.id ? null : section.id
                )
              }
              className="w-full justify-between p-4 h-auto rounded-xl bg-muted/30 hover:bg-muted/50"
            >
              <div className="flex items-center gap-3">
                <span className="text-primary">{section.icon}</span>
                <span className="font-medium text-foreground">{section.title}</span>
              </div>
              {expandedSection === section.id ? (
                <ChevronUp className="w-4 h-4 text-muted-foreground" />
              ) : (
                <ChevronDown className="w-4 h-4 text-muted-foreground" />
              )}
            </Button>

            <AnimatePresence>
              {expandedSection === section.id && (
                <motion.div
                  initial={{ height: 0, opacity: 0 }}
                  animate={{ height: "auto", opacity: 1 }}
                  exit={{ height: 0, opacity: 0 }}
                  transition={{ duration: 0.3 }}
                  className="overflow-hidden"
                >
                  <div className="p-4 bg-muted/20 text-sm text-muted-foreground leading-relaxed">
                    {section.content}

                    {section.id === "applications" && (
                      <div className="mt-4 space-y-3">
                        {applications.map((app, index) => (
                          <motion.div
                            key={app.title}
                            initial={{ opacity: 0, x: -10 }}
                            animate={{ opacity: 1, x: 0 }}
                            transition={{ delay: index * 0.1 }}
                            className="flex items-start gap-3 p-3 bg-background/30 rounded-lg"
                          >
                            <span className="text-primary mt-0.5">
                              {app.icon}
                            </span>
                            <div>
                              <p className="font-medium text-foreground">
                                {app.title}
                              </p>
                              <p className="text-xs">{app.desc}</p>
                            </div>
                          </motion.div>
                        ))}
                      </div>
                    )}
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        ))}
      </div>

      {/* Algorithm Code */}
      <div className="mt-4">
        <div className="flex items-center gap-2 mb-3">
          <Code2 className="w-4 h-4 text-cyan-400" />
          <span className="text-sm font-medium text-foreground">
            {language === "fr" ? "Code de l'algorithme" : "Algorithm Code"}
          </span>
        </div>
        <div className="bg-slate-900 rounded-xl p-4 overflow-x-auto">
          <pre className="text-xs text-slate-300 font-mono">
            <code>{`function busStops(houses: number[], d: number): number[] {
  const stops = [];
  let i = 0;

  while (i < houses.length) {
    const start = houses[i];

    // Find furthest house within d from start
    while (i < houses.length && houses[i] <= start + d) {
      i++;
    }

    const stop = houses[i - 1];
    stops.push(stop);

    // Skip houses covered by this stop
    while (i < houses.length && houses[i] <= stop + d) {
      i++;
    }
  }

  return stops;
}`}</code>
          </pre>
        </div>
      </div>
    </motion.div>
  );
}
