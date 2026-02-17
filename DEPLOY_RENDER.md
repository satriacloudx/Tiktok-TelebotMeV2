# Deploy ke Render.com

Panduan lengkap deploy bot ke Render.com

## Langkah 1: Persiapan

### 1.1 Dapatkan Bot Token
1. Buka [@BotFather](https://t.me/BotFather) di Telegram
2. Kirim `/newbot`
3. Ikuti instruksi
4. Salin token yang diberikan

### 1.2 Push ke GitHub (Opsional)
Jika belum di GitHub:
```bash
git init
git add .
git commit -m "Initial commit"
git remote add origin YOUR_GITHUB_REPO_URL
git push -u origin main
```

## Langkah 2: Setup di Render

### 2.1 Buat Akun
1. Buka [render.com](https://render.com/)
2. Sign up dengan GitHub

### 2.2 Buat Web Service
1. Klik **New +** → **Web Service**
2. Connect repository Anda
3. Atau pilih **Deploy from Git URL** jika tidak pakai GitHub

### 2.3 Konfigurasi Service

**Basic Settings:**
- **Name:** `tiktok-downloader-bot` (atau nama lain)
- **Region:** Singapore (atau terdekat)
- **Branch:** `main`
- **Root Directory:** (kosongkan)
- **Runtime:** `Node`
- **Build Command:** `npm install`
- **Start Command:** `npm start`

**Instance Type:**
- Pilih **Free** (gratis)

### 2.4 Environment Variables
Klik **Advanced** → **Add Environment Variable**

Tambahkan:
```
Key: TELEGRAM_BOT_TOKEN
Value: YOUR_BOT_TOKEN_HERE
```

**PENTING:** Jangan lupa ganti `YOUR_BOT_TOKEN_HERE` dengan token asli dari BotFather!

### 2.5 Deploy
1. Klik **Create Web Service**
2. Tunggu proses build & deploy (5-10 menit)
3. Status akan berubah menjadi **Live** jika berhasil

## Langkah 3: Update Bot Token di Code

### Opsi A: Menggunakan Environment Variable (Recommended)
Edit `index.js` baris 23:
```javascript
let token = process.env.TELEGRAM_BOT_TOKEN || "YOUR_BOT_TOKEN_HERE";
```

### Opsi B: Hardcode Token
Edit `index.js` baris 23:
```javascript
let token = "YOUR_BOT_TOKEN_HERE";
```

**Note:** Opsi A lebih aman karena token tidak ter-commit ke Git.

## Langkah 4: Verifikasi

### 4.1 Cek Logs
Di Render dashboard:
1. Klik service Anda
2. Klik tab **Logs**
3. Pastikan muncul:
   ```
   ✅ Data loaded from file.
   Server on 8080
   ```

### 4.2 Test Bot
1. Buka bot di Telegram
2. Kirim `/start`
3. Kirim link TikTok/Instagram/Twitter/Pinterest/YouTube
4. Bot harus merespon dan download

## Troubleshooting

### Bot tidak merespon
**Solusi:**
1. Cek logs di Render
2. Pastikan token benar
3. Restart service: **Manual Deploy** → **Clear build cache & deploy**

### Error saat build
**Solusi:**
```bash
# Pastikan package.json benar
# Cek Build Command: npm install
# Cek Start Command: npm start
```

### Bot crash setelah beberapa saat
**Solusi:**
- Render free tier akan sleep setelah 15 menit tidak ada request
- Bot akan auto-restart saat ada request baru
- Untuk 24/7 uptime, upgrade ke paid plan ($7/bulan)

### Error "Cannot find module"
**Solusi:**
1. Hapus `node_modules` dan `package-lock.json`
2. Push ke Git
3. Redeploy di Render

## Tips Deployment

### 1. Keep Alive (Opsional)
Bot sudah punya Express server di port 8080 untuk keep alive.
Render akan auto-ping service untuk keep it alive.

### 2. Auto Deploy
Setiap push ke GitHub akan auto-deploy ke Render.

### 3. Monitoring
- Cek logs secara berkala
- Monitor error messages
- Cek user activity

### 4. Update Bot
```bash
# Edit code
git add .
git commit -m "Update bot"
git push

# Render akan auto-deploy
```

## Render Free Tier Limits

- ✅ 750 hours/bulan (cukup untuk 1 service 24/7)
- ✅ Auto sleep setelah 15 menit idle
- ✅ Auto wake on request
- ✅ 512 MB RAM
- ✅ 0.1 CPU

**Cukup untuk bot dengan traffic sedang!**

## Alternative: Manual Deploy

Jika tidak pakai Git:

1. Zip semua file (kecuali node_modules)
2. Upload ke Render via **Deploy from Git URL**
3. Atau gunakan Render CLI

## Support

Jika ada masalah:
- Cek [Render Docs](https://render.com/docs)
- Cek logs di Render dashboard
- Pastikan semua environment variables benar

---

**Bot siap production di Render! 🚀**
