const { Client, LocalAuth } = require('whatsapp-web.js');
const qrcode = require('qrcode-terminal');
const express = require('express');
const cron = require('node-cron');
const dotenv = require('dotenv');

dotenv.config();

const { getKaitoYaps } = require('./helpers/kaito');
const { getTrendingHashtags } = require('./helpers/hashtags');
const db = require('./helpers/db');

const app = express();
const port = process.env.PORT || 3000;

const client = new Client({
  authStrategy: new LocalAuth(),
  puppeteer: { headless: true }
});

client.on('qr', qr => {
  qrcode.generate(qr, { small: true });
  console.log('Scan the QR code above to authenticate your WhatsApp session');
});

client.on('ready', () => console.log('✅ WhatsApp client ready!'));

client.on('message', async msg => {
  try {
    const body = msg.body.trim().toLowerCase();

    if (body.startsWith('/yaps')) {
      const username = msg.body.split('@')[1];
      if (!username) return msg.reply('Usage: /yaps @username');
      const yaps = await getKaitoYaps(username);
      db.updateUserYaps(username, yaps);
      const isInnerCT = yaps >= 1000;
      return msg.reply(`@${username} has ${yaps} yaps.\nStatus: ${isInnerCT ? 'Inner CT ✅' : 'Not Inner CT ❌'}`);
    }

    if (body.startsWith('/isinner')) {
      const username = msg.body.split('@')[1];
      if (!username) return msg.reply('Usage: /isinner @username');
      const yaps = await getKaitoYaps(username);
      const isInnerCT = yaps >= 1000;
      return msg.reply(`@${username} is ${isInnerCT ? 'an Inner CT ✅' : 'not an Inner CT ❌'} (yaps: ${yaps})`);
    }

    if (body.startsWith('/tophashtags')) {
      const hashtags = await getTrendingHashtags();
      return msg.reply(hashtags);
    }

  } catch (err) {
    console.error('Error:', err);
    msg.reply('⚠️ Error processing your command.');
  }
});

// Daily hashtags cron job
const groupId = process.env.GROUP_ID;
const cronSchedule = process.env.CRON_SCHEDULE || '0 9 * * *';
cron.schedule(cronSchedule, async () => {
  try {
    if (!groupId) return console.log('GROUP_ID not set, skipping scheduled post');
    const hashtags = await getTrendingHashtags();
    await client.sendMessage(groupId, hashtags);
    console.log('✅ Sent daily hashtags');
  } catch (err) {
    console.error('cron job error', err);
  }
});

app.get('/', (_, res) => res.send('WhatsApp Kaito Bot is running'));
app.listen(port, () => console.log(`Server running on port ${port}`));

client.initialize();
