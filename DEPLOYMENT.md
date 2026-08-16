# 24/7 Deployment Guide 🚀

## **Quick Comparison**

| Method      | Cost      | Setup Time | Best For              |
| ----------- | --------- | ---------- | --------------------- |
| **PM2**     | Free      | 5 min      | Local/Windows machine |
| **Railway** | Free tier | 10 min     | Cloud (recommended)   |
| **Render**  | Free tier | 10 min     | Cloud alternative     |
| **Docker**  | Free      | 15 min     | Professional/VPS      |

---

## **Method 1: PM2 (Recommended for Local)**

### Install:

```powershell
npm install -g pm2
```

### Start Bot:

```powershell
pm2 start index.js --name "leetcode-bot"
```

### View Logs:

```powershell
pm2 logs leetcode-bot
```

### Auto-start on Windows Startup:

```powershell
pm2 startup windows
pm2 save
```

### Stop Bot:

```powershell
pm2 stop leetcode-bot
```

---

## **Method 2: Railway.app (Best for 24/7)**

### Steps:

1. **Initialize Git** (if not done)

   ```powershell
   git init
   git add .
   git commit -m "Initial commit"
   git branch -M main
   ```

2. **Create GitHub Repo**
   - Go to github.com
   - Create new repo
   - Push your code

3. **Deploy on Railway**
   - Go to https://railway.app
   - Click "New Project"
   - Select "Deploy from GitHub"
   - Choose your telegram-bot repo
   - Add variables under "Variables":
     - `TELEGRAM_BOT_TOKEN`: Your bot token from BotFather
   - Click Deploy
   - Bot runs 24/7!

### Monitor:

- View logs in Railway Dashboard
- Check status anytime

---

## **Method 3: Docker (Professional)**

### Prerequisites:

- Install Docker Desktop for Windows

### Build & Run:

```powershell
docker build -t leetcode-bot .
docker-compose up -d
```

### Commands:

```powershell
docker-compose logs -f          # View logs
docker-compose stop             # Stop bot
docker-compose start            # Start bot
docker-compose down             # Remove bot
```

---

## **Method 4: Microsoft Azure (Free Tier)**

1. Create Free Azure account
2. Create Function App (Node.js)
3. Deploy bot code
4. Set up timer trigger (every 5 minutes to keep alive)

---

## **Troubleshooting**

**Bot not responding?**

```powershell
pm2 logs leetcode-bot
```

**High memory usage?**

- Restart: `pm2 restart leetcode-bot`
- Update Node.js: `npm update`

**Token expired?**

- Update `TELEGRAM_BOT_TOKEN` environment variable
- Restart bot

---

## **Recommended Setup**

1. **Development**: Local PM2
2. **Production**: Railway.app (easiest) or Docker + VPS
3. **Best Practice**: Use environment variables, never hardcode tokens

**Your bot is ready for 24/7 deployment!** ✨
