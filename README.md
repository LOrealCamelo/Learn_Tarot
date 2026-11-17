# Ink & Intuition ✦

A personal, phone-friendly tarot **learning** app (not a tarot reading app).

## Included

- All 78 traditional tarot cards, with concise *upright-only* meanings and reflection prompts
- Searchable Major Arcana and Minor Arcana library; suit and learned-status filters
- Tap-to-flip study mode, sequential or random study, and "mark learned" progress
- Four-choice upright-meaning quiz and total correct-answer count
- Interactive flip-card Q&A lessons covering Major/Minor Arcana, the four suits and their elements, court cards, and symbolic tarot numerology (0–10)
- Short randomized lesson mini-tests with immediate answer explanations
- A clear distinction between traditional tarot associations and actual Ink & Intuition illustration details
- Turquoise, deep teal and gold styling with responsive small-screen layout
- Browser-local progress storage; no registration, tracking, readings, spreads or reversals

## Run

Open `index.html` in a browser, or serve this folder with a simple static server (for example `python -m http.server 8000` and visit `http://localhost:8000`). Hosting is **not** configured or deployed by these changes.

## Original card art (not yet imported)

The app works without image files using a symbolic fallback. Symbolic fallback is a temporary placeholder, not a representation of the owner's illustrated deck. To use the owner's 78 actual Ink & Intuition illustrations, add files under `assets/cards/` with these names:

- Major Arcana: `major-00.png` through `major-21.png` (The Fool through The World)
- Each suit (`cups`, `wands`, `swords`, `pentacles`): `suit-01.png` through `suit-14.png`, ordered Ace, Two–Ten, Page, Knight, Queen, King.

Only add images owned or licensed for this purpose. Never substitute unrelated tarot artwork and claim it is the original deck.

## Privacy and review

Progress is stored in localStorage under `ink-intuition-v1` and is unique to each browser/device. Clearing site data removes that progress. The GitHub repository is currently **public**, so do not commit personal journals or other private material. To make it private, change visibility under repository Settings.

This implementation is on a review branch and does not merge to `main` or deploy automatically. Review it before merging.
## Original scope

This remains the originally specified Ink & Intuition learning experience: 78 cards; turquoise styling; upright meanings only; interactive flip-to-answer study; tests/mini-quizzes; full suits, Arcana, court ranks, and tarot numerology. No spreads and no reversals. The user does not require private GitHub visibility, and the app intentionally collects no personal information. The owner's distinct card images must be added before image-specific recognition and symbol-study questions can be grounded in their actual art.
