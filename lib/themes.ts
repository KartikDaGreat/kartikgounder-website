/**
 * The palette roulette. Each palette is a `data-theme` value styled in
 * globals.css; "default" means no data-theme at all.
 *
 * The pick has to happen before first paint, or the default palette flashes
 * before the chosen one. So it runs as an inline script in <head> (see
 * paletteScript, used by app/layout.tsx), built from these same lists.
 */

export const SUNRISE_THEMES = [
  "sunrise-peach",
  "sunrise-gold",
  "sunrise-coral",
  "sunrise-amber",
  "sunrise-blush",
  "sunrise-honey",
  "sunrise-apricot",
  "sunrise-mango",
  "sunrise-champagne",
  "sunrise-saffron",
  "sunrise-tangerine",
  "sunrise-dawn",
] as const

export const DAYLIGHT_THEMES = [
  "daylight-sky",
  "daylight-mint",
  "daylight-cloud",
  "daylight-aqua",
  "daylight-sage",
  "daylight-azure",
  "daylight-seafoam",
  "daylight-breeze",
  "daylight-teal",
  "daylight-cyan",
  "daylight-lagoon",
  "daylight-crystal",
] as const

export const SUNSET_THEMES = [
  "sunset-coral",
  "sunset-rose",
  "sunset-tangerine",
  "sunset-crimson",
  "sunset-magenta",
  "sunset-ember",
  "sunset-plum",
  "sunset-wine",
  "sunset-burgundy",
  "sunset-cherry",
  "sunset-copper",
  "sunset-dusk",
] as const

export const MIDNIGHT_THEMES = [
  "midnight-indigo",
  "midnight-navy",
  "midnight-plum",
  "midnight-void",
  "midnight-obsidian",
  "midnight-cosmos",
  "midnight-abyss",
  "midnight-eclipse",
  "midnight-onyx",
  "midnight-charcoal",
  "midnight-shadow",
  "midnight-storm",
] as const

export const BASE_THEMES = ["default", "warm", "ocean", "mono", "forest"] as const

/** Every palette the roulette can land on; "default" means no data-theme. */
export const ALL_PALETTES: string[] = [
  ...SUNRISE_THEMES,
  ...DAYLIGHT_THEMES,
  ...SUNSET_THEMES,
  ...MIDNIGHT_THEMES,
  ...BASE_THEMES,
]

/**
 * Runs before paint. A saved light/dark choice wins; otherwise 70% of visits
 * get a palette for the time of day and 30% get a base palette.
 */
export function paletteScript(): string {
  const lists = JSON.stringify({
    sunrise: SUNRISE_THEMES,
    daylight: DAYLIGHT_THEMES,
    sunset: SUNSET_THEMES,
    midnight: MIDNIGHT_THEMES,
    base: BASE_THEMES,
  })
  return `try{var d=document.documentElement,m=localStorage.getItem("themeMode");if(m==="light")d.setAttribute("data-theme","light-extreme");else if(m!=="dark"){var L=${lists},pick=function(a){return a[Math.floor(Math.random()*a.length)]},h=new Date().getHours(),t=Math.random()<0.7?pick(h>=5&&h<9?L.sunrise:h>=9&&h<17?L.daylight:h>=17&&h<20?L.sunset:L.midnight):pick(L.base);if(t!=="default")d.setAttribute("data-theme",t)}}catch(e){}`
}
