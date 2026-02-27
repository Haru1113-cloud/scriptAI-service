"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";

function getDeviceId(): string | null {
  try {
    return localStorage.getItem("scriptai_device_id");
  } catch {
    return null;
  }
}

type Step = "check" | "confirm" | "done" | "error" | "no-sub";

export default function CancelPage() {
  const router = useRouter();
  const [step, setStep] = useState<Step>("check");
  const [loading, setLoading] = useState(false);
  const [subscribed, setSubscribed] = useState(false);

  useEffect(() => {
    const deviceId = getDeviceId();
    if (!deviceId) { setStep("no-sub"); return; }

    fetch("/api/credits", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ deviceId }),
    })
      .then((r) => r.json())
      .then((d) => {
        if (d.subscribed) {
          setSubscribed(true);
          setStep("confirm");
        } else {
          setStep("no-sub");
        }
      })
      .catch(() => setStep("error"));
  }, []);

  const handleCancel = async () => {
    const deviceId = getDeviceId();
    if (!deviceId) return;
    setLoading(true);
    try {
      const res = await fetch("/api/cancel", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ deviceId }),
      });
      if (!res.ok) {
        const data = await res.json();
        throw new Error(data.error || "解約に失敗しました");
      }
      setStep("done");
    } catch (e) {
      console.error(e);
      setStep("error");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{ minHeight: "100vh", background: "var(--bg)", display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", padding: "32px 16px" }}>
      {/* ロゴ */}
      <a href="/" style={{ display: "flex", alignItems: "center", gap: 8, textDecoration: "none", marginBottom: 48 }}>
        <div style={{ width: 32, height: 32, borderRadius: 10, background: "var(--accent-dark)", display: "flex", alignItems: "center", justifyContent: "center", fontSize: 15 }}>✦</div>
        <span style={{ fontFamily: "var(--font-heading)", fontWeight: 800, fontSize: 18, color: "var(--text-primary)", letterSpacing: "-0.03em" }}>
          Script<span style={{ color: "var(--accent)" }}>AI</span>
        </span>
      </a>

      <div style={{ width: "100%", maxWidth: 480, background: "#fff", borderRadius: 24, padding: "40px 36px", boxShadow: "0 4px 32px rgba(0,0,0,0.07)", border: "1px solid var(--border)" }}>

        {/* ローディング中 */}
        {step === "check" && (
          <div style={{ textAlign: "center", padding: "24px 0" }}>
            <div style={{ width: 40, height: 40, borderRadius: "50%", border: "3px solid var(--border)", borderTopColor: "var(--accent)", margin: "0 auto 16px", animation: "spin 0.8s linear infinite" }} />
            <p style={{ color: "var(--text-muted)", fontSize: 14 }}>サブスクリプション状態を確認中...</p>
          </div>
        )}

        {/* 確認画面 */}
        {step === "confirm" && (
          <>
            <div style={{ display: "flex", alignItems: "center", gap: 12, marginBottom: 24 }}>
              <div style={{ width: 44, height: 44, borderRadius: 12, background: "#fff3ee", display: "flex", alignItems: "center", justifyContent: "center", fontSize: 22, flexShrink: 0 }}>⚠️</div>
              <h1 style={{ fontFamily: "var(--font-heading)", fontWeight: 800, fontSize: 20, color: "var(--text-primary)", letterSpacing: "-0.03em", margin: 0 }}>Maxプランを解約する</h1>
            </div>

            <p style={{ fontSize: 14, color: "var(--text-secondary)", lineHeight: 1.8, marginBottom: 24 }}>
              解約すると、<strong>当月末まで</strong>は残りのクレジットを引き続きご利用いただけます。翌月からは自動更新が停止されます。
            </p>

            <div style={{ background: "var(--bg-subtle)", borderRadius: 14, padding: "16px 20px", marginBottom: 32 }}>
              <ul style={{ margin: 0, padding: 0, listStyle: "none", display: "flex", flexDirection: "column", gap: 10 }}>
                {[
                  "当月末まで残りクレジットが利用可能",
                  "翌月からクレジット制に戻る",
                  "購入済みクレジットはそのまま残る",
                  "再度いつでも登録できる",
                ].map((item) => (
                  <li key={item} style={{ display: "flex", alignItems: "center", gap: 10, fontSize: 13, color: "var(--text-secondary)" }}>
                    <span style={{ fontSize: 11, color: "var(--accent)" }}>●</span>
                    {item}
                  </li>
                ))}
              </ul>
            </div>

            <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
              <button
                onClick={handleCancel}
                disabled={loading}
                style={{
                  width: "100%", padding: "14px", borderRadius: 12, border: "none",
                  background: loading ? "var(--bg-subtle)" : "#1a1a1a",
                  color: loading ? "var(--text-muted)" : "#fff",
                  fontFamily: "var(--font-heading)", fontWeight: 700, fontSize: 14,
                  cursor: loading ? "not-allowed" : "pointer", transition: "background 0.2s",
                  display: "flex", alignItems: "center", justifyContent: "center", gap: 8,
                }}
              >
                {loading && (
                  <span style={{ width: 14, height: 14, borderRadius: "50%", border: "2px solid rgba(255,255,255,0.3)", borderTopColor: "#fff", display: "inline-block", animation: "spin 0.8s linear infinite" }} />
                )}
                {loading ? "処理中..." : "解約を確定する"}
              </button>

              <button
                onClick={() => router.push("/")}
                style={{
                  width: "100%", padding: "14px", borderRadius: 12, border: "1px solid var(--border)",
                  background: "#fff", color: "var(--text-secondary)",
                  fontFamily: "var(--font-heading)", fontWeight: 600, fontSize: 14,
                  cursor: "pointer", transition: "background 0.2s",
                }}
                onMouseEnter={(e) => (e.currentTarget.style.background = "var(--bg-subtle)")}
                onMouseLeave={(e) => (e.currentTarget.style.background = "#fff")}
              >
                キャンセル（トップに戻る）
              </button>
            </div>
          </>
        )}

        {/* 解約完了 */}
        {step === "done" && (
          <div style={{ textAlign: "center" }}>
            <div style={{ width: 56, height: 56, borderRadius: "50%", background: "var(--bg-subtle)", display: "flex", alignItems: "center", justifyContent: "center", fontSize: 28, margin: "0 auto 20px" }}>✓</div>
            <h1 style={{ fontFamily: "var(--font-heading)", fontWeight: 800, fontSize: 20, color: "var(--text-primary)", letterSpacing: "-0.03em", marginBottom: 12 }}>解約が完了しました</h1>
            <p style={{ fontSize: 14, color: "var(--text-secondary)", lineHeight: 1.8, marginBottom: 32 }}>
              当月末まで残りのクレジットをご利用いただけます。またご利用をご検討の際はいつでもお申し込みください。
            </p>
            <button
              onClick={() => router.push("/")}
              style={{
                width: "100%", padding: "14px", borderRadius: 12, border: "none",
                background: "var(--accent)", color: "#fff",
                fontFamily: "var(--font-heading)", fontWeight: 700, fontSize: 14,
                cursor: "pointer",
              }}
            >
              トップページへ戻る
            </button>
          </div>
        )}

        {/* サブスクなし */}
        {step === "no-sub" && (
          <div style={{ textAlign: "center" }}>
            <div style={{ width: 56, height: 56, borderRadius: "50%", background: "var(--bg-subtle)", display: "flex", alignItems: "center", justifyContent: "center", fontSize: 28, margin: "0 auto 20px" }}>ℹ️</div>
            <h1 style={{ fontFamily: "var(--font-heading)", fontWeight: 800, fontSize: 20, color: "var(--text-primary)", letterSpacing: "-0.03em", marginBottom: 12 }}>有効なサブスクリプションがありません</h1>
            <p style={{ fontSize: 14, color: "var(--text-secondary)", lineHeight: 1.8, marginBottom: 32 }}>
              現在Maxプランにご登録されていないため、解約の手続きは不要です。
            </p>
            <button
              onClick={() => router.push("/")}
              style={{
                width: "100%", padding: "14px", borderRadius: 12, border: "none",
                background: "var(--accent)", color: "#fff",
                fontFamily: "var(--font-heading)", fontWeight: 700, fontSize: 14,
                cursor: "pointer",
              }}
            >
              トップページへ戻る
            </button>
          </div>
        )}

        {/* エラー */}
        {step === "error" && (
          <div style={{ textAlign: "center" }}>
            <div style={{ width: 56, height: 56, borderRadius: "50%", background: "#fff3ee", display: "flex", alignItems: "center", justifyContent: "center", fontSize: 28, margin: "0 auto 20px" }}>✕</div>
            <h1 style={{ fontFamily: "var(--font-heading)", fontWeight: 800, fontSize: 20, color: "var(--text-primary)", letterSpacing: "-0.03em", marginBottom: 12 }}>エラーが発生しました</h1>
            <p style={{ fontSize: 14, color: "var(--text-secondary)", lineHeight: 1.8, marginBottom: 32 }}>
              解約処理中にエラーが発生しました。しばらく時間をおいてから再度お試しください。
            </p>
            <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
              <button
                onClick={() => setStep("confirm")}
                style={{
                  width: "100%", padding: "14px", borderRadius: 12, border: "none",
                  background: "var(--accent-dark)", color: "#fff",
                  fontFamily: "var(--font-heading)", fontWeight: 700, fontSize: 14,
                  cursor: "pointer",
                }}
              >
                再試行する
              </button>
              <button
                onClick={() => router.push("/")}
                style={{
                  width: "100%", padding: "14px", borderRadius: 12, border: "1px solid var(--border)",
                  background: "#fff", color: "var(--text-secondary)",
                  fontFamily: "var(--font-heading)", fontWeight: 600, fontSize: 14,
                  cursor: "pointer",
                }}
              >
                トップページへ戻る
              </button>
            </div>
          </div>
        )}
      </div>

      <p style={{ marginTop: 24, fontSize: 12, color: "var(--text-muted)" }}>
        お困りの場合はお問い合わせください
      </p>
    </div>
  );
}
