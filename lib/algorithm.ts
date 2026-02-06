// Bus Stops Greedy Algorithm Implementation

export interface AlgorithmStep {
  type: 'select_house' | 'expand_coverage' | 'place_stop' | 'cover_remaining' | 'complete';
  houseIndex: number;
  housePosition?: number;
  stopPosition?: number;
  coveredRange?: [number, number];
  message: string;
  messageEn: string;
}

export interface AlgorithmResult {
  stops: number[];
  steps: AlgorithmStep[];
  executionTime: number;
}

export function busStopsGreedy(houses: number[], d: number): AlgorithmResult {
  const startTime = performance.now();
  const sortedHouses = [...houses].sort((a, b) => a - b);
  const stops: number[] = [];
  const steps: AlgorithmStep[] = [];
  let i = 0;

  while (i < sortedHouses.length) {
    const start = sortedHouses[i];
    
    steps.push({
      type: 'select_house',
      houseIndex: i,
      housePosition: start,
      message: `Sélection de la maison la plus à gauche non couverte à la position ${start}`,
      messageEn: `Selecting the leftmost uncovered house at position ${start}`
    });

    // Find the furthest house within distance d from start
    while (i < sortedHouses.length && sortedHouses[i] <= start + d) {
      i++;
    }

    const stopPosition = sortedHouses[i - 1];
    
    steps.push({
      type: 'expand_coverage',
      houseIndex: i - 1,
      coveredRange: [start, start + d],
      message: `Extension de la couverture: la maison la plus éloignée accessible est à ${stopPosition}`,
      messageEn: `Expanding coverage: the furthest reachable house is at ${stopPosition}`
    });

    steps.push({
      type: 'place_stop',
      houseIndex: i - 1,
      stopPosition,
      coveredRange: [stopPosition - d, stopPosition + d],
      message: `Placement de l'arrêt à la position ${stopPosition} (couvre ${stopPosition - d} à ${stopPosition + d})`,
      messageEn: `Placing bus stop at position ${stopPosition} (covers ${stopPosition - d} to ${stopPosition + d})`
    });

    stops.push(stopPosition);

    // Skip all houses covered by this stop
    const previousI = i;
    while (i < sortedHouses.length && sortedHouses[i] <= stopPosition + d) {
      i++;
    }

    if (i > previousI) {
      steps.push({
        type: 'cover_remaining',
        houseIndex: i - 1,
        stopPosition,
        coveredRange: [stopPosition - d, stopPosition + d],
        message: `${i - previousI} maison(s) supplémentaire(s) couverte(s) par cet arrêt`,
        messageEn: `${i - previousI} additional house(s) covered by this stop`
      });
    }
  }

  steps.push({
    type: 'complete',
    houseIndex: -1,
    message: `Algorithme terminé! ${stops.length} arrêt(s) placé(s) de manière optimale.`,
    messageEn: `Algorithm complete! ${stops.length} stop(s) placed optimally.`
  });

  const endTime = performance.now();

  return {
    stops,
    steps,
    executionTime: endTime - startTime
  };
}

// Naive algorithm for comparison
export function busStopsNaive(houses: number[], d: number): number[] {
  const sortedHouses = [...houses].sort((a, b) => a - b);
  const stops: number[] = [];
  
  for (const house of sortedHouses) {
    const isCovered = stops.some(stop => Math.abs(house - stop) <= d);
    if (!isCovered) {
      stops.push(house);
    }
  }
  
  return stops;
}

// Random placement for comparison
export function busStopsRandom(houses: number[], d: number): number[] {
  const sortedHouses = [...houses].sort((a, b) => a - b);
  const min = sortedHouses[0];
  const max = sortedHouses[sortedHouses.length - 1];
  const stops: number[] = [];
  
  let attempts = 0;
  const maxAttempts = 1000;
  
  while (attempts < maxAttempts) {
    const allCovered = sortedHouses.every(house => 
      stops.some(stop => Math.abs(house - stop) <= d)
    );
    
    if (allCovered) break;
    
    const randomPos = min + Math.random() * (max - min);
    stops.push(randomPos);
    attempts++;
  }
  
  return stops;
}

// Check if a house is covered by any stop
export function isHouseCovered(housePosition: number, stops: number[], d: number): boolean {
  return stops.some(stop => Math.abs(housePosition - stop) <= d);
}

// Generate random house positions
export function generateRandomHouses(count: number, maxPosition: number): number[] {
  const houses: number[] = [];
  for (let i = 0; i < count; i++) {
    houses.push(Math.floor(Math.random() * maxPosition));
  }
  return houses.sort((a, b) => a - b);
}
