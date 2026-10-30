# Updating the portfolio after a resume change

This guide is written for anyone, including smaller AI assistants, who needs to change the portfolio's content.
Follow the steps in order. Change **only** the files listed here unless a step says otherwise.

All paths are relative to the `site/` folder.

---

## 0. Golden rules

1. **The resume is the source of truth.** Never invent roles, numbers, dates, prizes or skills.
2. **Text content lives in `sources/data/`.** You almost never need to touch `sources/Game/`.
3. **Keep the existing code style:** 4-space indentation, no semicolons, single quotes.
4. **Keep the 3D signs short.** Board attributes need about 22 characters max, and timeline stone lines about 20 characters max. Longer text gets clipped or squeezed.
5. After editing, run the build (step 9). If it fails, fix the error before finishing.

---

## 1. Replace the resume PDF

- Overwrite `static/resume/Anurag-Padhi-Resume.pdf` with the new PDF. Keep the **same file name**.
- If the file name must change, also update `resume` and `resumeFileName` in `sources/data/portfolio.js`.

## 2. Profile, intro and contact: `sources/data/portfolio.js` → `profile`

| Field | What it is |
| --- | --- |
| `name`, `headline`, `positioning`, `intro` | Text in the intro card and the "About" panel |
| `interests` | Role interests (chips) |
| `lookingFor` | Sentence about the roles being sought |
| `location`, `email`, `phone`, `phoneHref`, `linkedin`, `linkedinLabel` | Contact details. `phoneHref` must be `tel:+91…` with no spaces |
| `highlights` | The 4 number tiles on the intro card (`value`, `label`). Keep exactly 4 short ones |

## 3. Experience: `sources/data/portfolio.js` → `experience`

Each entry looks like this:

```js
{
    organisation: 'Company name',
    role: 'Job title',
    duration: 'Month YYYY – Month YYYY',   // or '– Present'
    current: true,                          // only if still ongoing (optional)
    points: [ 'Achievement 1.', 'Achievement 2.', 'Achievement 3.' ],  // 2–4 short bullets
},
```

- The list order is the display order. Put the **most recent first**.
- Then update the 3D timeline (step 7).

## 4. Projects

1. In `sources/data/portfolio.js` → `projects`, edit or add an entry with these fields: `name`, `tagline`, `problem`, `contribution`, `solution`, `achievements` (array), and `image` (file name).
2. In `sources/data/projects.js` (the 3D board), add a matching entry:

```js
{
    title: 'Project Name',
    titleSmall: [ 'Project', 'Name' ],   // 1–2 words per line for the side signs
    url: null,
    urlLabel: 'Read project details',
    panel: 'projects',
    attributes: { role: 'Short role', at: 'Event · Prize', with: 'Team of 4' },  // each ≤ ~22 chars, any can be omitted
    distinctions: [],
    images: [ 'project-name.webp' ]
},
```

3. Generate the board image. Open `scripts/portfolio-images.js`, copy one of the `projects/images/...` lines in `items`, edit it, then run:

```bash
node scripts/portfolio-images.js
```

## 5. Education and certifications

- `sources/data/portfolio.js` → `education` holds the degree, CGPA, coursework and the extra programme.
- `sources/data/portfolio.js` → `certifications` is a plain list of names.
- The 3D Education board is `sources/data/lab.js`. Each entry needs a `title`, `urlLabel`, `panel: 'education'`, `image` and `imageMini`. Add the image to `scripts/portfolio-images.js` (a `lab/images/...` line; the mini version is created automatically) and re-run the script.

## 6. Achievements and skills

- `achievements`: a list of `{ title, text }`. Keep the titles short, for example `'ProdXPulse – 1st Prize'`.
- `skills`: a list of `{ category, items: [ ... ] }`.

## 7. The 3D career timeline (Experience area)

File: `sources/Game/World/Areas/CareerArea.js`, at the top (`careerLabels` and `careerYears`).

- There are **6 fixed slots**. Their names (`careerHetic`, `careerFreelancer`, …) come from the 3D scene, so **don't rename the keys**. Only change the values.
- Each value is `{ title, subtitle, color, size }`:
  - `title` / `subtitle`: UPPERCASE, about 20 characters max each.
  - `color`: `'blue'`, `'orange'`, `'purple'` or `'green'`.
  - `size`: leave as is.
  - Christ University has `length: 17, ongoing: true, laneX: 31.04`, which gives it its own full-length lane. Don't copy those fields to other slots.
- What each slot is shaped for (start → length; "ends" means its stone drops at the end):

| Slot | Starts at | Length | Ends? | Currently |
| --- | --- | --- | --- | --- |
| `careerHetic` | 2024 | own lane | no | Christ University |
| `careerFreelancer` | 2025 | to the end | no | Teachers By Choice |
| `careerUzik` | 2025 | short | yes | Happy Folks Club |
| `careerIRLTeacher` | 2025 | medium | yes | COIL Programme |
| `careerImmersiveGarden` | 2026 | short | yes | POP by Razorpay |
| `careerOnlineTeacher` | 2026 | to the end | no | Mu Sigma |

- `careerYears` maps distance along the timeline to the year shown: `[ [ 0, 2024 ], [ 3, 2025 ], [ 8, 2026 ], [ 15, 2027 ] ]`. If the dates shift by a year, change only the years.
- With more than 6 timeline items, drop the least important from the timeline. The Experience panel still shows everything.

## 8. Contact points around the statue

`sources/data/social.js` lists the interactive points. Use `url` for a link, or `panel` (`'skills'`, `'contact'`, …) to open a portfolio panel.

## 9. Check your work

```bash
npm run build      # must finish with "built in …" and no errors
npm run preview    # open the printed URL and click every top-bar section
```

Checklist:
- [ ] The intro card shows the new information.
- [ ] Every panel (Home, Experience, Projects, Education, Achievements, Skills, Contact) opens and reads correctly.
- [ ] "Resume" downloads the new PDF.
- [ ] Email, phone and LinkedIn links work.
- [ ] No text is cut off on the 3D signs (shorten it if it is).
- [ ] Add `?mode=lite` to the URL to check the phone-style layout.

---

## Where things are (for reference)

| Thing | File |
| --- | --- |
| All panel content | `sources/data/portfolio.js` |
| Panel and intro rendering | `sources/Portfolio/Portfolio.js` |
| Portfolio styles | `sources/style/portfolio.styl` |
| Name in 3D letters | Built from `profile.name` (`sources/Game/World/Areas/LandingArea.js`) |
| Headlights (N key) | `sources/Game/World/Headlights.js` |
| Ignition sound | `static/sounds/ignition/` (CC0) |
| Music | `static/sounds/musics/` (CC0). Set `VITE_MUSIC=0` in `.env` to turn it off |
