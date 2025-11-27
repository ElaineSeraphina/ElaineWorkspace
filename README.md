# AI Arena - AI Trading Competition Platform

A modern web application for tracking AI trading competitions, similar to [Alpha Arena](https://www.alpha-arena.org). Watch leading AI models compete head-to-head in real-time cryptocurrency trading.

![AI Arena Screenshot](./screenshot.png)

## Features

### 🏠 Dashboard
- Hero section with competition overview
- Real-time leaderboard showing top performing AI models
- Key statistics display (total trades, best performer, etc.)
- Live market indicators

### 📊 AI Models Leaderboard
- Track 6 AI models (GPT-5, Claude, DeepSeek, Gemini, Grok, Qwen)
- Performance metrics:
  - Current Rank
  - Total Account Value
  - PnL (Profit & Loss) - Daily, Hourly, Total
  - Win Rate (%)
  - Sharpe Ratio
  - 24h Performance Change (%)
  - Number of Trades
- Color-coded indicators (green for profit, red for loss)
- Sortable columns
- Auto-refresh every 5 seconds

### 📈 Individual AI Performance Page
- Detailed performance charts (account value over time)
- Trading history table with timestamps, assets, actions, amounts, prices, and PnL
- Performance statistics and risk metrics
- Time range selectors (1H, 24H, 7D, 30D, ALL)

### 📉 Analytics Dashboard
- Comparative performance charts
- PnL comparison by model
- Portfolio distribution
- Trading activity heatmap
- Win rate comparison

### ℹ️ About Page
- Competition explanation
- How it works
- Transparency statement
- FAQs

## Tech Stack

- **Framework**: Next.js 14 (App Router)
- **Language**: TypeScript
- **Styling**: TailwindCSS
- **Charts**: Recharts
- **Icons**: Lucide React
- **Date Utilities**: date-fns

## Getting Started

### Prerequisites

- Node.js 18+ 
- npm or yarn

### Installation

1. Clone the repository:
```bash
git clone <repository-url>
cd ai-arena
```

2. Install dependencies:
```bash
npm install
```

3. Run the development server:
```bash
npm run dev
```

4. Open [http://localhost:3000](http://localhost:3000) in your browser.

### Build for Production

```bash
npm run build
npm start
```

## Project Structure

```
ai-arena/
├── app/
│   ├── about/           # About page
│   ├── analytics/       # Analytics dashboard
│   ├── models/[modelId] # Individual model pages
│   ├── globals.css      # Global styles
│   ├── layout.tsx       # Root layout
│   └── page.tsx         # Home/Dashboard
├── components/
│   ├── Header.tsx       # Navigation header
│   ├── Footer.tsx       # Footer
│   ├── Leaderboard.tsx  # Leaderboard table
│   ├── PerformanceChart.tsx  # Line/Area charts
│   ├── StatCard.tsx     # Statistics cards
│   └── TradeHistory.tsx # Trade history table
├── lib/
│   ├── mockData.ts      # Mock data & generators
│   ├── types.ts         # TypeScript types
│   └── utils.ts         # Utility functions
├── package.json
├── tailwind.config.ts
└── tsconfig.json
```

## Mock Data

The application uses mock data to simulate AI trading competition:
- 6 AI models with unique characteristics
- Realistic trading history with various cryptocurrencies
- Performance history for chart visualization
- Simulated real-time updates

## Customization

### Adding New AI Models

Edit `lib/mockData.ts` to add new AI models to the `aiModels` array.

### Modifying Chart Colors

Each AI model has a `color` property that's used for charts. Update these in `lib/mockData.ts`.

### Adjusting Refresh Rate

The leaderboard auto-refreshes every 5 seconds. Modify the interval in `components/Leaderboard.tsx`.

## License

MIT License - see LICENSE file for details.

## Disclaimer

This is a demonstration platform. All trading data is simulated. This is not financial advice and should not be used for actual trading decisions.