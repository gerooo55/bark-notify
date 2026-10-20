// GitHub Actions から30分ごとに呼ばれ、設定した時刻になったら天気予報を Bark で送る。
// 設定はページから保存した Actions 変数 WEATHER_CONFIG（JSON）を読む。
// ※ 公開リポジトリのログは誰でも見られるので、名前・キー・地域はログに出さないこと。
import { readFileSync, writeFileSync } from "node:fs";
import { fetchForecast, buildMessage, sendBark } from "../weather.js";

const STATE_FILE = "weather-state.json";
const SEND_WINDOW_HOURS = 3; // 遅延でずれても、設定時刻から3時間以内なら送る

const raw = process.env.WEATHER_CONFIG;
if (!raw) { console.log("WEATHER_CONFIG が未設定なので何もしません"); process.exit(0); }
const config = JSON.parse(raw);
if (!config.enabled) { console.log("天気通知はオフです"); process.exit(0); }

// 日本時間の今日と今の時刻
const jst = new Date(Date.now() + 9 * 60 * 60 * 1000);
const today = jst.toISOString().slice(0, 10);
const hour = jst.getUTCHours();
const force = process.env.FORCE === "true";

let state = {};
try { state = JSON.parse(readFileSync(STATE_FILE, "utf8")); } catch {}

if (!force) {
  if (state.lastSent === today) { console.log("今日はもう送信済みです"); process.exit(0); }
  const h = config.hour ?? 7;
  if (hour < h || hour >= h + SEND_WINDOW_HOURS) { console.log(`送信時刻ではありません（今 ${hour}時）`); process.exit(0); }
}

const [owner, repo] = (process.env.GITHUB_REPOSITORY || "/").split("/");
const iconBase = `https://${owner.toLowerCase()}.github.io/${repo}/`;

let sent = 0, skipped = 0, failed = 0;
for (const r of config.recipients || []) {
  try {
    const fc = await fetchForecast(r.place.lat, r.place.lon);
    const msg = buildMessage(config, r, fc, iconBase);
    if (config.rainOnly && !msg.isRainy && fc.rain < 50) { skipped++; continue; }
    (await sendBark(r.key, msg, config.server || undefined)) ? sent++ : failed++;
  } catch {
    failed++;
  }
}
console.log(`送信 ${sent}件 / 雨じゃないのでスキップ ${skipped}件 / 失敗 ${failed}件`);

// 送ったことを記録（このファイルの更新がリポジトリの「活動」にもなり、自動実行が止められるのを防ぐ）
if (!force) writeFileSync(STATE_FILE, JSON.stringify({ lastSent: today }) + "\n");
if (failed) process.exit(1);
