# QuickAid — Emergency & Blood Donor Connect

A responsive website that connects people needing urgent blood/emergency help with registered donors nearby, and keeps emergency helpline numbers within reach. Built with plain HTML, CSS and JavaScript.

## Live Demo
Open `index.html` in any browser, or enable GitHub Pages (Settings → Pages → deploy from `main` branch) to get a live link.

## Features
- **Donor registration** — form with client-side validation (name, blood group, city, 10-digit phone)
- **Find donors** — live search/filter by blood group and city
- **Emergency contacts** — quick-access helpline numbers (ambulance, blood bank, police, etc.)
- **About / FAQ** — accordion covering blood donation myths and facts
- **Dark / light theme toggle** — preference saved across visits
- **Responsive design** — hamburger navigation on mobile
- **No backend required** — donor data is saved in the browser via `localStorage`

## Tech Stack
- HTML5
- CSS3 (Flexbox, Grid, CSS variables, media queries)
- Vanilla JavaScript (DOM manipulation, form validation, `localStorage`)

## File Structure
```
quickaid/
├── index.html      # Page structure
├── style.css        # Styling, theming, responsive layout
├── script.js         # Navigation, form validation, search, storage logic
└── README.md
```

## How to Run
1. Clone or download this repo
2. Open `index.html` directly in a browser — no build step or server needed

## Notes
Donor data is stored locally in each visitor's browser (`localStorage`), so it does not persist across devices. This keeps the project fully static and deployable on GitHub Pages with no backend.
