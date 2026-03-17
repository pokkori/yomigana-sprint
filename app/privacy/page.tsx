export default function PrivacyPage() {
  return (
    <div className="min-h-screen py-12 px-6" style={{ background: "linear-gradient(160deg, #1c1917, #292524)" }}>
      <div className="max-w-2xl mx-auto text-stone-300">
        <h1 className="text-2xl font-bold mb-8 text-white">プライバシーポリシー</h1>

        <section className="mb-8">
          <h2 className="text-lg font-bold mb-3 text-red-400">1. 収集する情報</h2>
          <p className="text-sm leading-relaxed text-stone-400">
            当サービス「読み仮名スプリント」では、以下の情報を収集することがあります。
          </p>
          <ul className="text-sm leading-relaxed text-stone-400 mt-2 space-y-1 list-disc list-inside">
            <li>PAY.JPによる決済時のメールアドレス（PAY.JPが管理）</li>
            <li>ゲームプレイデータ（ブラウザのlocalStorageに保存、外部送信なし）</li>
            <li>Vercel Analyticsによる匿名アクセスログ</li>
          </ul>
        </section>

        <section className="mb-8">
          <h2 className="text-lg font-bold mb-3 text-red-400">2. 情報の利用目的</h2>
          <ul className="text-sm leading-relaxed text-stone-400 space-y-1 list-disc list-inside">
            <li>サービスの提供・運営</li>
            <li>お問い合わせへの対応</li>
            <li>サービス改善のための分析</li>
          </ul>
        </section>

        <section className="mb-8">
          <h2 className="text-lg font-bold mb-3 text-red-400">3. 第三者提供</h2>
          <p className="text-sm leading-relaxed text-stone-400">
            法令に基づく場合を除き、ユーザーの同意なく第三者に個人情報を提供しません。
            決済処理はPAY.JP（ペイジェント）が行い、カード情報は当サービスでは保持しません。
          </p>
        </section>

        <section className="mb-8">
          <h2 className="text-lg font-bold mb-3 text-red-400">4. Cookieの使用</h2>
          <p className="text-sm leading-relaxed text-stone-400">
            当サービスはセッション管理のためにCookieを使用します。ブラウザの設定でCookieを無効化できますが、一部機能が制限される場合があります。
          </p>
        </section>

        <section className="mb-8">
          <h2 className="text-lg font-bold mb-3 text-red-400">5. お問い合わせ</h2>
          <p className="text-sm leading-relaxed text-stone-400">
            プライバシーに関するお問い合わせはX(Twitter) @levona_design までDMをお送りください。
          </p>
        </section>

        <p className="text-xs text-stone-600 mt-8">最終更新: 2026年3月</p>
        <a href="/" className="text-red-400 text-sm mt-4 inline-block hover:underline">← トップへ戻る</a>
      </div>
    </div>
  );
}
