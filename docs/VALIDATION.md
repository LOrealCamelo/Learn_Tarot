# Validation and review status

## Verified on the local review candidate

- Inspected the public GitHub repository and open PR #1 before editing. Continued its head commit `8f9bcb59e04c07966e15e28e5c8b1c6290a2e9ff` on local branch `work/ink-intuition-refinement`.
- 78 original photo titles visually identified; 78 unique source-to-card-to-asset mappings, 22 Major and 56 Minor cards, 14 per suit.
- All processed assets visually reviewed in contact sheets. Raw file SHA-256 checks enforced during export; originals left unchanged.
- Python validator: every asset decodes, has the expected 720 × 1200 dimensions, and has no EXIF metadata.
- Real Chromium automated tests passed at **390 × 900** and **1280 × 900**:
  - All 78 images load at their actual runtime paths and agree with the mapping's IDs and card names.
  - Printed Justice/Strength ordering, Page/Pentacles search aliases, deck navigation and search.
  - Artwork-first flashcard and answer reveal, sequential/random study, learned toggle and reload persistence.
  - Correct-answer quiz feedback and score persistence; answering a card quiz leaves lesson-test controls enabled (fixes the PR's shared `.choice` selector bug).
  - Lesson flashcards, topic navigation, completion tracking, a five-question mini test, results and restart.
  - Reload persistence of completed lessons and mini-test scores.
  - Duplicate/unknown learned IDs and invalid legacy scores sanitized.
  - No runtime page errors or horizontal overflow in the five app sections.
- Desktop dashboard inspected in shared Chromium; mobile full-page screenshot reviewed.
- `git diff --check` and JavaScript syntax checks passed.

## Remaining review

1. The owner supplied the approved tattoo-style mockup after the first deployment. The new local design candidate uses it for the ornate eye/rose masthead, turquoise/cream/gold palette, illustrated study tiles and four original featured cards. Live replacement awaits visual approval. The reference’s astrology, Moon Goddesses and birth-chart tiles are outside the current study scope; current functional tiles cover courts, numerology and quizzes.
2. Some source glare and clipped top edges remain. Review `IMAGE-PROCESSING.md` and the per-card mapping notes; better originals can improve those assets without inventing missing artwork.
3. Owner review of content wording and the visual candidate before remote application, merge or deployment.
4. Safari and Firefox have not been tested. Progress remains local to each browser/device as requested.

## Remote state

The owner approved pushing this candidate to the new `work/ink-intuition-refinement` review branch after validation. No existing branch was overwritten. PR #1 and `main` were not changed or merged. No hosting/deployment action was taken. The review package contains the complete static source, processed artwork, documentation and test scripts; raw photos and development dependencies are excluded.
