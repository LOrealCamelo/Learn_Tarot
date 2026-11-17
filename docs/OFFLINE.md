# Offline phone version

The hosted app supports offline study after one explicit download. It remains a static app; no backend or account is added to the app itself. The existing host still requires the owner's ChatGPT sign-in for the first online visit.

## On your phone

1. Open the live site online in Safari (iPhone) or Chrome (Android).
2. Tap **Make available offline** and keep the page open until it says **Saved for offline study**. The current bundle is about 108 MB; allow at least 160 MB free for storage overhead.
3. Add it to your home screen. iPhone: Share → Add to Home Screen. Android: menu → Install app / Add to Home screen.
4. Open the home-screen app once while online and check/download there too, because browsers may use separate storage for home-screen apps.
5. Test airplane mode: close and reopen the app. Cards, study lessons and quizzes should remain available.

Progress stays in this browser/app's localStorage. It is not synchronized across devices. Downloaded art is stored in Cache Storage. Clearing site data, using private browsing, removing the app, or browser storage eviction can remove offline files and/or progress. The app requests persistent storage where supported, but the browser decides whether to grant it. Keep a connection for the first download, sign-in, and future updates.

## Implementation

- `manifest.webmanifest` provides the app name, icons, standalone display and scope.
- `offline.js` manages the explicit download, progress/error/status messages, and a nonfatal persistent-storage request.
- `service-worker.js` caches the app shell, runtime scripts/styles, decorative artwork and all 156 card images across both decks. It does not cache authentication endpoints or connected-app responses.
- Every response must succeed; images/scripts have MIME checks, redirects are rejected and the app shell is checked before caching. A complete marker is written only after every file is saved. Failed installs cannot claim readiness. Old app caches are removed only after a complete new cache activates.
- Navigation tries the network then falls back to the downloaded app shell. Only enumerated static assets are served from the offline cache. Scope-relative paths support subdirectory hosting.
- Regenerate the content-hashed asset version after any runtime change: `python scripts/build_offline.py`. Source template: `scripts/service-worker-template.js`.

## Validation

`node scripts/test-offline.mjs` uses real Chromium with a subdirectory-hosted app. It tests an intentionally failed image download, retry, all 156 cached images across both sections, a cold page launch with networking disabled, flashcards, quizzes, lessons, progress surviving reload, and the standalone manifest. Desktop/mobile study regression tests also pass. Installation and storage retention on physical iOS/Android devices have not been verified; confirm the saved status on the actual phone.
