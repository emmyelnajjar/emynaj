# EMYNAJ website

Emmy Elnajjar's website, rebuilt with React + Vite, GSAP ScrollTrigger, Lenis smooth scroll and React Bits components.

## Run it on your computer

You need Node.js 20 or newer.

```bash
npm install
npm run dev        # opens a live preview at http://localhost:5173
```

## Make the final website files

```bash
npm run build      # puts the finished site in the dist/ folder
npm run preview    # check the finished site at http://localhost:4173
```

Upload everything inside `dist/` to your web host (Netlify, Vercel, Hostinger, cPanel and so on).
The `dist/index.html` file will not work if you double click it. It has to be served by a web host or `npm run preview`.

## One single file (open by double click)

```bash
npm run build:single
```

This makes `emynaj-website-single.html`: the whole site in one file, with the photo inside.
Double click it to open it in any browser, or send it to someone. The fonts still come from Google Fonts,
so without internet the page works but shows a backup font.

## Change text or links

All words and links are in one file: `src/data/content.js`. Edit the text there and the page updates.
The photo is `src/assets/emmy.jpg`. Replace it with a new photo of the same name to swap it.

## Pictures

- `src/assets/emmy.jpg`: Emmy's own photo, from the old website.
- `src/assets/art/` (dubai, egypt, sky, boutique, stage): drawings made with code for this site
  by `scripts/make-art.py` (run `python3 scripts/make-art.py src/assets/art` to redraw them). No stock photos, no AI images, nothing copied, so you own them and can use them anywhere.
  To swap one for a real photo, save your photo over it with the same name (or change the import in the section file).

## What is where

- `src/sections/` one file per section (Hero, About, Markets, Training, Collaborators, Testimonials, Contact, Footer)
- `src/components/Header.jsx` top bar and phone menu
- `src/components/reactbits/` React Bits components used: Grainient (moving hero background), ShinyText, CircularText (spinning badge),
  SplitText, ScrollReveal, CountUp, Threads (moving lines behind the numbers), TiltedCard (market pictures), ScrollExpand (training stage),
  ScrollStack (stacking program cards), CurvedLoop (curved names ribbon), LightRays and ClickSpark (contact), Magnet, AnimatedContent
- `src/lib/smoothScroll.js` Lenis smooth scroll, linked to GSAP ScrollTrigger
- `src/styles.css` all styling, with the original colors and fonts

## Motion and accessibility

People who turn on "reduce motion" on their phone or computer get a calm version: no smooth scroll, no moving text, everything shown straight away.
Phones or computers that can't run WebGL simply get a still background instead of the moving ones.

The first version of this rebuild is kept as `emynaj-website-v1-backup` next to this folder.

React Bits components are under the MIT + Commons Clause license (see `src/components/reactbits/LICENSE-react-bits.txt`). Using them in your own website is allowed.
