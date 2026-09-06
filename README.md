# JanSetu — Civic Innovation Hub

**Jan Setu** — *Jan* means people, *Setu* means bridge. JanSetu is India's community
innovation network: it connects citizens, government, universities, innovators and
industry to transform real-world local problems into scalable national solutions.

## Tech Stack

- **Frontend**: React 19 + Vite 7
- **Styling**: Custom CSS (`client/src/jansetu.css`)
- **Icons**: lucide-react
- **Data**: Frontend-first mock data (`client/src/data/jansetuMockData.js`) exposed through
  an API adapter (`client/src/services/jansetuApi.js`) so a real backend can be wired in
  later without changing page flows.

## Getting Started

```bash
npm install --prefix client
npm run dev
```

Open the app at [http://localhost:5173](http://localhost:5173).

## Citizen Registration

On the first visit, a registration form appears before the home page. Required
fields are starred (name, country, state/city, phone, email, gender); caste,
age and occupation are optional and can be added later. The profile is stored
in the browser's `localStorage` — the Dashboard greets the citizen by name and
the Profile page tracks completion, benefits and account actions (edit,
sign out).

To run from inside the `client/` folder directly:

```bash
cd client
npm install
npm run dev
```

## Production Build

```bash
npm run build
```

Output is generated in `client/dist/`.

## Routes

| Route | Page |
|---|---|
| `/` | Landing page + domain explorer |
| `/report` | Five-step problem submission wizard |
| `/challenges` | Explore reported challenges |
| `/challenges/:id` | Challenge detail with AI analysis |
| `/dashboard` | Citizen problem dashboard (greets you by name) |
| `/profile` | Your citizen profile — information, completion and benefits |
| `/impact` | National impact analytics |
| `/universities` | University collaboration network |
| `/industry` | Industry connect network |
| `/about` | How JanSetu works |
| `/agriculture` | Crop Doctor and farmer support tools |
| `/rural-development` | Roads, water, sanitation, electricity, employment |
| `/health-services` | Health centres and ambulance services |
| `/emergency` | Emergency response services and SOS flow |
| `/government-services` | Citizen, farmer, family and disaster-relief services |

## Project Structure

```text
client/
  index.html              # Vite entry HTML
  vite.config.js          # Vite configuration
  src/
    main.jsx              # React entry point
    App.jsx               # Renders JansetuApp
    JansetuApp.jsx        # App shell, internal routing, page components
    jansetu.css           # JanSetu design system (global reset + theme)
    components/
      DomainExplorer.jsx  # Domain explorer on the landing page
      DisasterSidebar.jsx # Left navigation sidebar
    pages/
      DisasterServices.jsx  # Domain service pages (agriculture, health, ...)
      SubmitProblem.jsx     # Standalone problem wizard (uses indiaLocations)
      SubmitProblem.css
      UserGate.jsx          # Registration form shown before the home page
      ProfileForm.jsx       # Shared profile form (registration + edit)
      ProfilePage.jsx       # Citizen profile, completion and benefits
      Account.css           # Account UI styles
    data/
      jansetuMockData.js  # Mock problems, universities, industries, analytics
      indiaLocations.js   # India states/districts reference data
    services/
      jansetuApi.js         # API adapter over mock data
      userProfileService.js # localStorage citizen profile + completion tracker
```
