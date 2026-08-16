const TelegramBot = require("node-telegram-bot-api");
const axios = require("axios");

const TOKEN =
  process.env.TELEGRAM_BOT_TOKEN ||
  "8673389951:AAGwIrzCdORWHNMZJ1ENvysu08uO4HoMQbw";

// Production-ready bot configuration
const bot = new TelegramBot(TOKEN, {
  polling: {
    interval: 300,
    autoStart: true,
    params: {
      timeout: 10,
    },
  },
});

const usernames = {};

// Error handling
bot.on("error", (error) => {
  console.error("❌ Bot Error:", error.message);
});

bot.on("polling_error", (error) => {
  console.error("❌ Polling Error:", error.message);
});

console.log("✅ LeetCode Bot Started - Running 24/7");
console.log(`🤖 Bot Token: ${TOKEN.slice(0, 10)}...`);
console.log(`📅 Started at: ${new Date().toLocaleString()}`);

bot.onText(/\/start/, (msg) => {
  const chatId = msg.chat.id;
  const helpText = `🤖 LeetCode Stats Bot

Send me your LeetCode username to get started!

📋 Commands:
/stats - Get your LeetCode stats
/help - Show this message`;

  bot.sendMessage(chatId, helpText);
});

bot.onText(/\/help/, (msg) => {
  const chatId = msg.chat.id;
  const helpText = `📚 How to use:
1. Send your LeetCode username
2. Use /stats to view your statistics
3. Send a new username anytime to update it`;

  bot.sendMessage(chatId, helpText);
});

bot.on("message", (msg) => {
  const chatId = msg.chat.id;
  const text = msg.text;

  if (text.startsWith("/")) return;

  usernames[chatId] = text;
  bot.sendMessage(
    chatId,
    `✅ Username "${text}" saved! Use /stats to view your stats.`,
  );
});

bot.onText(/\/stats/, async (msg) => {
  const chatId = msg.chat.id;

  if (!usernames[chatId]) {
    return bot.sendMessage(
      chatId,
      "❌ Please send your LeetCode username first!",
    );
  }

  try {
    bot.sendChatAction(chatId, "typing");
    const stats = await fetchLeetCodeStats(usernames[chatId]);

    let message = `📊 LeetCode Stats for @${usernames[chatId]}\n\n`;
    message += `✅ Total Solved: ${stats.totalSolved}\n\n`;
    message += `By Difficulty:\n`;

    stats.difficultyStats.forEach((stat) => {
      const emoji =
        stat.difficulty === "Easy"
          ? "🟢"
          : stat.difficulty === "Medium"
            ? "🟡"
            : "🔴";
      message += `${emoji} ${stat.difficulty}: ${stat.count}\n`;
    });

    bot.sendMessage(chatId, message);
  } catch (error) {
    console.error("Error:", error.message);
    bot.sendMessage(
      chatId,
      "❌ Invalid username or user not found. Please check and try again.",
    );
  }
});

async function fetchLeetCodeStats(username) {
  const query = {
    query: `
      query getUserProfile($username: String!) {
        matchedUser(username: $username) {
          submitStats {
            acSubmissionNum {
              difficulty
              count
            }
          }
        }
      }`,
    variables: { username: username },
  };

  try {
    const response = await axios.post("https://leetcode.com/graphql", query, {
      headers: {
        "Content-Type": "application/json",
        Referer: "https://leetcode.com/",
        "User-Agent":
          "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36",
      },
      timeout: 10000,
    });

    if (response.data.errors) {
      throw new Error(response.data.errors[0].message);
    }

    const userData = response.data.data?.matchedUser;

    if (!userData) {
      throw new Error("User not found");
    }

    const difficultyStats = userData.submitStats.acSubmissionNum;

    if (!difficultyStats || difficultyStats.length === 0) {
      throw new Error("User has no submissions");
    }

    const totalSolved = difficultyStats.reduce((sum, x) => sum + x.count, 0);

    return {
      totalSolved,
      acceptanceRate: "N/A",
      difficultyStats: difficultyStats,
    };
  } catch (error) {
    console.error("LeetCode API Error:", error.response?.data || error.message);
    throw new Error(error.message);
  }
}

// commit update 1

// commit update 2

// commit update 3

// commit update 4
