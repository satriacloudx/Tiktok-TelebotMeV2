# Telegram Multi-Platform Downloader Bot

Bot Telegram untuk download konten dari berbagai platform sosial media!

## Platform yang Didukung

✅ **TikTok** - Video, Foto, Audio (TikWM API - Original)
✅ **Instagram** - Video, Reels, Foto (btch-downloader)
✅ **Twitter/X** - Video, Foto (btch-downloader)
✅ **Pinterest** - Video, Foto (btch-downloader)
✅ **YouTube** - Video HD (btch-downloader)

## Fitur

- 🆓 **100% Gratis** - Tidak ada biaya atau limit
- 🚀 **Cepat** - Download dalam hitungan detik
- 🎯 **Multi-platform** - 5 platform dalam 1 bot
- 🌐 **Multi-bahasa** - Indonesia & English
- 📱 **Mudah digunakan** - Tinggal kirim link!
- 🔧 **Hybrid System** - TikTok pakai TikWM (original), platform lain pakai btch-downloader

## Teknologi

### TikTok (Original System)
- **API:** TikWM (https://www.tikwm.com/api/)
- **Kualitas:** HD tanpa watermark
- **Support:** Video, Foto slideshow, Audio

### Instagram, Twitter, Pinterest, YouTube
- **Library:** btch-downloader
- **Kualitas:** HD
- **Support:** Video, Foto, Reels

## Instalasi

1. Clone atau download repository ini

2. Install dependencies:

```bash
npm install
```

3. Setup Bot Telegram:
   - Buka [@BotFather](https://t.me/BotFather) di Telegram
   - Buat bot baru dengan command `/newbot`
   - Ikuti instruksi (nama bot, username bot)
   - Salin token yang diberikan

4. Edit file `index.js`, ganti token bot (baris 23):

```javascript
let token = "YOUR_BOT_TOKEN_HERE";
```

5. Jalankan bot:

```bash
node index.js
```

## Cara Menggunakan

1. Start chat dengan bot Anda di Telegram
2. Kirim command `/start` untuk memulai
3. Kirim link dari platform yang didukung:
   - TikTok: `https://www.tiktok.com/@username/video/...`
   - Instagram: `https://www.instagram.com/p/...` atau `https://www.instagram.com/reel/...`
   - Twitter: `https://twitter.com/username/status/...`
   - Pinterest: `https://www.pinterest.com/pin/...`
   - YouTube: `https://www.youtube.com/watch?v=...`
4. Bot akan mendownload dan mengirim konten ke Anda

## Command Bot

- `/start` - Mulai bot
- `/help` - Bantuan penggunaan
- `/lang` - Ganti bahasa (English/Indonesia)
- `/runtime` - Cek waktu aktif bot
- `/broadcast` - (Admin only) Kirim pesan ke semua user

## Keunggulan Hybrid System

### TikTok (TikWM API)
- ✅ Terbukti stabil dan reliable
- ✅ HD quality tanpa watermark
- ✅ Support foto slideshow
- ✅ Audio terpisah
- ✅ Gratis unlimited

### Instagram, Twitter, Pinterest, YouTube (btch-downloader)
- ✅ Library NPM yang aktif di-maintain
- ✅ Support multiple platform
- ✅ HD quality
- ✅ Gratis unlimited
- ✅ Mudah digunakan

## Troubleshooting

**Bot tidak merespon:**
- Pastikan token Telegram sudah benar
- Cek koneksi internet
- Restart bot

**Download gagal:**
- Pastikan link yang dikirim valid dan public
- Beberapa konten private tidak bisa didownload
- Coba lagi beberapa saat (mungkin server sedang sibuk)

**Error saat install:**
```bash
# Hapus node_modules dan install ulang
rm -rf node_modules package-lock.json
npm install
```

## Catatan Penting

- Bot ini untuk personal/educational use
- Hormati hak cipta content creator
- Jangan gunakan untuk tujuan komersial tanpa izin
- Gunakan dengan bijak dan bertanggung jawab

## Deploy ke Cloud

Bot ini bisa di-deploy ke:
- Heroku
- Railway
- Render
- VPS
- Atau hosting Node.js lainnya

## Credits

- **TikWM API** - TikTok downloader (https://www.tikwm.com/)
- **btch-downloader** - [@prm2.0](https://www.npmjs.com/package/btch-downloader)
- Bot framework - node-telegram-bot-api

## License

This project is licensed under the [MIT License](LICENSE).

## Support

Jika ada masalah atau pertanyaan:
- Baca dokumentasi ini dengan teliti
- Cek error message di console
- Pastikan semua dependencies terinstall

---

**Dibuat dengan ❤️ menggunakan TikWM API & btch-downloader library**
