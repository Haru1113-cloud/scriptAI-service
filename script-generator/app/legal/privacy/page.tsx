export default function PrivacyPage() {
  const sections = [
    {
      title: "1. 取得する情報",
      content: `当サービスが取得する情報は以下の通りです。

■ デバイスID
ブラウザのlocalStorageに保存される識別子です。ユーザーアカウントと紐付くものではなく、クレジット残高およびサブスクリプション状態の管理にのみ使用します。

■ 決済情報
クレジットカード情報は当社のサーバーには一切保存されません。決済処理はStripe, Inc.が行い、Stripeのプライバシーポリシーが適用されます。

■ 生成した台本の内容
ユーザーが入力したテーマや生成された台本の内容は、当社のサーバーには保存されません。`,
    },
    {
      title: "2. 情報の利用目的",
      content: `取得した情報は以下の目的のために使用します。

・当サービスの提供（クレジット管理・サブスクリプション管理）
・サービスの品質改善および不正利用の防止
・お問い合わせへの対応`,
    },
    {
      title: "3. 第三者への提供",
      content: `当社は、以下の場合を除き、取得した情報を第三者に提供しません。

・ユーザーの同意がある場合
・法令に基づく場合

■ 業務委託先への提供
決済処理のため、Stripe, Inc.に必要な情報を提供します。
Stripeのプライバシーポリシー：https://stripe.com/jp/privacy`,
    },
    {
      title: "4. Cookieおよびlocalストレージの使用",
      content: `当サービスは、デバイスIDの保存にブラウザのlocalStorageを使用します。

localStorageのデータはブラウザの設定からいつでも削除することができます。ただし、削除するとクレジット残高の引き継ぎができなくなります。

なお、当サービスは現在トラッキング目的のCookieや広告Cookieは使用していません。`,
    },
    {
      title: "5. データの保持期間",
      content: `デバイスIDに紐付くクレジット残高・サブスクリプション情報は、サービス提供のために必要な期間保持します。

サービスを長期間ご利用いただいていない場合、データを削除することがあります。`,
    },
    {
      title: "6. 安全管理措置",
      content: `当社は、取得した情報の漏洩・滅失・毀損を防止するため、適切なセキュリティ対策を講じます。`,
    },
    {
      title: "7. プライバシーポリシーの変更",
      content: `当社は必要に応じて本ポリシーを変更することがあります。重要な変更がある場合はサービス上でお知らせします。`,
    },
    {
      title: "8. お問い合わせ",
      content: `個人情報の取り扱いに関するお問い合わせは、お問い合わせフォームよりご連絡ください。`,
    },
  ];

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
          プライバシーポリシー
        </h1>
        <p style={{ fontSize: 13, color: "var(--text-muted)", marginBottom: 48 }}>最終更新：2026年2月</p>

        <div style={{ display: "flex", flexDirection: "column", gap: 40 }}>
          {sections.map((section) => (
            <section key={section.title}>
              <h2 style={{ fontFamily: "var(--font-heading)", fontWeight: 800, fontSize: 16, color: "var(--text-primary)", marginBottom: 12, letterSpacing: "-0.02em" }}>
                {section.title}
              </h2>
              <p style={{ fontSize: 14, color: "var(--text-secondary)", lineHeight: 2, whiteSpace: "pre-line", margin: 0 }}>
                {section.content}
              </p>
            </section>
          ))}
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
