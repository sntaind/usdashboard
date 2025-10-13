# US Macroeconomics Watchtower

A real-time dashboard for monitoring key US economic indicators with interactive charts and data visualization.

## Features

- **Real-time Economic Data**: Fetches live data from FRED (Federal Reserve Economic Database)
- **Interactive Charts**: Click to zoom charts with custom tooltips
- **High-Contrast Design**: Black theme with white text for optimal readability
- **10 Key Indicators**: 
  - Initial Claims (ICSA)
  - Inventory/Sales Ratio (ISRATIO)
  - Secured Overnight Financing Rate (SOFR)
  - Industrial Production (INDPRO)
  - Retail Sales ex Food (RSXFS)
  - Consumer Sentiment (UMCSENT)
  - Cass Freight Shipments
  - Margin Debt (FINRA)
  - ICE BofA IG OAS (BAMLC0A0CM)
  - ICE BofA HY OAS (BAMLH0A0HYM2)

## Technology Stack

- **Frontend**: Next.js 15, React 19, TypeScript
- **Styling**: Tailwind CSS
- **Charts**: Recharts
- **Data Fetching**: SWR
- **Database**: Prisma with SQLite
- **API**: FRED API integration

## Live Demo

🌐 **[View Live Dashboard](https://sntaind.github.io/macro-watchtower/)**

## Local Development

1. Clone the repository
2. Install dependencies: `npm install`
3. Set up environment variables:
   ```bash
   FRED_API_KEY=your_fred_api_key
   ```
4. Run the development server: `npm run dev`
5. Open [http://localhost:3000](http://localhost:3000)

## Deployment

This project is automatically deployed to GitHub Pages on every push to the main branch.

## API Keys

To run locally, you'll need a FRED API key from the [Federal Reserve Bank of St. Louis](https://fred.stlouisfed.org/docs/api/api_key.html).

## License

MIT License
