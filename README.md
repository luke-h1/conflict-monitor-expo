# Conflict Monitor

iOS and Android app for [Monitor the Situation](https://monitor-the-situation.com/) — live global news and event map.

## Setup

```bash
bun install
cp .env.example .env
```

Edit `.env` if you need a different API base URL (default: `https://monitor-the-situation.com/api`).

## Run

- **Dev (requires dev client):** `bun run start` then open on simulator or device with the dev build installed.
- **iOS:** `bun run ios` (builds and runs; run `npx expo prebuild -p ios` first if needed).
- **Android:** `bun run android`.
- **Web:** `bun run web`.

## Build for production

- **Native:** Use [EAS Build](https://docs.expo.dev/build/introduction/) or run `npx expo prebuild` then build in Xcode/Android Studio. Bump `version` in `app.json` and optionally set `ios.buildNumber` / `android.versionCode` for store submissions.
- **Web:** `npx expo export --platform web` — output is in `dist/`.

## Scripts

| Script         | Description              |
|----------------|--------------------------|
| `bun run start`| Start Metro (dev client) |
| `bun run ios`  | Run on iOS               |
| `bun run android` | Run on Android       |
| `bun run web`  | Run web dev server       |
| `bun run lint` | Lint                     |
| `bun run typecheck` | TypeScript check    |

## Production checklist

- [ ] Set `EXPO_PUBLIC_API_BASE` in your build environment if not using the default.
- [ ] Use your own `ios.bundleIdentifier` and `android.package` in `app.json` for store submission.
- [ ] Replace placeholder assets in `assets/images/` (icon, splash, favicon, Android adaptive icons).
- [ ] For EAS Submit / store release, configure credentials and run the relevant EAS commands.
