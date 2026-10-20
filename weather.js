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
  hot: 28,           // 最高気温がこれ以上なら「暑い」
  cold: 12,          // 最高気温がこれ以下なら「寒い」
  pressureDrop: 5,   // 半日でこれ以上（hPa）気圧が下がりそうなら「気圧」コメント
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

// 今の天気（ボタンを押したときに添える用）
export async function fetchCurrent(lat, lon) {
  const url = `https://api.open-meteo.com/v1/forecast?latitude=${lat}&longitude=${lon}&current=temperature_2m,weather_code&timezone=Asia%2FTokyo`;
  const c = (await (await fetch(url)).json()).current;
  return { temp: Math.round(c.temperature_2m), ...weatherInfo(c.weather_code) };
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

  const lines = [
    `🌡 ${fc.max}℃ / ${fc.min}℃　☔ ${fc.rain}%`,
    pick(s.comments[w.type]),
    pick(s.comments[tempType]),
    fc.pressureDrop >= s.pressureDrop ? pick(s.comments.pressure) : "",
  ].filter(Boolean).map(fill);

  return {
    title: `${w.emoji} ${recipient.place.name}は${w.label}`,
    body: lines.join("\n"),
    icon: iconBase ? `${iconBase.replace(/\/?$/, "/")}icons/weather/${w.icon}.png` : "",
    isRainy: w.type === "rain" || w.type === "snow",
  };
}

export async function sendBark(key, msg, server = "https://api.day.app") {
  const params = new URLSearchParams({ title: msg.title, body: msg.body, group: "天気予報" });
  if (msg.icon) params.set("icon", msg.icon);
  const res = await fetch(`${server.replace(/\/+$/, "")}/${encodeURIComponent(key)}?${params}`);
  return res.ok;
}
