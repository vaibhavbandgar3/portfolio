"use client";

import { Canvas, useFrame, useThree } from "@react-three/fiber";
import { useLayoutEffect, useMemo, useRef } from "react";
import * as THREE from "three";

/**
 * "Loss landscape" — a field of points forming a slowly shifting error
 * surface, with an optimiser point running gradient descent across it and
 * leaving a trail. The height function is shared by the GPU (to shape the
 * surface) and the CPU (to steer the optimiser), so the ball truly follows
 * the slope it sits on.
 */

const MIN = { x: 2.2, z: 0.4 }; // where the basin sits

// Keep in sync with `heightGLSL` below.
function height(x: number, z: number, t: number) {
  return (
    0.45 * Math.sin(x * 0.8 + t * 0.35) * Math.cos(z * 0.9 - t * 0.25) +
    0.18 * Math.sin((x + z) * 1.6 + t * 0.5) -
    1.3 * Math.exp(-((x - MIN.x) ** 2 + (z - MIN.z) ** 2) / 4.5)
  );
}

const heightGLSL = /* glsl */ `
  float heightAt(float x, float z, float t) {
    return 0.45 * sin(x * 0.8 + t * 0.35) * cos(z * 0.9 - t * 0.25)
         + 0.18 * sin((x + z) * 1.6 + t * 0.5)
         - 1.3 * exp(-((x - ${MIN.x.toFixed(2)}) * (x - ${MIN.x.toFixed(2)}) + (z - ${MIN.z.toFixed(2)}) * (z - ${MIN.z.toFixed(2)})) / 4.5);
  }
`;

const surfaceVertex = /* glsl */ `
  uniform float uTime;
  uniform float uPixelRatio;
  varying float vH;
  varying float vEdge;
  ${heightGLSL}
  void main() {
    vec3 p = position;
    p.y = heightAt(p.x, p.z, uTime);
    vH = p.y;
    vEdge = 1.0 - smoothstep(0.55, 1.0, max(abs(p.x) / 9.0, abs(p.z) / 4.5));
    vec4 mv = modelViewMatrix * vec4(p, 1.0);
    gl_PointSize = 3.2 * uPixelRatio * (6.0 / -mv.z);
    gl_Position = projectionMatrix * mv;
  }
`;

const surfaceFragment = /* glsl */ `
  varying float vH;
  varying float vEdge;
  void main() {
    float d = length(gl_PointCoord - 0.5);
    float a = smoothstep(0.5, 0.1, d);
    float k = clamp((vH + 1.3) / 1.9, 0.0, 1.0);
    vec3 low = vec3(0.545, 0.482, 1.0);   // violet
    vec3 mid = vec3(0.31, 0.55, 1.0);     // blue
    vec3 high = vec3(0.133, 0.827, 0.933); // cyan
    vec3 col = k < 0.5 ? mix(low, mid, k * 2.0) : mix(mid, high, (k - 0.5) * 2.0);
    gl_FragColor = vec4(col, a * vEdge * (0.5 + k * 0.5));
  }
`;

const TRAIL = 48;

function Landscape({ dense }: { dense: boolean }) {
  const dpr = useThree((s) => s.viewport.dpr);
  const cols = dense ? 150 : 80;
  const rows = dense ? 70 : 40;

  const geometry = useMemo(() => {
    const pos = new Float32Array(cols * rows * 3);
    let i = 0;
    for (let r = 0; r < rows; r++) {
      for (let c = 0; c < cols; c++) {
        pos[i++] = (c / (cols - 1) - 0.5) * 18;
        pos[i++] = 0;
        pos[i++] = (r / (rows - 1) - 0.5) * 9;
      }
    }
    const g = new THREE.BufferGeometry();
    g.setAttribute("position", new THREE.BufferAttribute(pos, 3));
    return g;
  }, [cols, rows]);

  const material = useMemo(
    () =>
      new THREE.ShaderMaterial({
        vertexShader: surfaceVertex,
        fragmentShader: surfaceFragment,
        uniforms: { uTime: { value: 0 }, uPixelRatio: { value: dpr } },
        transparent: true,
        depthWrite: false,
        blending: THREE.AdditiveBlending,
      }),
    [dpr],
  );

  const trailGeometry = useMemo(() => {
    const g = new THREE.BufferGeometry();
    g.setAttribute("position", new THREE.BufferAttribute(new Float32Array(TRAIL * 3), 3));
    return g;
  }, []);

  const trail = useMemo(
    () =>
      new THREE.Line(
        trailGeometry,
        new THREE.LineBasicMaterial({
          color: "#22d3ee",
          transparent: true,
          opacity: 0.7,
          blending: THREE.AdditiveBlending,
        }),
      ),
    [trailGeometry],
  );

  useLayoutEffect(
    () => () => {
      geometry.dispose();
      material.dispose();
      trailGeometry.dispose();
      (trail.material as THREE.Material).dispose();
    },
    [geometry, material, trailGeometry, trail],
  );

  const surface = useRef<THREE.Points>(null);
  const trailLine = useRef<THREE.Line>(null);
  const ball = useRef<THREE.Mesh>(null);
  const glow = useRef<THREE.Mesh>(null);
  const opt = useRef({ x: -3.2, z: -1.8, settled: 0, trail: [] as THREE.Vector3[] });

  useFrame((state, delta) => {
    const t = state.clock.elapsedTime;
    const mat = surface.current?.material as THREE.ShaderMaterial | undefined;
    if (mat) mat.uniforms.uTime.value = t;
    const o = opt.current;
    const dt = Math.min(delta, 1 / 20);

    // Gradient descent with a numerical gradient of the same height function.
    const e = 0.01;
    const gx = (height(o.x + e, o.z, t) - height(o.x - e, o.z, t)) / (2 * e);
    const gz = (height(o.x, o.z + e, t) - height(o.x, o.z - e, t)) / (2 * e);
    const lr = 2.2;
    o.x -= gx * lr * dt;
    o.z -= gz * lr * dt;

    // Once converged, pause, then restart from a new random initialisation.
    if (Math.hypot(gx, gz) < 0.04) o.settled += dt;
    if (o.settled > 1.6 || Math.abs(o.x) > 9 || Math.abs(o.z) > 4.5) {
      const a = Math.random() * Math.PI * 2;
      o.x = MIN.x + Math.cos(a) * 5.5;
      o.z = MIN.z + Math.sin(a) * 2.6;
      o.settled = 0;
      o.trail = [];
    }

    const y = height(o.x, o.z, t) + 0.08;
    ball.current?.position.set(o.x, y, o.z);
    glow.current?.position.set(o.x, y, o.z);

    o.trail.push(new THREE.Vector3(o.x, y, o.z));
    if (o.trail.length > TRAIL) o.trail.shift();
    const tg = trailLine.current?.geometry;
    if (!tg) return;
    const arr = tg.attributes.position.array as Float32Array;
    for (let i = 0; i < TRAIL; i++) {
      const p = o.trail[Math.max(0, o.trail.length - TRAIL + i)] ?? o.trail[0];
      if (p) p.toArray(arr, i * 3);
    }
    tg.attributes.position.needsUpdate = true;
    tg.setDrawRange(0, o.trail.length);
  });

  return (
    <group position={[0, -1.1, 0]} rotation={[0, -0.25, 0]}>
      <points ref={surface} geometry={geometry} material={material} frustumCulled={false} />
      <primitive ref={trailLine} object={trail} frustumCulled={false} />
      <mesh ref={ball}>
        <sphereGeometry args={[0.06, 16, 16]} />
        <meshBasicMaterial color="#ffffff" />
      </mesh>
      <mesh ref={glow}>
        <sphereGeometry args={[0.16, 16, 16]} />
        <meshBasicMaterial
          color="#22d3ee"
          transparent
          opacity={0.25}
          blending={THREE.AdditiveBlending}
          depthWrite={false}
        />
      </mesh>
    </group>
  );
}

export default function DataSurfaceScene({
  lowPower,
  paused,
  reducedMotion,
}: {
  lowPower: boolean;
  paused: boolean;
  reducedMotion: boolean;
}) {
  return (
    <Canvas
      dpr={lowPower ? [1, 1.25] : [1, 1.5]}
      camera={{ position: [0, 2.6, 7.5], fov: 45, near: 0.1, far: 40 }}
      onCreated={({ camera }) => camera.lookAt(0, -0.2, 0)}
      gl={{ antialias: false, alpha: true, powerPreference: "low-power" }}
      frameloop={paused ? "never" : reducedMotion ? "demand" : "always"}
      aria-hidden="true"
    >
      <Landscape dense={!lowPower} />
    </Canvas>
  );
}
