# portfolio. working context

Astro 5 + Tailwind v4 site. Dark, cinematic, motion-rich. Ships to GitHub Pages at
`https://ajeenkya.github.io` via the workflow in `.github/workflows/deploy.yml`.

## Where things live
- `src/data/site.ts`: all content (bio, stats, projects, experience, skills, AI stack).
  Edit content here, not in components.
- `src/styles/global.css`: Tailwind v4 `@theme` tokens, glass / grain / glow utilities,
  reveal-on-scroll animation, gradient text.
- `src/layouts/BaseLayout.astro`: meta + global scroll/reveal/parallax JS.
- `src/components/*`: one file per section (Hero, About, Projects, Experience, Skills,
  AIStack, Contact). Nav is a fixed glass pill.
- `public/`: favicon + `aj-bhatalkar-resume.pdf` (linked from hero + contact CTAs).
- `seed/`: original Gamma export the site was inspired by. Reference only.

## Conventions
- Content edits = `src/data/site.ts`.
- Color/typography tokens = `@theme` block in `global.css`.
- New section = new component + register in `src/pages/index.astro`.
- Animation: add `class="reveal"` to anything you want to fade-up on scroll.
  Parallax: `data-parallax="0.1"` (negative for upward drift).

## Commands
- `npm run dev`. local at http://localhost:4321
- `npm run build`. static build to `dist/`
- Push to `main` triggers the Pages deploy.
