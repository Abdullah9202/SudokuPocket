# Play Console guide – Sudoku Pocket: Classic Puzzles

> ✅ This app is **not** a health, medical, finance, VPN or government app, so a **personal** developer account can publish it.
> Answer every declaration exactly as below — they match what the app really does.

## Create app
| Field | Value |
|---|---|
| App name | Sudoku Pocket: Classic Puzzles |
| Default language | English (United States) – en-US |
| App or game | Game |
| Free or paid | Free |

---

## Store listing (Grow → Store presence → Main store listing)

**App name** (30/30)
```
Sudoku Pocket: Classic Puzzles
```

**Short description** (72/80)
```
Endless classic Sudoku with 4 difficulty levels, notes, hints and stats.
```

**Full description** (846/4000)
```
Sudoku Pocket is a clean, classic Sudoku game you can play anywhere – no internet needed.

ENDLESS PUZZLES
• A brand-new puzzle every game, generated on your device
• Every puzzle has exactly one solution – solvable with pure logic
• 4 difficulty levels: Easy, Medium, Hard and Expert

PLAY YOUR WAY
• Pencil notes for candidates
• Undo any move
• 3 hints per game
• Mistakes highlighted in red
• Matching numbers, row, column and box highlighting
• Finished digits fade out on the number pad
• Your game is saved automatically – continue any time

TRACK YOUR PROGRESS
• Games played, wins and win rate per difficulty
• Best and average solve times

ALSO
• Timer pauses automatically when you leave the app
• Dark mode
• Designed for phones, tablets and foldables, in portrait or landscape
• No ads, no account, no data collection, no permissions

Privacy Policy: https://abdullah9202.github.io/SudokuPocket/
Terms of Use: https://abdullah9202.github.io/SudokuPocket/terms.html
```

**Graphics**
| Asset | File |
|---|---|
| App icon 512×512 | `store-listing/play-store-icon-512.png` |
| Feature graphic 1024×500 | `store-listing/feature-graphic-1024x500.png` |
| Phone screenshots (2–8) | Take them from the real app (see below) |

**Phone screenshots to capture** (portrait, PNG/JPEG, from the app running on your phone):
1. A game in progress with a cell selected (highlighting visible)
2. Notes mode with pencil marks in a few cells
3. The 'New game' difficulty dialog
4. The 'Puzzle solved!' dialog
5. Stats tab after a couple of wins
6. Landscape layout on a tablet (optional)

Capture with the phone's screenshot buttons, or over USB: `adb exec-out screencap -p > 01.png`.
Screenshots must show the real app — don't upload mock-ups.

---

## Store settings
| Field | Value |
|---|---|
| App category | Games → Puzzle |
| Tags | Pick up to 5 that appear in the list, closest to: Sudoku, Logic puzzle, Number puzzle, Brain games. Don't pick tags for features the app doesn't have. |
| Email | your support email (same as in the privacy policy) |
| Website / phone | optional – leave blank |

---

## App content (Policy → App content)
| Section | Answer |
|---|---|
| **Privacy policy** | `https://abdullah9202.github.io/SudokuPocket/` |
| **App access** | All functionality is available without special access |
| **Ads** | No, my app does not contain ads |
| **Content rating** | Category: **Game**. Answer **No** to every question (violence, sexuality, language, controlled substances, gambling, user interaction/chat, sharing location, digital purchases). |
| **Target audience** | **18 and over** only. "Could your store listing unintentionally appeal to children?" → **No** |
| **News app** | No |
| **Data safety** | Does your app collect or share any required user data types? → **No**. (Nothing else to fill.) |
| **Advertising ID** | **No** – the app does not use it (and `app.json` blocks the permission) |
| **Government apps** | No |
| **Financial features** | My app doesn't provide any financial features |
| **Health** | **My app does not have any health features** (do not tick anything) |
| **Trader status (EU)** | Not a trader (free app, no ads or purchases, personal account) |

---

## Release
1. **Testing → Internal testing → Create release** → upload the `.aab` → let Google manage the app signing key.
2. Release name: filled in automatically. Release notes:
```
<en-US>
First release of Sudoku Pocket.
• Endless unique puzzles in 4 difficulty levels
• Notes, undo, hints and mistake highlighting
• Auto-save and statistics
• Works fully offline
</en-US>
```
3. Once every App content section has a green tick, **promote the release to Closed testing**, add **12+ testers** and keep them opted in for **14 days in a row**, then apply for production access.
