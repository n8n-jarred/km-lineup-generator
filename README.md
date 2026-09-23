# Ultimate Frisbee Strategy & Lineup Intelligence Platform

A real-time data-driven tactical assistant designed for Ultimate Frisbee coaches, captains, and team managers. This application empowers teams to track player performance, evaluate line chemistry, assess pre-sub player conditions, and dynamically generate optimal lineups for specific point scenarios.

---

## Key Features

### 1. Dynamic Player History & Conditional Analytics
* **Zero-History Protection:** Prevents arbitrary defaults or fake analytics. Player and lineup metrics like **Success Rate**, **Conversion Rate**, **Turnovers / Point**, and **Line Rating** render as `N/A` until real game or point history is logged.
* **Contextual Formulas:** Calculates win percentages, hold/break conversion efficiency, and custom Line Ratings dynamically as game data accumulates.

### 2. Pre-Sub Situational Dashboard
Before calling players onto the field for a crucial point, review real-time player statuses:
* **Fatigue Tracking:** Live visual meters tracking consecutive points played (`Fresh`, `Moderate`, `Gassed`).
* **Momentum / Form:** Quick indicators tracking recent performance trends (`Hot`, `Neutral`, `Cold`) over the last few points.
* **In-Game Coach Notes:** Instantly access quick tags or notes logged mid-match (e.g., *"Tweaked ankle in Q2"*, *"Shining in deep coverage"*).

### 3. Automated Lineup Strengths & Weaknesses (S&W)
* Dynamically aggregates active player attributes and drawbacks to output actionable tactical insights for any 7-player combination.
* Identifies strengths like *"Stacked with elite throwers — can win deep matchups"* or vulnerabilities like *"Soft marks, gives up easy unders"*.

### 4. Tactical Set Generator & Regenerator
Instantly auto-select or regenerate 7-player sets tailored to specific situational strategies:
* **O-Line Hold:** Prioritizes possession handlers and low-turnover cutters.
* **D-Line Break:** Emphasizes high-pressure mark defenders and quick transition scorers.
* **Anti-Zone:** Selects tall reset handlers and long-range huckers.
* **High Pressure:** Rotates in rested players with minimal consecutive points played.

---

## Tech Stack

* **Framework:** React 18 / Vite
* **Routing:** TanStack Router
* **Styling:** Tailwind CSS + `shadcn/ui` UI component primitive library
* **Runtime / Package Manager:** Bun (or Node.js / npm)
* **Language:** TypeScript

---

## Getting Started

### Prerequisites

Ensure you have either **Bun** or **Node.js** installed on your system.
* [Install Bun](https://bun.sh/) *(Recommended)*
* Or [Install Node.js (v18+)](https://nodejs.org/)

### Installation

1. **Clone the repository:**
   ```bash
   git clone https://github.com/YOUR-USERNAME/YOUR-REPO-NAME.git
   cd YOUR-REPO-NAME
   ```

2. **Install dependencies:**
   Using Bun:
   ```bash
   bun install
   ```
   Or using npm:
   ```bash
   npm install
   ```

3. **Start the development server:**
   Using Bun:
   ```bash
   bun run dev
   ```
   Or using npm:
   ```bash
   npm run dev
   ```

4. **Open in browser:**
   Navigate to `http://localhost:5173` (or the port displayed in your terminal).

---

## Directory Structure

```text
src/
├── components/          # Reusable UI components & dialogs
│   ├── PointLogger.tsx  # Pre-sub situation dashboard & tactical set UI
│   ├── RosterTable.tsx  # Player performance and status overview
│   └── ui/              # Base shadcn/ui components
├── lib/
│   ├── lineup.ts        # Dynamic S&W, zero-history logic & set generator
│   ├── team-data.ts     # Roster definitions and player traits
│   └── games.ts        # Game and point logging engine
├── routes/              # TanStack route views (Games, Players, Dashboard)
├── styles.css           # Global Tailwind CSS configurations
└── main.tsx            # Application entry point
```

---

## Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/NewFeature`)
3. Commit your changes (`git commit -m 'Add NewFeature'`)
4. Push to the branch (`git push origin feature/NewFeature`)
5. Open a Pull Request

---

## License

This project is open-source and available under the [MIT License](LICENSE).