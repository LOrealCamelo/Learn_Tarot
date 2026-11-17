# App structure

This continues PR #1 at `8f9bcb59e04c07966e15e28e5c8b1c6290a2e9ff`. It preserves the original deck IDs, storage key, navigation, study and quiz implementation. There is no backend, build step, external runtime API or account requirement.

- `index.html`: semantic section layout, navigation, study/lesson/quiz controls.
- `styles.css`: extracted original styles with the bright aqua, cream, gold and coral visual refinement and responsive rules.
- `app.js`: original 78-card structure, library/search, flashcards, meaning quiz, progress and browser storage. Printed deck terminology and artwork are integrated here.
- `deck-content.js`: upright study summaries adapted from the owner's supplied deck PDF. Loaded before `app.js`.
- `curriculum.js`: Arcana, suits, court ranks, numerology and deck-specific Q&A; lesson completion; five-question mini tests.
- `assets/cards/`: 78 cleaned original-art JPEGs.
- `docs/original-image-inventory.json`: preserved original Drive inventory from PR #1.
- `docs/card-image-mapping.json`: reproducible photo-to-card map and reviewed crop records.
- `scripts/process_images.py`, `scripts/validate_assets.py`: asset reproduction and integrity checks.
- `scripts/test-app.mjs`: real Chromium checks at mobile and desktop widths.

## Progress

Uses the original `ink-intuition-v1` localStorage key. Adds `lessons`, `miniRight` and `miniTotal` without discarding `learned` or `correct`. Unknown and duplicate card IDs and invalid scores are sanitized. A visible message reports storage-save failure. Progress belongs to the browser origin/device and is not synchronized across devices; clearing browser data removes it.

## Source grounding

Both the PDF and DOCX supplied in Drive were inspected. Card meanings are concise upright study summaries, not verbatim transcriptions or predictions. The PDF's detailed suit sections ground the Minor Arcana; its Major overview grounds the Majors. Numerology uses the supplied Numbers section. General court-role associations remain explicitly described as study conventions. The app does not claim unseen symbols or import Rider–Waite artwork.

## Running and checking

Open `index.html` directly, or `python -m http.server 4173` from the project folder. Browser progress is separate between a file URL and an HTTP origin.

Development checks: `npm ci`, then `npm test`. The test uses `/usr/bin/chromium` by default; set `CHROMIUM_PATH` for another Chromium executable. Python asset validation requires Pillow: `python scripts/validate_assets.py`. Python image-processing dependencies are development tools only.

## Approval boundaries

The owner approved pushing this candidate to the new `work/ink-intuition-refinement` review branch. PR #1, its original branch and `main` remain unchanged. No merge, hosting configuration or deployment was performed. The exact approved Library UI mockup was not available in this chat/workspace; matching that reference remains pending. The current candidate follows the user's stated bright palette and uses the deck's actual tattoo artwork. Further owner approval is required before merging or deploying.
