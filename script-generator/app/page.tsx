"use client";

import { useState, useEffect } from "react";

type ContentType = "youtube" | "podcast";
type Plan = "pro" | "max";

const TESTIMONIALS_ROW1 = [
  { name: "田中 健太", role: "YouTuber・登録者2万人", avatar: "👨‍💻", rating: 5, text: "今まで台本作りに2〜3時間かかっていたのが、ScriptAIで15分に短縮。構成のクオリティも上がって視聴維持率が上がりました！" },
  { name: "佐藤 美咲", role: "Podcastホスト", avatar: "👩‍🎤", rating: 5, text: "毎週エピソードを出しているので、台本の速度が命。AIが自然な話し言葉で書いてくれるのが本当に助かります。" },
  { name: "鈴木 大輔", role: "フリーランスライター", avatar: "🧑‍🎨", rating: 5, text: "クライアントの動画台本制作に使っています。ゼロから考えるより遥かに早く、修正も少ない。コスパ最高です。" },
  { name: "中村 さくら", role: "ビジネス系YouTuber", avatar: "👩‍💼", rating: 5, text: "プロフェッショナルなトーンで台本を書いてくれるので、そのまま使えることが多い。Maxプランに入って毎日使っています。" },
  { name: "高橋 翔", role: "マーケター", avatar: "👨‍💼", rating: 4, text: "商品紹介動画の台本に使い始めてから制作スピードが3倍に。SEOを意識した説明文まで自動で作ってくれるのが嬉しい。" },
  { name: "伊藤 玲奈", role: "教育系コンテンツ制作", avatar: "👩‍🏫", rating: 5, text: "子ども向けの解説動画を毎週作っています。トーン設定が細かくできるので、ターゲットに合った表現になるのが気に入っています。" },
];

const TESTIMONIALS_ROW2 = [
  { name: "渡辺 浩二", role: "旅行Vlogger", avatar: "🧳", rating: 5, text: "旅先でアイデアが浮かんだらすぐ台本化。スマホでもサクッと使えるので、旅のスピード感にぴったりです。" },
  { name: "山田 あゆみ", role: "料理チャンネル運営", avatar: "👩‍🍳", rating: 5, text: "レシピ動画の台本は細かい説明が必要で大変でしたが、ScriptAIが構成ごと丁寧に作ってくれます。もっと早く使えばよかった。" },
  { name: "小林 誠一郎", role: "IT系解説チャンネル", avatar: "👨‍🔬", rating: 5, text: "専門用語が多い内容でも、わかりやすい台本に変換してくれる。初心者向けと上級者向けでトーンを変えて使い分けています。" },
  { name: "加藤 ひかり", role: "ライフスタイル系YouTuber", avatar: "🌸", rating: 4, text: "台本を書くのが苦手だったのですが、ScriptAIのおかげで自信を持ってカメラの前に立てるようになりました！" },
  { name: "松本 隆史", role: "ビジネスPodcast", avatar: "🎙️", rating: 5, text: "週3本のPodcast配信をしていますが、ネタ出しから台本まで全部サポートしてもらっています。ゲスト回も対応できて最高。" },
  { name: "吉田 菜々", role: "副業YouTuber", avatar: "💫", rating: 5, text: "本業が忙しくて更新頻度を保てていなかったのですが、ScriptAIで制作時間を大幅に削減。週1更新を継続できるようになりました。" },
];

// ── Static data ──────────────────────────────────────────────
const FEATURES = [
  { tag: "YouTube", tagColor: "#ff6b2b", tagBg: "#fff3ee", img: "/feature-1.png", title: "YouTube台本を自動生成", desc: "動画構成・台本全文・サムネイルテキスト・説明文・タグまでワンクリックで完成。" },
  { tag: "Podcast", tagColor: "#005aff", tagBg: "#eef3ff", img: "/feature-2.png", title: "Podcast台本も対応", desc: "イントロ・アウトロ・チャプターリスト・Show Notesまで含めた完全なエピソード台本を生成。" },
  { tag: "SEO", tagColor: "#16a34a", tagBg: "#f0fdf4", img: "/feature-3.png", title: "SEO最適化コンテンツ", desc: "検索上位を狙えるタイトル・説明文・タグを自動提案。視聴数アップをサポート。" },
  { tag: "カスタム", tagColor: "#9333ea", tagBg: "#faf5ff", img: "/feature-4.png", title: "細かいスタイル設定", desc: "トーン・尺・ターゲット設定で、あなたのチャンネルにぴったりの台本を生成できる。" },
];

const STEPS = [
  { num: "01", icon: "✏️", title: "テーマを入力", desc: "動画・エピソードのテーマやタイトル案を入力するだけ。難しい操作は一切不要です。" },
  { num: "02", icon: "⚙️", title: "スタイルを設定", desc: "コンテンツタイプ・尺・トーン・ターゲットを選択。細かくカスタマイズできます。" },
  { num: "03", icon: "✨", title: "台本が完成", desc: "数秒でプロ品質の台本が完成。そのままコピーして収録を始めましょう。" },
];

const PRICING_PLANS = [
  { name: "Free", price: "¥0", unit: "", badge: null, badgeColor: "", desc: "まず試してみたい方へ", credits: "10クレジット（初回）", features: ["YouTube・Podcast両対応", "全トーン・尺が選択可能", "コピー機能付き"], cta: "無料で始める", ctaBg: "var(--bg-subtle)", ctaColor: "var(--text-secondary)", highlight: false },
  { name: "Pro", price: "¥400", unit: "買い切り", badge: "人気", badgeColor: "#ff6b2b", desc: "もっと使いたい方へ", credits: "50クレジット追加", features: ["Freeの全機能", "50台本分のクレジット", "有効期限なし", "即時チャージ"], cta: "購入する", ctaBg: "var(--accent)", ctaColor: "#fff", highlight: true },
  { name: "Max", price: "¥2,980", unit: "/ 月", badge: "月額", badgeColor: "#1a1a1a", desc: "ヘビーユーザーへ", credits: "無制限生成", features: ["Proの全機能", "生成回数無制限", "クレジット消費なし", "いつでも解約可"], cta: "登録する", ctaBg: "var(--accent-dark)", ctaColor: "#fff", highlight: false },
];

const FAQS = [
  { q: "クレジットに有効期限はありますか？", a: "Proプランで購入したクレジットに有効期限はありません。使いたいときに使えます。" },
  { q: "Maxプランはいつでも解約できますか？", a: "はい、いつでも解約できます。解約後は当月末まで無制限機能を引き続きご利用いただけます。" },
  { q: "生成された台本は商用利用できますか？", a: "はい、商用利用可能です。YouTubeやPodcastへの投稿、クライアント向け制作にもお使いいただけます。" },
  { q: "どのAIモデルを使っていますか？", a: "Anthropic社のClaude Opus 4.6を使用しています。高品質な日本語生成に優れたモデルです。" },
  { q: "スマートフォンからも使えますか？", a: "はい、スマートフォン・タブレットのブラウザからそのままご利用いただけます。アプリのインストールは不要です。" },
];

// ── Sub-components ────────────────────────────────────────────
function SectionHeader({ badge, title, sub }: { badge: string; title: string; sub?: string }) {
  return (
    <div style={{ textAlign: "center", marginBottom: 48 }}>
      <div style={{ display: "inline-flex", alignItems: "center", gap: 6, background: "var(--accent-lime)", padding: "5px 14px", borderRadius: 999, marginBottom: 16 }}>
        <span style={{ width: 6, height: 6, borderRadius: "50%", background: "#1a1a1a", display: "inline-block" }} />
        <span style={{ fontFamily: "var(--font-heading)", fontWeight: 700, fontSize: 11, color: "#1a1a1a", letterSpacing: "0.08em" }}>{badge}</span>
      </div>
      <h2 style={{ fontFamily: "var(--font-heading)", fontWeight: 900, fontSize: "clamp(26px, 3.5vw, 38px)", letterSpacing: "-0.03em", color: "var(--text-primary)", marginBottom: sub ? 12 : 0 }}>
        {title}
      </h2>
      {sub && <p style={{ fontSize: 15, color: "var(--text-secondary)", maxWidth: 480, margin: "0 auto", lineHeight: 1.7 }}>{sub}</p>}
    </div>
  );
}

function getOrCreateDeviceId(): string {
  let id = localStorage.getItem("scriptai_device_id");
  if (!id) {
    id = crypto.randomUUID();
    localStorage.setItem("scriptai_device_id", id);
  }
  return id;
}

function TestimonialCard({ name, role, avatar, rating, text }: { name: string; role: string; avatar: string; rating: number; text: string }) {
  return (
    <div style={{
      width: 300, flexShrink: 0,
      margin: "0 8px",
      background: "#fff",
      borderRadius: 20,
      padding: "22px 24px",
      border: "1px solid var(--border)",
      boxShadow: "0 2px 12px rgba(0,0,0,0.05)",
    }}>
      <div style={{ display: "flex", alignItems: "center", gap: 12, marginBottom: 14 }}>
        <div style={{ width: 40, height: 40, borderRadius: "50%", background: "var(--bg-subtle)", display: "flex", alignItems: "center", justifyContent: "center", fontSize: 20, flexShrink: 0 }}>
          {avatar}
        </div>
        <div>
          <p style={{ fontFamily: "var(--font-heading)", fontWeight: 700, fontSize: 13, color: "var(--text-primary)", marginBottom: 2 }}>{name}</p>
          <p style={{ fontSize: 11, color: "var(--text-muted)" }}>{role}</p>
        </div>
      </div>
      <div style={{ display: "flex", gap: 2, marginBottom: 10 }}>
        {Array.from({ length: 5 }).map((_, i) => (
          <span key={i} style={{ fontSize: 12, color: i < rating ? "var(--accent)" : "var(--border)" }}>★</span>
        ))}
      </div>
      <p style={{ fontSize: 13, color: "var(--text-secondary)", lineHeight: 1.7, margin: 0 }}>{text}</p>
    </div>
  );
}

function Spinner({ white = false }: { white?: boolean }) {
  return (
    <span style={{
      display: "inline-block", width: 14, height: 14, borderRadius: "50%",
      border: `2px solid ${white ? "rgba(255,255,255,0.3)" : "rgba(255,107,43,0.2)"}`,
      borderTopColor: white ? "#fff" : "var(--accent)",
    }} className="animate-spin-sm" />
  );
}

export default function Home() {
  const [topic, setTopic] = useState("");
  const [contentType, setContentType] = useState<ContentType>("youtube");
  const [duration, setDuration] = useState("10分");
  const [tone, setTone] = useState("わかりやすく親しみやすい");
  const [targetAudience, setTargetAudience] = useState("");
  const [output, setOutput] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [copied, setCopied] = useState(false);
  const [credits, setCredits] = useState<number | null>(null);
  const [subscribed, setSubscribed] = useState(false);
  const [deviceId, setDeviceId] = useState<string | null>(null);
  const [showUpgradeModal, setShowUpgradeModal] = useState(false);
  const [checkoutLoading, setCheckoutLoading] = useState<Plan | null>(null);
  const [openFaq, setOpenFaq] = useState<number | null>(null);

  useEffect(() => {
    const id = getOrCreateDeviceId();
    setDeviceId(id);
    fetch("/api/credits", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ deviceId: id }),
    })
      .then((r) => r.json())
      .then((d) => { setCredits(d.credits); setSubscribed(d.subscribed ?? false); })
      .catch(console.error);
  }, []);

  const handleGenerate = async () => {
    if (!topic.trim() || !deviceId) return;
    setIsLoading(true);
    setOutput("");
    try {
      const res = await fetch("/api/generate", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ topic, contentType, duration, tone, targetAudience, deviceId }),
      });
      if (res.status === 402) { setShowUpgradeModal(true); return; }
      if (!res.ok) throw new Error();
      const reader = res.body?.getReader();
      const decoder = new TextDecoder();
      if (!reader) return;
      while (true) {
        const { done, value } = await reader.read();
        if (done) break;
        setOutput((p) => p + decoder.decode(value, { stream: true }));
      }
      setCredits((p) => (p !== null ? p - 1 : null));
    } catch {
      setOutput("エラーが発生しました。APIキーを確認してください。");
    } finally {
      setIsLoading(false);
    }
  };

  const handleCopy = () => {
    navigator.clipboard.writeText(output);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleCheckout = async (plan: Plan) => {
    if (!deviceId) return;
    setCheckoutLoading(plan);
    try {
      const res = await fetch("/api/checkout", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ deviceId, plan }),
      });
      const d = await res.json();
      if (d.url) window.location.href = d.url;
    } catch { /* noop */ }
    finally { setCheckoutLoading(null); }
  };

  const outOfCredits = !subscribed && credits === 0;

  return (
    <div style={{ minHeight: "100vh", background: "var(--bg)", fontFamily: "var(--font-body)" }}>

      {/* ─── HEADER ─── */}
      <header style={{
        position: "sticky", top: 0, zIndex: 50,
        background: "rgba(238,236,234,0.88)",
        backdropFilter: "blur(20px)", WebkitBackdropFilter: "blur(20px)",
        borderBottom: "1px solid var(--border)",
      }}>
        <div style={{ maxWidth: 1100, margin: "0 auto", padding: "0 32px", height: 60, display: "flex", alignItems: "center", justifyContent: "space-between" }}>

          {/* Logo */}
          <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
            <div style={{ width: 32, height: 32, borderRadius: 10, background: "var(--accent-dark)", display: "flex", alignItems: "center", justifyContent: "center" }}>
              <span style={{ fontSize: 15 }}>✦</span>
            </div>
            <span style={{ fontFamily: "var(--font-heading)", fontWeight: 800, fontSize: 18, color: "var(--text-primary)", letterSpacing: "-0.03em" }}>
              Script<span style={{ color: "var(--accent)" }}>AI</span>
            </span>
          </div>

          {/* Credits / badge */}
          <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
            {subscribed ? (
              <div style={{ display: "flex", alignItems: "center", gap: 6, background: "var(--accent-lime)", color: "#1a1a1a", padding: "6px 14px", borderRadius: 999, fontSize: 12, fontFamily: "var(--font-heading)", fontWeight: 700 }}>
                ♾ MAX · 無制限
              </div>
            ) : credits !== null ? (
              <button
                onClick={() => setShowUpgradeModal(true)}
                style={{
                  display: "flex", alignItems: "center", gap: 6,
                  background: credits <= 2 ? "#fff0ee" : "#fff",
                  color: credits <= 2 ? "var(--accent)" : "var(--text-secondary)",
                  border: `1.5px solid ${credits <= 2 ? "var(--accent)" : "var(--border)"}`,
                  padding: "6px 14px", borderRadius: 999,
                  fontSize: 12, fontFamily: "var(--font-heading)", fontWeight: 700,
                  cursor: "pointer", transition: "all 0.2s ease",
                }}
              >
                ⚡ {credits} クレジット
              </button>
            ) : null}
            <a
              href="/cancel"
              style={{
                fontSize: 12, fontFamily: "var(--font-heading)", fontWeight: 600,
                color: "var(--text-muted)", textDecoration: "none",
                padding: "6px 12px", borderRadius: 999, border: "1px solid var(--border)",
                background: "#fff", transition: "all 0.2s",
              }}
              onMouseEnter={(e) => { e.currentTarget.style.color = "var(--text-primary)"; e.currentTarget.style.borderColor = "var(--border-hover)"; }}
              onMouseLeave={(e) => { e.currentTarget.style.color = "var(--text-muted)"; e.currentTarget.style.borderColor = "var(--border)"; }}
            >
              解約する
            </a>
            <button
              onClick={() => setShowUpgradeModal(true)}
              style={{
                background: "var(--accent-dark)", color: "#fff",
                border: "none", padding: "8px 20px", borderRadius: 999,
                fontSize: 13, fontFamily: "var(--font-heading)", fontWeight: 700,
                cursor: "pointer", transition: "opacity 0.2s",
              }}
              onMouseEnter={(e) => (e.currentTarget.style.opacity = "0.85")}
              onMouseLeave={(e) => (e.currentTarget.style.opacity = "1")}
            >
              プランを見る
            </button>
          </div>
        </div>
      </header>

      {/* ─── HERO + FORM (2 column) ─── */}
      <main style={{ maxWidth: 1100, margin: "0 auto", padding: "60px 32px 80px" }}>
        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 48, alignItems: "start" }}>

          {/* Left: Hero text */}
          <div className="animate-fade-up">
            {/* Badge */}
            <div style={{ display: "inline-flex", alignItems: "center", gap: 8, background: "#fff", border: "1.5px solid var(--border)", borderRadius: 999, padding: "6px 14px", marginBottom: 28 }}>
              <span style={{ width: 20, height: 20, borderRadius: "50%", background: "var(--accent-lime)", display: "flex", alignItems: "center", justifyContent: "center", fontSize: 11 }}>✦</span>
              <span style={{ fontFamily: "var(--font-heading)", fontSize: 12, fontWeight: 600, color: "var(--text-secondary)" }}>Claude Opus 4.6 搭載</span>
            </div>

            {/* Headline */}
            <h1 style={{ fontFamily: "var(--font-heading)", fontWeight: 900, fontSize: "clamp(38px, 4.5vw, 56px)", lineHeight: 1.05, letterSpacing: "-0.04em", color: "var(--text-primary)", marginBottom: 20 }}>
              台本制作を<br />
              <span style={{ color: "var(--accent)" }}>AI</span>に<br />
              任せよう。
            </h1>

            <p style={{ fontSize: 15, color: "var(--text-secondary)", lineHeight: 1.8, maxWidth: 380, marginBottom: 36 }}>
              テーマを入力するだけで、YouTube・Podcast用の台本をプロ品質で自動生成。企画からセリフまで、ワンクリックで完成します。
            </p>

            {/* CTA buttons */}
            <div style={{ display: "flex", gap: 12, flexWrap: "wrap", marginBottom: 48 }}>
              <button
                onClick={() => document.getElementById("topic-input")?.focus()}
                style={{
                  background: "var(--accent-dark)", color: "#fff", border: "none",
                  padding: "14px 28px", borderRadius: 999,
                  fontFamily: "var(--font-heading)", fontWeight: 700, fontSize: 14,
                  cursor: "pointer", transition: "opacity 0.2s",
                }}
                onMouseEnter={(e) => (e.currentTarget.style.opacity = "0.85")}
                onMouseLeave={(e) => (e.currentTarget.style.opacity = "1")}
              >
                無料で試す →
              </button>
              <button
                onClick={() => setShowUpgradeModal(true)}
                style={{
                  background: "#fff", color: "var(--text-primary)",
                  border: "1.5px solid var(--border)",
                  padding: "14px 28px", borderRadius: 999,
                  fontFamily: "var(--font-heading)", fontWeight: 700, fontSize: 14,
                  cursor: "pointer",
                  transition: "border-color 0.2s",
                }}
                onMouseEnter={(e) => (e.currentTarget.style.borderColor = "var(--accent)")}
                onMouseLeave={(e) => (e.currentTarget.style.borderColor = "var(--border)")}
              >
                プランを見る
              </button>
            </div>

            {/* Stats */}
            <div style={{ display: "flex", alignItems: "center", gap: 20 }}>
              <div style={{ display: "flex" }}>
                {["🎬","🎙️","✍️"].map((e, i) => (
                  <div key={i} style={{ width: 32, height: 32, borderRadius: "50%", background: "#fff", border: "2px solid var(--bg)", display: "flex", alignItems: "center", justifyContent: "center", marginLeft: i > 0 ? -8 : 0, fontSize: 15 }}>{e}</div>
                ))}
              </div>
              <p style={{ fontSize: 13, color: "var(--text-secondary)", fontFamily: "var(--font-heading)" }}>
                <strong style={{ color: "var(--text-primary)", fontWeight: 800 }}>初回10本</strong> 無料で生成
              </p>
            </div>
          </div>

          {/* Right: Form card */}
          <div className="animate-fade-up delay-1" style={{ background: "var(--bg-card)", borderRadius: 24, padding: "32px 28px", boxShadow: "0 4px 40px rgba(0,0,0,0.08)", border: "1px solid var(--border)" }}>

            {/* Content type */}
            <div style={{ marginBottom: 20 }}>
              <p className="label" style={{ marginBottom: 10 }}>コンテンツタイプ</p>
              <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 8 }}>
                {(["youtube", "podcast"] as const).map((type) => (
                  <button
                    key={type}
                    onClick={() => setContentType(type)}
                    style={{
                      padding: "10px 0",
                      background: contentType === type ? "var(--accent-dark)" : "var(--bg-subtle)",
                      color: contentType === type ? "#fff" : "var(--text-secondary)",
                      border: "none",
                      borderRadius: 12,
                      fontFamily: "var(--font-heading)", fontWeight: 700, fontSize: 12,
                      cursor: "pointer", transition: "all 0.2s ease",
                      display: "flex", alignItems: "center", justifyContent: "center", gap: 6,
                    }}
                  >
                    <span>{type === "youtube" ? "📹" : "🎙️"}</span>
                    {type === "youtube" ? "YouTube" : "Podcast"}
                  </button>
                ))}
              </div>
            </div>

            {/* Topic */}
            <div style={{ marginBottom: 16 }}>
              <p className="label" style={{ marginBottom: 8 }}>テーマ・タイトル案 <span style={{ color: "var(--accent)", textTransform: "none", letterSpacing: 0, fontFamily: "var(--font-body)", fontSize: 11 }}>必須</span></p>
              <input
                id="topic-input"
                className="field"
                type="text"
                value={topic}
                onChange={(e) => setTopic(e.target.value)}
                onKeyDown={(e) => e.key === "Enter" && handleGenerate()}
                placeholder="例：初心者でもわかるNISAの始め方"
                style={{ borderRadius: 12 }}
              />
            </div>

            {/* Duration + Tone */}
            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 10, marginBottom: 16 }}>
              {[
                { label: "尺・長さ", value: duration, set: setDuration, options: ["5分","10分","15分","20分","30分"] },
                { label: "トーン", value: tone, set: setTone, options: ["わかりやすく親しみやすい","プロフェッショナルで丁寧","エネルギッシュで熱量高め","ゆっくり落ち着いた","ユーモア・笑いあり"] },
              ].map(({ label, value, set, options }) => (
                <div key={label}>
                  <p className="label" style={{ marginBottom: 8 }}>{label}</p>
                  <div style={{ position: "relative" }}>
                    <select
                      className="field"
                      value={value}
                      onChange={(e) => set(e.target.value)}
                      style={{ borderRadius: 12, paddingRight: 32, cursor: "pointer" }}
                    >
                      {options.map((o) => <option key={o}>{o}</option>)}
                    </select>
                    <span style={{ position: "absolute", right: 10, top: "50%", transform: "translateY(-50%)", fontSize: 9, color: "var(--text-muted)", pointerEvents: "none" }}>▼</span>
                  </div>
                </div>
              ))}
            </div>

            {/* Target */}
            <div style={{ marginBottom: 20 }}>
              <p className="label" style={{ marginBottom: 8 }}>ターゲット <span style={{ textTransform: "none", letterSpacing: 0, color: "var(--text-muted)", fontFamily: "var(--font-body)", fontSize: 11 }}>任意</span></p>
              <input
                className="field"
                type="text"
                value={targetAudience}
                onChange={(e) => setTargetAudience(e.target.value)}
                placeholder="例：20〜30代の投資初心者"
                style={{ borderRadius: 12 }}
              />
            </div>

            {/* Credit bar */}
            {!subscribed && credits !== null && (
              <div style={{ marginBottom: 20 }}>
                <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 6 }}>
                  <p className="label">残りクレジット</p>
                  <span style={{ fontFamily: "var(--font-heading)", fontSize: 10, fontWeight: 700, color: credits <= 2 ? "var(--accent)" : "var(--text-muted)" }}>
                    {credits} / 10
                  </span>
                </div>
                <div style={{ height: 4, background: "var(--bg-subtle)", borderRadius: 999, overflow: "hidden" }}>
                  <div style={{ height: "100%", width: `${Math.min((credits / 10) * 100, 100)}%`, background: credits <= 2 ? "var(--accent)" : "var(--accent-dark)", borderRadius: 999, transition: "width 0.5s ease" }} />
                </div>
              </div>
            )}

            {/* Generate button */}
            <button
              onClick={handleGenerate}
              disabled={isLoading || !topic.trim() || outOfCredits}
              style={{
                width: "100%", padding: "15px",
                background: isLoading || !topic.trim() || outOfCredits ? "var(--bg-subtle)" : "var(--accent)",
                color: isLoading || !topic.trim() || outOfCredits ? "var(--text-muted)" : "#fff",
                border: "none", borderRadius: 14,
                fontFamily: "var(--font-heading)", fontWeight: 800, fontSize: 14,
                cursor: isLoading || !topic.trim() || outOfCredits ? "not-allowed" : "pointer",
                display: "flex", alignItems: "center", justifyContent: "center", gap: 8,
                transition: "all 0.2s ease",
                boxShadow: isLoading || !topic.trim() || outOfCredits ? "none" : "0 4px 20px rgba(255,107,43,0.35)",
              }}
            >
              {isLoading ? <><Spinner white /> 生成中...</> : outOfCredits ? "クレジット不足 — アップグレード" : "台本を生成する →"}
            </button>
          </div>
        </div>

        {/* ─── OUTPUT ─── */}
        {(output || isLoading) && (
          <div className="animate-fade-up" style={{ marginTop: 32, background: "var(--bg-card)", borderRadius: 24, overflow: "hidden", boxShadow: "0 4px 40px rgba(0,0,0,0.07)", border: "1px solid var(--border)" }}>
            <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", padding: "16px 28px", borderBottom: "1px solid var(--border)", background: "var(--bg-subtle)" }}>
              <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
                <span style={{ width: 8, height: 8, borderRadius: "50%", background: isLoading ? "var(--accent)" : "#4ade80", display: "inline-block" }} className={isLoading ? "animate-blink" : ""} />
                <span style={{ fontFamily: "var(--font-heading)", fontWeight: 700, fontSize: 13, color: "var(--text-primary)" }}>
                  {isLoading ? "Claudeが台本を書いています..." : "生成完了"}
                </span>
              </div>
              {output && (
                <button
                  onClick={handleCopy}
                  style={{
                    display: "flex", alignItems: "center", gap: 6,
                    background: copied ? "#f0fdf4" : "#fff",
                    color: copied ? "#16a34a" : "var(--text-secondary)",
                    border: `1px solid ${copied ? "#86efac" : "var(--border)"}`,
                    padding: "6px 14px", borderRadius: 999,
                    fontFamily: "var(--font-heading)", fontWeight: 700, fontSize: 12,
                    cursor: "pointer", transition: "all 0.2s",
                  }}
                >
                  {copied ? "✓ コピー済み" : "コピー"}
                </button>
              )}
            </div>
            <div style={{ padding: "28px 32px" }}>
              {output ? (
                <pre style={{ whiteSpace: "pre-wrap", fontFamily: "var(--font-body)", fontSize: 14, color: "var(--text-primary)", lineHeight: 1.9, margin: 0 }}>
                  {output}
                </pre>
              ) : (
                <div style={{ display: "flex", alignItems: "center", gap: 12, color: "var(--text-muted)", padding: "8px 0" }}>
                  <Spinner />
                  <span style={{ fontSize: 14 }}>しばらくお待ちください...</span>
                </div>
              )}
            </div>
          </div>
        )}
      </main>

      {/* ─── TESTIMONIALS ─── */}
      <section style={{ padding: "80px 0", borderTop: "1px solid var(--border)", overflow: "hidden" }}>
        <div style={{ maxWidth: 1100, margin: "0 auto", padding: "0 32px", marginBottom: 40, textAlign: "center" }}>
          <p style={{ fontFamily: "var(--font-heading)", fontSize: 11, fontWeight: 700, letterSpacing: "0.14em", textTransform: "uppercase", color: "var(--accent)", marginBottom: 12 }}>
            User Reviews
          </p>
          <h2 style={{ fontFamily: "var(--font-heading)", fontWeight: 900, fontSize: "clamp(26px, 4vw, 38px)", letterSpacing: "-0.03em", color: "var(--text-primary)" }}>
            使ってみた人の声
          </h2>
        </div>

        <div style={{ overflow: "hidden", width: "100%" }}>
          <div className="marquee-track" style={{ padding: "8px 0 16px" }}>
            {[...TESTIMONIALS_ROW1, ...TESTIMONIALS_ROW2, ...TESTIMONIALS_ROW1, ...TESTIMONIALS_ROW2].map((t, i) => (
              <TestimonialCard key={i} {...t} />
            ))}
          </div>
        </div>
      </section>

      {/* ─── FEATURES ─── */}
      <section style={{ padding: "96px 0", background: "#fff" }}>
        <div style={{ maxWidth: 1100, margin: "0 auto", padding: "0 32px" }}>
          <SectionHeader badge="できること" title="ScriptAIで台本制作を革新しよう" sub="テーマを入力するだけ。構成・台本・SEO対策まで、すべてAIが担います。" />
          <div style={{ display: "grid", gridTemplateColumns: "repeat(4, 1fr)", gap: 20 }}>
            {FEATURES.map((f) => (
              <div key={f.title} style={{ background: "var(--bg)", borderRadius: 20, overflow: "hidden", border: "1px solid var(--border)", boxShadow: "0 2px 16px rgba(0,0,0,0.05)", transition: "transform 0.2s, box-shadow 0.2s" }}
                onMouseEnter={(e) => { (e.currentTarget as HTMLDivElement).style.transform = "translateY(-4px)"; (e.currentTarget as HTMLDivElement).style.boxShadow = "0 8px 32px rgba(0,0,0,0.1)"; }}
                onMouseLeave={(e) => { (e.currentTarget as HTMLDivElement).style.transform = "translateY(0)"; (e.currentTarget as HTMLDivElement).style.boxShadow = "0 2px 16px rgba(0,0,0,0.05)"; }}
              >
                <div style={{ height: 160, overflow: "hidden", background: f.tagBg }}>
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img src={f.img} alt={f.title} style={{ width: "100%", height: "100%", objectFit: "cover", display: "block" }} />
                </div>
                <div style={{ padding: "18px 20px 22px" }}>
                  <span style={{ display: "inline-block", background: f.tagBg, color: f.tagColor, fontFamily: "var(--font-heading)", fontWeight: 700, fontSize: 10, letterSpacing: "0.08em", padding: "3px 10px", borderRadius: 999, marginBottom: 10 }}>{f.tag}</span>
                  <p style={{ fontFamily: "var(--font-heading)", fontWeight: 800, fontSize: 14, color: "var(--text-primary)", marginBottom: 8, lineHeight: 1.4 }}>{f.title}</p>
                  <p style={{ fontSize: 12, color: "var(--text-secondary)", lineHeight: 1.7 }}>{f.desc}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ─── HOW IT WORKS ─── */}
      <section style={{ padding: "96px 0", background: "var(--bg)" }}>
        <div style={{ maxWidth: 1100, margin: "0 auto", padding: "0 32px" }}>
          <SectionHeader badge="使い方" title="3ステップで台本完成" sub="難しい操作は一切不要。テーマを入れるだけで、プロ品質の台本が手に入ります。" />
          <div style={{ display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: 24 }}>
            {STEPS.map((s, i) => (
              <div key={s.num} style={{ background: "#fff", borderRadius: 20, padding: "36px 28px", border: "1px solid var(--border)", boxShadow: "0 2px 16px rgba(0,0,0,0.05)", position: "relative", overflow: "hidden" }}>
                <div style={{ position: "absolute", top: 20, right: 24, fontFamily: "var(--font-heading)", fontWeight: 900, fontSize: 48, color: "var(--bg-subtle)", lineHeight: 1, userSelect: "none" }}>{s.num}</div>
                <div style={{ width: 52, height: 52, borderRadius: 16, background: i === 0 ? "#fff3ee" : i === 1 ? "#eef3ff" : "#f0fdf4", display: "flex", alignItems: "center", justifyContent: "center", fontSize: 26, marginBottom: 20 }}>{s.icon}</div>
                <p style={{ fontFamily: "var(--font-heading)", fontWeight: 800, fontSize: 16, color: "var(--text-primary)", marginBottom: 10 }}>{s.title}</p>
                <p style={{ fontSize: 13, color: "var(--text-secondary)", lineHeight: 1.75 }}>{s.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ─── PRICING ─── */}
      <section style={{ padding: "96px 0", background: "#fff" }}>
        <div style={{ maxWidth: 1100, margin: "0 auto", padding: "0 32px" }}>
          <SectionHeader badge="料金プラン" title="シンプルな料金体系" sub="まず無料で試して、必要になったらアップグレード。縛りは一切ありません。" />
          <div style={{ display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: 20 }}>
            {PRICING_PLANS.map((p) => (
              <div key={p.name} style={{ background: p.highlight ? "var(--accent)" : "var(--bg)", borderRadius: 24, padding: "36px 28px", border: p.highlight ? "none" : "1px solid var(--border)", boxShadow: p.highlight ? "0 8px 40px rgba(255,107,43,0.3)" : "0 2px 16px rgba(0,0,0,0.05)", display: "flex", flexDirection: "column" }}>
                <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 6 }}>
                  <p style={{ fontFamily: "var(--font-heading)", fontWeight: 900, fontSize: 18, color: p.highlight ? "#fff" : "var(--text-primary)" }}>{p.name}</p>
                  {p.badge && <span style={{ background: p.highlight ? "rgba(255,255,255,0.25)" : p.badgeColor, color: p.highlight ? "#fff" : "#fff", fontFamily: "var(--font-heading)", fontWeight: 700, fontSize: 9, letterSpacing: "0.08em", padding: "2px 8px", borderRadius: 999 }}>{p.badge}</span>}
                </div>
                <p style={{ fontSize: 12, color: p.highlight ? "rgba(255,255,255,0.75)" : "var(--text-muted)", marginBottom: 20 }}>{p.desc}</p>
                <div style={{ marginBottom: 24 }}>
                  <span style={{ fontFamily: "var(--font-heading)", fontWeight: 900, fontSize: 36, color: p.highlight ? "#fff" : "var(--text-primary)", letterSpacing: "-0.04em" }}>{p.price}</span>
                  {p.unit && <span style={{ fontSize: 13, color: p.highlight ? "rgba(255,255,255,0.7)" : "var(--text-muted)", marginLeft: 4 }}>{p.unit}</span>}
                </div>
                <div style={{ background: p.highlight ? "rgba(255,255,255,0.15)" : "var(--bg-subtle)", borderRadius: 12, padding: "12px 16px", marginBottom: 24 }}>
                  <p style={{ fontFamily: "var(--font-heading)", fontWeight: 700, fontSize: 13, color: p.highlight ? "#fff" : "var(--text-primary)" }}>⚡ {p.credits}</p>
                </div>
                <ul style={{ listStyle: "none", padding: 0, margin: "0 0 28px", display: "flex", flexDirection: "column", gap: 10 }}>
                  {p.features.map((f) => (
                    <li key={f} style={{ display: "flex", alignItems: "center", gap: 8, fontSize: 13, color: p.highlight ? "rgba(255,255,255,0.9)" : "var(--text-secondary)" }}>
                      <span style={{ color: p.highlight ? "#fff" : "var(--accent)", fontWeight: 700 }}>✓</span> {f}
                    </li>
                  ))}
                </ul>
                <button
                  onClick={() => p.name !== "Free" ? handleCheckout(p.name.toLowerCase() as Plan) : undefined}
                  style={{ marginTop: "auto", padding: "13px", background: p.ctaBg, color: p.ctaColor, border: "none", borderRadius: 12, fontFamily: "var(--font-heading)", fontWeight: 800, fontSize: 13, cursor: "pointer", transition: "opacity 0.2s" }}
                  onMouseEnter={(e) => (e.currentTarget.style.opacity = "0.85")}
                  onMouseLeave={(e) => (e.currentTarget.style.opacity = "1")}
                >
                  {p.cta} →
                </button>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ─── FAQ ─── */}
      <section style={{ padding: "96px 0", background: "var(--bg)" }}>
        <div style={{ maxWidth: 720, margin: "0 auto", padding: "0 32px" }}>
          <SectionHeader badge="FAQ" title="よくある質問" />
          <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
            {FAQS.map((faq, i) => (
              <div key={i} style={{ background: "#fff", borderRadius: 16, border: "1px solid var(--border)", overflow: "hidden", transition: "box-shadow 0.2s", boxShadow: openFaq === i ? "0 4px 20px rgba(0,0,0,0.08)" : "none" }}>
                <button
                  onClick={() => setOpenFaq(openFaq === i ? null : i)}
                  style={{ width: "100%", padding: "20px 24px", display: "flex", alignItems: "center", justifyContent: "space-between", background: "none", border: "none", cursor: "pointer", textAlign: "left" }}
                >
                  <span style={{ fontFamily: "var(--font-heading)", fontWeight: 700, fontSize: 14, color: "var(--text-primary)" }}>{faq.q}</span>
                  <span style={{ fontSize: 18, color: "var(--text-muted)", transition: "transform 0.2s", transform: openFaq === i ? "rotate(45deg)" : "rotate(0)", flexShrink: 0, marginLeft: 16 }}>+</span>
                </button>
                {openFaq === i && (
                  <div style={{ padding: "0 24px 20px" }}>
                    <p style={{ fontSize: 14, color: "var(--text-secondary)", lineHeight: 1.75 }}>{faq.a}</p>
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ─── CTA BANNER ─── */}
      <section style={{ padding: "0 32px 96px" }}>
        <div style={{ maxWidth: 1100, margin: "0 auto" }}>
          <div style={{ background: "var(--accent-dark)", borderRadius: 28, padding: "64px 48px", textAlign: "center" }}>
            <p style={{ fontFamily: "var(--font-heading)", fontSize: 11, fontWeight: 700, letterSpacing: "0.14em", textTransform: "uppercase", color: "rgba(255,255,255,0.5)", marginBottom: 16 }}>Get Started</p>
            <h2 style={{ fontFamily: "var(--font-heading)", fontWeight: 900, fontSize: "clamp(28px, 4vw, 44px)", letterSpacing: "-0.04em", color: "#fff", marginBottom: 16 }}>
              今すぐ無料で<br />台本を生成しよう
            </h2>
            <p style={{ fontSize: 15, color: "rgba(255,255,255,0.6)", marginBottom: 36 }}>登録不要・クレジットカード不要。10クレジット無料。</p>
            <button
              onClick={() => document.getElementById("topic-input")?.focus()}
              style={{ background: "var(--accent)", color: "#fff", border: "none", padding: "15px 36px", borderRadius: 999, fontFamily: "var(--font-heading)", fontWeight: 800, fontSize: 15, cursor: "pointer", boxShadow: "0 4px 24px rgba(255,107,43,0.5)", transition: "opacity 0.2s" }}
              onMouseEnter={(e) => (e.currentTarget.style.opacity = "0.85")}
              onMouseLeave={(e) => (e.currentTarget.style.opacity = "1")}
            >
              無料で試す →
            </button>
          </div>
        </div>
      </section>

      {/* ─── FOOTER ─── */}
      <footer style={{ borderTop: "1px solid var(--border)", background: "#fff" }}>
        <div style={{ maxWidth: 1100, margin: "0 auto", padding: "40px 32px", display: "flex", alignItems: "center", justifyContent: "space-between", flexWrap: "wrap", gap: 20 }}>
          <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
            <div style={{ width: 28, height: 28, borderRadius: 8, background: "var(--accent-dark)", display: "flex", alignItems: "center", justifyContent: "center", fontSize: 13 }}>✦</div>
            <span style={{ fontFamily: "var(--font-heading)", fontWeight: 800, fontSize: 16, color: "var(--text-primary)", letterSpacing: "-0.03em" }}>Script<span style={{ color: "var(--accent)" }}>AI</span></span>
          </div>
          <p style={{ fontSize: 11, color: "var(--text-muted)", fontFamily: "var(--font-heading)" }}>© 2026 ScriptAI. All rights reserved.</p>
        </div>
      </footer>

      {/* ─── UPGRADE MODAL ─── */}
      {showUpgradeModal && (
        <div style={{ position: "fixed", inset: 0, zIndex: 100, display: "flex", alignItems: "center", justifyContent: "center", padding: 24 }} onClick={() => setShowUpgradeModal(false)}>
          <div style={{ position: "absolute", inset: 0, background: "rgba(26,26,26,0.6)", backdropFilter: "blur(10px)", WebkitBackdropFilter: "blur(10px)" }} />

          <div className="animate-fade-up" style={{ position: "relative", width: "100%", maxWidth: 500, background: "#fff", borderRadius: 24, overflow: "hidden", boxShadow: "0 20px 80px rgba(0,0,0,0.18)", zIndex: 1 }} onClick={(e) => e.stopPropagation()}>

            {/* Header */}
            <div style={{ padding: "28px 32px 24px", borderBottom: "1px solid var(--border)" }}>
              <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between" }}>
                <div>
                  <h2 style={{ fontFamily: "var(--font-heading)", fontWeight: 900, fontSize: 20, letterSpacing: "-0.03em", color: "var(--text-primary)", marginBottom: 4 }}>
                    プランを選択
                  </h2>
                  <p style={{ fontSize: 13, color: "var(--text-secondary)" }}>
                    {credits === 0 ? "クレジットが切れました。" : `残り ${credits} クレジット。`}
                  </p>
                </div>
                <button onClick={() => setShowUpgradeModal(false)} style={{ width: 32, height: 32, borderRadius: "50%", background: "var(--bg-subtle)", border: "none", cursor: "pointer", fontSize: 16, color: "var(--text-muted)", display: "flex", alignItems: "center", justifyContent: "center" }}>✕</button>
              </div>
            </div>

            {/* Plans */}
            <div style={{ padding: "20px 24px", display: "flex", flexDirection: "column", gap: 12 }}>

              {/* Free */}
              <div style={{ border: "1.5px solid var(--border)", borderRadius: 16, padding: "16px 20px", display: "flex", alignItems: "center", justifyContent: "space-between", background: "var(--bg-subtle)" }}>
                <div>
                  <p style={{ fontFamily: "var(--font-heading)", fontWeight: 800, fontSize: 14, color: "var(--text-muted)", marginBottom: 3 }}>FREE</p>
                  <p style={{ fontSize: 12, color: "var(--text-muted)" }}>初回10クレジット · 付与済み</p>
                </div>
                <span style={{ fontFamily: "var(--font-heading)", fontWeight: 800, fontSize: 15, color: "var(--text-muted)" }}>¥0</span>
              </div>

              {/* Pro */}
              <div style={{ border: "2px solid var(--accent)", borderRadius: 16, padding: "18px 20px", display: "flex", alignItems: "center", justifyContent: "space-between", background: "#fff8f5" }}>
                <div>
                  <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 3 }}>
                    <p style={{ fontFamily: "var(--font-heading)", fontWeight: 900, fontSize: 15, color: "var(--text-primary)" }}>PRO</p>
                    <span style={{ background: "var(--accent)", color: "#fff", fontFamily: "var(--font-heading)", fontWeight: 700, fontSize: 10, padding: "2px 8px", borderRadius: 999 }}>人気</span>
                  </div>
                  <p style={{ fontSize: 12, color: "var(--text-secondary)", marginBottom: 8 }}>50クレジット追加 · 買い切り</p>
                  <div style={{ display: "flex", gap: 12 }}>
                    {["50台本分", "有効期限なし"].map((f) => (
                      <span key={f} style={{ fontSize: 11, color: "var(--accent)", fontFamily: "var(--font-heading)", fontWeight: 700 }}>✓ {f}</span>
                    ))}
                  </div>
                </div>
                <button onClick={() => handleCheckout("pro")} disabled={checkoutLoading !== null}
                  style={{ padding: "11px 20px", background: "var(--accent)", color: "#fff", border: "none", borderRadius: 12, fontFamily: "var(--font-heading)", fontWeight: 800, fontSize: 14, cursor: checkoutLoading ? "not-allowed" : "pointer", opacity: checkoutLoading && checkoutLoading !== "pro" ? 0.4 : 1, flexShrink: 0, marginLeft: 16, display: "flex", alignItems: "center", gap: 6, boxShadow: "0 4px 14px rgba(255,107,43,0.3)" }}>
                  {checkoutLoading === "pro" ? <Spinner white /> : "¥400"}
                </button>
              </div>

              {/* Max */}
              <div style={{ border: "2px solid var(--accent-dark)", borderRadius: 16, padding: "18px 20px", display: "flex", alignItems: "center", justifyContent: "space-between", background: "#f8f8f6" }}>
                <div>
                  <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 3 }}>
                    <p style={{ fontFamily: "var(--font-heading)", fontWeight: 900, fontSize: 15, color: "var(--text-primary)" }}>MAX</p>
                    <span style={{ background: "var(--accent-lime)", color: "#1a1a1a", fontFamily: "var(--font-heading)", fontWeight: 700, fontSize: 10, padding: "2px 8px", borderRadius: 999 }}>月額</span>
                  </div>
                  <p style={{ fontSize: 12, color: "var(--text-secondary)", marginBottom: 8 }}>無制限生成 · サブスクリプション</p>
                  <div style={{ display: "flex", gap: 12 }}>
                    {["無制限", "いつでも解約"].map((f) => (
                      <span key={f} style={{ fontSize: 11, color: "var(--text-primary)", fontFamily: "var(--font-heading)", fontWeight: 700 }}>✓ {f}</span>
                    ))}
                  </div>
                </div>
                <button onClick={() => handleCheckout("max")} disabled={checkoutLoading !== null}
                  style={{ padding: "11px 20px", background: "var(--accent-dark)", color: "#fff", border: "none", borderRadius: 12, fontFamily: "var(--font-heading)", fontWeight: 800, fontSize: 13, cursor: checkoutLoading ? "not-allowed" : "pointer", opacity: checkoutLoading && checkoutLoading !== "max" ? 0.4 : 1, flexShrink: 0, marginLeft: 16, display: "flex", alignItems: "center", gap: 6, whiteSpace: "nowrap", boxShadow: "0 4px 14px rgba(0,0,0,0.15)" }}>
                  {checkoutLoading === "max" ? <Spinner white /> : "¥2,980/月"}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
