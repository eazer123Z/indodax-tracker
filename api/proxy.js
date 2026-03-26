// Vercel Serverless Proxy for Indodax API
export default async function handler(req, res) {
  const { endpoint } = req.query;
  
  // Whitelist allowed endpoints
  const allowed = ['summaries', 'tickers', 'server_time', 'pairs', 'depth', 'trades', 'price_increments'];
  const path = (endpoint || '').replace('.json', '');
  
  if (!path || (!allowed.includes(path) && !path.match(/^ticker\//))) {
    return res.status(400).json({ error: 'Invalid endpoint' });
  }

  try {
    const url = `https://indodax.com/api/${path}`;
    const response = await fetch(url, { 
      headers: { 'User-Agent': 'IndodaxTracker/1.0' },
      signal: AbortSignal.timeout(10000)
    });
    const data = await response.json();
    
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Cache-Control', 's-maxage=10, stale-while-revalidate=30');
    res.status(200).json(data);
  } catch (e) {
    res.status(500).json({ error: e.message });
  }
}
