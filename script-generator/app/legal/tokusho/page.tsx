export default function TokushoPage() {
  return (
    <div style={{ minHeight: "100vh", background: "var(--bg)" }}>
      {/* Header */}
      <header style={{ borderBottom: "1px solid var(--border)", background: "rgba(238,236,234,0.88)", backdropFilter: "blur(20px)", WebkitBackdropFilter: "blur(20px)", position: "sticky", top: 0, zIndex: 50 }}>
        <div style={{ maxWidth: 1100, margin: "0 auto", padding: "0 32px", height: 60, display: "flex", alignItems: "center" }}>
          <a href="/" style={{ display: "flex", alignItems: "center", gap: 8, textDecoration: "none" }}>
            <div style={{ width: 32, height: 32, borderRadius: 10, background: "var(--accent-dark)", display: "flex", alignItems: "center", justifyContent: "center", fontSize: 15 }}>✦</div>
            <span style={{ fontFamily: "var(--font-heading)", fontWeight: 800, fontSize: 18, color: "var(--text-primary)", letterSpacing: "-0.03em" }}>
              Script<span style={{ color: "var(--accent)" }}>AI</span>
            </span>
          </a>
        </div>
      </header>

      {/* Content */}
      <main style={{ maxWidth: 720, margin: "0 auto", padding: "64px 32px 80px" }}>
        <h1 style={{ fontFamily: "var(--font-heading)", fontWeight: 900, fontSize: 28, color: "var(--text-primary)", letterSpacing: "-0.03em", marginBottom: 8 }}>
          特定商取引法に基づく表記
        </h1>
        <p style={{ fontSize: 13, color: "var(--text-muted)", marginBottom: 48 }}>最終更新：2026年2月</p>

        <table style={{ width: "100%", borderCollapse: "collapse", fontSize: 14, lineHeight: 1.9 }}>
          <tbody>
            {[
              ["販売業者", "【氏名または会社名を記載】"],
              ["運営統括責任者", "【氏名を記載】"],
              ["所在地", "【住所を記載】\n※請求があった場合、遅滞なく開示いたします"],
              ["電話番号", "【電話番号を記載】\n※請求があった場合、遅滞なく開示いたします"],
              ["メールアドレス", "【メールアドレスを記載】"],
              ["販売価格", "各プランページに記載の通り\n・Proプラン：¥400（税込）\n・Maxプラン：¥2,980/月（税込）"],
              ["支払い方法", "クレジットカード（Visa・Mastercard・American Express・JCB）"],
              ["支払い時期", "購入手続き完了時に即時決済"],
              ["サービス提供時期", "決済完了後、即時ご利用いただけます"],
              ["解約方法", "Maxプラン（月額）は、サイト内の解約ページより月末日までにお手続きください。翌月以降の自動更新が停止されます。"],
              ["返品・返金について", "デジタルコンテンツの性質上、原則として返品・返金はお受けしておりません。ただし、サービス側の重大な瑕疵による場合はこの限りではありません。個別のご相談はお問い合わせよりご連絡ください。"],
              ["動作環境", "Google Chrome・Safari・Firefox・Microsoft Edge（各最新版）推奨\nスマートフォン・タブレットのブラウザからもご利用いただけます"],
            ].map(([label, value]) => (
              <tr key={label} style={{ borderBottom: "1px solid var(--border)" }}>
                <td style={{ padding: "16px 20px 16px 0", color: "var(--text-muted)", fontFamily: "var(--font-heading)", fontWeight: 600, fontSize: 13, verticalAlign: "top", whiteSpace: "nowrap", width: 180 }}>
                  {label}
                </td>
                <td style={{ padding: "16px 0", color: "var(--text-secondary)", whiteSpace: "pre-line" }}>
                  {value}
                </td>
              </tr>
            ))}
          </tbody>
        </table>

        <div style={{ marginTop: 48, padding: "24px", background: "#fff", borderRadius: 16, border: "1px solid var(--border)" }}>
          <p style={{ fontSize: 13, color: "var(--text-secondary)", lineHeight: 1.8, margin: 0 }}>
            ご不明な点がございましたら、お問い合わせフォームよりご連絡ください。
          </p>
        </div>
      </main>

      {/* Footer */}
      <footer style={{ borderTop: "1px solid var(--border)", background: "#fff" }}>
        <div style={{ maxWidth: 1100, margin: "0 auto", padding: "32px", display: "flex", alignItems: "center", justifyContent: "space-between", flexWrap: "wrap", gap: 16 }}>
          <div style={{ display: "flex", gap: 24, flexWrap: "wrap" }}>
            {[
              { label: "利用規約", href: "/legal/terms" },
              { label: "プライバシーポリシー", href: "/legal/privacy" },
              { label: "特定商取引法に基づく表記", href: "/legal/tokusho" },
            ].map((link) => (
              <a key={link.href} href={link.href} style={{ fontSize: 12, color: "var(--text-muted)", textDecoration: "none", fontFamily: "var(--font-heading)", fontWeight: 500 }}>
                {link.label}
              </a>
            ))}
          </div>
          <p style={{ fontSize: 11, color: "var(--text-muted)", fontFamily: "var(--font-heading)", margin: 0 }}>© 2026 ScriptAI. All rights reserved.</p>
        </div>
      </footer>
    </div>
  );
}
