const fetch = require('node-fetch');
const cheerio = require('cheerio');

// Scrapes top hashtags from trends24.in
async function getTrendingHashtags() {
  try {
    const res = await fetch('https://trends24.in/');
    if (!res.ok) return "Couldn't fetch trends";

    const html = await res.text();
    const $ = cheerio.load(html);
    const list = [];

    $('.trend-card .trend-card__list li a').each((i, el) => {
      if (list.length >= 8) return;
      const tag = $(el).text().trim();
      if (tag.startsWith('#')) list.push(tag);
    });

    if (!list.length) return "No hashtags found";
    return '🔥 Today\'s Top Hashtags:\n' + list.join('\n');
  } catch (err) {
    console.error('Hashtag error:', err);
    return 'Error fetching hashtags';
  }
}

module.exports = { getTrendingHashtags };
