# WhatsApp Kaito Bot (Node.js)

This bot can:
- Fetch Kaito "Yaps" for any X username.
- Tell if a user is "Inner CT" or not.
- Send daily trending hashtags to a WhatsApp group.

## Setup Steps
1. Clone or copy this folder.
2. Run `cp .env.example .env` and edit it.
3. Run `npm install`
4. Run `npm start` — a QR code will appear.  
   Scan it with the WhatsApp account you want to run the bot on.
5. Add the bot account to your WhatsApp group.
6. Test commands:
   - `/yaps @username`
   - `/isinner @username`
   - `/tophashtags`

## Notes
- The bot uses a public Kaito Yaps endpoint (no key required).
- It scrapes Trends24 for global trending hashtags.
- Cron job posts hashtags daily at 9 AM (server time).
