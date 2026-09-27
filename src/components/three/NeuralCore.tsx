"use client";

import { useFrame, useThree } from "@react-three/fiber";
import type { MotionValue } from "motion/react";
import { useLayoutEffect, useMemo, useRef, type RefObject } from "react";
import * as THREE from "three";

/**
 * "Neural Core" — the hero's 3D piece.
 *   core     → a faceted solid: the model
 *   shell    → nodes on a sphere linked to their neighbours: the network / graph
 *   pulses   → points travelling along links: data in motion
 *   field    → sparse particles around everything: the dataset
 * All geometry is procedural (no assets to download).
 */

const BLUE = new THREE.Color("#4f8cff");
const CYAN = new THREE.Color("#22d3ee");
const VIOLET = new THREE.Color("#8b7bff");

export interface QualityConfig {
  nodes: number;
  neighbours: number;
  pulses: number;
  particles: number;
}

export const QUALITY: Record<"high" | "low", QualityConfig> = {
  high: { nodes: 120, neighbours: 3, pulses: 70, particles: 1400 },
  low: { nodes: 64, neighbours: 2, pulses: 28, particles: 450 },
};

/* ---------- Soft round point material (shared by nodes, pulses, particles) ---------- */

const pointVertex = /* glsl */ `
  attribute float aSize;
  attribute float aPhase;
  attribute vec3 aColor;
  uniform float uTime;
  uniform float uPixelRatio;
  uniform float uBreath;
  varying vec3 vColor;
  varying float vFade;
  void main() {
    vec4 mv = modelViewMatrix * vec4(position, 1.0);
    float breath = 1.0 + uBreath * sin(uTime * 1.6 + aPhase);
    gl_PointSize = aSize * breath * uPixelRatio * (8.0 / -mv.z);
    gl_Position = projectionMatrix * mv;
    vColor = aColor;
    vFade = smoothstep(18.0, 4.0, -mv.z);
  }
`;

const pointFragment = /* glsl */ `
  uniform float uOpacity;
  varying vec3 vColor;
  varying float vFade;
  void main() {
    float d = length(gl_PointCoord - 0.5);
    float a = smoothstep(0.5, 0.0, d);
    a *= a;
    gl_FragColor = vec4(vColor, a * uOpacity * vFade);
  }
`;

function makePointMaterial(opacity: number, breath: number, pixelRatio: number) {
  return new THREE.ShaderMaterial({
    vertexShader: pointVertex,
    fragmentShader: pointFragment,
    uniforms: {
      uTime: { value: 0 },
      uPixelRatio: { value: pixelRatio },
      uOpacity: { value: opacity },
      uBreath: { value: breath },
    },
    transparent: true,
    depthWrite: false,
    blending: THREE.AdditiveBlending,
  });
}

/* ---------- Soft halo behind the core ---------- */

const haloVertex = /* glsl */ `
  varying vec2 vUv;
  void main() {
    vUv = uv;
    gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
  }
`;

const haloFragment = /* glsl */ `
  uniform vec3 uColorA;
  uniform vec3 uColorB;
  uniform float uIntensity;
  varying vec2 vUv;
  void main() {
    float r = length(vUv - 0.5) * 2.0;
    float glow = pow(max(1.0 - r, 0.0), 2.2);
    float ring = smoothstep(0.08, 0.0, abs(r - 0.52)) * 0.35;
    vec3 col = mix(uColorB, uColorA, r);
    gl_FragColor = vec4(col, (glow + ring) * uIntensity);
  }
`;

/* ---------- Geometry helpers ---------- */

/** Deterministic PRNG so the structure looks identical on every load. */
function mulberry32(seed: number) {
  return () => {
    seed |= 0;
    seed = (seed + 0x6d2b79f5) | 0;
    let t = Math.imul(seed ^ (seed >>> 15), 1 | seed);
    t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t;
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}

function fibonacciSphere(count: number, radius: number, rand: () => number) {
  const pts: THREE.Vector3[] = [];
  const golden = Math.PI * (3 - Math.sqrt(5));
  for (let i = 0; i < count; i++) {
    const y = 1 - (i / (count - 1)) * 2;
    const r = Math.sqrt(1 - y * y);
    const theta = golden * i;
    const jitter = radius * (0.92 + rand() * 0.16);
    pts.push(new THREE.Vector3(Math.cos(theta) * r * jitter, y * jitter, Math.sin(theta) * r * jitter));
  }
  return pts;
}

/** Unique edges connecting each node to its k nearest neighbours. */
function nearestEdges(pts: THREE.Vector3[], k: number): [number, number][] {
  const seen = new Set<string>();
  const edges: [number, number][] = [];
  for (let i = 0; i < pts.length; i++) {
    const nearest = pts
      .map((p, j) => ({ j, d: j === i ? Infinity : p.distanceToSquared(pts[i]) }))
      .sort((a, b) => a.d - b.d)
      .slice(0, k);
    for (const { j } of nearest) {
      const key = i < j ? `${i}-${j}` : `${j}-${i}`;
      if (!seen.has(key)) {
        seen.add(key);
        edges.push([i, j]);
      }
    }
  }
  return edges;
}

/* ---------- Scene ---------- */

interface NeuralCoreProps {
  quality: QualityConfig;
  /** 0 → hero fully visible, 1 → hero scrolled away. */
  scroll?: MotionValue<number>;
  /** Normalised pointer, -1..1, written by the parent. */
  pointer: RefObject<{ x: number; y: number }>;
  /** Render a single still frame (reduced motion). */
  still?: boolean;
}

export function NeuralCore({ quality, scroll, pointer, still = false }: NeuralCoreProps) {
  const root = useRef<THREE.Group>(null);
  const network = useRef<THREE.Group>(null);
  const core = useRef<THREE.Mesh>(null);
  const halo = useRef<THREE.Mesh>(null);
  const ringA = useRef<THREE.Mesh>(null);
  const ringB = useRef<THREE.Mesh>(null);
  const field = useRef<THREE.Points>(null);
  const pulsesRef = useRef<THREE.Points>(null);
  const viewport = useThree((s) => s.viewport);
  const canvasWidth = useThree((s) => s.size.width);
  const pixelRatio = viewport.dpr;

  const data = useMemo(() => {
    const rand = mulberry32(7);
    const nodes = fibonacciSphere(quality.nodes, 2.35, rand);
    const edges = nearestEdges(nodes, quality.neighbours);

    // Nodes
    const nodePos = new Float32Array(nodes.length * 3);
    const nodeCol = new Float32Array(nodes.length * 3);
    const nodeSize = new Float32Array(nodes.length);
    const nodePhase = new Float32Array(nodes.length);
    const tmp = new THREE.Color();
    nodes.forEach((p, i) => {
      p.toArray(nodePos, i * 3);
      tmp
        .copy(BLUE)
        .lerp(CYAN, (p.y / 2.35 + 1) / 2)
        .lerp(VIOLET, rand() < 0.15 ? 0.7 : 0);
      tmp.toArray(nodeCol, i * 3);
      nodeSize[i] = 5 + rand() * 7;
      nodePhase[i] = rand() * Math.PI * 2;
    });

    // Links (vertex-coloured so they fade from one node's colour to the other's)
    const linePos = new Float32Array(edges.length * 6);
    const lineCol = new Float32Array(edges.length * 6);
    edges.forEach(([a, b], i) => {
      nodes[a].toArray(linePos, i * 6);
      nodes[b].toArray(linePos, i * 6 + 3);
      lineCol.set(nodeCol.subarray(a * 3, a * 3 + 3), i * 6);
      lineCol.set(nodeCol.subarray(b * 3, b * 3 + 3), i * 6 + 3);
    });

    // Pulses: each rides one edge at its own speed
    const pulses = Array.from({ length: quality.pulses }, () => ({
      edge: Math.floor(rand() * edges.length),
      t: rand(),
      speed: 0.15 + rand() * 0.35,
    }));
    const pulsePos = new Float32Array(quality.pulses * 3);
    const pulseCol = new Float32Array(quality.pulses * 3);
    const pulseSize = new Float32Array(quality.pulses);
    const pulsePhase = new Float32Array(quality.pulses);
    for (let i = 0; i < quality.pulses; i++) {
      (rand() < 0.5 ? CYAN : new THREE.Color("#ffffff")).toArray(pulseCol, i * 3);
      pulseSize[i] = 7 + rand() * 5;
      pulsePhase[i] = rand() * Math.PI * 2;
    }

    // Ambient field: a thick shell well outside the network
    const fieldPos = new Float32Array(quality.particles * 3);
    const fieldCol = new Float32Array(quality.particles * 3);
    const fieldSize = new Float32Array(quality.particles);
    const fieldPhase = new Float32Array(quality.particles);
    const v = new THREE.Vector3();
    for (let i = 0; i < quality.particles; i++) {
      v.randomDirection().multiplyScalar(4 + rand() * 9);
      v.toArray(fieldPos, i * 3);
      tmp
        .copy(BLUE)
        .lerp(VIOLET, rand())
        .multiplyScalar(0.5 + rand() * 0.5);
      tmp.toArray(fieldCol, i * 3);
      fieldSize[i] = 2 + rand() * 4;
      fieldPhase[i] = rand() * Math.PI * 2;
    }

    return {
      nodes,
      edges,
      nodePos,
      nodeCol,
      nodeSize,
      nodePhase,
      linePos,
      lineCol,
      pulses,
      pulsePos,
      pulseCol,
      pulseSize,
      pulsePhase,
      fieldPos,
      fieldCol,
      fieldSize,
      fieldPhase,
    };
  }, [quality]);

  const materials = useMemo(
    () => ({
      nodes: makePointMaterial(0.95, 0.18, pixelRatio),
      pulses: makePointMaterial(1, 0, pixelRatio),
      field: makePointMaterial(0.55, 0.35, pixelRatio),
      halo: new THREE.ShaderMaterial({
        vertexShader: haloVertex,
        fragmentShader: haloFragment,
        uniforms: {
          uColorA: { value: BLUE },
          uColorB: { value: CYAN },
          uIntensity: { value: 0.55 },
        },
        transparent: true,
        depthWrite: false,
        blending: THREE.AdditiveBlending,
      }),
    }),
    [pixelRatio],
  );

  useLayoutEffect(() => () => Object.values(materials).forEach((m) => m.dispose()), [materials]);

  // Beside the text on large screens (full-bleed canvas), centred in the stacked stage below it otherwise.
  const wide = canvasWidth >= 1024 && viewport.aspect > 1.1;
  const baseX = wide ? Math.min(viewport.width * 0.22, 3.2) : 0;
  const baseScale = wide ? 1 : Math.min(1, viewport.width / 6.2);

  const edgeTmpA = useMemo(() => new THREE.Vector3(), []);
  const edgeTmpB = useMemo(() => new THREE.Vector3(), []);

  useFrame((state, delta) => {
    const t = state.clock.elapsedTime;
    const dt = still ? 0 : Math.min(delta, 1 / 20);
    const p = pointer.current ?? { x: 0, y: 0 };
    const s = scroll?.get() ?? 0;

    for (const m of [materials.nodes, materials.pulses, materials.field]) m.uniforms.uTime.value = t;

    if (root.current) {
      // Ease toward the pointer rather than following it 1:1.
      const targetY = p.x * 0.45;
      const targetX = -p.y * 0.3;
      root.current.rotation.y = THREE.MathUtils.damp(root.current.rotation.y, targetY, 2.5, dt || 1);
      root.current.rotation.x = THREE.MathUtils.damp(root.current.rotation.x, targetX, 2.5, dt || 1);
      root.current.position.x = baseX;
      root.current.position.y = s * 1.6;
      root.current.scale.setScalar(baseScale * (1 - s * 0.15));
    }
    if (halo.current && root.current) halo.current.rotation.set(-root.current.rotation.x, -root.current.rotation.y, 0);
    if (network.current) network.current.rotation.y += dt * 0.06;
    if (core.current) {
      core.current.rotation.x += dt * 0.12;
      core.current.rotation.y += dt * 0.18;
    }
    if (ringA.current) ringA.current.rotation.z += dt * 0.1;
    if (ringB.current) ringB.current.rotation.z -= dt * 0.07;
    if (field.current) field.current.rotation.y += dt * 0.012;

    // Move pulses along their links; hop to a new link when one finishes.
    const pos = pulsesRef.current?.geometry.attributes.position as THREE.BufferAttribute | undefined;
    if (pos) {
      const arr = pos.array as Float32Array;
      data.pulses.forEach((pulse, i) => {
        pulse.t += dt * pulse.speed;
        if (pulse.t > 1) {
          pulse.t = 0;
          const end = data.edges[pulse.edge][1];
          const next = data.edges.findIndex(([a], idx) => a === end && idx !== pulse.edge);
          pulse.edge = next >= 0 ? next : (pulse.edge + 7) % data.edges.length;
        }
        const [a, b] = data.edges[pulse.edge];
        edgeTmpA
          .copy(data.nodes[a])
          .lerp(edgeTmpB.copy(data.nodes[b]), pulse.t)
          .toArray(arr, i * 3);
      });
      pos.needsUpdate = true;
    }

    // Pull the camera back slightly as the hero scrolls away.
    state.camera.position.z = THREE.MathUtils.damp(state.camera.position.z, 7.5 + s * 2.5, 4, dt || 1);
  });

  return (
    <group ref={root}>
      {/* Core */}
      <group>
        <mesh ref={core}>
          <icosahedronGeometry args={[1, 1]} />
          <meshStandardMaterial
            color="#111a30"
            metalness={0.55}
            roughness={0.3}
            flatShading
            emissive="#173a8f"
            emissiveIntensity={0.3}
          />
          <mesh scale={1.012}>
            <icosahedronGeometry args={[1, 1]} />
            <meshBasicMaterial color="#6fa5ff" wireframe transparent opacity={0.35} />
          </mesh>
        </mesh>
        {/* Camera-facing glow; counter-rotated so it stays circular as the structure turns. */}
        <mesh ref={halo} position={[0, 0, -0.6]} material={materials.halo}>
          <planeGeometry args={[5.2, 5.2]} />
        </mesh>
      </group>

      {/* Orbit rings */}
      <mesh ref={ringA} rotation={[Math.PI / 2.4, 0.3, 0]}>
        <torusGeometry args={[1.75, 0.006, 8, 160]} />
        <meshBasicMaterial color={CYAN} transparent opacity={0.55} />
      </mesh>
      <mesh ref={ringB} rotation={[Math.PI / 1.8, -0.5, 0.4]}>
        <torusGeometry args={[2.0, 0.004, 8, 160]} />
        <meshBasicMaterial color={VIOLET} transparent opacity={0.4} />
      </mesh>

      {/* Network shell */}
      <group ref={network}>
        <lineSegments>
          <bufferGeometry>
            <bufferAttribute attach="attributes-position" args={[data.linePos, 3]} />
            <bufferAttribute attach="attributes-color" args={[data.lineCol, 3]} />
          </bufferGeometry>
          <lineBasicMaterial
            vertexColors
            transparent
            opacity={0.28}
            blending={THREE.AdditiveBlending}
            depthWrite={false}
          />
        </lineSegments>
        <points material={materials.nodes}>
          <bufferGeometry>
            <bufferAttribute attach="attributes-position" args={[data.nodePos, 3]} />
            <bufferAttribute attach="attributes-aColor" args={[data.nodeCol, 3]} />
            <bufferAttribute attach="attributes-aSize" args={[data.nodeSize, 1]} />
            <bufferAttribute attach="attributes-aPhase" args={[data.nodePhase, 1]} />
          </bufferGeometry>
        </points>
        <points ref={pulsesRef} material={materials.pulses} frustumCulled={false}>
          <bufferGeometry>
            <bufferAttribute attach="attributes-position" args={[data.pulsePos, 3]} usage={THREE.DynamicDrawUsage} />
            <bufferAttribute attach="attributes-aColor" args={[data.pulseCol, 3]} />
            <bufferAttribute attach="attributes-aSize" args={[data.pulseSize, 1]} />
            <bufferAttribute attach="attributes-aPhase" args={[data.pulsePhase, 1]} />
          </bufferGeometry>
        </points>
      </group>

      {/* Ambient field */}
      <points ref={field} material={materials.field}>
        <bufferGeometry>
          <bufferAttribute attach="attributes-position" args={[data.fieldPos, 3]} />
          <bufferAttribute attach="attributes-aColor" args={[data.fieldCol, 3]} />
          <bufferAttribute attach="attributes-aSize" args={[data.fieldSize, 1]} />
          <bufferAttribute attach="attributes-aPhase" args={[data.fieldPhase, 1]} />
        </bufferGeometry>
      </points>
    </group>
  );
}
