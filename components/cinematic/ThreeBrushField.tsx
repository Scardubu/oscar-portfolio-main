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
  const pointerRef = useRef(new THREE.Vector2(0.5, 0.5));
  const [supportsWebGl, setSupportsWebGl] = useState(true);

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

  useEffect(() => {
    if (reducedMotion) return;

    const canvas = canvasRef.current;
    if (!canvas) return;

    const hasWebGL2 = !!canvas.getContext('webgl2', { alpha: true });
    const hasWebGL = hasWebGL2 || !!canvas.getContext('webgl', { alpha: true });

    if (!hasWebGL) {
      setSupportsWebGl(false);
      return;
    }

    setSupportsWebGl(true);

    const renderer = new THREE.WebGLRenderer({
      canvas,
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
      const dpr = Math.min(window.devicePixelRatio || 1, 1.5);

      uniforms.uResolution.value.set(width, height);
      renderer.setPixelRatio(dpr);
      renderer.setSize(width, height, false);
    };

    const pointerMedia = window.matchMedia('(pointer: fine)');

    const onPointerMove = (event: PointerEvent) => {
      if (!pointerMedia.matches) return;

      pointerRef.current.set(
        event.clientX / window.innerWidth,
        1 - event.clientY / window.innerHeight
      );
    };

    const setChapterPalette = () => {
      const chapter = CHAPTERS.find((item) => item.id === activeChapter) ?? CHAPTERS[0];
      uniforms.uAccent.value.set(chapter.colors.accent);
      uniforms.uWash.value.set(chapter.colors.wash);
      uniforms.uIntensity.value = chapter.motion.drift;
    };

    const render = () => {
      const uniformsState = uniformsRef.current;
      const rendererState = rendererRef.current;

      if (!uniformsState || !rendererState) return;

      const elapsed = (performance.now() - startTimeRef.current) / 1000;
      uniformsState.uTime.value = elapsed;
      uniformsState.uScroll.value +=
        (scrollProgressRef.current - uniformsState.uScroll.value) * 0.06;
      uniformsState.uPointer.value.lerp(pointerRef.current, 0.08);

      rendererState.render(scene, camera);
      frameRef.current = window.requestAnimationFrame(render);
    };

    setChapterPalette();
    resize();
    startTimeRef.current = performance.now();
    render();

    const resizeObserver = new ResizeObserver(resize);
    resizeObserver.observe(document.documentElement);

    window.addEventListener('pointermove', onPointerMove, { passive: true });
    window.addEventListener('resize', resize, { passive: true });

    return () => {
      if (frameRef.current) {
        window.cancelAnimationFrame(frameRef.current);
      }

      resizeObserver.disconnect();
      window.removeEventListener('pointermove', onPointerMove);
      window.removeEventListener('resize', resize);
      geometry.dispose();
      material.dispose();
      renderer.dispose();
      rendererRef.current = null;
      uniformsRef.current = null;
    };
  }, [activeChapter, reducedMotion, scrollProgressRef]);

  useEffect(() => {
    const uniforms = uniformsRef.current;
    if (!uniforms) return;

    const chapter = CHAPTERS.find((item) => item.id === activeChapter) ?? CHAPTERS[0];
    uniforms.uAccent.value.set(chapter.colors.accent);
    uniforms.uWash.value.set(chapter.colors.wash);
    uniforms.uIntensity.value = chapter.motion.drift;
  }, [activeChapter]);

  if (reducedMotion || !supportsWebGl) {
    return <FallbackField />;
  }

  return (
    <div
      aria-hidden="true"
      className="pointer-events-none fixed inset-0 -z-[1] overflow-hidden opacity-90 [mix-blend-mode:screen]"
    >
      <canvas ref={canvasRef} className="h-full w-full" />
    </div>
  );
}
