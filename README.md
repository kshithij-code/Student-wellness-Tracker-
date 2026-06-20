# Serene: Somatic Sanctuary & Reframing Workshop

Serene is a high-fidelity, full-stack wellness portal designed specifically for students to conquer academic stress, reframe self-limiting study anxiety, and establish healthy, mindful routines. Combining instant physical anchors with structured cognitive-behavioral reframing, Serene tracks emotional health dynamically over time and surfaces smart AI insights.

---

## 🌟 Key Features

### 1. Daily Study & Mood Dashboard
* **Dynamic Student Gauges**: Monitor active study goals, complete weekly targets, and see real-time performance indicators.
* **7-Day Trend Analytics**: Visualizes correlation between logged moods and estimated academic stress factor scores.
* **Weekly Wellness Digest**: Matches user-logged moods side-by-side with Gemini-analyzed text sentiments over the past seven days, surfacing summarized coping cards.

### 2. Somatic Sanctuary (Physical Stabilizers)
* **Paced Breathing Guide**: Visual somatic box breathing loop (or customizable breathing sequences) with interactive micro-animations.
* **Grounding Exercises**: Guided sensory exercises to down-regulate nervous system activation during intense exam preparation.

### 3. Reframing Workshop (CBT Exercises)
* **Cognitive Deconstruction**: Guided step-by-step cognitive-behavioral therapy (CBT) diary to document negative automatic thoughts, isolate cognitive distortions (e.g., *“Should” statements*, *all-or-nothing thinking*, *magnification*), and write balanced reframed perspectives.
* **Persistent Efficacy Ledger**: A personal archive of reframed doubts that students can revisit as an active cognitive shield against imposter syndrome.

### 4. Gemini AI Integrations
* **Sentiment Analysis**: Evaluates deep linguistic markers in daily journaling to output a structured mood sentiment score.
* **Personalized Coping Cards**: Automatically recommends actionable stress-relief actions based on specific recorded emotional triggers.
* **Deep Reframing Assistance**: Uses Gemini models to assist stuck students in restyling overwhelming self-criticism into constructive, forward-looking affirmations.

---

## ♿ Accessibility & Usability Features

Serene is meticulously engineered to be inclusive, responsive, and robust:
* **Keyboard-Accessible Elements**: Enhanced visible focus-visible rings with optimal contrast offsets on all custom control elements and navigation nodes.
* **Screen-Reader Assisted Markup**: Structured navigation using semantic roles, explicit `aria-current` flags, dynamic `role="menu"`, and custom `role="toolbar"`.
* **Reduced Motion Preferences**: Seamlessly respects operating-system level rules via custom mediaqueries that override transitions and visual keyframes on request.
* **Accessible Legends**: Fully labeled SVG chart components backed by an semantic `ChartLegend` structure for accessible layout hierarchy.

---

## 🛠️ Architecture & Tech Stack

* **Frontend**: React 18 with TypeScript on Vite.
* **Styling**: Tailwind CSS with focus-visible overlays and custom responsive breakpoints.
* **Database & ORM**: Flexible offline/server-synced collection structure.
* **Libraries**: `recharts` for performance-focused correlation charts, `lucide-react` for accessible vector icons, and `vitest` for test runner isolation.
* **Backend**: Express node-server serving live API proxy configurations and compiling resources using `esbuild`.

---

## 🚀 How to Run the Project Local Development

### Prerequisites
Make sure you have Node.js (version 18 or above) installed on your system.

### 1. Install Dependencies
Run the installation script in the project directory:
```bash
npm install
```

### 2. Configure Environment Variables
Create a `.env` file in the root directory (using `.env.example` as a template):
```env
PORT=3000
GEMINI_API_KEY=your_gemini_api_key_here
```

### 3. Run Developer Mode
Boot up the integrated Vite and Express development environment:
```bash
npm run dev
```
The server will start, exposing the frontend and backend concurrently on:
* **Terminal host**: `http://localhost:3000`

### 4. Code Quality & Formatting
Run the linter to verify syntax conformity and type configuration before pushing code:
```bash
npm run lint
```

### 5. Running Tests
Run the comprehensive test suite to verify that both the backend sentiment engines, CBT converters, and accessible dashboards are fully operational:
```bash
npx vitest run
```

---

## 📦 Production Builds & Deployment

To compile a highly optimized, single-bundle standalone distribution:

### 1. Build Compilation
```bash
npm run build
```
This runs the production builder resulting in:
1. Static compiled files generated inside folder `/dist`
2. Server codebase compiled via `esbuild` to a single production-ready output (`dist/server.cjs`)

### 2. Launch Standalone Server
To launch the final bundled container stack:
```bash
npm run start
```
