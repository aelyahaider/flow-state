# Flow State - Deployment Guide

## Quick Start

Flow State is a personal wellness tracking PWA built with React. It runs entirely in your browser with local storage, no backend needed.

### Option 1: Deploy to Vercel (Recommended)

1. **Create a GitHub account** (if you don't have one)
   - Go to github.com and sign up

2. **Create a new repository**
   - Click "New repository"
   - Name it `flow-state`
   - Make it public or private (your choice)

3. **Upload these files to GitHub:**
   - `flow-state-app.jsx`
   - `index.html`
   - `manifest.json`
   - `DEPLOYMENT.md`
   - `README.md` (optional)

4. **Connect to Vercel**
   - Go to vercel.com
   - Click "New Project"
   - Import your GitHub repository
   - Vercel auto-detects the setup
   - Click "Deploy"

5. **You'll get a live URL** like `flow-state.vercel.app`

6. **Add to iPhone Home Screen:**
   - Open the URL in Safari on your iPhone
   - Tap the Share button (bottom middle)
   - Tap "Add to Home Screen"
   - Name it "Flow State"
   - Tap "Add"

### Option 2: Deploy to Netlify

1. Create a GitHub repo (same as above)

2. Go to netlify.com
   - Click "New site from Git"
   - Connect your GitHub account
   - Select the repository
   - Click "Deploy"

3. You'll get a live URL

4. Add to iPhone home screen (same as Option 1)

### Option 3: Use Locally (Testing Only)

Install Node.js, then:

```bash
npm install -g http-server
cd /path/to/your/files
http-server
```

Open `http://localhost:8080` in your browser.

---

## Adding to iPhone

1. Open Flow State in Safari on your iPhone
2. Tap the Share icon (↗️ at the bottom)
3. Scroll down and tap **"Add to Home Screen"**
4. Name it "Flow State" (or whatever you want)
5. Tap **"Add"**
6. The app now appears as an icon on your home screen
7. Tap it to launch — it works offline!

---

## Setting Up Apple Shortcuts

Once the app is on your home screen, create reminders using Apple Shortcuts:

### Shortcut 1: Morning Sleep Log Reminder (7 AM)

1. Open **Shortcuts** app
2. Tap **"Create Shortcut"**
3. Search for **"Send Notification"** and add it
   - Title: "Good morning! ☀️"
   - Message: "Log your sleep from last night"
4. Below that, add **"Open URL"**
   - URL: `https://your-vercel-url.app` (replace with your actual URL)
5. Tap the clock icon at top right, set to **Repeat: Daily at 7:00 AM**
6. Tap "Done"

### Shortcut 2: Evening Prayer Reminder (6 PM)

1. **Create Shortcut** (same steps)
2. Notification: "Time to pray 🌙"
3. Open the app URL
4. Set to **Repeat: Daily at 6:00 PM**

### Shortcut 3: Evening Chores (8 PM)

Similar setup, different time and message.

---

## Data Privacy

✅ **All your data stays on your phone**
- No server storage
- No accounts needed
- No data sent anywhere
- Just browser local storage

If you uninstall the app, data is lost. To backup:
- Use browser developer tools (Settings → Developer → Console)
- Copy your localStorage data periodically

---

## Features Checklist

- [x] Period tracking with cycle prediction
- [x] Sleep logger with weekly graph
- [x] Calendar with color-coded events
- [x] Prayer tracker (auto-hides during menstruation)
- [x] Chores manager
- [x] Budget/expense tracker
- [x] Quick actions menu
- [x] Home recap dashboard
- [x] Monthly recap (generates on the 1st)
- [x] Offline support
- [x] iOS PWA compatibility

---

## Troubleshooting

**App not adding to home screen?**
- Make sure you're using Safari (not Chrome)
- Try refreshing the page first
- On iOS 16+, swipe down from the home screen, search for the app, and long-press to add

**Data not saving?**
- Check browser settings — local storage might be disabled
- Try incognito/private mode to test
- Safari private browsing disables storage by default

**Can't see notifications?**
- iOS PWAs don't support push notifications
- Use Apple Shortcuts instead (see above)
- Notifications appear in-app when you open the app

---

## Support

If something breaks:
1. Try clearing browser cache (Settings → Safari → Clear History and Website Data)
2. Check browser console for errors (Developer menu)
3. Try a different browser
4. Reinstall the app from home screen

---

## Version Info

- Built with: React 18
- Deployed to: Vercel / Netlify
- Tested on: iPhone 11+
- Storage: Browser localStorage
- Size: ~150KB compressed

---

Happy tracking! 🌸
