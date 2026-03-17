export default function TermsPage() {
  return (
    <div className="min-h-screen py-12 px-6" style={{ background: "linear-gradient(160deg, #1c1917, #292524)" }}>
      <div className="max-w-2xl mx-auto text-stone-300">
        <h1 className="text-2xl font-bold mb-8 text-white">利用規約</h1>

        <section className="mb-8">
          <h2 className="text-lg font-bold mb-3 text-red-400">第1条（適用）</h2>
          <p className="text-sm leading-relaxed text-stone-400">
            本利用規約は、ポッコリラボ（以下「当社」）が提供する「読み仮名スプリント」（以下「本サービス」）の利用条件を定めるものです。ユーザーは本規約に同意の上、本サービスをご利用ください。
          </p>
        </section>

        <section className="mb-8">
          <h2 className="text-lg font-bold mb-3 text-red-400">第2条（利用登録）</h2>
          <p className="text-sm leading-relaxed text-stone-400">
            無料プランは登録不要でご利用いただけます。プレミアムプランの利用にはPAY.JPを通じた決済登録が必要です。
          </p>
        </section>

        <section className="mb-8">
          <h2 className="text-lg font-bold mb-3 text-red-400">第3条（禁止事項）</h2>
          <ul className="text-sm leading-relaxed text-stone-400 space-y-1 list-disc list-inside">
            <li>法令または公序良俗に違反する行為</li>
            <li>不正アクセス・改ざん行為</li>
            <li>本サービスのコンテンツの無断転載・複製</li>
            <li>その他当社が不適切と判断する行為</li>
          </ul>
        </section>

        <section className="mb-8">
          <h2 className="text-lg font-bold mb-3 text-red-400">第4条（サービスの変更・停止）</h2>
          <p className="text-sm leading-relaxed text-stone-400">
            当社は事前通知なくサービス内容の変更・停止を行う場合があります。これによるユーザーへの損害について当社は責任を負いません。
          </p>
        </section>

        <section className="mb-8">
          <h2 className="text-lg font-bold mb-3 text-red-400">第5条（免責事項）</h2>
          <p className="text-sm leading-relaxed text-stone-400">
            本サービスは「現状のまま」提供されます。当社は本サービスの正確性・完全性について保証しません。本サービスの利用により生じた損害について、当社の故意・重過失による場合を除き責任を負いません。
          </p>
        </section>

        <section className="mb-8">
          <h2 className="text-lg font-bold mb-3 text-red-400">第6条（準拠法・管轄）</h2>
          <p className="text-sm leading-relaxed text-stone-400">
            本規約の解釈は日本法に準拠し、本サービスに関する紛争は名古屋地方裁判所を第一審の専属的合意管轄裁判所とします。
          </p>
        </section>

        <p className="text-xs text-stone-600 mt-8">最終更新: 2026年3月</p>
        <a href="/" className="text-red-400 text-sm mt-4 inline-block hover:underline">← トップへ戻る</a>
      </div>
    </div>
  );
}
