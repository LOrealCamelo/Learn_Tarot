# Ink & Intuition

A standalone, upright-only learning app for the owner's Ink & Intuition deck. This continues the working implementation in PR #1.

- All 78 cards with processed original deck photography and traceable card mappings.
- Card library with suit/progress filters and Page/Pentacles search aliases for printed Knave/Coins names.
- Artwork-first flip-to-answer study, sequential/random practice and learned-card tracking.
- Four-choice meaning quizzes, 26 study lessons, and five-question mini tests.
- Structured Major/Minor Arcana, four suits, courts, numerology and deck-specific study.
- Local browser progress for cards, quizzes, completed lessons and mini-test scores.
- Responsive aqua, cream, gold and coral styling. No spreads, reversals or backend.

## Run

Open `index.html`, or serve this directory with `python -m http.server 4173` and visit `http://localhost:4173`. No installation/build is needed to run the app.

## Rider–Waite section

The Rider–Waite tab reuses Spiritual Vibz’s original Learn Tarot renderer, source color styles, card content and 78 original images. It has independent progress and preserves that section’s upright/reversed modes. See [source provenance and integration](docs/RIDER-WAITE.md).

## Offline on your phone

Open the hosted app online and tap **Make available offline**. Wait for confirmation that both decks are saved, then add it to your home screen. See [offline setup and storage limits](docs/OFFLINE.md).

## Documentation

- [App structure and local storage](docs/APP-STRUCTURE.md)
- [Image-processing workflow and source limitations](docs/IMAGE-PROCESSING.md)
- [All 78 card mappings and crop records](docs/card-image-mapping.json)
- [Original Drive inventory from PR #1](docs/original-image-inventory.json)
- [Validation and remaining review](docs/VALIDATION.md)

Original raw photos stay untouched and separate from processed assets. Some source glare and clipped edges remain; no missing art was invented. The updated local design follows the supplied approved tattoo mockup and awaits review before live replacement.

## Checks

`python scripts/validate_assets.py` (Pillow required). For browser checks: `npm ci && npm test` (system Chromium; override with `CHROMIUM_PATH` if needed). Dev dependencies are not part of the running static app.

The existing `ink-intuition-v1` storage key and card IDs are preserved. Progress is stored only in this browser/device. The candidate is on the owner-approved `work/ink-intuition-refinement` review branch. No merge or deployment has been performed; those require separate owner approval.
