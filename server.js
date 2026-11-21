// Requires Node.js 18 or newer. Keep the API key on the server.
const fs = require('fs');
const http = require('http');
const path = require('path');

function loadEnv() {
  const envPath = path.join(__dirname, '.env');
  if (!fs.existsSync(envPath)) return;

  const lines = fs.readFileSync(envPath, 'utf8').split(/\r?\n/);
  for (const line of lines) {
    const match = line.match(/^\s*([A-Za-z_][A-Za-z0-9_]*)\s*=\s*(.*?)\s*$/);
    if (!match || process.env[match[1]]) continue;

    process.env[match[1]] = match[2].replace(/^["']|["']$/g, '');
  }
}

loadEnv();

const PORT = Number(process.env.PORT || 3000);
const API_KEY = process.env.ALPHA_VANTAGE_API_KEY;

async function getAlphaVantageData(params) {
  if (!API_KEY || API_KEY === 'PASTE_YOUR_NEW_KEY_HERE') {
    throw new Error('Hay them ALPHA_VANTAGE_API_KEY vao file .env.');
  }

  const url = new URL('https://www.alphavantage.co/query');
  for (const [key, value] of Object.entries({ ...params, apikey: API_KEY })) {
    url.searchParams.set(key, value);
  }

  const response = await fetch(url);
  if (!response.ok) {
    throw new Error(`Alpha Vantage HTTP ${response.status}`);
  }

  const data = await response.json();
  const apiError = data.Note || data.Information || data['Error Message'];
  if (apiError) throw new Error(apiError);

  return data;
}

function sendJson(response, status, data) {
  response.writeHead(status, {
    'Content-Type': 'application/json; charset=utf-8',
    'Cache-Control': 'no-store'
  });
  response.end(JSON.stringify(data));
}

async function handleRequest(request, response) {
  const { pathname } = new URL(request.url, 'http://localhost');

  if (request.method === 'GET' && pathname === '/api/gold/spot') {
    try {
      const data = await getAlphaVantageData({
        function: 'GOLD_SILVER_SPOT',
        symbol: 'GOLD'
      });
      const price = Number(data.price);

      sendJson(response, 200, {
        price,
        raw: data,
        lastUpdated: data['last updated'] || data.last_updated || new Date().toISOString()
      });
    } catch (error) {
      sendJson(response, 502, { error: error.message });
    }
    return;
  }

  if (request.method === 'GET' && pathname === '/api/gold/history') {
    try {
      const data = await getAlphaVantageData({
        function: 'GOLD_SILVER_HISTORY',
        symbol: 'GOLD',
        interval: 'daily'
      });
      const rows = Array.isArray(data.data) ? data.data : [];
      const history = rows
        .map(row => ({
          date: row.date,
          value: Number(row.value ?? row.close ?? row.price)
        }))
        .filter(row => row.date && Number.isFinite(row.value))
        .reverse();

      if (!history.length) {
        throw new Error('Phan hoi lich su khong co du lieu hop le.');
      }

      sendJson(response, 200, { data: history });
    } catch (error) {
      sendJson(response, 502, { error: error.message });
    }
    return;
  }

  if (request.method === 'GET' && (pathname === '/' || pathname === '/index.html')) {
    fs.readFile(path.join(__dirname, 'index.html'), (error, html) => {
      if (error) {
        response.writeHead(500, { 'Content-Type': 'text/plain; charset=utf-8' });
        response.end('Khong the doc index.html.');
        return;
      }

      response.writeHead(200, { 'Content-Type': 'text/html; charset=utf-8' });
      response.end(html);
    });
    return;
  }

  response.writeHead(404, { 'Content-Type': 'text/plain; charset=utf-8' });
  response.end('Not found');
}

const server = http.createServer((request, response) => {
  handleRequest(request, response).catch(error => {
    console.error('Loi server:', error);
    sendJson(response, 500, { error: 'Loi server noi bo.' });
  });
});

server.listen(PORT, () => {
  console.log(`Trading Research Terminal: http://localhost:${PORT}`);
});
