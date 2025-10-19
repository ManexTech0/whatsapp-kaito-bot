const fetch = require('node-fetch');
const BASE = process.env.KAITO_API_BASE || 'https://api.kaito.ai/api/v1';

async function getKaitoYaps(username) {
  try {
    const url = `${BASE}/yaps?username=${encodeURIComponent(username)}`;
    const res = await fetch(url);
    if (!res.ok) {
      console.warn('Kaito fetch failed:', res.status);
      return 0;
    }
    const json = await res.json();
    const yaps = json.yaps_count ?? json.yaps ?? json.score ?? json.yap ?? 0;
    return Number(yaps) || 0;
  } catch (err) {
    console.error('getKaitoYaps error', err);
    return 0;
  }
}

module.exports = { getKaitoYaps };
