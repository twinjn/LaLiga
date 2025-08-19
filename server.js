const express = require('express');
const cors    = require('cors');
const fetch   = (...args) => import('node-fetch').then(({default: f}) => f(...args));
require('dotenv').config();

const PORT      = 3000;                                   
const API_BASE  = 'https://api.football-data.org/v4';
const API_TOKEN = process.env.FD_API_KEY;
if (!API_TOKEN) {
  console.error('‼️  FD_API_KEY fehlt! .env anlegen oder Env-Var setzen.');      // Sicherheits-Check, falls API key fehlt
  process.exit(1);
}

const app = express();
app.use(cors());

app.use('/api', async (req, res) => {
  try {
    const upstream = API_BASE + req.originalUrl.replace('/api', '');
    console.log('→', upstream);               
    const r = await fetch(upstream, {
      headers: { 'X-Auth-Token': API_TOKEN, Accept: 'application/json' }
    });
    res.status(r.status).json(await r.json());
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: err.message });
  }
});

app.listen(PORT, () =>
  console.log(`Proxy läuft → http://localhost:${PORT}/api/...`)
);
