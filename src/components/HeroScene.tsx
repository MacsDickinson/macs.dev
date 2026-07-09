import React, { Suspense, useEffect, useMemo, useRef } from 'react';
import * as THREE from 'three';
import { Canvas, useFrame, useLoader, useThree } from '@react-three/fiber';
import {
  Environment,
  Float,
  Html,
  Lightformer,
  MeshTransmissionMaterial
} from '@react-three/drei';
import { Bloom, EffectComposer } from '@react-three/postprocessing';
import { FontLoader } from 'three/examples/jsm/loaders/FontLoader.js';
import { TextGeometry } from 'three/examples/jsm/geometries/TextGeometry.js';
import { mergeGeometries } from 'three/examples/jsm/utils/BufferGeometryUtils.js';
import { easing } from 'maath';
import { NavNode, type NavNodeData } from './NavNode';
import { useMediaQuery } from '../useMediaQuery';
import {
  NameBacklight,
  NebulaBackdrop,
  PhotoBackdrop,
  WeatherBackdrop,
  getWeatherLook,
  photoFromUrl,
  useWeather,
  type BackdropKind
} from './HeroBackdrops';

/**
 * The constellation "main level" rendered with three.js:
 * - The name as an extruded glass object floating in space. It is barely
 *   visible until light rakes across it — the key light lives off-screen and
 *   its direction follows the cursor (auto-orbits on touch devices).
 * - A starfield + the clickable nav stars, all mounted on one slowly
 *   rotating group so the whole sky drifts like a long-exposure night shot.
 *   No cursor gravity — the pointer only steers the light.
 */

/* ------------------------------------------------------------------ */
/* Starfield                                                           */
/* ------------------------------------------------------------------ */

function makeStarTexture() {
  const c = document.createElement('canvas');
  c.width = c.height = 64;
  const ctx = c.getContext('2d')!;
  const g = ctx.createRadialGradient(32, 32, 0, 32, 32, 32);
  g.addColorStop(0, 'rgba(255,255,255,1)');
  g.addColorStop(0.35, 'rgba(255,255,255,0.5)');
  g.addColorStop(1, 'rgba(255,255,255,0)');
  ctx.fillStyle = g;
  ctx.fillRect(0, 0, 64, 64);
  return new THREE.CanvasTexture(c);
}

type StarCloudProps = {
  texture: THREE.Texture;
  count: number;
  minRadius: number;
  maxRadius: number;
  minZ: number;
  maxZ: number;
  size: number;
  opacity: number;
  color?: string;
  /** When given, per-star colours are picked from this palette. */
  palette?: string[];
  seed: number;
};

// Deterministic PRNG so the sky doesn't reshuffle on re-render.
function mulberry32(seed: number) {
  let a = seed;
  return () => {
    a |= 0;
    a = (a + 0x6d2b79f5) | 0;
    let t = Math.imul(a ^ (a >>> 15), 1 | a);
    t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t;
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}

function StarCloud({
  texture,
  count,
  minRadius,
  maxRadius,
  minZ,
  maxZ,
  size,
  opacity,
  color = '#ffffff',
  palette,
  seed
}: StarCloudProps) {
  const { positions, colors } = useMemo(() => {
    const rand = mulberry32(seed);
    const pos = new Float32Array(count * 3);
    const col = palette ? new Float32Array(count * 3) : null;
    const tmp = new THREE.Color();
    for (let i = 0; i < count; i++) {
      // Area-uniform radius in an annulus, random angle, random depth.
      const r = Math.sqrt(
        THREE.MathUtils.lerp(minRadius * minRadius, maxRadius * maxRadius, rand())
      );
      const a = rand() * Math.PI * 2;
      pos[i * 3] = Math.cos(a) * r;
      pos[i * 3 + 1] = Math.sin(a) * r;
      pos[i * 3 + 2] = THREE.MathUtils.lerp(minZ, maxZ, rand());
      if (col && palette) {
        tmp.set(palette[Math.floor(rand() * palette.length)]);
        col[i * 3] = tmp.r;
        col[i * 3 + 1] = tmp.g;
        col[i * 3 + 2] = tmp.b;
      }
    }
    return { positions: pos, colors: col };
  }, [count, minRadius, maxRadius, minZ, maxZ, palette, seed]);

  return (
    <points>
      <bufferGeometry>
        <bufferAttribute
          attach="attributes-position"
          count={count}
          array={positions}
          itemSize={3}
        />
        {colors &&
        <bufferAttribute
          attach="attributes-color"
          count={count}
          array={colors}
          itemSize={3} />
        }
      </bufferGeometry>
      <pointsMaterial
        map={texture}
        size={size}
        sizeAttenuation
        transparent
        opacity={opacity}
        depthWrite={false}
        blending={THREE.AdditiveBlending}
        color={palette ? undefined : color}
        vertexColors={!!palette} />

    </points>);

}

function Starfield() {
  const texture = useMemo(makeStarTexture, []);
  useEffect(() => () => texture.dispose(), [texture]);
  return (
    <>
      {/* Fine dust, far away */}
      <StarCloud
        texture={texture}
        count={420}
        minRadius={2}
        maxRadius={38}
        minZ={-32}
        maxZ={-10}
        size={0.14}
        opacity={0.6}
        color="#8a93a6"
        seed={11} />

      {/* Mid stars */}
      <StarCloud
        texture={texture}
        count={170}
        minRadius={2.5}
        maxRadius={34}
        minZ={-26}
        maxZ={-6}
        size={0.28}
        opacity={0.8}
        color="#c8d0dd"
        seed={23} />

      {/* A handful of brighter, tinted stars */}
      <StarCloud
        texture={texture}
        count={30}
        minRadius={3}
        maxRadius={30}
        minZ={-22}
        maxZ={-5}
        size={0.34}
        opacity={0.9}
        palette={['#c8d0dd', '#8a93a6', '#6c5ce7', '#00b894']}
        seed={41} />

    </>);

}

/* ------------------------------------------------------------------ */
/* Rotating sky                                                        */
/* ------------------------------------------------------------------ */

const SKY_SPEED = 0.014; // rad/s — one revolution in ~7.5 minutes

function RotatingField({
  reduced,
  children
}: {
  reduced: boolean;
  children: React.ReactNode;
}) {
  const ref = useRef<THREE.Group>(null);
  useFrame((_, delta) => {
    if (!reduced && ref.current) ref.current.rotation.z += delta * SKY_SPEED;
  });
  return <group ref={ref}>{children}</group>;
}

/* ------------------------------------------------------------------ */
/* Clickable nav stars                                                 */
/* ------------------------------------------------------------------ */

type NavStarDef = Omit<NavNodeData, 'x' | 'y'> & {
  /** Initial angle around the name, degrees. */
  angle: number;
  /** Radius factor relative to the base orbit. */
  radiusF: number;
  z: number;
};

// Spread in a loose ring around the name so every star stays on screen
// through a full rotation of the sky.
const NAV_STARS: NavStarDef[] = [
{ label: 'Book me to speak', target: 'book', color: '#ff5a2c', primary: true, align: 'left', angle: 38, radiusF: 1.02, z: -2, delay: 0.5 },
{ label: 'Work', target: 'work', color: '#8a93a6', align: 'left', angle: 100, radiusF: 0.82, z: -3.4, delay: 1 },
{ label: 'Podcast', target: 'podcast', color: '#6c5ce7', align: 'right', angle: 160, radiusF: 1.05, z: -2.6, delay: 1.15 },
{ label: 'Writing', target: 'writing', color: '#00b894', align: 'left', angle: 212, radiusF: 0.9, z: -3.8, delay: 0.85 },
{ label: 'About', target: 'about', color: '#00b894', align: 'right', angle: 268, radiusF: 1.06, z: -2.2, delay: 1.3 },
{ label: 'Speaking', target: 'speaking', color: '#6c5ce7', align: 'right', angle: 322, radiusF: 0.94, z: -3, delay: 0.7 }];


function NavStars({ onNavigate }: { onNavigate: (target: string) => void }) {
  const { viewport } = useThree();
  const rBase = Math.min(viewport.width * 0.42, viewport.height * 0.4);
  return (
    <>
      {NAV_STARS.map((n) => {
        const a = n.angle * Math.PI / 180;
        const r = rBase * n.radiusF;
        return (
          <group key={n.target} position={[Math.cos(a) * r, Math.sin(a) * r, n.z]}>
            <Html center zIndexRange={[30, 0]}>
              <NavNode node={n} onSelect={onNavigate} />
            </Html>
          </group>);

      })}
    </>);

}

/* ------------------------------------------------------------------ */
/* The glass name                                                      */
/* ------------------------------------------------------------------ */

// public/ assets referenced by URL don't get Vite's base-path rewriting the
// way imported assets do — prefix BASE_URL by hand, or the fonts 404 when
// the site is served from a sub-path (e.g. GitHub Pages project URLs).
const ROMAN_FONT = `${import.meta.env.BASE_URL}fonts/fraunces-72-light.typeface.json`;
const ITALIC_FONT = `${import.meta.env.BASE_URL}fonts/fraunces-72-light-italic.typeface.json`;

function GlassName({ reduced }: { reduced: boolean }) {
  const romanFont = useLoader(FontLoader, ROMAN_FONT);
  const italicFont = useLoader(FontLoader, ITALIC_FONT);
  const { viewport } = useThree();
  const tiltRef = useRef<THREE.Group>(null);

  // The name leans gently toward the cursor, so moving the light also turns
  // the object into/away from it — kept small so the front faces never swing
  // far enough to mirror the key light into the camera.
  useFrame((state, delta) => {
    if (!tiltRef.current || reduced) return;
    easing.dampE(
      tiltRef.current.rotation,
      [-state.pointer.y * 0.08, state.pointer.x * 0.12, 0],
      0.5,
      delta
    );
  });

  const { geometry, width, height } = useMemo(() => {
    const SIZE = 3;
    const opts = (font: unknown) => ({
      font,
      size: SIZE,
      height: SIZE * 0.22, // extrusion depth (three <=r162 name)
      depth: SIZE * 0.22,
      curveSegments: 10,
      bevelEnabled: true,
      bevelThickness: SIZE * 0.022,
      bevelSize: SIZE * 0.014,
      bevelSegments: 5
    });
    const make = (text: string, font: unknown, y: number) => {
      const g = new TextGeometry(text, opts(font) as ConstructorParameters<typeof TextGeometry>[1]);
      g.computeBoundingBox();
      const bb = g.boundingBox!;
      // Centre each line on x (and z), stack on y.
      g.translate(-(bb.min.x + bb.max.x) / 2, y, -(bb.min.z + bb.max.z) / 2);
      return g;
    };
    const top = make('Macs', romanFont, SIZE * 0.28);
    const bottom = make('Dickinson', italicFont, -SIZE * 0.98);
    const merged = mergeGeometries([top, bottom]);
    top.dispose();
    bottom.dispose();
    merged.computeBoundingBox();
    const bb = merged.boundingBox!;
    merged.translate(0, -(bb.min.y + bb.max.y) / 2, 0);
    return {
      geometry: merged,
      width: bb.max.x - bb.min.x,
      height: bb.max.y - bb.min.y
    };
  }, [romanFont, italicFont]);

  useEffect(() => () => geometry.dispose(), [geometry]);

  const scale = Math.min(
    viewport.width * 0.7 / width,
    viewport.height * 0.46 / height
  );

  return (
    <group ref={tiltRef}>
      <Float
        speed={reduced ? 0 : 1.1}
        rotationIntensity={0.1}
        floatIntensity={0.3}>

        <mesh geometry={geometry} scale={scale}>
        <MeshTransmissionMaterial
          thickness={0.85}
          samples={8}
          resolution={512}
          roughness={0.12}
          ior={1.5}
          chromaticAberration={0.08}
          anisotropicBlur={0.2}
          clearcoat={1}
          clearcoatRoughness={0.12}
          color="#ffffff" />

        </mesh>
      </Float>
    </group>);

}

/* ------------------------------------------------------------------ */
/* Light rig — direction follows the cursor from off-screen            */
/* ------------------------------------------------------------------ */

// How high the light sits above the screen plane (sine of elevation).
// Fixed and low so the light always *rakes* in from beyond the window edge —
// a frontal light would mirror straight back into the camera and light the
// whole face up.
const LIGHT_ELEVATION = 0.24;

function LightRig({ reduced, bright }: { reduced: boolean; bright?: boolean }) {
  // The light's direction is tracked as an angle around the screen rim, and
  // damped as an angle: when the cursor crosses the middle the light slides
  // *around* the rim instead of lerping through the centre (which would pass
  // through a frontal, canvas-facing direction and flash the glass white).
  const theta = useRef({ value: Math.atan2(0.67, 0.74) });
  const lightRef = useRef<THREE.DirectionalLight>(null);
  const envKeyRef = useRef<THREE.Group>(null);
  const finePointer = useMediaQuery('(pointer: fine)');

  useFrame((state, delta) => {
    const t = state.clock.elapsedTime;
    let px: number;
    let py: number;
    if (reduced) {
      px = 0.74;
      py = 0.67;
    } else if (finePointer) {
      px = state.pointer.x;
      py = state.pointer.y;
    } else {
      // No cursor (touch): let the light orbit slowly on its own.
      px = Math.cos(t * 0.11);
      py = Math.sin(t * 0.16);
    }
    // The cursor's direction from centre picks which edge of the window the
    // light comes in from; near the centre we hold the last direction.
    if (Math.hypot(px, py) > 0.12) {
      easing.dampAngle(theta.current, 'value', Math.atan2(py, px), 0.4, delta);
    }
    const planar = Math.sqrt(1 - LIGHT_ELEVATION * LIGHT_ELEVATION);
    const dx = Math.cos(theta.current.value) * planar;
    const dy = Math.sin(theta.current.value) * planar;
    if (lightRef.current) {
      lightRef.current.position.set(dx * 16, dy * 16, LIGHT_ELEVATION * 16);
    }
    if (envKeyRef.current) {
      envKeyRef.current.position.set(dx * 9, dy * 9, LIGHT_ELEVATION * 9);
      envKeyRef.current.lookAt(0, 0, 0);
    }
  });

  return (
    <>
      <directionalLight ref={lightRef} intensity={2.2} color="#f4f7ff" />
      {/* Live environment: the bright "window" lightformer moves with the
          cursor, so its reflection sweeps across the glass. */}
      <Environment frames={reduced ? 1 : Infinity} resolution={256}>
        <color attach="background" args={['#05070b']} />
        {/* Base glow: faint in deep space, lifted on the brighter backdrops
            so the glass reads as clear glass rather than a dark silhouette */}
        <Lightformer
          intensity={bright ? 0.45 : 0.07}
          scale={[30, 30, 1]}
          position={[0, 0, -14]}
          color={bright ? '#66738c' : '#2c3547'} />

        <group ref={envKeyRef} position={[6.5, 5.8, 2.3]}>
          <Lightformer form="rect" intensity={9} scale={[2.2, 11, 1]} color="#ffffff" />
        </group>
        {/* Cool rim from the opposite side, very dim */}
        <Lightformer
          form="rect"
          intensity={0.25}
          scale={[12, 2.5, 1]}
          position={[-8, -6, -6]}
          color="#6c5ce7"
          onUpdate={(self) => self.lookAt(0, 0, 0)} />

      </Environment>
    </>);

}

/* ------------------------------------------------------------------ */
/* Scene                                                               */
/* ------------------------------------------------------------------ */

type HeroSceneProps = {
  onNavigate: (target: string) => void;
  /** Render the clickable nav stars (desktop only). */
  showNodes: boolean;
  /** Stop the render loop, e.g. while a section overlay covers the hero. */
  paused?: boolean;
  /** PROTOTYPE: alternative backdrops, selected via ?bg= (see HeroBackdrops). */
  backdrop?: BackdropKind;
};

export function HeroScene({
  onNavigate,
  showNodes,
  paused,
  backdrop = 'space'
}: HeroSceneProps) {
  const reduced = useMediaQuery('(prefers-reduced-motion: reduce)');
  const wx = useWeather(backdrop === 'weather');
  const look = wx ? getWeatherLook(wx) : null;
  // Scene background also feeds the transmission buffer — it's what the
  // glass refracts, so it must be a real colour, never transparent black.
  const background = look ? look.bg : backdrop === 'nebula' ? '#131826' : '#0e1116';
  const showStars = look ? look.starry : true;
  const bloomThreshold = look ? look.bloomThreshold : backdrop === 'photo' ? 0.7 : 0.4;
  const bloomIntensity = look ? look.bloomIntensity : backdrop === 'photo' ? 0.7 : 1.2;
  return (
    <Canvas
      frameloop={paused ? 'never' : 'always'}
      dpr={[1, 1.75]}
      camera={{ position: [0, 0, 16], fov: 40 }}
      gl={{ antialias: true, alpha: true, powerPreference: 'high-performance' }}>

      <Suspense fallback={null}>
        <color attach="background" args={[background]} />
        {look && <WeatherBackdrop wx={wx!} />}
        {backdrop === 'photo' && <PhotoBackdrop name={photoFromUrl()} />}
        {backdrop === 'nebula' && <NameBacklight />}
        {/* Slight tilt so the rotation reads as depth, not a flat spin */}
        <group rotation={[-0.1, 0.05, 0]}>
          <RotatingField reduced={reduced}>
            {backdrop === 'nebula' && <NebulaBackdrop />}
            {showStars && <Starfield />}
            {showNodes && <NavStars onNavigate={onNavigate} />}
          </RotatingField>
        </group>
        <GlassName reduced={reduced} />
        <LightRig
          reduced={reduced}
          bright={backdrop === 'nebula' || backdrop === 'photo'} />

        {/* Bloom makes the raking glints ignite while the rest stays dark;
            bright backdrops raise the threshold so they don't wash out */}
        <EffectComposer>
          <Bloom
            mipmapBlur
            luminanceThreshold={bloomThreshold}
            intensity={bloomIntensity}
            levels={7} />

        </EffectComposer>
      </Suspense>
    </Canvas>);

}
