"use client";

import React from "react"

import { Canvas, useFrame, useThree } from "@react-three/fiber";
import { OrthographicCamera, Html, Line } from "@react-three/drei";
import { useRef, useState, useEffect, useMemo, useCallback } from "react";
import * as THREE from "three";
import type { AlgorithmStep } from "@/lib/algorithm";

// ============================================================================
// TYPES
// ============================================================================

interface CitySceneProps {
  houses: number[];
  stops: number[];
  d: number;
  maxPosition: number;
  currentStep: number;
  currentStepData: AlgorithmStep | null;
  highlightedHouseIndex: number | null;
  userStops: number[];
  isRunning: boolean;
  showCoverageZones: boolean;
  language: "fr" | "en";
  onAddHouse: (position: number) => void;
  onAddUserStop: (position: number) => void;
}

// ============================================================================
// URBAN PARTICLES - Floating lights
// ============================================================================

function UrbanParticles({ count = 100 }: { count?: number }) {
  const particlesRef = useRef<THREE.Points>(null);

  const { positions, speeds } = useMemo(() => {
    const pos = new Float32Array(count * 3);
    const spd = new Float32Array(count);
    for (let i = 0; i < count; i++) {
      pos[i * 3] = (Math.random() - 0.5) * 200;
      pos[i * 3 + 1] = Math.random() * 30 + 5;
      pos[i * 3 + 2] = (Math.random() - 0.5) * 200;
      spd[i] = Math.random() * 0.02 + 0.01;
    }
    return { positions: pos, speeds: spd };
  }, [count]);

  useFrame(() => {
    if (!particlesRef.current) return;
    const posArray = particlesRef.current.geometry.attributes.position
      .array as Float32Array;
    for (let i = 0; i < count; i++) {
      posArray[i * 3 + 1] += speeds[i];
      if (posArray[i * 3 + 1] > 35) {
        posArray[i * 3 + 1] = 5;
      }
    }
    particlesRef.current.geometry.attributes.position.needsUpdate = true;
  });

  return (
    <points ref={particlesRef}>
      <bufferGeometry>
        <bufferAttribute
          attach="attributes-position"
          args={[positions, 3]}
          count={count}
          itemSize={3}
        />
      </bufferGeometry>
      <pointsMaterial
        size={0.3}
        color="#60a5fa"
        transparent
        opacity={0.6}
        sizeAttenuation
      />
    </points>
  );
}

// ============================================================================
// CITY GROUND - Urban grid with roads
// ============================================================================

function CityGround({ maxPosition }: { maxPosition: number }) {
  const gridSize = maxPosition + 40;

  return (
    <group>
      {/* Main ground */}
      <mesh rotation={[-Math.PI / 2, 0, 0]} position={[maxPosition / 2, -0.1, 0]}>
        <planeGeometry args={[gridSize, 80]} />
        <meshStandardMaterial color="#0f172a" />
      </mesh>

      {/* Grid lines */}
      {Array.from({ length: Math.floor(gridSize / 10) + 1 }).map((_, i) => (
        <Line
          key={`grid-x-${i}`}
          points={[
            [-20, 0, (i - Math.floor(gridSize / 20)) * 10],
            [maxPosition + 20, 0, (i - Math.floor(gridSize / 20)) * 10],
          ]}
          color="#1e3a5f"
          lineWidth={0.5}
          opacity={0.3}
          transparent
        />
      ))}
      {Array.from({ length: Math.floor(gridSize / 10) + 1 }).map((_, i) => (
        <Line
          key={`grid-z-${i}`}
          points={[
            [i * 10 - 20, 0, -40],
            [i * 10 - 20, 0, 40],
          ]}
          color="#1e3a5f"
          lineWidth={0.5}
          opacity={0.3}
          transparent
        />
      ))}
    </group>
  );
}

// ============================================================================
// MAIN ROAD
// ============================================================================

function MainRoad({ maxPosition }: { maxPosition: number }) {
  return (
    <group position={[maxPosition / 2, 0.01, 0]}>
      {/* Road surface */}
      <mesh rotation={[-Math.PI / 2, 0, 0]}>
        <planeGeometry args={[maxPosition + 40, 12]} />
        <meshStandardMaterial color="#1e293b" />
      </mesh>

      {/* Road markings - center line */}
      {Array.from({ length: Math.floor((maxPosition + 40) / 8) }).map((_, i) => (
        <mesh
          key={`marking-${i}`}
          rotation={[-Math.PI / 2, 0, 0]}
          position={[i * 8 - maxPosition / 2 - 16, 0.02, 0]}
        >
          <planeGeometry args={[4, 0.3]} />
          <meshStandardMaterial color="#fbbf24" emissive="#fbbf24" emissiveIntensity={0.3} />
        </mesh>
      ))}

      {/* Sidewalks */}
      <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, 0.02, 7]}>
        <planeGeometry args={[maxPosition + 40, 2]} />
        <meshStandardMaterial color="#334155" />
      </mesh>
      <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, 0.02, -7]}>
        <planeGeometry args={[maxPosition + 40, 2]} />
        <meshStandardMaterial color="#334155" />
      </mesh>
    </group>
  );
}

// ============================================================================
// HOUSE COMPONENT - Realistic building
// ============================================================================

function House({
  position,
  index,
  isHighlighted,
  isCovered,
  d,
}: {
  position: number;
  index: number;
  isHighlighted: boolean;
  isCovered: boolean;
  d: number;
}) {
  const meshRef = useRef<THREE.Group>(null);
  const [hovered, setHovered] = useState(false);

  const height = useMemo(() => 2 + Math.random() * 3, []);
  const width = useMemo(() => 2 + Math.random() * 1.5, []);
  const depth = useMemo(() => 2 + Math.random() * 1.5, []);
  const houseColor = useMemo(() => {
    const colors = ["#475569", "#334155", "#3f3f46", "#525252"];
    return colors[Math.floor(Math.random() * colors.length)];
  }, []);

  useFrame((state) => {
    if (!meshRef.current) return;
    if (isHighlighted) {
      meshRef.current.position.y =
        height / 2 + Math.sin(state.clock.elapsedTime * 4) * 0.2;
    } else {
      meshRef.current.position.y = height / 2;
    }
  });

  const emissiveColor = isHighlighted
    ? "#f472b6"
    : isCovered
    ? "#22c55e"
    : "#64748b";
  const emissiveIntensity = isHighlighted ? 0.8 : isCovered ? 0.4 : 0.1;

  return (
    <group position={[position, 0, 12]}>
      {/* Building body */}
      <group
        ref={meshRef}
        onPointerOver={() => setHovered(true)}
        onPointerOut={() => setHovered(false)}
      >
        <mesh>
          <boxGeometry args={[width, height, depth]} />
          <meshStandardMaterial
            color={houseColor}
            emissive={emissiveColor}
            emissiveIntensity={hovered ? emissiveIntensity + 0.3 : emissiveIntensity}
          />
        </mesh>

        {/* Windows */}
        {Array.from({ length: Math.floor(height / 1.2) }).map((_, floor) => (
          <mesh
            key={floor}
            position={[width / 2 + 0.01, -height / 2 + 1 + floor * 1.2, 0]}
          >
            <planeGeometry args={[0.01, 0.6]} />
            <meshStandardMaterial
              color="#fef08a"
              emissive="#fef08a"
              emissiveIntensity={Math.random() > 0.3 ? 0.8 : 0.1}
            />
          </mesh>
        ))}

        {/* Roof */}
        <mesh position={[0, height / 2, 0]}>
          <boxGeometry args={[width + 0.2, 0.3, depth + 0.2]} />
          <meshStandardMaterial color="#1e293b" />
        </mesh>
      </group>

      {/* House label */}
      <Html position={[0, height + 1.5, 0]} center distanceFactor={50}>
        <div
          className={`px-2 py-1 rounded-full text-xs font-medium whitespace-nowrap transition-all ${
            isHighlighted
              ? "bg-pink-500/90 text-white scale-110"
              : isCovered
              ? "bg-emerald-500/80 text-white"
              : "bg-slate-700/80 text-slate-200"
          }`}
        >
          H{index + 1} ({position})
        </div>
      </Html>

      {/* Highlight ring */}
      {isHighlighted && (
        <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, 0.1, 0]}>
          <ringGeometry args={[3, 3.5, 32]} />
          <meshBasicMaterial color="#f472b6" transparent opacity={0.6} />
        </mesh>
      )}
    </group>
  );
}

// ============================================================================
// BUS STOP COMPONENT - Modern station
// ============================================================================

function BusStop({
  position,
  index,
  d,
  showCoverage,
  isNew,
}: {
  position: number;
  index: number;
  d: number;
  showCoverage: boolean;
  isNew: boolean;
}) {
  const groupRef = useRef<THREE.Group>(null);
  const [scale, setScale] = useState(isNew ? 0 : 1);

  useEffect(() => {
    if (isNew) {
      setScale(0);
      const timeout = setTimeout(() => setScale(1), 50);
      return () => clearTimeout(timeout);
    }
  }, [isNew]);

  useFrame((state, delta) => {
    if (groupRef.current) {
      groupRef.current.scale.setScalar(THREE.MathUtils.lerp(groupRef.current.scale.x, scale, delta * 8));
    }
  });

  return (
    <group position={[position, 0, 0]}>
      {/* Coverage zone */}
      {showCoverage && (
        <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, 0.05, 0]}>
          <circleGeometry args={[d, 64]} />
          <meshBasicMaterial color="#06b6d4" transparent opacity={0.15} />
        </mesh>
      )}
      {showCoverage && (
        <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, 0.06, 0]}>
          <ringGeometry args={[d - 0.3, d, 64]} />
          <meshBasicMaterial color="#06b6d4" transparent opacity={0.5} />
        </mesh>
      )}

      {/* Bus stop structure */}
      <group ref={groupRef}>
        {/* Shelter roof */}
        <mesh position={[0, 3.5, -5]}>
          <boxGeometry args={[4, 0.2, 3]} />
          <meshStandardMaterial
            color="#0ea5e9"
            emissive="#0ea5e9"
            emissiveIntensity={0.3}
            metalness={0.8}
            roughness={0.2}
          />
        </mesh>

        {/* Shelter poles */}
        <mesh position={[-1.8, 1.75, -5]}>
          <cylinderGeometry args={[0.1, 0.1, 3.5, 8]} />
          <meshStandardMaterial color="#64748b" metalness={0.9} roughness={0.1} />
        </mesh>
        <mesh position={[1.8, 1.75, -5]}>
          <cylinderGeometry args={[0.1, 0.1, 3.5, 8]} />
          <meshStandardMaterial color="#64748b" metalness={0.9} roughness={0.1} />
        </mesh>

        {/* Sign post */}
        <mesh position={[2.5, 2, -5]}>
          <cylinderGeometry args={[0.08, 0.08, 4, 8]} />
          <meshStandardMaterial color="#475569" />
        </mesh>

        {/* Bus sign */}
        <mesh position={[2.5, 3.8, -5]}>
          <boxGeometry args={[1.2, 0.8, 0.1]} />
          <meshStandardMaterial
            color="#0ea5e9"
            emissive="#0ea5e9"
            emissiveIntensity={0.5}
          />
        </mesh>

        {/* Bench */}
        <mesh position={[0, 0.5, -5.5]}>
          <boxGeometry args={[2.5, 0.15, 0.5]} />
          <meshStandardMaterial color="#334155" />
        </mesh>
        <mesh position={[-1, 0.25, -5.5]}>
          <boxGeometry args={[0.15, 0.5, 0.5]} />
          <meshStandardMaterial color="#334155" />
        </mesh>
        <mesh position={[1, 0.25, -5.5]}>
          <boxGeometry args={[0.15, 0.5, 0.5]} />
          <meshStandardMaterial color="#334155" />
        </mesh>

        {/* Platform */}
        <mesh position={[0, 0.1, -5]} rotation={[-Math.PI / 2, 0, 0]}>
          <planeGeometry args={[5, 4]} />
          <meshStandardMaterial color="#1e3a5f" />
        </mesh>
      </group>

      {/* Stop label */}
      <Html position={[0, 5, -5]} center distanceFactor={50}>
        <div className="px-3 py-1.5 bg-cyan-500/90 text-white rounded-lg text-sm font-bold shadow-lg shadow-cyan-500/30">
          Stop {index + 1}
        </div>
      </Html>
    </group>
  );
}

// ============================================================================
// ANIMATED BUS
// ============================================================================

function AnimatedBus({
  stops,
  isRunning,
  maxPosition,
}: {
  stops: number[];
  isRunning: boolean;
  maxPosition: number;
}) {
  const busRef = useRef<THREE.Group>(null);
  const [targetIndex, setTargetIndex] = useState(0);
  const [currentX, setCurrentX] = useState(-10);

  useEffect(() => {
    if (!isRunning) {
      setTargetIndex(0);
      setCurrentX(-10);
    }
  }, [isRunning]);

  useFrame((state, delta) => {
    if (!busRef.current) return;

    if (isRunning && stops.length > 0) {
      const targetX = stops[targetIndex] || maxPosition + 10;
      const newX = THREE.MathUtils.lerp(currentX, targetX, delta * 0.5);
      setCurrentX(newX);
      busRef.current.position.x = newX;

      if (Math.abs(newX - targetX) < 0.5) {
        if (targetIndex < stops.length - 1) {
          setTimeout(() => setTargetIndex((prev) => prev + 1), 1000);
        }
      }
    } else {
      // Idle animation
      busRef.current.position.x = -10 + Math.sin(state.clock.elapsedTime * 0.5) * 2;
    }

    // Slight bounce
    busRef.current.position.y = 0.8 + Math.sin(state.clock.elapsedTime * 8) * 0.02;
  });

  return (
    <group ref={busRef} position={[-10, 0.8, 0]}>
      {/* Bus body */}
      <mesh>
        <boxGeometry args={[6, 2.5, 2.5]} />
        <meshStandardMaterial
          color="#0891b2"
          emissive="#0891b2"
          emissiveIntensity={0.2}
          metalness={0.6}
          roughness={0.3}
        />
      </mesh>

      {/* Windshield */}
      <mesh position={[2.8, 0.3, 0]}>
        <boxGeometry args={[0.5, 1.5, 2.2]} />
        <meshStandardMaterial
          color="#1e293b"
          transparent
          opacity={0.8}
          metalness={0.9}
          roughness={0.1}
        />
      </mesh>

      {/* Wheels */}
      {[[-1.8, -0.8, 1.3], [-1.8, -0.8, -1.3], [1.8, -0.8, 1.3], [1.8, -0.8, -1.3]].map(
        (pos, i) => (
          <mesh key={i} position={pos as [number, number, number]} rotation={[Math.PI / 2, 0, 0]}>
            <cylinderGeometry args={[0.5, 0.5, 0.3, 16]} />
            <meshStandardMaterial color="#1e293b" />
          </mesh>
        )
      )}

      {/* Headlights */}
      <pointLight position={[3.2, 0, 0.8]} color="#fef08a" intensity={2} distance={15} />
      <pointLight position={[3.2, 0, -0.8]} color="#fef08a" intensity={2} distance={15} />

      {/* Bus label */}
      <Html position={[0, 2, 0]} center distanceFactor={50}>
        <div className="px-2 py-1 bg-cyan-600/90 text-white rounded text-xs font-bold">
          BUS
        </div>
      </Html>
    </group>
  );
}

// ============================================================================
// CAMERA CONTROLLER
// ============================================================================

function CameraController({
  zoom,
  panOffset,
  maxPosition,
}: {
  zoom: number;
  panOffset: { x: number; y: number };
  maxPosition: number;
}) {
  const { camera } = useThree();

  useFrame(() => {
    if (camera instanceof THREE.OrthographicCamera) {
      const targetZoom = zoom;
      camera.zoom = THREE.MathUtils.lerp(camera.zoom, targetZoom, 0.1);
      camera.position.x = THREE.MathUtils.lerp(
        camera.position.x,
        maxPosition / 2 + panOffset.x,
        0.1
      );
      camera.position.z = THREE.MathUtils.lerp(camera.position.z, panOffset.y, 0.1);
      camera.updateProjectionMatrix();
    }
  });

  return null;
}

// ============================================================================
// COVERAGE VISUALIZATION - Algorithm step
// ============================================================================

function CoverageVisualization({
  step,
  houses,
  d,
}: {
  step: AlgorithmStep | null;
  houses: number[];
  d: number;
}) {
  if (!step || step.type === "complete") return null;

  const housePos = step.houseIndex >= 0 ? houses[step.houseIndex] : 0;

  return (
    <group>
      {/* Current consideration range */}
      {step.coveredRange && (
        <mesh
          rotation={[-Math.PI / 2, 0, 0]}
          position={[(step.coveredRange[0] + step.coveredRange[1]) / 2, 0.08, 12]}
        >
          <planeGeometry args={[step.coveredRange[1] - step.coveredRange[0], 8]} />
          <meshBasicMaterial color="#a855f7" transparent opacity={0.2} />
        </mesh>
      )}

      {/* Distance d indicator */}
      {step.type === "select_house" && housePos !== undefined && (
        <>
          <Line
            points={[
              [housePos, 0.5, 12],
              [housePos + d, 0.5, 12],
            ]}
            color="#f472b6"
            lineWidth={3}
            dashed
            dashSize={0.5}
            gapSize={0.3}
          />
          <Html position={[housePos + d / 2, 1.5, 12]} center>
            <div className="px-2 py-1 bg-pink-500/90 text-white text-xs rounded font-bold">
              d = {d}
            </div>
          </Html>
        </>
      )}
    </group>
  );
}

// ============================================================================
// BACKGROUND BUILDINGS
// ============================================================================

function BackgroundBuildings({ maxPosition }: { maxPosition: number }) {
  const buildings = useMemo(() => {
    const arr = [];
    for (let i = -20; i < maxPosition + 30; i += 8 + Math.random() * 6) {
      arr.push({
        x: i,
        height: 5 + Math.random() * 15,
        width: 3 + Math.random() * 4,
        depth: 3 + Math.random() * 4,
        z: -20 - Math.random() * 15,
      });
    }
    return arr;
  }, [maxPosition]);

  return (
    <group>
      {buildings.map((b, i) => (
        <mesh key={i} position={[b.x, b.height / 2, b.z]}>
          <boxGeometry args={[b.width, b.height, b.depth]} />
          <meshStandardMaterial
            color="#1e293b"
            emissive="#3b82f6"
            emissiveIntensity={0.05}
          />
        </mesh>
      ))}
    </group>
  );
}

// ============================================================================
// STREET LIGHTS
// ============================================================================

function StreetLights({ maxPosition }: { maxPosition: number }) {
  const lights = useMemo(() => {
    const arr = [];
    for (let i = 0; i < maxPosition; i += 15) {
      arr.push(i);
    }
    return arr;
  }, [maxPosition]);

  return (
    <group>
      {lights.map((x, i) => (
        <group key={i} position={[x, 0, -8]}>
          {/* Pole */}
          <mesh position={[0, 3, 0]}>
            <cylinderGeometry args={[0.1, 0.15, 6, 8]} />
            <meshStandardMaterial color="#475569" />
          </mesh>
          {/* Light fixture */}
          <mesh position={[0, 6, 0]}>
            <sphereGeometry args={[0.4, 16, 16]} />
            <meshStandardMaterial
              color="#fef08a"
              emissive="#fef08a"
              emissiveIntensity={1}
            />
          </mesh>
          <pointLight position={[0, 5.5, 0]} color="#fef3c7" intensity={3} distance={20} />
        </group>
      ))}
    </group>
  );
}

// ============================================================================
// MAIN CITY SCENE COMPONENT
// ============================================================================

export function CityScene({
  houses,
  stops,
  d,
  maxPosition,
  currentStep,
  currentStepData,
  highlightedHouseIndex,
  userStops,
  isRunning,
  showCoverageZones,
  language,
  onAddHouse,
  onAddUserStop,
}: CitySceneProps) {
  // Calculate initial zoom based on maxPosition to fit the scene
const initialZoom = useMemo(() => {
  const sceneWidth = maxPosition + 80;
  return Math.max(0.8, Math.min(3, 120 / sceneWidth));
}, [maxPosition]);


  const [zoom, setZoom] = useState(initialZoom);
  const [panOffset, setPanOffset] = useState({ x: 0, y: 5 });

  // Update zoom when maxPosition changes
  useEffect(() => {
    const newZoom = Math.max(3, Math.min(8, 400 / (maxPosition + 40)));
    setZoom(newZoom);
    setPanOffset({ x: 0, y: 5 });
  }, [maxPosition]);
  const [isDragging, setIsDragging] = useState(false);
  const [lastMousePos, setLastMousePos] = useState({ x: 0, y: 0 });

  const handleWheel = useCallback((e: React.WheelEvent) => {
    e.preventDefault();
setZoom((prev) => Math.max(0.5, Math.min(6, prev - e.deltaY * 0.002)));
  }, []);

  const handleMouseDown = useCallback((e: React.MouseEvent) => {
    if (e.button === 0) {
      setIsDragging(true);
      setLastMousePos({ x: e.clientX, y: e.clientY });
    }
  }, []);

  const handleMouseMove = useCallback(
    (e: React.MouseEvent) => {
      if (isDragging) {
        const dx = (e.clientX - lastMousePos.x) * (30 / zoom);
        const dy = (e.clientY - lastMousePos.y) * (30 / zoom);

        setPanOffset((prev) => ({
          x: prev.x - dx * 0.1,
          y: prev.y + dy * 0.1,
        }));
        setLastMousePos({ x: e.clientX, y: e.clientY });
      }
    },
    [isDragging, lastMousePos, zoom]
  );

  const handleMouseUp = useCallback(() => {
    setIsDragging(false);
  }, []);

  // Check if house is covered
  const isHouseCovered = useCallback(
    (housePos: number) => {
      return stops.some((stop) => Math.abs(housePos - stop) <= d);
    },
    [stops, d]
  );

  return (
    <div
      className="w-full h-full"
      onWheel={handleWheel}
      onMouseDown={handleMouseDown}
      onMouseMove={handleMouseMove}
      onMouseUp={handleMouseUp}
      onMouseLeave={handleMouseUp}
    >
      <Canvas>
        <OrthographicCamera
  makeDefault
  position={[maxPosition / 2, 140, 120]}
  zoom={zoom}
  near={0.1}
  far={2000}
/>

        <CameraController zoom={zoom} panOffset={panOffset} maxPosition={maxPosition} />

        {/* Lighting */}
        <ambientLight intensity={0.2} />
        <directionalLight position={[50, 100, 50]} intensity={0.3} color="#93c5fd" />
        <directionalLight position={[-50, 80, -50]} intensity={0.2} color="#c4b5fd" />

        {/* Scene elements */}
        <color attach="background" args={["#0a0f1a"]} />
        <fog attach="fog" args={["#0a0f1a", 50, 200]} />

        <CityGround maxPosition={maxPosition} />
        <MainRoad maxPosition={maxPosition} />
        <BackgroundBuildings maxPosition={maxPosition} />
        <StreetLights maxPosition={maxPosition} />
        <UrbanParticles count={80} />

        {/* Houses */}
        {houses.map((pos, i) => (
          <House
            key={`house-${i}`}
            position={pos}
            index={i}
            isHighlighted={highlightedHouseIndex === i}
            isCovered={isHouseCovered(pos)}
            d={d}
          />
        ))}

        {/* Bus stops */}
        {stops.map((pos, i) => (
          <BusStop
            key={`stop-${i}`}
            position={pos}
            index={i}
            d={d}
            showCoverage={showCoverageZones}
            isNew={i === stops.length - 1 && isRunning}
          />
        ))}

        {/* User stops (challenge mode) */}
        {userStops.map((pos, i) => (
          <BusStop
            key={`user-stop-${i}`}
            position={pos}
            index={i}
            d={d}
            showCoverage={showCoverageZones}
            isNew={false}
          />
        ))}

        {/* Algorithm visualization */}
        <CoverageVisualization step={currentStepData} houses={houses} d={d} />

        {/* Animated bus */}
        <AnimatedBus stops={stops} isRunning={isRunning} maxPosition={maxPosition} />
      </Canvas>

      {/* Zoom controls overlay */}
      <div className="absolute bottom-4 right-4 flex flex-col gap-2">
        <button
          onClick={() => setZoom((prev) => Math.min(20, prev + 1))}
          className="w-10 h-10 bg-card/80 backdrop-blur-md border border-border/50 rounded-lg flex items-center justify-center text-foreground hover:bg-card transition-colors"
        >
          +
        </button>
        <button
          onClick={() => setZoom((prev) => Math.max(2, prev - 1))}
          className="w-10 h-10 bg-card/80 backdrop-blur-md border border-border/50 rounded-lg flex items-center justify-center text-foreground hover:bg-card transition-colors"
        >
          -
        </button>
        <button
          onClick={() => {
            const newZoom = Math.max(0.8, Math.min(3, 120 / (maxPosition + 80)));
            setZoom(newZoom);
            setPanOffset({ x: 0, y: 5 });
          }}
          className="w-10 h-10 bg-card/80 backdrop-blur-md border border-border/50 rounded-lg flex items-center justify-center text-foreground hover:bg-card transition-colors text-xs"
        >
          R
        </button>
      </div>
    </div>
  );
}
