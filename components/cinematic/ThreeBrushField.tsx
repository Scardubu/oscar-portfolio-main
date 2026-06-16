'use client';

import { useEffect, useRef, useState } from 'react';
import * as THREE from 'three';

import { useScrollCinema } from '@/components/cinematic/ScrollCinemaProvider';
import { CHAPTERS } from '@/lib/cinematic/chapters';

const vertexShader = `
varying vec2 vUv;
void main() {
  vUv = uv;
  gl_Position = vec4(position.xy, 0.0, 1.0);
}
`;

const fragmentShader = `
precision highp float;

varying vec2 vUv;
uniform vec2 uResolution;
uniform vec2 uPointer;
uniform float uTime;
uniform float uScroll;
uniform float uIntensity;
uniform vec3 uAccent;
uniform vec3 uWash;

float hash(vec2 p) {
  return fract(sin(dot(p, vec2(127.1, 311.7))) * 43758.5453123);
}

float noise(vec2 p) {
  vec2 i = floor(p);
  vec2 f = fract(p);
  f = f * f * (3.0 - 2.0 * f);

  float a = hash(i);
  float b = hash(i + vec2(1.0, 0.0));
  float c = hash(i + vec2(0.0, 1.0));
  float d = hash(i + vec2(1.0, 1.0));

  return mix(mix(a, b, f.x), mix(c, d, f.x), f.y);
}

float fbm(vec2 p) {
  float v = 0.0;
  float a = 0.5;
  mat2 m = mat2(1.6, 1.2, -1.2, 1.6);
  for (int i = 0; i < 5; i++) {
    v += a * noise(p);
    p = m * p;
    a *= 0.5;
  }
  return v;
}

void main() {
  vec2 uv = vUv;
  vec2 p = uv - 0.5;
  p.x *= uResolution.x / max(uResolution.y, 1.0);

  vec2 cursor = (uPointer - 0.5) * vec2(uResolution.x / max(uResolution.y, 1.0), 1.0);
  float t = uTime * 0.025;
  float scroll = uScroll * 1.4;

  vec2 flow = vec2(
    fbm(uv * 2.7 + vec2(scroll * 0.35, t)),
    fbm(uv * 3.4 - vec2(t * 0.8, scroll * 0.28))
  );

  float streak = fbm(uv * 6.0 + flow * 1.5);
  float ribbon = smoothstep(0.2, 0.92, streak + 0.18 * sin((uv.x + flow.y * 0.25) * 18.0 + t * 2.0));
  float halo = smoothstep(0.8, 0.0, length(p - cursor * 0.18));
  float vignette = smoothstep(1.0, 0.15, length(p));

  vec3 base = mix(vec3(0.03, 0.04, 0.06), uWash, ribbon * 0.85);
  vec3 tint = uAccent * (0.12 + 0.18 * flow.x + 0.16 * halo);

  float alpha = clamp(0.16 + ribbon * 0.30 + halo * 0.10, 0.0, 0.72) * vignette * uIntensity;
  gl_FragColor = vec4(base + tint, alpha);
}
`;

type QualityTier = 'full' | 'balanced' | 'low';

type NavigatorPerformanceHints = Navigator & {
  connection?: {
    saveData?: boolean;
  };
  deviceMemory?: number;
};

function getFrameBudgetMs(tier: QualityTier) {
  switch (tier) {
    case 'low':
      return 1000 / 24;
    case 'balanced':
      return 1000 / 40;
    default:
      return 1000 / 60;
  }
}

function getPixelRatioCap(tier: QualityTier) {
  switch (tier) {
    case 'low':
      return 0.9;
    case 'balanced':
      return 1.15;
    default:
      return 1.5;
  }
}

function getNextQualityTier(tier: QualityTier): QualityTier {
  if (tier === 'full') return 'balanced';
  if (tier === 'balanced') return 'low';
  return 'low';
}

function FallbackField() {
  return (
    <div
      aria-hidden="true"
      className="pointer-events-none fixed inset-0 -z-[1] opacity-70"
      // eslint-disable-next-line no-restricted-syntax
      style={{
        background:
          'radial-gradient(circle at 20% 10%, rgba(103,232,249,0.12), transparent 35%), radial-gradient(circle at 80% 20%, rgba(168,85,247,0.08), transparent 30%), linear-gradient(180deg, rgba(5,7,10,0.92), rgba(8,10,14,0.98))',
      }}
    />
  );
}

export function ThreeBrushField() {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const rendererRef = useRef<THREE.WebGLRenderer | null>(null);
  const frameRef = useRef<number | null>(null);
  const startTimeRef = useRef<number>(0);
  const lastFrameTimeRef = useRef<number>(0);
  const targetFrameMsRef = useRef<number>(1000 / 60);
  const pixelRatioCapRef = useRef<number>(1.5);
  const qualityTierRef = useRef<QualityTier>('balanced');
  const slowFrameStreakRef = useRef<number>(0);
  const pointerRef = useRef(new THREE.Vector2(0.5, 0.5));
  const [supportsWebGl, setSupportsWebGl] = useState(true);

  // ── PATCH v2026.16 [PALETTE LERP]: target color refs ────────────────────────
  // When a chapter change fires, the palette effect (below) updates these
  // target refs. The render loop lerps the ACTUAL uniform values toward these
  // targets at ~0.06 per frame ≈ 0.65s at 60fps — matching the CSS
  // `--chapter-accent` cross-fade duration. Without lerp, the WebGL background
  // snaps to the new palette while the CSS layer fades smoothly — visible as a
  // one-frame color flash on the canvas at every chapter boundary.
  //
  // Initialized inside the main useEffect (not here) to avoid the SSR penalty
  // of constructing THREE.Color on the server during module evaluation.
  const targetAccentRef = useRef<THREE.Color | null>(null);
  const targetWashRef = useRef<THREE.Color | null>(null);
  const targetIntensityRef = useRef<number>(0.18);
  // ── END PATCH v2026.16 [PALETTE LERP] ───────────────────────────────────────

  const { activeChapter, scrollProgressRef, reducedMotion } = useScrollCinema();

  const uniformsRef = useRef<{
    uResolution: { value: THREE.Vector2 };
    uPointer: { value: THREE.Vector2 };
    uTime: { value: number };
    uScroll: { value: number };
    uIntensity: { value: number };
    uAccent: { value: THREE.Color };
    uWash: { value: THREE.Color };
  } | null>(null);

  // FIX BUG 2 (main effect): dependency array is now `[reducedMotion]` only.
  //
  // Previously `activeChapter` was included here, causing React to destroy and
  // recreate the entire WebGL renderer, scene, geometry, material, and RAF loop
  // on every chapter change — producing a visible black-flash on the canvas.
  //
  // The palette update is handled in the separate effect below, which fires on
  // `activeChapter` changes and imperatively mutates the existing uniforms.
  // The RAF loop picks them up on the next tick — zero context churn.
  //
  // `scrollProgressRef` is a React ref (MutableRefObject). Its `.current` is
  // read inside the RAF callback; the ref identity never changes and must NOT
  // appear in any effect's dependency array.
  useEffect(() => {
    if (reducedMotion) return;

    const canvas = canvasRef.current;
    if (!canvas) return;

    // Acquire exactly one rendering context and pass it to THREE to avoid
    // repeated getContext probes per mount.
    const contextAttributes: WebGLContextAttributes = {
      alpha: true,
      antialias: false,
      powerPreference: 'high-performance',
      premultipliedAlpha: true,
    };

    const webgl2Context = canvas.getContext('webgl2', contextAttributes);
    const webgl1Context = webgl2Context ?? canvas.getContext('webgl', contextAttributes);
    const glContext = webgl1Context as WebGLRenderingContext | null;

    if (!glContext) {
      setSupportsWebGl(false);
      return;
    }

    setSupportsWebGl(true);

    const renderer = new THREE.WebGLRenderer({
      canvas,
      context: glContext,
      alpha: true,
      antialias: false,
      powerPreference: 'high-performance',
      premultipliedAlpha: true,
    });

    renderer.setClearColor(0x000000, 0);
    renderer.outputColorSpace = THREE.SRGBColorSpace;
    rendererRef.current = renderer;

    const scene = new THREE.Scene();
    const camera = new THREE.OrthographicCamera(-1, 1, 1, -1, 0, 1);

    const uniforms = {
      uResolution: { value: new THREE.Vector2(1, 1) },
      uPointer: { value: new THREE.Vector2(0.5, 0.5) },
      uTime: { value: 0 },
      uScroll: { value: 0 },
      uIntensity: { value: 0.5 },
      uAccent: { value: new THREE.Color('#67e8f9') },
      uWash: { value: new THREE.Color('#0c1320') },
    };

    uniformsRef.current = uniforms;

    const material = new THREE.ShaderMaterial({
      uniforms,
      vertexShader,
      fragmentShader,
      transparent: true,
      depthWrite: false,
      depthTest: false,
    });

    const geometry = new THREE.PlaneGeometry(2, 2);
    const mesh = new THREE.Mesh(geometry, material);
    scene.add(mesh);

    const resize = () => {
      const width = window.innerWidth;
      const height = window.innerHeight;
      const dpr = Math.min(window.devicePixelRatio || 1, pixelRatioCapRef.current);

      uniforms.uResolution.value.set(width, height);
      renderer.setPixelRatio(dpr);
      renderer.setSize(width, height, false);
    };

    const frameBudgetMedia = window.matchMedia('(max-width: 768px), (pointer: coarse)');
    const getPreferredQualityTier = (): QualityTier => {
      const navigatorWithHints = navigator as NavigatorPerformanceHints;
      const saveData = navigatorWithHints.connection?.saveData ?? false;
      const deviceMemory = navigatorWithHints.deviceMemory ?? 8;
      const cpuBudget = navigator.hardwareConcurrency ?? 8;

      if (saveData || deviceMemory <= 4 || cpuBudget <= 4) return 'low';
      if (frameBudgetMedia.matches || deviceMemory <= 8 || cpuBudget <= 8) return 'balanced';
      return 'full';
    };

    const applyQualityTier = (tier: QualityTier) => {
      qualityTierRef.current = tier;
      targetFrameMsRef.current = getFrameBudgetMs(tier);
      pixelRatioCapRef.current = getPixelRatioCap(tier);
      resize();
    };

    const updateFrameBudget = () => {
      applyQualityTier(getPreferredQualityTier());
      slowFrameStreakRef.current = 0;
    };

    updateFrameBudget();

    const pointerMedia = window.matchMedia('(pointer: fine)');

    const onPointerMove = (event: PointerEvent) => {
      if (!pointerMedia.matches) return;

      pointerRef.current.set(
        event.clientX / window.innerWidth,
        1 - event.clientY / window.innerHeight
      );
    };

    // Set initial palette from the current chapter at mount time.
    // Subsequent chapter changes are handled by the palette effect below.
    // PATCH v2026.16: also initialize target refs so the render loop lerp
    // starts at the correct color (not from the THREE.Color defaults).
    const setInitialPalette = () => {
      const chapter = CHAPTERS.find((item) => item.id === activeChapter) ?? CHAPTERS[0];
      // Initialize target refs here (first time they're accessible in the effect scope)
      targetAccentRef.current = new THREE.Color(chapter.colors.accent);
      targetWashRef.current = new THREE.Color(chapter.colors.wash);
      targetIntensityRef.current = chapter.motion.drift;
      // Set actual uniform values to match targets — no initial lerp needed
      uniforms.uAccent.value.set(chapter.colors.accent);
      uniforms.uWash.value.set(chapter.colors.wash);
      uniforms.uIntensity.value = chapter.motion.drift;
    };

    const render = (now: number) => {
      const uniformsState = uniformsRef.current;
      const rendererState = rendererRef.current;

      if (!uniformsState || !rendererState) return;

      const elapsedSinceLastFrame =
        lastFrameTimeRef.current === 0 ? targetFrameMsRef.current : now - lastFrameTimeRef.current;

      if (lastFrameTimeRef.current !== 0 && elapsedSinceLastFrame < targetFrameMsRef.current) {
        frameRef.current = window.requestAnimationFrame(render);
        return;
      }

      if (elapsedSinceLastFrame > targetFrameMsRef.current * 1.85) {
        slowFrameStreakRef.current += 1;
      } else {
        slowFrameStreakRef.current = Math.max(0, slowFrameStreakRef.current - 1);
      }

      if (slowFrameStreakRef.current >= 8 && qualityTierRef.current !== 'low') {
        applyQualityTier(getNextQualityTier(qualityTierRef.current));
        slowFrameStreakRef.current = 0;
      }

      lastFrameTimeRef.current = now;

      const elapsed = (now - startTimeRef.current) / 1000;
      uniformsState.uTime.value = elapsed;
      uniformsState.uScroll.value +=
        (scrollProgressRef.current - uniformsState.uScroll.value) * 0.06;
      uniformsState.uPointer.value.lerp(pointerRef.current, 0.08);

      // ── PATCH v2026.16 [PALETTE LERP]: smooth chapter color transitions ──────
      // Lerp factor 0.06 ≈ 0.65s convergence at 60fps — matches the CSS
      // `--chapter-accent` transition duration. Without this, the WebGL canvas
      // snaps to the new chapter palette while the CSS layer cross-fades,
      // creating a one-frame color mismatch flash at every chapter boundary.
      if (targetAccentRef.current) {
        uniformsState.uAccent.value.lerp(targetAccentRef.current, 0.06);
      }
      if (targetWashRef.current) {
        uniformsState.uWash.value.lerp(targetWashRef.current, 0.06);
      }
      uniformsState.uIntensity.value +=
        (targetIntensityRef.current - uniformsState.uIntensity.value) * 0.06;
      // ── END PATCH v2026.16 [PALETTE LERP] ─────────────────────────────────

      rendererState.render(scene, camera);
      frameRef.current = window.requestAnimationFrame(render);
    };

    const onVisibilityChange = () => {
      if (document.visibilityState === 'hidden') {
        if (frameRef.current) {
          window.cancelAnimationFrame(frameRef.current);
          frameRef.current = null;
        }
        return;
      }

      startTimeRef.current = performance.now() - uniforms.uTime.value * 1000;
      lastFrameTimeRef.current = 0;
      if (!frameRef.current) {
        frameRef.current = window.requestAnimationFrame(render);
      }
    };

    const onContextLost = (event: Event) => {
      event.preventDefault();
      setSupportsWebGl(false);
    };

    setInitialPalette();
    lastFrameTimeRef.current = 0;
    startTimeRef.current = performance.now();
    frameRef.current = window.requestAnimationFrame(render);

    const resizeObserver = new ResizeObserver(resize);
    resizeObserver.observe(document.documentElement);

    frameBudgetMedia.addEventListener('change', updateFrameBudget);
    window.addEventListener('pointermove', onPointerMove, { passive: true });
    window.addEventListener('resize', resize, { passive: true });
    document.addEventListener('visibilitychange', onVisibilityChange);
    canvas.addEventListener('webglcontextlost', onContextLost);

    return () => {
      if (frameRef.current) {
        window.cancelAnimationFrame(frameRef.current);
      }

      resizeObserver.disconnect();
      frameBudgetMedia.removeEventListener('change', updateFrameBudget);
      window.removeEventListener('pointermove', onPointerMove);
      window.removeEventListener('resize', resize);
      document.removeEventListener('visibilitychange', onVisibilityChange);
      canvas.removeEventListener('webglcontextlost', onContextLost);
      geometry.dispose();
      material.dispose();
      renderer.dispose();
      rendererRef.current = null;
      uniformsRef.current = null;
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [reducedMotion]); // activeChapter intentionally excluded — see comment above

  // FIX BUG 2 (palette effect): fires only on chapter change, imperatively
  // updates palette targets. The renderer and RAF loop continue uninterrupted —
  // zero WebGL context destruction on chapter transitions.
  //
  // PATCH v2026.16: now sets targetAccentRef / targetWashRef / targetIntensityRef
  // instead of mutating uniform values directly. The render loop lerps toward
  // these targets at 0.06/frame, creating a ~0.65s smooth transition that matches
  // the CSS `--chapter-accent` cross-fade. The old direct-set caused a hard snap.
  useEffect(() => {
    const chapter = CHAPTERS.find((item) => item.id === activeChapter) ?? CHAPTERS[0];

    // Update lerp targets. The render loop smoothly drives uniforms toward them.
    // Guard: targetAccentRef/targetWashRef are initialized inside the main
    // useEffect; this effect can fire before the main effect on first render
    // (React fires effects in order of declaration). If targets aren't set yet,
    // fall back to directly setting the uniforms for correctness.
    if (targetAccentRef.current) {
      targetAccentRef.current.set(chapter.colors.accent);
    } else {
      const uniforms = uniformsRef.current;
      if (uniforms) uniforms.uAccent.value.set(chapter.colors.accent);
    }

    if (targetWashRef.current) {
      targetWashRef.current.set(chapter.colors.wash);
    } else {
      const uniforms = uniformsRef.current;
      if (uniforms) uniforms.uWash.value.set(chapter.colors.wash);
    }

    targetIntensityRef.current = chapter.motion.drift;
  }, [activeChapter]);

  if (reducedMotion || !supportsWebGl) {
    return <FallbackField />;
  }

  return (
    // ENHANCEMENT 7: `mix-blend-mode: screen` is applied only on sm+ (≥640px).
    // On mobile the GPU must composite the canvas against every layer on every
    // frame; disabling the blend mode there drops it to a free compositor
    // no-op and eliminates scroll jank on low-power devices. The atmospheric
    // effect remains visible on mobile — it just doesn't carry the blend cost.
    <div
      aria-hidden="true"
      className="pointer-events-none fixed inset-0 -z-[1] overflow-hidden opacity-90 sm:[mix-blend-mode:screen]"
    >
      <canvas ref={canvasRef} className="h-full w-full" />
    </div>
  );
}
