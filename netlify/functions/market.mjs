// Simple market data function without external dependencies
const SYMBOL_MAP = {
  DXY: "DX-Y.NYB", // US Dollar Index
  NDX: "^IXIC", // NASDAQ Composite
  SPX: "^GSPC", // S&P 500
  VIX: "^VIX", // VIX
  USDKRW: "KRW=X", // USD/KRW
  KOSPI: "^KS11", // KOSPI
  GOLD: "GLD", // SPDR Gold Trust ETF
  BTC: "BTC-USD", // Bitcoin USD
};

export default async (req, context) => {
  // Enable CORS
  const headers = {
    'Access-Control-Allow-Origin': '*',
    'Access-Control-Allow-Headers': 'Content-Type',
    'Access-Control-Allow-Methods': 'GET, OPTIONS',
    'Content-Type': 'application/json',
  };

  // Handle OPTIONS request for CORS
  if (req.method === 'OPTIONS') {
    return new Response(null, { status: 204, headers });
  }

  try {
    const url = new URL(req.url);
    const symbol = url.searchParams.get('symbol');

    if (!symbol) {
      return new Response(
        JSON.stringify({ error: 'Symbol parameter is required' }),
        { status: 400, headers }
      );
    }

    const yahooSymbol = SYMBOL_MAP[symbol];

    if (!yahooSymbol) {
      return new Response(
        JSON.stringify({ error: 'Invalid symbol' }),
        { status: 400, headers }
      );
    }

    // Use Yahoo Finance API directly via fetch
    const yahooUrl = `https://query1.finance.yahoo.com/v8/finance/chart/${yahooSymbol}`;
    const response = await fetch(yahooUrl);
    
    if (!response.ok) {
      throw new Error(`Yahoo Finance API error: ${response.status}`);
    }

    const data = await response.json();
    const result = data.chart.result[0];
    
    if (!result || !result.meta) {
      return new Response(
        JSON.stringify({ error: 'No data available' }),
        { status: 404, headers }
      );
    }

    const meta = result.meta;
    let value = meta.regularMarketPrice || meta.previousClose;
    const change = meta.regularMarketChangePercent || 0;

    // For BTC-KRW conversion (BTC in USD -> KRW)
    if (symbol === "BTC") {
      try {
        const usdKrwResponse = await fetch('https://query1.finance.yahoo.com/v8/finance/chart/KRW=X');
        const usdKrwData = await usdKrwResponse.json();
        const usdKrwRate = usdKrwData.chart.result[0]?.meta?.regularMarketPrice || 1300;
        value = value * usdKrwRate; // Convert BTC-USD to BTC-KRW
      } catch (e) {
        // Fallback to default rate
        value = value * 1300;
      }
    }

    // Round to 2 decimal places for most symbols, but keep integers for large values
    const roundedValue = symbol === 'BTC' || symbol === 'USDKRW' || symbol === 'KOSPI' 
      ? Math.round(value) 
      : parseFloat(value.toFixed(2));

    return new Response(
      JSON.stringify({
        symbol,
        value: roundedValue,
        change: parseFloat(change.toFixed(2)),
        lastUpdate: new Date().toISOString(),
      }),
      { status: 200, headers }
    );
  } catch (error) {
    console.error('Market data API error:', error);
    return new Response(
      JSON.stringify({ error: 'Failed to fetch market data' }),
      { status: 500, headers }
    );
  }
};

export const config = {
  path: "/api/market"
};