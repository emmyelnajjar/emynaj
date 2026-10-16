# EMYNAJ website (emynaj.com)

The live website is the files at the top of this repo: `index.html`, `assets/`, `favicon.svg` and `CNAME`.
These are the finished, built files. Do not edit them by hand.

The code to change the website is in `source/`. To change text or pictures:

```bash
cd source
npm install
npm run dev          # live preview at http://localhost:5173
npm run build        # makes the finished files in source/dist/
```

Then copy everything inside `source/dist/` to the top of this repo (replace `index.html` and `assets/`), keep `CNAME`, and push.
All words and links are in `source/src/data/content.js`. More details in `source/README.md`.
