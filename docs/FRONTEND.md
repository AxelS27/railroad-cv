# Frontend

> Stack: Next.js (App Router) · React · TypeScript · Tailwind · Supabase · Vercel.
> Open this for any `apps/web` work. Goal: ship something that feels **professionally designed and human-made — not a generic AI site** (but still modern and sharp).

## Design Craft (read first)

The default failure mode of AI-built UIs is "generic." Don't ship that. The goal is a real product made by humans: calm, intentional, production-ready. Prioritize clarity, restraint, consistency, usability, and readability over decoration.

**Two tests to keep applying:** if a screen could be any AI demo, it is not done. If an element exists only to look "cool", it should not exist. Every visual element needs a reason.

**Target vibe:** a real product company website designed by experienced frontend engineers and product designers. It should feel structured, editorial, balanced, calm, professional, trustworthy, scalable, and production-ready.

### Forbidden patterns (the AI tells)

Do not use:
- Default violet/indigo gradients, glassmorphism, glow, or blur as decoration.
- Random horizontal dividers or decorative separators with no functional purpose.
- Emoji as UI/section markers, or excessive uppercase micro-labels.
- Cinematic or floating decorative text; fake futuristic styling.
- Decorative dual-colored headlines, split-color phrases, or mixed heading colors without a system.
- Decorative numbering like [01], [02].
- Random serif-italic fonts dropped in "for contrast".
- Untouched shadcn defaults (looks like every other demo).
- Symmetric filler card grids and centered-everything landing pages.
- Oversized hero sections, excessive empty space, or layouts where every section is perfectly centered.
- Floating UI elements, random cards, badges, and panels that do not carry real information.
- Fake dashboard aesthetics, Dribbble-style visual overload, experimental layouts with no UX purpose.
- Fade-in-on-everything motion, gratuitous parallax, constantly moving elements.
- Generic portfolio aesthetics: tiny centered labels, decorative rules, large type paired with thin filler copy, and vague skill cards.

### Do instead

- **Have an identity.** Commit to a real palette, a deliberate type scale, and a consistent spacing rhythm as design tokens, not Tailwind defaults sprinkled ad-hoc.
- **Customize components.** shadcn/ui is a starting point, not the look. Tune radius, weight, density, and color so it does not read as "default shadcn."
- **Keep typography stable.** One or two font families at most. No random font mixing, no decorative or serif-italic-for-aesthetics switches. Build hierarchy with spacing, weight, and size.
- **Lay out with structure.** Use a proper responsive grid, strong alignment, and clear section flow. Whitespace should create hierarchy; it should not become dead empty space.
- **Use asymmetry intentionally.** Avoid centering every section. A page can feel balanced while using offset columns, editorial rhythm, and varied section density.
- **Earn every effect.** Subtle, fast motion that supports usability. No heavy animation libs for a hover, no cinematic transitions. Users should notice smoothness, not the animation.
- **Respect hierarchy and whitespace.** One clear focal point per screen, intentional alignment, generous spacing. Polish over decoration.
- **Accessibility is craft.** Real focus states, sufficient contrast, keyboard paths. Pros do this, and it reads as human.

### Layout Checks

- Every section must answer: what is this for, what should the user notice, and what comes next?
- Cards must contain meaningful information or actions. If a card exists only to fill a grid, remove it.
- Keep borders, shadows, corner radius, and hover states restrained and consistent.
- Test mobile and desktop for stable spacing, readable line lengths, and no awkward empty zones.
- Prefer real product references and mature design systems over AI-generated landing page patterns.

## Theming & Color

All color lives in **one file**: `apps/web/src/styles/globals.css`. It is the single source of truth, so retheming or adding a brand is a one file change.

- Colors are **semantic CSS custom properties** (`--background`, `--primary`, `--muted`, ...), not raw values scattered through components.
- **Light theme** is defined in `:root`, **dark theme** in `.dark`. Same token names, different values, so switching themes never touches a component.
- Components reference **tokens only** (`bg-background`, `text-foreground`, `border-border`). Never hardcode hex, and never use raw palette classes like `bg-zinc-900`.
- One `--radius` knob controls roundness across the UI.

Wiring (done once, when the app is scaffolded):

1. Import `globals.css` in the root layout.
2. In `tailwind.config.ts`, set `darkMode: 'class'` and map the tokens to Tailwind colors:

   ```ts
   theme: {
     extend: {
       colors: {
         background: 'hsl(var(--background))',
         foreground: 'hsl(var(--foreground))',
         border: 'hsl(var(--border))',
         primary: { DEFAULT: 'hsl(var(--primary))', foreground: 'hsl(var(--primary-foreground))' },
         // same pattern for secondary, muted, accent, destructive, card, popover
       },
       borderRadius: {
         lg: 'var(--radius)',
         md: 'calc(var(--radius) - 2px)',
         sm: 'calc(var(--radius) - 4px)',
       },
     },
   }
   ```

3. Toggle by adding or removing `class="dark"` on `<html>`. Use `next-themes` (`<ThemeProvider attribute="class">`) for system plus manual switching.

To rebrand: edit the token values in `globals.css`. That is the only file you touch.

## Content & Copy

- All user facing copy is in **clear, standard English**.
- Use **conventional, well known terms** for features. Do not invent names or jargon for things that already have a common name (a "Sign in" button is "Sign in", not a coined word).
- **No em dash** in UI copy or content. Use a comma, a period, a plain hyphen, or rephrase. Keep punctuation clean and standard.
- **Minimize emoji** and skip decorative symbols. Use an emoji only when it carries real meaning, never as decoration or a section marker.
- Avoid AI-sounding marketing language, fake technical terminology, and meme-style writing. Keep wording concise, natural, and familiar.
- Avoid generic phrases such as "crafting digital experiences", "building with passion", "clarity and purpose", and "innovative solutions".
- Do not use placeholder content, fake feature names, or invented labels when normal product language would be clearer.

## Internationalization (i18n)

User-facing text is centralized, never hardcoded in components. This keeps copy consistent and makes adding a language a one-file job.

- Text lives in `apps/web/src/i18n/locales/<locale>.json`, one file per language (`en.json`, `id.json`, ...).
- **English (`en`) is the default and the source of truth.** To add a language, copy `en.json`, translate the values, and keep the keys identical.
- Locales and the default are declared in `apps/web/src/i18n/config.ts`. Add the language there, then add its loader in `dictionaries.ts`.
- Components read text through the dictionary, which is typed from `en.json`, so a missing or renamed key becomes a type error:

  ```tsx
  import { getDictionary } from '@/i18n/dictionaries';
  import type { Locale } from '@/i18n/config';

  export default async function Page({ params }: { params: { lang: Locale } }) {
    const t = await getDictionary(params.lang);
    return <h1>{t.app.tagline}</h1>;
  }
  ```

- **Routing:** the active locale lives in the URL under `app/[lang]/...`. A small middleware redirects `/` to the default locale and can honor the visitor's `Accept-Language`.
- **Switcher:** the language selector links to the current path under another locale, so changing language keeps the user on the same page.
- Keep each full phrase as one key. Do not build sentences by concatenating translated fragments, since other languages order words differently.

## Rendering Strategy

- **Server Components by default.** Reach for `'use client'` only when you actually need interactivity, browser APIs, local state, animation, or realtime.
- Don't make a whole page client-side for one interactive widget — push the client boundary down to the smallest leaf.

## Data Fetching

- Fetch on the **server** whenever possible; keep client-side fetching minimal.
- No duplicate server + client requests for the same data.
- Use streaming / progressive rendering where it improves perceived speed.
- Use `loading.tsx` with designed **skeletons** (not bare spinners).

## Code Splitting

- Lazy-load heavy / non-critical features: charts, editors, maps, modals, media viewers, admin tools.
- Don't pull large libraries into the initial bundle unless they're needed above the fold.

## Performance

Optimize for, in order: (1) fast initial load, (2) responsive interactions, (3) smooth navigation, (4) minimal hydration, (5) small bundle.

Avoid: unnecessary client state, deeply nested providers, excessive re-renders, animation libs everywhere, heavy deps for simple tasks.

## Images

- Use `next/image` for anything non-trivial; lazy-load below-the-fold media.
- Compress assets, no oversized files, and set dimensions to avoid layout shift.

## States & Responsiveness

- Always design **loading, empty, and error** states — not just the happy path.
- Transitions subtle and fast.
- Responsive at every breakpoint (test mobile → desktop).

## Deployment Mindset

Build for **stable, scalable, maintainable, production-ready** on Vercel. Not experimental, not overengineered.
