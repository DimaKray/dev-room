# Developer's Room

An interactive 3D portfolio: a cartoon cabin in the forest that you can walk into. Inside, every object is a section of the portfolio: the monitor shows projects, the shelf holds skills, the cat tells the story, the plant holds the contacts.

> Add a screen recording here: `docs/preview.gif` (see "Screenshots" below).

**Live demo:** https://dev-room.vercel.app (replace with your URL)

## Features

- **3D scene in Vue.** Cabin, forest, pond and a furnished room built from primitives with TresJS (Three.js for Vue). There are no 3D model files: everything is code.
- **Cartoon look.** Toon materials with stepped shading, black outlines (inverted hull) and procedural textures drawn on canvas: wood grain, logs, shingles, brick, cobblestone, fur, quilting.
- **Camera choreography.** One GSAP-driven camera rig: a fly-in over the forest, then the door opens, the roof lifts and the walls sink into the ground as the camera enters the room.
- **Alive details.** The cat follows the cursor, blinks and falls asleep; the monitor types code; the lamp toggles on click; fireflies, smoke, ponds, ripples.
- **Day, night and weather.** Time-of-day lighting (initial state from local time), rain with lightning and thunder, snow. Sky with sun, moon, clouds and stars.
- **Sound without files.** Purring, clicks, birds, crickets, rain, wind and thunder are synthesized with the Web Audio API.
- **UA / EN.** A lightweight typed i18n layer; titles and meta tags change with the language.
- **Simple version.** A semantic HTML page with the same content. It is always in the DOM (visually hidden in 3D mode), so search engines and screen readers get real text. It also becomes the default when WebGL is unavailable.
- **Performance tiers.** Phones and low-memory devices get fewer trees, lighter shadows and a capped pixel ratio (`?quality=low` / `?quality=high` to force).
- **Accessibility.** `prefers-reduced-motion` disables camera flights and parallax, keyboard-friendly controls, ARIA labels, the simple version as an alternative.
- **Easter eggs.** Try the Konami code, or click the sun/moon five times.

## Stack

Vue 3 · TypeScript · Vite · TresJS · Three.js · Pinia · GSAP · Web Audio API

## Run

```bash
npm install
npm run dev
```

Build for production:

```bash
npm run build
npm run preview
```

## Deploy (Vercel)

1. Push the repository to GitHub.
2. In Vercel choose **Add New Project** and import the repository. Vite is detected automatically (build `npm run build`, output `dist`).
3. Add the environment variable `VITE_SITE_URL` with your final address, for example `https://your-name.vercel.app`. It is used for the canonical URL, Open Graph tags, `sitemap.xml` and `robots.txt`.
4. Deploy, then submit the sitemap in Google Search Console.

## Project structure

```
src/
  components/
    scene/    3D: Room, Cabin, Forest, Weather, CameraRig, Part (toon + outline + texture)
    ui/       HUD, panels, sky, simple page, toast, fireworks
  data/       bilingual content: projects, skills, profile, camera spots
  lib/        audio (sound, ambient), pointer, perf tiers
  stores/     Pinia: focus, mode, weather, lamp, language-independent UI state
  i18n.ts     tiny typed i18n
public/       favicon, social image, CV
```

## How it works (short notes)

- **Outlines.** Each object (`Part.vue`) renders a slightly larger copy with back faces only and a dark color, which gives a clean outline without post-processing. Hovered objects switch it to neon cyan.
- **Textures.** `textures.ts` draws detail maps on canvas and multiplies them by the material color, so one wood texture serves every wooden object. Box UVs are rescaled to world units, so patterns never stretch.
- **One light model.** Day/night, weather and the lamp are three numbers animated by GSAP; every light intensity and color is derived from them.
- **SEO for a canvas app.** The same data that drives the 3D panels renders the simple HTML page, plus JSON-LD (`Person`), canonical, Open Graph and generated `robots.txt` / `sitemap.xml`.

## Screenshots

Add `docs/preview.gif` (outside view, entering the house, day/night, rain) and a couple of PNGs, then reference them at the top of this file.

## Credits

All geometry, textures and sounds are generated in code. Font: Space Grotesk (via `@fontsource-variable/space-grotesk`, OFL).
