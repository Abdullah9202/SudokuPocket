# Sudoku Pocket: Classic Puzzles

Endless classic Sudoku with 4 difficulty levels, notes, hints and stats.

- **Package name:** `com.abdullah9202.sudokupocket` (cannot be changed after the first upload to Play)
- **Play category:** Games → Puzzle
- **Expo SDK 58** (React Native 0.88) · New Architecture · edge-to-edge
- **No permissions, no ads, no analytics, no advertising ID, no account, works offline**
- Responsive: phones, tablets, foldables, portrait and landscape · dark mode · font scaling · Android back button

Everything for the Play Console is in **`PLAY_CONSOLE.md`**.

---

## 1. One-time requirements
- Node.js **22.13 or newer** (`node -v`)
- EAS CLI: `npm install -g eas-cli@latest`
- Logged in to Expo: `eas whoami` (should show `abdullah9202`)

## 2. Put your support email in the legal pages
Replace `you@example.com` with your real email (keep the quotes exactly as shown):

```bash
sed -i 's/\[YOUR SUPPORT EMAIL\]/you@example.com/g' docs/index.html docs/terms.html
grep -c "YOUR SUPPORT EMAIL" docs/index.html docs/terms.html   # both should print 0
```

## 3. Install and run
```bash
npm install
npm run setup        # installs the exact SDK 58 versions of React, React Native and libraries
npx expo-doctor      # should pass every check
npx expo start       # scan the QR code with Expo Go (SDK 58)
```

## 4. Publish the privacy policy and terms (GitHub Pages)
1. On GitHub create a **public** repository named exactly **`SudokuPocket`** (capitals matter in the URL).
2. Push this project:
   ```bash
   git init
   git add -A
   git commit -m "Sudoku Pocket 1.0.0"
   git branch -M main
   git remote add origin https://github.com/abdullah9202/SudokuPocket.git
   git push -u origin main
   ```
3. GitHub → repository → **Settings → Pages → Deploy from a branch → `main` / `/docs` → Save**.
4. After about a minute these work:
   - Privacy Policy: https://abdullah9202.github.io/SudokuPocket/
   - Terms of Use: https://abdullah9202.github.io/SudokuPocket/terms.html

The repo only contains app code. Your signing key lives on Expo's servers and `.gitignore` excludes keystores.

## 5. Build the .aab
```bash
eas init                                            # choose "Yes" to create a new project
eas build --platform android --profile production   # choose "Yes" to generate a new keystore
```
If the upload from your computer keeps failing, use **expo.dev → project → Builds → Build from GitHub** (connect the repo under Project settings → GitHub first).

Version codes are managed by EAS (`appVersionSource: remote`, `autoIncrement`), so you never edit `versionCode`. For an update, raise `version` in `app.json` (e.g. 1.0.1) and build again.

## 6. Play Console
Follow **`PLAY_CONSOLE.md`** section by section.
