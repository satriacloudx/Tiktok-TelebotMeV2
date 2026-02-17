const fs = require("fs");
const axios = require("axios");
const TelegramBot = require("node-telegram-bot-api");
const chalk = require("chalk");
const express = require("express");
const { 
  igdl,      // Instagram
  twitter,   // Twitter
  pinterest, // Pinterest
  youtube    // YouTube
} = require("btch-downloader");

const app = express();
const port = process.env.PORT || 8080;

const ADMIN_USER_ID = 7314801720;

// ===== LOAD & SAVE DATA =====
let users = [];
let userLang = {};
function loadData() {
  try {
    if (fs.existsSync("data.json")) {
      const raw = fs.readFileSync("data.json");
      const parsed = JSON.parse(raw);
      users = parsed.users || [];
      userLang = parsed.userLang || {};
      console.log("✅ Data loaded from file.");
    }
  } catch (err) {
    console.error("❌ Failed to load data:", err.message);
  }
}
function saveData() {
  try {
    const data = { users, userLang };
    fs.writeFileSync("data.json", JSON.stringify(data, null, 2));
    console.log("💾 Data saved.");
  } catch (err) {
    console.error("❌ Failed to save data:", err.message);
  }
}
loadData();

// ===== EXPRESS KEEPALIVE =====
app.get("/", (req, res) => {
  res.json({
    response: {
      status: "true",
      message: "Bot Successfully Activated!",
      author: "SATRIADEV",
    },
  });
});
app.listen(port, () => console.log(`Server on ${port}`));

// ===== BOT CONFIG =====
let token = process.env.TELEGRAM_BOT_TOKEN || "8571655439:AAF5jpoe3cGRBJtekNIbp6uCKE6kpOcoBKQ";
const bot = new TelegramBot(token, { polling: true });
let Start = new Date();

// ===== HELPER =====
const logs = (msg, color = "green") =>
  console.log(chalk[color](`[${new Date().toLocaleTimeString()}] ${msg}`));
const sleep = (ms) => new Promise((r) => setTimeout(r, ms));

function notifyAdmin(userId, name, username, link) {
  const userInfo = `📢 *User Active Interaction:*\n*User ID:* \`${userId}\`\n*Name:* ${name || "Unknown"}\n*Username:* ${username ? `@${username}` : "Unknown"}\n*Message:* ${link || "Unknown"}`;
  bot
    .sendMessage(ADMIN_USER_ID, userInfo, { parse_mode: "Markdown" })
    .catch((error) =>
      logs(`[ ERROR ] Gagal mengirim pesan ke admin: ${error.message}`, "red"),
    );
}

// ===== EXPAND SHORT URL =====
async function expandTikTokUrl(url) {
  if (/^https:\/\/(vm|vt)\.tiktok\.com\//.test(url)) {
    try {
      const res = await axios.get(url, {
        maxRedirects: 0,
        validateStatus: null,
      });
      if (res.headers.location) return res.headers.location;
    } catch (e) {
      logs("Gagal expand short url", "yellow");
    }
  }
  return url;
}

// ===== TIKWM DOWNLOAD =====
async function downloadFromTikWM(url) {
  const api = "https://www.tikwm.com/api/";
  const res = await axios.post(api, { url });
  if (!res.data || res.data.code !== 0)
    throw new Error("Invalid response TikWM");

  return {
    type: res.data.data.images ? "photo" : "video",
    video: res.data.data.hdplay || res.data.data.play,
    music: res.data.data.music || null,
    title: res.data.data.title || "TikTok Video",
    images: res.data.data.images || null, // array foto jika ada
  };
}

// ===== TIKWM DOWNLOAD (Original) =====
async function downloadFromTikWM(url) {
  const api = "https://www.tikwm.com/api/";
  const res = await axios.post(api, { url });
  if (!res.data || res.data.code !== 0)
    throw new Error("Invalid response TikWM");

  return {
    type: res.data.data.images ? "photo" : "video",
    video: res.data.data.hdplay || res.data.data.play,
    music: res.data.data.music || null,
    title: res.data.data.title || "TikTok Video",
    images: res.data.data.images || null,
  };
}

// ===== INSTAGRAM DOWNLOADER (btch-downloader) =====
async function downloadFromInstagram(url) {
  try {
    const result = await igdl(url);
    
    if (!result || !result.status || !result.data || result.data.length === 0) {
      throw new Error("No media found");
    }

    const items = result.data.map(media => ({
      type: media.type || "image",
      url: media.url,
    }));

    return {
      type: items[0].type,
      items,
      title: result.title || "Instagram Content",
    };
  } catch (error) {
    throw new Error("Failed to download Instagram content: " + error.message);
  }
}

// ===== TWITTER DOWNLOADER (btch-downloader) =====
async function downloadFromTwitter(url) {
  try {
    const result = await twitter(url);
    
    if (!result || !result.status || !result.url || result.url.length === 0) {
      throw new Error("No media found");
    }

    // Filter video URLs
    const videos = result.url.filter(item => item.url && item.url.includes('.mp4'));
    
    if (videos.length > 0) {
      // Pilih kualitas terbaik (HD)
      const hdVideo = videos.find(v => v.quality === 'HD' || v.hd) || videos[0];
      
      return {
        type: "video",
        video: hdVideo.url,
        images: null,
        title: result.title || "Twitter Content",
      };
    }

    throw new Error("No video found");
  } catch (error) {
    throw new Error("Failed to download Twitter content: " + error.message);
  }
}

// ===== PINTEREST DOWNLOADER (btch-downloader) =====
async function downloadFromPinterest(url) {
  try {
    const result = await pinterest(url);
    
    if (!result || !result.status || !result.result) {
      throw new Error("No media found");
    }

    const data = result.result;
    
    if (data.video) {
      return {
        type: "video",
        video: data.video,
        image: null,
        title: data.title || "Pinterest Content",
      };
    } else if (data.image) {
      return {
        type: "photo",
        video: null,
        image: data.image,
        title: data.title || "Pinterest Content",
      };
    }

    throw new Error("No media found");
  } catch (error) {
    throw new Error("Failed to download Pinterest content: " + error.message);
  }
}

// ===== YOUTUBE DOWNLOADER (btch-downloader) =====
async function downloadFromYouTube(url) {
  try {
    const result = await youtube(url);
    
    if (!result || !result.status || !result.mp4) {
      throw new Error("No video found");
    }

    return {
      type: "video",
      video: result.mp4,
      title: result.title || "YouTube Video",
      thumbnail: result.thumbnail,
      quality: "HD",
    };
  } catch (error) {
    throw new Error("Failed to download YouTube content: " + error.message);
  }
}

// ===== COMMANDS =====
bot.setMyCommands([
  { command: "/start", description: "Start bot" },
  { command: "/lang", description: "Change language / Ganti bahasa" },
  { command: "/runtime", description: "Check bot runtime" },
  { command: "/help", description: "Help / Bantuan" },
]);

// ===== RUNTIME =====
bot.onText(/^\/runtime$/, (msg) => {
  const From = msg.chat.id;
  const lang = userLang[From] || "EN";
  const now = new Date();
  const uptimeMs = now - Start;
  const uptimeSec = Math.floor(uptimeMs / 1000);
  const uptimeMin = Math.floor(uptimeSec / 60);
  const uptimeH = Math.floor(uptimeMin / 60);

  const uptimeMessage =
    lang === "EN"
      ? `Active: ${uptimeH} hour ${uptimeMin % 60} minute ${uptimeSec % 60} second.`
      : `Aktif: ${uptimeH} jam ${uptimeMin % 60} menit ${uptimeSec % 60} detik.`;

  bot.sendMessage(From, uptimeMessage);
});

// ===== START =====
bot.onText(/^\/start$/, (msg) => {
  const fromId = msg.chat.id;
  if (!users.includes(fromId)) {
    users.push(fromId);
    saveData();
  }

  const lang = userLang[fromId] || "EN";
  const startMsg =
    lang === "EN"
      ? "ℹ With this bot you can easily download content from TikTok, Instagram, Twitter, Pinterest, and YouTube. Just send a link!"
      : "ℹ Dengan bot ini, Anda dapat mengunduh konten dari TikTok, Instagram, Twitter, Pinterest, dan YouTube dengan mudah. Cukup kirimkan tautan!";

  bot.sendMessage(fromId, startMsg);
  notifyAdmin(msg.from.id, msg.from.first_name, msg.from.username, "/start");
});

// ===== HELP =====
bot.onText(/^\/help$/, (msg) => {
  const fromId = msg.chat.id;
  const lang = userLang[fromId] || "EN";

  const helpMsg =
    lang === "EN"
      ? `📖 Download Instructions:

Supported Platforms:
✅ TikTok
✅ Instagram
✅ Twitter
✅ Pinterest
✅ YouTube

How to use:
1. Open the app (TikTok, Instagram, Twitter, Pinterest, or YouTube).
2. Select the content you want to download.
3. Click the share button and copy the link.
4. Send the link to this bot.
5. Get your content in seconds!`
      : `📖 Petunjuk Unduh:

Platform yang Didukung:
✅ TikTok
✅ Instagram
✅ Twitter
✅ Pinterest
✅ YouTube

Cara menggunakan:
1. Buka aplikasi (TikTok, Instagram, Twitter, Pinterest, atau YouTube).
2. Pilih konten yang ingin kamu unduh.
3. Klik tombol bagikan dan salin tautan.
4. Kirim tautan ke bot ini.
5. Dapatkan kontenmu dalam hitungan detik!`;

  bot.sendMessage(fromId, helpMsg);
});

// ===== CHANGE LANGUAGE BUTTON =====
bot.onText(/^\/lang$/, (msg) => {
  const fromId = msg.chat.id;

  const inlineKeyboard = {
    reply_markup: {
      inline_keyboard: [
        [{ text: "🇬🇧 English", callback_data: "LANG_EN" }],
        [{ text: "🇮🇩 Indonesia", callback_data: "LANG_ID" }],
      ],
    },
  };

  bot.sendMessage(
    fromId,
    "🌐 Choose your language / Pilih bahasa:",
    inlineKeyboard,
  );
});

// ===== CALLBACK QUERY FOR LANGUAGE =====
bot.on("callback_query", async (query) => {
  const fromId = query.from.id;
  let selectedLang = "";

  if (query.data === "LANG_EN") selectedLang = "EN";
  if (query.data === "LANG_ID") selectedLang = "ID";
  if (!selectedLang) return;

  userLang[fromId] = selectedLang;

  // Hapus tombol
  await bot.editMessageReplyMarkup(
    { inline_keyboard: [] },
    { chat_id: query.message.chat.id, message_id: query.message.message_id },
  );

  // Kirim pesan sukses sesuai bahasa
  const langText =
    selectedLang === "EN"
      ? "🌐 Language successfully updated. You can always change the language with the /lang command."
      : "🌐 Bahasa berhasil diperbarui. Kamu selalu bisa mengubah bahasa dengan perintah /lang.";

  await bot.answerCallbackQuery(query.id);
  await bot.sendMessage(fromId, langText);
});

// ===== HANDLE ALL MESSAGES =====
bot.on("message", async (msg) => {
  const From = msg.chat.id;
  const text = msg.text;

  // Jangan notif admin kalau pesan adalah /start
  if (text && text.startsWith("/start")) return;

  notifyAdmin(msg.from.id, msg.from.first_name, msg.from.username, text);

  if (!users.includes(From)) {
    users.push(From);
    saveData();
  }

  if (text && /^\/(start|help|lang|runtime|broadcast)$/.test(text)) return;

  if (!text || !/^https?:\/\//.test(text)) return;

  const lang = userLang[From] || "EN";

  try {
    // Deteksi platform
    let platform = null;
    if (/tiktok\.com/.test(text)) platform = "tiktok";
    else if (/instagram\.com/.test(text)) platform = "instagram";
    else if (/(twitter\.com|x\.com)/.test(text)) platform = "twitter";
    else if (/pinterest\.com/.test(text)) platform = "pinterest";
    else if (/(youtube\.com|youtu\.be)/.test(text)) platform = "youtube";
    
    if (!platform) {
      return bot.sendMessage(
        From,
        lang === "EN"
          ? "❌ Unsupported link. Please send a link from TikTok, Instagram, Twitter, Pinterest, or YouTube."
          : "❌ Link tidak didukung. Kirim link dari TikTok, Instagram, Twitter, Pinterest, atau YouTube.",
      );
    }

    // TIKTOK
    if (platform === "tiktok") {
      let url = await expandTikTokUrl(text);
      const data = await downloadFromTikWM(url);
      logs("✅ Download via TikWM", "green");

      if (data.type === "photo" && data.images && data.images.length > 0) {
        await bot.sendMessage(
          From,
          lang === "ID" ? "📷 Mengunduh posting foto..." : "📷 Downloading photo post...",
        );

        for (let i = 0; i < data.images.length; i += 10) {
          const batch = data.images.slice(i, i + 10);
          const mediaGroup = batch.map((img) => ({ type: "photo", media: img }));
          await bot.sendChatAction(From, "upload_photo");
          await bot.sendMediaGroup(From, mediaGroup);
          await sleep(1000);
        }

        if (data.music) {
          await sleep(1200);
          await bot.sendAudio(From, data.music, {
            caption: lang === "ID" ? "Audio dari posting foto" : "Audio from photo post",
          });
        }
      } else if (data.video) {
        let audioCaption = "Music TikTok";
        if (data.music && data.music.author) audioCaption = `Audio - ${data.music.author}`;

        await bot.sendChatAction(From, "upload_video");
        await bot.sendVideo(From, data.video, { caption: data.title });

        if (data.music) {
          await sleep(1200);
          await bot.sendAudio(From, data.music, { caption: audioCaption });
        }
      }
    }

    // INSTAGRAM
    else if (platform === "instagram") {
      const data = await downloadFromInstagram(text);
      logs("✅ Download from Instagram", "green");

      await bot.sendMessage(
        From,
        lang === "ID" ? "📷 Mengunduh konten Instagram..." : "📷 Downloading Instagram content...",
      );

      for (const item of data.items) {
        if (item.type === "image") {
          await bot.sendChatAction(From, "upload_photo");
          await bot.sendPhoto(From, item.url);
        } else if (item.type === "video") {
          await bot.sendChatAction(From, "upload_video");
          await bot.sendVideo(From, item.url);
        }
        await sleep(800);
      }
    }

    // TWITTER
    else if (platform === "twitter") {
      const data = await downloadFromTwitter(text);
      logs("✅ Download from Twitter", "green");

      await bot.sendMessage(
        From,
        lang === "ID" ? "🐦 Mengunduh konten Twitter..." : "🐦 Downloading Twitter content...",
      );

      if (data.type === "video" && data.video) {
        await bot.sendChatAction(From, "upload_video");
        await bot.sendVideo(From, data.video, { caption: data.title });
      } else if (data.type === "image" && data.images) {
        for (const img of data.images) {
          await bot.sendChatAction(From, "upload_photo");
          await bot.sendPhoto(From, img);
          await sleep(800);
        }
      }
    }

    // PINTEREST
    else if (platform === "pinterest") {
      const data = await downloadFromPinterest(text);
      logs("✅ Download from Pinterest", "green");

      await bot.sendMessage(
        From,
        lang === "ID" ? "📌 Mengunduh konten Pinterest..." : "📌 Downloading Pinterest content...",
      );

      if (data.type === "video" && data.video) {
        await bot.sendChatAction(From, "upload_video");
        await bot.sendVideo(From, data.video, { caption: data.title });
      } else if (data.image) {
        await bot.sendChatAction(From, "upload_photo");
        await bot.sendPhoto(From, data.image, { caption: data.title });
      }
    }

    // YOUTUBE
    else if (platform === "youtube") {
      const data = await downloadFromYouTube(text);
      logs("✅ Download from YouTube", "green");

      await bot.sendMessage(
        From,
        lang === "ID" ? "🎥 Mengunduh video YouTube..." : "🎥 Downloading YouTube video...",
      );

      await bot.sendChatAction(From, "upload_video");
      await bot.sendVideo(From, data.video, { caption: data.title });
    }

    bot.sendMessage(
      From,
      lang === "EN" ? "✅ Download complete!" : "✅ Unduhan selesai!",
    );
  } catch (e) {
    logs(`ERROR: ${e.message}`, "red");
    bot.sendMessage(
      From,
      lang === "EN"
        ? "❌ Failed to download content. Please try again."
        : "❌ Gagal mengunduh konten. Silakan coba lagi.",
    );
  }
});

// ===== BROADCAST (ADMIN ONLY) =====
bot.onText(/^\/broadcast(?:\s+([\s\S]+))?$/i, async (msg, match) => {
  const fromId = msg.chat.id;
  if (fromId !== ADMIN_USER_ID)
    return bot.sendMessage(fromId, "❌ You don't have access to this command.");

  let content = match[1];
  let reply = msg.reply_to_message;

  if (!content && !reply)
    return bot.sendMessage(
      fromId,
      "ℹ Usage:\n- `/broadcast text`\n- Reply to media then type `/broadcast`",
    );

  if (users.length === 0)
    return bot.sendMessage(
      fromId,
      "⚠ No users to broadcast. Ask users to send /start first.",
    );

  bot.sendMessage(fromId, `🚀 Broadcast starting to ${users.length} users...`);
  let success = 0;

  for (let uid of users) {
    try {
      if (content) {
        await bot.sendMessage(uid, `📢 Broadcast:\n\n${content}`);
      } else if (reply) {
        if (reply.photo) {
          const fileId = reply.photo[reply.photo.length - 1].file_id;
          await bot.sendPhoto(uid, fileId, {
            caption: reply.caption || "📢 Broadcast",
          });
        } else if (reply.video) {
          await bot.sendVideo(uid, reply.video.file_id, {
            caption: reply.caption || "📢 Broadcast",
          });
        } else if (reply.document) {
          await bot.sendDocument(uid, reply.document.file_id, {
            caption: reply.caption || "📢 Broadcast",
          });
        } else if (reply.audio) {
          await bot.sendAudio(uid, reply.audio.file_id, {
            caption: reply.caption || "📢 Broadcast",
          });
        } else if (reply.voice) {
          await bot.sendVoice(uid, reply.voice.file_id, {
            caption: "📢 Broadcast",
          });
        } else if (reply.text) {
          await bot.sendMessage(uid, `📢 Broadcast:\n\n${reply.text}`);
        }
      }
      success++;
      await sleep(300);
    } catch (e) {
      logs(`Failed to send to ${uid}: ${e.message}`, "red");
    }
  }

  bot.sendMessage(
    fromId,
    `✅ Broadcast complete. Sent to ${success}/${users.length} users.`,
  );
});
