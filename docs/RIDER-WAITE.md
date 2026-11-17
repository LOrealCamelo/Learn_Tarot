# Rider–Waite section from Spiritual Vibz

Source repository: `LOrealCamelo/Spiritual_Vibez_App`, inspected tree `7229f46a69926f88f7817440a270254d796c4b33`.

The requested repository color styles are copied into `rider/styles.css` and `rider/liquid-glass.css`. The original `learning.js`, `artwork.js`, study illustration sheets, fonts and font licenses are included. `learning-page.js` contains the unchanged `learningPage()` renderer from `frontend/app.js`. Card data is copied from `mobile/src/data/tarotCards.json`.

`adapter.js` supplies the renderer's existing helper interfaces, local quiz generation instead of the backend API, local image paths, and independent browser progress under `ink-intuition-rider-waite-v1`. `adapter.css` contains responsive host integration and legibility rules. The integration preserves the source Major/Minor/Card Meanings/Reversed Cards/Quiz modules and number/planet/house reference content. Birth-chart navigation opens the original Spiritual Vibz site; the personal calculators are not embedded into this static Tarot section.

All 78 images come from the repository's `mobile/assets/tarot/` set. PNG originals are preserved separately in the working download directory. The app uses lossless WebP exports, each checked for identical decoded RGB pixels. Source SHA-256 values, output filenames and dimensions are recorded in `rider-image-mapping.json`. There is no crop, recoloring, resizing or generative replacement of Rider–Waite artwork.

Ink & Intuition's images, upright-only content and original storage key are unchanged. The Rider–Waite section preserves the original Spiritual Vibz upright and reversed study content as requested. Deck progress is separate. The shared offline download includes both decks; regenerate it with `python scripts/build_offline.py` after changing either section.

Validated in Chromium at 390px and 1280px: tab navigation, all 78 Rider images, 22/56 Arcana filters, original details and reversed artwork, quizzes, persisted independent progress, no horizontal overflow or runtime errors. The offline test cold-launches both sections with networking disabled and loads all 156 card images. Physical phone installation/storage behavior still needs verification on the user's device.
