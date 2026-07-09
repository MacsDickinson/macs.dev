/**
 * Hero backdrop + glass configuration.
 *
 * To add a new backdrop image: drop a wallpaper-sized JPEG (~1920×1200,
 * ≲1 MB) into `public/backdrops/` and register it in HERO_IMAGES with a
 * credit line (ESA/Webb and ESA/Hubble releases are CC BY 4.0 — the credit
 * renders in the hero's corner, so keep it accurate).
 */

export const HERO_IMAGES = {
  tarantula: {
    file: 'tarantula.jpg',
    credit: 'Tarantula Nebula — NASA, ESA, CSA, STScI / JWST'
  },
  carina: {
    file: 'carina.jpg',
    credit: 'Cosmic Cliffs, Carina Nebula — NASA, ESA, CSA, STScI / JWST'
  },
  pillars: {
    file: 'pillars.jpg',
    credit: 'Pillars of Creation — NASA, ESA, CSA, STScI / JWST'
  }
} as const;

export type HeroImageKey = keyof typeof HERO_IMAGES;

export const DEFAULT_IMAGE: HeroImageKey = 'tarantula';

/**
 * Show a specific image on specific days.
 * Keys: 'YYYY-MM-DD' for a one-off date, 'MM-DD' for every year.
 * Exact dates win over annual ones.
 */
export const IMAGE_SCHEDULE: Record<string, HeroImageKey> = {
  // '12-25': 'carina',
  // '2026-10-31': 'pillars',
};

export function heroImageForDate(date: Date = new Date()) {
  const mm = String(date.getMonth() + 1).padStart(2, '0');
  const dd = String(date.getDate()).padStart(2, '0');
  const annual = `${mm}-${dd}`;
  const exact = `${date.getFullYear()}-${annual}`;
  const key = IMAGE_SCHEDULE[exact] ?? IMAGE_SCHEDULE[annual] ?? DEFAULT_IMAGE;
  return { key, ...HERO_IMAGES[key] };
}

/**
 * The name's glass material. `preset` picks a recipe (defined in
 * HeroScene's GLASS_MATERIALS); the optional fields override it:
 *   roughness 0–1 (surface frost), thickness 0–2 (refraction strength),
 *   tint '#rrggbb' (glass colour — darker reads smokier/more solid).
 */
export type GlassConfig = {
  preset: 'clear' | 'frosted' | 'smoke' | 'obsidian';
  roughness?: number;
  thickness?: number;
  tint?: string;
};

export const HERO_GLASS: GlassConfig = {
  preset: 'obsidian'
};
