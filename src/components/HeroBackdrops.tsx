import React, { useEffect, useMemo, useRef, useState } from 'react';
import * as THREE from 'three';
import { useFrame, useLoader, useThree } from '@react-three/fiber';

/**
 * PROTOTYPE hero backdrops, selected with ?bg= on the home route:
 *   ?bg=nebula   — dense galactic band + space-cloud hues behind the name
 *   ?bg=photo    — photoreal JWST imagery (&img=carina|pillars|tarantula)
 *   ?bg=weather  — sky driven by live local weather + season (Open-Meteo via
 *                  IP geolocation). Force a look with &wx=<kind>-<day|night>,
 *                  e.g. ?bg=weather&wx=rain-night, wx=snow-day, wx=clear-day.
 */

export type BackdropKind = 'space' | 'nebula' | 'weather' | 'photo';

export function backdropFromUrl(): BackdropKind {
  if (typeof window === 'undefined') return 'space';
  const b = new URLSearchParams(window.location.search).get('bg');
  return b === 'nebula' || b === 'weather' || b === 'photo' ? b : 'space';
}

/* ------------------------------------------------------------------ */
/* Small utilities (kept local — this whole file is a prototype)       */
/* ------------------------------------------------------------------ */

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

function makeBlobTexture(
  size: number,
  blobs: number,
  colors: string[],
  seed: number,
  maxAlpha = 0.12
) {
  const c = document.createElement('canvas');
  c.width = c.height = size;
  const ctx = c.getContext('2d')!;
  const rand = mulberry32(seed);
  ctx.globalCompositeOperation = 'lighter';
  const tmp = new THREE.Color();
  for (let i = 0; i < blobs; i++) {
    // Cluster blobs toward the centre so sprite edges fade out.
    const x = size * (0.5 + (rand() + rand() - 1) * 0.3);
    const y = size * (0.5 + (rand() + rand() - 1) * 0.3);
    const r = size * (0.12 + rand() * 0.22);
    tmp.set(colors[Math.floor(rand() * colors.length)]);
    const a = maxAlpha * (0.4 + rand() * 0.6);
    const g = ctx.createRadialGradient(x, y, 0, x, y, r);
    g.addColorStop(0, `rgba(${tmp.r * 255 | 0},${tmp.g * 255 | 0},${tmp.b * 255 | 0},${a})`);
    g.addColorStop(1, `rgba(${tmp.r * 255 | 0},${tmp.g * 255 | 0},${tmp.b * 255 | 0},0)`);
    ctx.fillStyle = g;
    ctx.beginPath();
    ctx.arc(x, y, r, 0, Math.PI * 2);
    ctx.fill();
  }
  return new THREE.CanvasTexture(c);
}

function makeSoftDotTexture(size = 64) {
  const c = document.createElement('canvas');
  c.width = c.height = size;
  const ctx = c.getContext('2d')!;
  const g = ctx.createRadialGradient(size / 2, size / 2, 0, size / 2, size / 2, size / 2);
  g.addColorStop(0, 'rgba(255,255,255,1)');
  g.addColorStop(0.4, 'rgba(255,255,255,0.5)');
  g.addColorStop(1, 'rgba(255,255,255,0)');
  ctx.fillStyle = g;
  ctx.fillRect(0, 0, size, size);
  return new THREE.CanvasTexture(c);
}

function makeStreakTexture() {
  const c = document.createElement('canvas');
  c.width = 8;
  c.height = 64;
  const ctx = c.getContext('2d')!;
  const g = ctx.createLinearGradient(0, 0, 0, 64);
  g.addColorStop(0, 'rgba(255,255,255,0)');
  g.addColorStop(0.5, 'rgba(255,255,255,0.9)');
  g.addColorStop(1, 'rgba(255,255,255,0)');
  ctx.fillStyle = g;
  ctx.fillRect(2, 0, 4, 64);
  return new THREE.CanvasTexture(c);
}

/* ------------------------------------------------------------------ */
/* Prototype A — galaxy density + nebula hues                          */
/* ------------------------------------------------------------------ */

const NEBULA_HUES = {
  electric: ['#6c5ce7', '#8d7bff', '#4436a8'],
  signal: ['#00b894', '#1fd2ae', '#0b6b58'],
  deep: ['#26436e', '#3c5f96', '#182a4a'],
  ember: ['#ff5a2c', '#c74a20', '#7a2f14']
};

function gauss(rand: () => number) {
  // Box–Muller, one sample.
  const u = Math.max(rand(), 1e-6);
  const v = rand();
  return Math.sqrt(-2 * Math.log(u)) * Math.cos(2 * Math.PI * v);
}

/** A dense, tilted galactic band of stars. */
function GalaxyBand() {
  const dot = useMemo(() => makeSoftDotTexture(), []);
  const { core, sparkle } = useMemo(() => {
    const rand = mulberry32(77);
    const make = (count: number, spread: number) => {
      const pos = new Float32Array(count * 3);
      for (let i = 0; i < count; i++) {
        const t = rand() * 2 - 1; // along the band
        pos[i * 3] = t * 46;
        // Thicker toward the middle of the band, like a galactic bulge.
        pos[i * 3 + 1] = gauss(rand) * spread * (1.2 - Math.abs(t) * 0.7);
        pos[i * 3 + 2] = -14 - rand() * 18;
      }
      return pos;
    };
    return { core: make(1700, 2.6), sparkle: make(420, 3.4) };
  }, []);
  useEffect(() => () => dot.dispose(), [dot]);
  return (
    // Tilted across the screen so it reads as a galaxy, not a horizon.
    <group rotation={[0, 0, -0.42]}>
      <points>
        <bufferGeometry>
          <bufferAttribute attach="attributes-position" count={core.length / 3} array={core} itemSize={3} />
        </bufferGeometry>
        <pointsMaterial
          map={dot}
          size={0.1}
          sizeAttenuation
          transparent
          opacity={0.75}
          depthWrite={false}
          blending={THREE.AdditiveBlending}
          color="#dfe6f2" />

      </points>
      <points>
        <bufferGeometry>
          <bufferAttribute attach="attributes-position" count={sparkle.length / 3} array={sparkle} itemSize={3} />
        </bufferGeometry>
        <pointsMaterial
          map={dot}
          size={0.24}
          sizeAttenuation
          transparent
          opacity={0.9}
          depthWrite={false}
          blending={THREE.AdditiveBlending}
          color="#f2ecdc" />

      </points>
    </group>);

}

type NebulaSpec = {
  hues: keyof typeof NEBULA_HUES;
  x: number;
  y: number;
  z: number;
  s: number;
  o: number;
  seed: number;
};

const NEBULAE: NebulaSpec[] = [
{ hues: 'electric', x: -16, y: 7, z: -30, s: 42, o: 0.75, seed: 3 },
{ hues: 'deep', x: 14, y: -3, z: -34, s: 52, o: 0.8, seed: 8 },
{ hues: 'signal', x: 22, y: 10, z: -28, s: 30, o: 0.55, seed: 13 },
{ hues: 'electric', x: -4, y: -11, z: -26, s: 30, o: 0.5, seed: 21 },
{ hues: 'ember', x: -26, y: -6, z: -32, s: 24, o: 0.4, seed: 34 },
{ hues: 'deep', x: 2, y: 14, z: -36, s: 44, o: 0.65, seed: 55 }];


/** Prototype A: render inside the rotating sky group. */
export function NebulaBackdrop() {
  const textures = useMemo(
    () => NEBULAE.map((n) => makeBlobTexture(512, 26, NEBULA_HUES[n.hues], n.seed)),
    []
  );
  useEffect(() => () => textures.forEach((t) => t.dispose()), [textures]);
  const dot = useMemo(() => makeSoftDotTexture(), []);
  // Extra all-sky density on top of the band.
  const dust = useMemo(() => {
    const rand = mulberry32(101);
    const pos = new Float32Array(900 * 3);
    for (let i = 0; i < 900; i++) {
      const r = Math.sqrt(THREE.MathUtils.lerp(4, 1600, rand()));
      const a = rand() * Math.PI * 2;
      pos[i * 3] = Math.cos(a) * r;
      pos[i * 3 + 1] = Math.sin(a) * r;
      pos[i * 3 + 2] = -10 - rand() * 24;
    }
    return pos;
  }, []);
  return (
    <>
      {NEBULAE.map((n, i) =>
      <sprite key={i} position={[n.x, n.y, n.z]} scale={[n.s, n.s * 0.72, 1]}>
          <spriteMaterial
          map={textures[i]}
          transparent
          opacity={n.o}
          depthWrite={false}
          blending={THREE.AdditiveBlending} />

        </sprite>
      )}
      <GalaxyBand />
      <points>
        <bufferGeometry>
          <bufferAttribute attach="attributes-position" count={dust.length / 3} array={dust} itemSize={3} />
        </bufferGeometry>
        <pointsMaterial
          map={dot}
          size={0.09}
          sizeAttenuation
          transparent
          opacity={0.55}
          depthWrite={false}
          blending={THREE.AdditiveBlending}
          color="#aab6cc" />

      </points>
    </>);

}

/** Soft luminous glow straight behind the name — gives the transmission
 *  material something bright to refract, which is what makes the glass read
 *  as *clear* glass instead of a dark obelisk. */
export function NameBacklight({
  color = '#93a7d6',
  opacity = 0.32
}: {
  color?: string;
  opacity?: number;
}) {
  const halo = useMemo(() => {
    // Softer falloff than makeSoftDotTexture so it reads as a glow, not a blob.
    const c = document.createElement('canvas');
    c.width = c.height = 256;
    const ctx = c.getContext('2d')!;
    const g = ctx.createRadialGradient(128, 128, 0, 128, 128, 128);
    g.addColorStop(0, 'rgba(255,255,255,0.85)');
    g.addColorStop(0.25, 'rgba(255,255,255,0.35)');
    g.addColorStop(0.55, 'rgba(255,255,255,0.1)');
    g.addColorStop(1, 'rgba(255,255,255,0)');
    ctx.fillStyle = g;
    ctx.fillRect(0, 0, 256, 256);
    return new THREE.CanvasTexture(c);
  }, []);
  useEffect(() => () => halo.dispose(), [halo]);
  return (
    <sprite position={[0, -0.5, -16]} scale={[26, 15, 1]}>
      <spriteMaterial
        map={halo}
        transparent
        opacity={opacity}
        depthWrite={false}
        blending={THREE.AdditiveBlending}
        color={color} />

    </sprite>);

}

/* ------------------------------------------------------------------ */
/* Prototype C — photoreal JWST imagery                                */
/* ------------------------------------------------------------------ */

// Self-hosted crops of ESA/Webb releases (NASA, ESA, CSA, STScI — CC BY 4.0):
// carina = Cosmic Cliffs (weic2205a), pillars = Pillars of Creation
// (weic2216a), tarantula = Tarantula Nebula (weic2212a).
const PHOTOS = ['carina', 'pillars', 'tarantula'] as const;
export type PhotoName = (typeof PHOTOS)[number];

export function photoFromUrl(): PhotoName {
  if (typeof window === 'undefined') return 'carina';
  const p = new URLSearchParams(window.location.search).get('img');
  return PHOTOS.includes(p as PhotoName) ? p as PhotoName : 'carina';
}

const PHOTO_Z = -45;

/** Full-bleed photographic plane with a slow drift + pointer parallax. */
export function PhotoBackdrop({ name }: { name: PhotoName }) {
  const texture = useLoader(
    THREE.TextureLoader,
    `${import.meta.env.BASE_URL}backdrops/${name}.jpg`
  );
  texture.colorSpace = THREE.SRGBColorSpace;
  const meshRef = useRef<THREE.Mesh>(null);
  const { camera } = useThree();
  const { width: vw, height: vh } = useThree((s) =>
  s.viewport.getCurrentViewport(camera, new THREE.Vector3(0, 0, PHOTO_Z))
  );
  // Cover-fit the image to the viewport at its depth, with margin for drift.
  const img = texture.image as HTMLImageElement;
  const aspect = img.width / img.height;
  let w = vw;
  let h = w / aspect;
  if (h < vh) {
    h = vh;
    w = h * aspect;
  }
  w *= 1.14;
  h *= 1.14;
  useFrame((state) => {
    const m = meshRef.current;
    if (!m) return;
    const t = state.clock.elapsedTime;
    // Ken-Burns style drift plus a whisper of parallax opposite the cursor.
    m.position.x = Math.sin(t * 0.02) * (w * 0.02) - state.pointer.x * w * 0.012;
    m.position.y = Math.cos(t * 0.016) * (h * 0.015) - state.pointer.y * h * 0.012;
  });
  return (
    <mesh ref={meshRef} position={[0, 0, PHOTO_Z]}>
      <planeGeometry args={[w, h]} />
      <meshBasicMaterial map={texture} depthWrite={false} toneMapped={false} />
    </mesh>);

}

/* ------------------------------------------------------------------ */
/* Prototype B — weather / season sky                                  */
/* ------------------------------------------------------------------ */

export type WxKind = 'clear' | 'cloudy' | 'rain' | 'snow';
export type Season = 'spring' | 'summer' | 'autumn' | 'winter';
export type Weather = {
  kind: WxKind;
  isDay: boolean;
  season: Season;
  source: 'live' | 'override' | 'fallback';
};

function seasonFor(month: number, latitude: number): Season {
  const north: Season[] = ['winter', 'winter', 'spring', 'spring', 'spring', 'summer', 'summer', 'summer', 'autumn', 'autumn', 'autumn', 'winter'];
  const s = north[month];
  if (latitude >= 0) return s;
  const flip: Record<Season, Season> = { winter: 'summer', summer: 'winter', spring: 'autumn', autumn: 'spring' };
  return flip[s];
}

function codeToKind(code: number): WxKind {
  if (code >= 71 && code <= 77 || code === 85 || code === 86) return 'snow';
  if (code >= 51 && code <= 67 || code >= 80 && code <= 82 || code >= 95) return 'rain';
  if (code >= 2) return 'cloudy';
  return 'clear';
}

async function fetchJson(url: string, timeoutMs: number) {
  const ctrl = new AbortController();
  const timer = setTimeout(() => ctrl.abort(), timeoutMs);
  try {
    const res = await fetch(url, { signal: ctrl.signal });
    if (!res.ok) throw new Error(String(res.status));
    return await res.json();
  } finally {
    clearTimeout(timer);
  }
}

/** Live weather (IP geolocation → Open-Meteo), or the ?wx= override. */
export function useWeather(enabled: boolean): Weather | null {
  const [wx, setWx] = useState<Weather | null>(null);
  useEffect(() => {
    if (!enabled) return;
    const month = new Date().getMonth();
    const override = new URLSearchParams(window.location.search).get('wx');
    if (override) {
      const [kind, daypart] = override.split('-');
      const kinds: WxKind[] = ['clear', 'cloudy', 'rain', 'snow'];
      setWx({
        kind: kinds.includes(kind as WxKind) ? kind as WxKind : 'clear',
        isDay: daypart !== 'night',
        season: seasonFor(month, 51),
        source: 'override'
      });
      return;
    }
    let cancelled = false;
    (async () => {
      try {
        const geo = await fetchJson('https://ipapi.co/json/', 3500);
        const lat = typeof geo.latitude === 'number' ? geo.latitude : 51.5;
        const lon = typeof geo.longitude === 'number' ? geo.longitude : -0.1;
        const met = await fetchJson(
          `https://api.open-meteo.com/v1/forecast?latitude=${lat}&longitude=${lon}&current=weather_code,is_day`,
          4500
        );
        if (cancelled) return;
        setWx({
          kind: codeToKind(met.current.weather_code),
          isDay: met.current.is_day === 1,
          season: seasonFor(month, lat),
          source: 'live'
        });
      } catch {
        if (cancelled) return;
        const hour = new Date().getHours();
        setWx({
          kind: 'clear',
          isDay: hour >= 7 && hour < 20,
          season: seasonFor(month, 51),
          source: 'fallback'
        });
      }
    })();
    return () => {
      cancelled = true;
    };
  }, [enabled]);
  return enabled ? wx : null;
}

export type WeatherLook = {
  bg: string;
  top: string;
  horizon: string;
  starry: boolean;
  body: 'sun' | 'moon' | null;
  clouds: { count: number; color: string; opacity: number };
  precip: 'rain' | 'snow' | null;
  bloomThreshold: number;
  bloomIntensity: number;
};

const CLEAR_DAY_SKIES: Record<Season, [string, string]> = {
  spring: ['#7fb0e0', '#e8f2fb'],
  summer: ['#4f97dd', '#d6ecf7'],
  autumn: ['#7d94bd', '#f4dcb4'],
  winter: ['#a3b8d4', '#eef3f9']
};

export function getWeatherLook(wx: Weather): WeatherLook {
  const day = wx.isDay;
  if (wx.kind === 'clear') {
    if (day) {
      const [top, horizon] = CLEAR_DAY_SKIES[wx.season];
      return {
        bg: top, top, horizon, starry: false, body: 'sun',
        clouds: { count: 3, color: '#ffffff', opacity: 0.22 },
        precip: null, bloomThreshold: 0.92, bloomIntensity: 0.55
      };
    }
    return {
      bg: '#0c1322', top: '#0c1322', horizon: '#22314e', starry: true, body: 'moon',
      clouds: { count: 2, color: '#8fa0bd', opacity: 0.12 },
      precip: null, bloomThreshold: 0.4, bloomIntensity: 1.2
    };
  }
  if (wx.kind === 'cloudy') {
    return day ?
    {
      bg: '#93a0b4', top: '#93a0b4', horizon: '#dfe4ea', starry: false, body: 'sun',
      clouds: { count: 9, color: '#f4f6f9', opacity: 0.5 },
      precip: null, bloomThreshold: 0.95, bloomIntensity: 0.4
    } :
    {
      bg: '#0d1119', top: '#0d1119', horizon: '#1d2634', starry: false, body: 'moon',
      clouds: { count: 8, color: '#3a4557', opacity: 0.45 },
      precip: null, bloomThreshold: 0.45, bloomIntensity: 1
    };
  }
  if (wx.kind === 'rain') {
    return day ?
    {
      bg: '#5f6b7c', top: '#5f6b7c', horizon: '#a8b2c0', starry: false, body: null,
      clouds: { count: 10, color: '#7e8a9b', opacity: 0.6 },
      precip: 'rain', bloomThreshold: 0.9, bloomIntensity: 0.45
    } :
    {
      bg: '#0a0e16', top: '#0a0e16', horizon: '#1a222f', starry: false, body: null,
      clouds: { count: 9, color: '#232d3d', opacity: 0.55 },
      precip: 'rain', bloomThreshold: 0.45, bloomIntensity: 1
    };
  }
  // snow
  return wx.isDay ?
  {
    bg: '#b3bfd0', top: '#b3bfd0', horizon: '#f0f4f9', starry: false, body: null,
    clouds: { count: 7, color: '#dde4ee', opacity: 0.5 },
    precip: 'snow', bloomThreshold: 0.95, bloomIntensity: 0.4
  } :
  {
    bg: '#141a26', top: '#141a26', horizon: '#2a3448', starry: false, body: null,
    clouds: { count: 6, color: '#33405a', opacity: 0.4 },
    precip: 'snow', bloomThreshold: 0.5, bloomIntensity: 0.9
  };
}

function SkyGradient({ top, horizon }: { top: string; horizon: string }) {
  const texture = useMemo(() => {
    const c = document.createElement('canvas');
    c.width = 2;
    c.height = 256;
    const ctx = c.getContext('2d')!;
    const g = ctx.createLinearGradient(0, 0, 0, 256);
    g.addColorStop(0, top);
    g.addColorStop(0.72, horizon);
    g.addColorStop(1, horizon);
    ctx.fillStyle = g;
    ctx.fillRect(0, 0, 2, 256);
    return new THREE.CanvasTexture(c);
  }, [top, horizon]);
  useEffect(() => () => texture.dispose(), [texture]);
  return (
    <mesh position={[0, 0, -44]}>
      <planeGeometry args={[240, 130]} />
      <meshBasicMaterial map={texture} depthWrite={false} toneMapped={false} />
    </mesh>);

}

function SunMoon({ body }: { body: 'sun' | 'moon' }) {
  const halo = useMemo(() => makeSoftDotTexture(128), []);
  useEffect(() => () => halo.dispose(), [halo]);
  const sun = body === 'sun';
  return (
    <group position={[10, 6.5, -34]}>
      <sprite scale={sun ? [16, 16, 1] : [7, 7, 1]}>
        <spriteMaterial
          map={halo}
          transparent
          opacity={sun ? 0.85 : 0.4}
          depthWrite={false}
          blending={THREE.AdditiveBlending}
          color={sun ? '#fff3d6' : '#cfdcf2'} />

      </sprite>
      <sprite scale={sun ? [4.6, 4.6, 1] : [3.4, 3.4, 1]}>
        <spriteMaterial
          map={halo}
          transparent
          opacity={1}
          depthWrite={false}
          blending={THREE.AdditiveBlending}
          color={sun ? '#fffdf4' : '#e8eefa'} />

      </sprite>
    </group>);

}

function CloudLayer({ count, color, opacity }: WeatherLook['clouds']) {
  const texture = useMemo(() => makeBlobTexture(256, 18, ['#ffffff'], 5, 0.16), []);
  useEffect(() => () => texture.dispose(), [texture]);
  const groupRef = useRef<THREE.Group>(null);
  const specs = useMemo(() => {
    const rand = mulberry32(19);
    return Array.from({ length: count }, () => ({
      x: (rand() * 2 - 1) * 30,
      y: 1 + rand() * 11,
      z: -18 - rand() * 12,
      w: 14 + rand() * 16,
      h: 4 + rand() * 3.5,
      speed: 0.12 + rand() * 0.25,
      o: opacity * (0.6 + rand() * 0.4)
    }));
  }, [count, opacity]);
  useFrame((_, delta) => {
    const g = groupRef.current;
    if (!g) return;
    g.children.forEach((child, i) => {
      child.position.x += specs[i].speed * delta;
      if (child.position.x > 38) child.position.x = -38;
    });
  });
  return (
    <group ref={groupRef}>
      {specs.map((s, i) =>
      <sprite key={i} position={[s.x, s.y, s.z]} scale={[s.w, s.h, 1]}>
          <spriteMaterial
          map={texture}
          transparent
          opacity={s.o}
          depthWrite={false}
          color={color} />

        </sprite>
      )}
    </group>);

}

function Precip({ kind }: { kind: 'rain' | 'snow' }) {
  const rain = kind === 'rain';
  const count = rain ? 550 : 340;
  const texture = useMemo(
    () => rain ? makeStreakTexture() : makeSoftDotTexture(32),
    [rain]
  );
  useEffect(() => () => texture.dispose(), [texture]);
  const geoRef = useRef<THREE.BufferGeometry>(null);
  const data = useMemo(() => {
    const rand = mulberry32(rain ? 7 : 9);
    const pos = new Float32Array(count * 3);
    const phase = new Float32Array(count);
    for (let i = 0; i < count; i++) {
      pos[i * 3] = (rand() * 2 - 1) * 24;
      pos[i * 3 + 1] = (rand() * 2 - 1) * 14;
      pos[i * 3 + 2] = -16 + rand() * 11;
      phase[i] = rand() * Math.PI * 2;
    }
    return { pos, phase };
  }, [count, rain]);
  useFrame((state, delta) => {
    const t = state.clock.elapsedTime;
    const p = data.pos;
    const vy = rain ? 17 : 1.4;
    for (let i = 0; i < count; i++) {
      p[i * 3 + 1] -= vy * delta;
      p[i * 3] += rain ?
      -delta * 1.6 :
      Math.sin(t * 0.8 + data.phase[i]) * delta * 0.7;
      if (p[i * 3 + 1] < -14) p[i * 3 + 1] = 14;
      if (p[i * 3] < -24) p[i * 3] = 24;
    }
    if (geoRef.current) geoRef.current.attributes.position.needsUpdate = true;
  });
  return (
    <points frustumCulled={false}>
      <bufferGeometry ref={geoRef}>
        <bufferAttribute attach="attributes-position" count={count} array={data.pos} itemSize={3} />
      </bufferGeometry>
      <pointsMaterial
        map={texture}
        size={rain ? 0.55 : 0.2}
        sizeAttenuation
        transparent
        opacity={rain ? 0.45 : 0.85}
        depthWrite={false}
        color={rain ? '#cdd9ea' : '#ffffff'} />

    </points>);

}

/** Prototype B: render outside the rotating sky group (skies don't spin). */
export function WeatherBackdrop({ wx }: { wx: Weather }) {
  const look = getWeatherLook(wx);
  return (
    <>
      <SkyGradient top={look.top} horizon={look.horizon} />
      {look.body && <SunMoon body={look.body} />}
      <CloudLayer {...look.clouds} />
      {look.precip && <Precip kind={look.precip} />}
    </>);

}
