# Copilot Instructions for launchsiteswebapp

## Project Overview
- This is a React web application bootstrapped with Create React App.
- The main entry point is `src/App.jsx`, which composes the UI from modular components in `src/components/`.
- Major page sections (Hero, WhatWeDo, WhyChooseUs, Portfolio, PricingPreview, Testimonials, Contact) are implemented in `src/components/sections/` and rendered in `src/components/MainPage.jsx`.
- Layout components (Card, Footer, Header, Section, SectionTitle) are in `src/components/layout/`.

## Developer Workflows
- **Start development server:** `npm start` (runs on http://localhost:3000)
- **Run tests:** `npm test` (uses Jest, see `App.test.js`)
- **Build for production:** `npm run build` (outputs to `build/`)
- **Deploy to Vercel:**
  - Commit changes to git
  - Run `vercel --prod` in the project root
  - Vercel uses the production build from the current branch

## Project Conventions & Patterns
- **Component Structure:**
  - Functional React components, using hooks for state and effects
  - Section components receive no props; all data is local or hardcoded
  - Use of `framer-motion` for animations and `react-icons` for icons
- **Contact Section:**
  - Uses Formspree for form submission (see `Contact.jsx`)
  - Includes a booking button linking to Google Calendar
- **Styling:**
  - Global styles in `src/index.css`
  - No CSS-in-JS or styled-components
- **Testing:**
  - Minimal tests in `App.test.js`; expand as needed

## Integration Points
- **External Services:**
  - Formspree for contact form
  - Google Calendar for booking
- **No backend/server code**; all logic is client-side

## Examples
- To add a new section, create a component in `src/components/sections/` and import/render it in `MainPage.jsx`.
- To update deployment, commit changes and run `vercel --prod`.

## References
- See `README.md` for Create React App commands and links to documentation.
- See `MainPage.jsx` for the main page composition pattern.
- See `Contact.jsx` for external form/booking integration.

---
_If any conventions or workflows are unclear, please request clarification or provide examples from the codebase._
