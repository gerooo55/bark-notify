// 天気予報まわりの共通処理。ページ（index.html）と GitHub Actions（scripts/send-weather.mjs）の両方から使う。
// 天気データは Open-Meteo（無料・登録不要）を利用。

// コメントのカテゴリ。key は設定データの名前、label は画面の表示名
export const COMMENT_TYPES = [
  { key: "sunny",    label: "☀️ 晴れ" },
  { key: "cloudy",   label: "☁️ くもり" },
  { key: "rain",     label: "☔ 雨" },
  { key: "snow",     label: "⛄ 雪" },
  { key: "hot",      label: "🥵 暑い" },
  { key: "cold",     label: "🥶 寒い" },
  { key: "mild",     label: "😊 ちょうどいい" },
  { key: "pressure", label: "🌀 気圧が下がる" },
];

export const DEFAULT_WEATHER_SETTINGS = {
  enabled: false,
  hour: 7,           // 毎朝この時（日本時間）に送る
  rainOnly: false,   // true なら雨・雪の日だけ送る
  hot: 30,           // 最高気温がこれ以上なら「暑い」
  cold: 10,          // 最高気温がこれ以下なら「寒い」
  pressureDrop: 5,   // 半日でこれ以上（hPa）気圧が下がりそうなら「気圧」コメント
  topics: true,      // 満月や七夕などの「今日の小ネタ」を付ける
  comments: {
    sunny:    ["いい天気だね！洗濯日和だよ", "お日さまが出てるよ〜"],
    cloudy:   ["今日はくもりだよ", "どんより空だけど元気にいこ"],
    rain:     ["傘を忘れないでね☂️", "雨だから足元気をつけてね"],
    snow:     ["雪だよ！滑らないようにね", "あったかくしてね⛄"],
    hot:      ["暑くなりそう！水分とってね", "熱中症に気をつけてね"],
    cold:     ["寒いから上着を持ってね", "あったかくして出かけてね"],
    mild:     ["過ごしやすい気温だよ", "ちょうどいい気温だね"],
    pressure: ["気圧が下がりそう…無理しないでね", "頭痛に気をつけてね"],
  },
};

// WMO 天気コード → 表示名・絵文字・コメントの種類・アイコン画像
export function weatherInfo(code) {
  if (code === 0) return { label: "晴れ", emoji: "☀️", type: "sunny", icon: "sunny" };
  if (code <= 2) return { label: "晴れ時々くもり", emoji: "🌤", type: "sunny", icon: "partly" };
  if (code === 3) return { label: "くもり", emoji: "☁️", type: "cloudy", icon: "cloudy" };
  if (code === 45 || code === 48) return { label: "霧", emoji: "🌫", type: "cloudy", icon: "fog" };
  if ((code >= 51 && code <= 57)) return { label: "小雨", emoji: "🌦", type: "rain", icon: "rain" };
  if (code === 61 || code === 63 || code === 66 || code === 80 || code === 81)
    return { label: "雨", emoji: "☔", type: "rain", icon: "rain" };
  if (code === 65 || code === 67 || code === 82) return { label: "大雨", emoji: "☔", type: "rain", icon: "heavy" };
  if ((code >= 71 && code <= 77) || code === 85 || code === 86) return { label: "雪", emoji: "⛄", type: "snow", icon: "snow" };
  if (code >= 95) return { label: "雷雨", emoji: "⛈", type: "rain", icon: "thunder" };
  return { label: "くもり", emoji: "☁️", type: "cloudy", icon: "cloudy" };
}

// 地名検索（日本の地名を日本語で）
export async function searchPlace(query) {
  const url = `https://geocoding-api.open-meteo.com/v1/search?name=${encodeURIComponent(query)}&count=6&language=ja&countryCode=JP`;
  const data = await (await fetch(url)).json();
  return (data.results || []).map(r => ({
    name: r.name,
    detail: [r.admin1, r.admin2].filter(Boolean).join(" "),
    lat: r.latitude,
    lon: r.longitude,
  }));
}

// 今日の予報 + 気圧の下がり幅
export async function fetchForecast(lat, lon) {
  const url = `https://api.open-meteo.com/v1/forecast?latitude=${lat}&longitude=${lon}`
    + `&daily=weather_code,temperature_2m_max,temperature_2m_min,precipitation_probability_max`
    + `&hourly=pressure_msl&timezone=Asia%2FTokyo&past_days=1&forecast_days=1`;
  const f = await (await fetch(url)).json();
  const d = f.daily, i = d.time.length - 1; // 最後の日 = 今日

  // 今日の各時刻について「直前12時間の最高気圧からどれだけ下がったか」の最大値
  const p = f.hourly.pressure_msl;
  let drop = 0;
  for (let h = 24; h < p.length; h++) {
    const before = Math.max(...p.slice(h - 12, h));
    drop = Math.max(drop, before - p[h]);
  }

  return {
    code: d.weather_code[i],
    max: Math.round(d.temperature_2m_max[i]),
    min: Math.round(d.temperature_2m_min[i]),
    rain: d.precipitation_probability_max[i] ?? 0,
    pressureDrop: Math.round(drop * 10) / 10,
  };
}

// ---- 今日の小ネタ（月の満ち欠け・季節の行事）----

// 日本時間の年月日・曜日
export function jstToday(now = Date.now()) {
  const t = new Date(now + 9 * 60 * 60 * 1000);
  return { y: t.getUTCFullYear(), m: t.getUTCMonth() + 1, d: t.getUTCDate(), dow: t.getUTCDay() };
}

// 太陽と月の黄経の差（月齢の角度）。簡易計算だけど誤差は1時間程度
const rad = Math.PI / 180;
function moonElongation(ms) {
  const n = ms / 86400000 - 10957.5; // J2000.0 からの日数
  const g = (357.528 + 0.9856003 * n) * rad;
  const sun = 280.460 + 0.9856474 * n + 1.915 * Math.sin(g) + 0.020 * Math.sin(2 * g);
  const Mm = (134.963 + 13.064993 * n) * rad;
  const D = (297.850 + 12.190749 * n) * rad;
  const F = (93.272 + 13.229350 * n) * rad;
  const moon = 218.316 + 13.176396 * n + 6.289 * Math.sin(Mm) + 1.274 * Math.sin(2 * D - Mm)
    + 0.658 * Math.sin(2 * D) + 0.214 * Math.sin(2 * Mm) - 0.186 * Math.sin(g) - 0.114 * Math.sin(2 * F);
  return ((moon - sun) % 360 + 360) % 360;
}

// 今日（日本時間の0時〜24時）に新月・上弦・満月・下弦の瞬間があればそれを返す
export function moonEvent({ y, m, d }) {
  const start = Date.UTC(y, m - 1, d) - 9 * 60 * 60 * 1000;
  const a = moonElongation(start), b = moonElongation(start + 86400000);
  const phases = [
    { deg: 0,   text: "🌑 今日は新月だよ" },
    { deg: 90,  text: "🌓 今日は上弦の月だよ" },
    { deg: 180, text: "🌕 今日は満月だよ" },
    { deg: 270, text: "🌗 今日は下弦の月だよ" },
  ];
  // 1日で約12度進むので、a → b の間に目標の角度をまたいだかを見る
  const crossed = deg => ((deg - a + 360) % 360) < ((b - a + 360) % 360);
  return phases.find(p => crossed(p.deg))?.text || "";
}

// 春分・夏至・秋分・冬至・立春の日付（1980〜2099年で使える近似式）
const solarDay = (y, base) => Math.floor(base + 0.242194 * (y - 1980) - Math.floor((y - 1980) / 4));
const risshun = y => Math.floor(3.8693 + 0.242713 * (y - 1980) - Math.floor((y - 1981) / 4)); // 2月はまだその年のうるう日前
// その月の第 n 日曜日
const nthSunday = (y, m, n) => { const first = new Date(Date.UTC(y, m - 1, 1)).getUTCDay(); return 1 + (7 - first) % 7 + (n - 1) * 7; };

export function seasonalEvents({ y, m, d }) {
  const list = [
    [1, 1, "🎍 あけましておめでとう！"],
    [2, risshun(y) - 1, "👹 今日は節分！鬼は外〜"],
    [2, 14, "💝 今日はバレンタイン"],
    [3, 3, "🎎 今日はひな祭り"],
    [3, solarDay(y, 20.8431), "🌸 今日は春分の日"],
    [3, 14, "🍪 今日はホワイトデー"],
    [4, 1, "🤡 今日はエイプリルフール"],
    [5, 5, "🎏 今日はこどもの日"],
    [5, nthSunday(y, 5, 2), "💐 今日は母の日"],
    [6, solarDay(y, 21.851),"☀️ 今日は夏至。一年で一番昼が長い日"],
    [6, nthSunday(y, 6, 3), "👔 今日は父の日"],
    [7, 7, "🎋 今日は七夕！"],
    [9, solarDay(y, 23.2488), "🍁 今日は秋分の日"],
    [10, 31, "🎃 今日はハロウィン！"],
    [12, solarDay(y, 22.6587), "🍊 今日は冬至。ゆず湯の日"],
    [12, 24, "🎄 今日はクリスマスイブ"],
    [12, 25, "🎅 メリークリスマス！"],
    [12, 31, "🔔 今日は大晦日。今年もありがとう"],
  ];
  return list.filter(([mm, dd]) => mm === m && dd === d).map(e => e[2]);
}

// 今日の小ネタをまとめて（行事 → 月の順）
export function todayTopics(now = Date.now()) {
  const t = jstToday(now);
  return [...seasonalEvents(t), moonEvent(t)].filter(Boolean);
}

const pick = list => {
  const lines = (list || []).map(s => s.trim()).filter(Boolean);
  return lines.length ? lines[Math.floor(Math.random() * lines.length)] : "";
};

// 通知の中身を作る。iconBase は icons/weather/ がある場所の URL
export function buildMessage(settings, recipient, fc, iconBase) {
  const s = { ...DEFAULT_WEATHER_SETTINGS, ...settings };
  const w = weatherInfo(fc.code);
  const tempType = fc.max >= s.hot ? "hot" : fc.max <= s.cold ? "cold" : "mild";
  const fill = t => t.replaceAll("{name}", recipient.name).replaceAll("{max}", fc.max).replaceAll("{min}", fc.min);

  // iPhone の通知は「タイトル・サブタイトル・本文2行」までしかパッと見えないので、
  // 数字はサブタイトルにまとめ、本文は1行目＝天気と気温のコメント、2行目＝気圧や小ネタ（なければ気温のコメント）にする
  const normal = [pick(s.comments[w.type]), pick(s.comments[tempType])].filter(Boolean).map(fill);
  const special = [
    fc.pressureDrop >= s.pressureDrop ? pick(s.comments.pressure) : "",
    ...(s.topics ? todayTopics() : []),
  ].filter(Boolean).map(fill);
  const lines = special.length ? [normal.join(" "), special.join(" ")] : normal;

  return {
    title: `${w.emoji} ${recipient.place.name}は${w.label}`,
    subtitle: `🌡 ${fc.max}℃ / ${fc.min}℃　☔ ${fc.rain}%`,
    body: lines.filter(Boolean).join("\n"),
    icon: iconBase ? `${iconBase.replace(/\/?$/, "/")}icons/weather/${w.icon}.png` : "",
    isRainy: w.type === "rain" || w.type === "snow",
  };
}

export async function sendBark(key, msg, server = "https://api.day.app") {
  const params = new URLSearchParams({ title: msg.title, body: msg.body, group: "天気予報" });
  if (msg.subtitle) params.set("subtitle", msg.subtitle);
  if (msg.icon) params.set("icon", msg.icon);
  const res = await fetch(`${server.replace(/\/+$/, "")}/${encodeURIComponent(key)}?${params}`);
  return res.ok;
}
