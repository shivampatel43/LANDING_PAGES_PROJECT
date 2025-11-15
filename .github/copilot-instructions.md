# AI Agent Instructions for Landing Pages Project

## Architecture Overview

This is a **multi-landing-page + university API** project designed for educational lead generation. 

**Key Components:**
- **Frontend**: Two independent HTML landing pages (`lp1.html`, `lp2.html`) served statically, each representing a different institution
- **Backend**: Express.js API server (`api/server.js`) on port 4000 with fee lookup and lead capture endpoints
- **Shared Assets**: Single stylesheet (`css/styles.css`) and JavaScript module (`js/main.js`) reused across both pages

**Data Flow**: Landing pages → API calls (`/api/university/:id`, `/api/fees/:courseId`) → JSON data store (`api/data.json`) → Response to client, then POST to either Pipedream webhook or local `/api/leads` endpoint.

## Critical Setup & Workflows

### Running the Project
1. **API Server**: Run `npm install && npm start` from `api/` directory to start Express server on port 4000
2. **Frontend**: Open `lp1.html` or `lp2.html` directly in browser (no build needed), or use a simple HTTP server
3. **Common Issues**: 
   - CORS is enabled in API (`app.use(cors())`) to allow cross-origin requests from frontend
   - `js/main.js` has hardcoded `API_BASE = "http://localhost:4000"` — this must match running server port
   - Pipedream webhook URL in `js/main.js` (`PD_ENDPOINT`) is placeholder; set to actual URL for production lead routing

### Dependencies
- Backend: `express` (4.18.2), `cors` (2.8.5)
- Frontend: Vanilla JavaScript (no frameworks); uses `fetch()` API
- No build tool, bundler, or test framework in use

## Data & API Patterns

**University Data Structure** (`api/data.json`):
```json
{
  "universities": [
    {
      "id": 1,
      "name": "Rising Tech University",
      "courses": [{ "id": 101, "name": "B.Tech CS", "fee_range": {"min": 50000, "max": 200000} }]
    }
  ]
}
```

**API Endpoints** (`api/server.js`):
- `GET /api/university/:id` — Returns full university object with all courses
- `GET /api/fees/:courseId` — Returns course name and fee_range only (nested search across all universities)
- `POST /api/leads` — Accepts form data, logs to console, returns `{status: 'ok'}`

**String ID Matching**: All IDs are coerced to strings with `String()` for safe comparison across different data types.

## Frontend-Specific Patterns

**Form Submission** (`js/main.js`, `submitLead()`):
- Validates: required fields (fullname, email, phone), phone must be exactly 10 digits
- Dynamic endpoint routing: Uses Pipedream URL if set (non-placeholder), otherwise falls back to local API
- Form state management: Displays success/error messages in `.form-message` element within form
- Modal interaction: Click outside modal (`onclick="if(event.target.id==='feesModal')closeModal()"`) to close

**HTML Structure Conventions**:
- Forms must have `id` attribute matching the form reference in JavaScript calls
- Fee data fetches use university `id` passed directly to `openFees()` function
- `.form-message` elements must exist within forms for validation feedback
- Modals use `display: flex` for centering; hidden state is `display: none`

## Project-Specific Patterns

1. **Dual Landing Page Pattern**: Each page (`lp1.html`, `lp2.html`) is independent but shares styles and scripts — changes to `css/styles.css` or `js/main.js` affect both pages
2. **Inline JavaScript**: No separate event listeners; all event handling via `onclick`, `onsubmit` attributes in HTML
3. **Error Handling**: All API calls wrap in try-catch; user-facing errors display in UI, technical errors log to console
4. **Styling**: Single responsive grid layout using CSS Grid with breakpoint at 900px (mobile-first base, desktop sidebar)

## Common Modifications

- **Adding a new course**: Add to `data.json` with new `id` under target university's `courses` array
- **Adding a landing page**: Copy `lp1.html` or `lp2.html`, update title/content, ensure unique form `id`, and add new university/courses to `data.json`
- **Changing API port**: Update `PORT` env var or hardcoded `port` in `api/server.js` AND `API_BASE` in `js/main.js`
- **Styling updates**: Edit `css/styles.css` — all pages inherit the same stylesheet; be aware of responsive breakpoint at `@media(min-width:900px)`
