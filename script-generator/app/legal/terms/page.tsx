export default function TermsPage() {
  const sections = [
    {
      title: "第1条（目的・サービス内容）",
      content: `本利用規約（以下「本規約」）は、ScriptAI（以下「当サービス」）の利用条件を定めるものです。ユーザーは本規約に同意の上、当サービスをご利用ください。

当サービスは、AIを活用したYouTube・Podcast向け台本生成ツールです。`,
    },
    {
      title: "第2条（利用登録）",
      content: `当サービスはアカウント登録不要でご利用いただけます。ブラウザのlocalStorageに保存されるデバイスIDにより、クレジット残高およびサブスクリプション状態を管理します。

デバイスIDはブラウザのデータを削除した場合にリセットされます。リセットにより失われたクレジットの復元はいたしかねます。`,
    },
    {
      title: "第3条（料金・クレジット）",
      content: `当サービスには以下のプランがあります。

■ Freeプラン
新規利用開始時に10クレジットを付与します。追加購入が必要な場合はProまたはMaxプランをご利用ください。

■ Proプラン（¥400 買い切り）
50クレジットを即時付与します。クレジットに有効期限はありません。

■ Maxプラン（¥2,980/月）
毎月300クレジットを付与します。クレジットは月末にリセットされます。翌月分は更新時に付与されます。

クレジットは1台本生成につき1消費されます。`,
    },
    {
      title: "第4条（解約）",
      content: `Maxプラン（月額サブスクリプション）の解約は、サイト内の解約ページよりお手続きください。

解約手続きを当月末日までに完了した場合、翌月以降の自動更新が停止されます。解約後は当月末まで残りのクレジットをご利用いただけます。

解約後に残存するクレジットの払い戻しはいたしかねます。`,
    },
    {
      title: "第5条（生成コンテンツの著作権）",
      content: `当サービスにより生成されたコンテンツの著作権は、生成を行ったユーザーに帰属します。商用利用（YouTubeへの投稿、クライアント向け制作等）も可能です。

ただし、AIモデルの特性上、同一または類似のコンテンツが他のユーザーにも生成される可能性があり、当社はその独自性・独占性を保証しません。`,
    },
    {
      title: "第6条（禁止事項）",
      content: `ユーザーは以下の行為を行ってはなりません。

・法令または公序良俗に違反するコンテンツの生成
・第三者の著作権、商標権、プライバシーその他の権利を侵害するコンテンツの生成
・差別的・ヘイトスピーチに該当するコンテンツの生成
・スパムや大量生成による不正利用
・当サービスのAPIへの直接アクセス・リバースエンジニアリング
・クレジットの不正取得・アカウントの転売・譲渡
・その他当社が不適切と判断する行為`,
    },
    {
      title: "第7条（免責事項）",
      content: `当社は、当サービスにより生成されたコンテンツの正確性・品質・適法性について保証しません。

生成されたコンテンツの利用によりユーザーまたは第三者に生じた損害について、当社は一切の責任を負いません。

当サービスは予告なく内容の変更、一時停止、終了する場合があります。`,
    },
    {
      title: "第8条（サービスの変更・停止）",
      content: `当社は、ユーザーへの事前通知なく、当サービスの内容を変更または提供を停止することがあります。

サービス停止に伴う未使用クレジットの払い戻しについては、その時点で別途対応方針をお知らせします。`,
    },
    {
      title: "第9条（規約の変更）",
      content: `当社は必要に応じて本規約を変更することがあります。変更後の規約は、当サービス上に掲示した時点で効力を生じます。変更後もサービスを継続してご利用いただいた場合、変更後の規約に同意したものとみなします。`,
    },
    {
      title: "第10条（準拠法・管轄裁判所）",
      content: `本規約の解釈は日本法に準拠します。本規約に関する紛争については、東京地方裁判所を第一審の専属的合意管轄裁判所とします。`,
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
          利用規約
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
