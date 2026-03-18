export default function LegalPage() {
  return (
    <div className="min-h-screen py-12 px-6" style={{ background: "linear-gradient(160deg, #1c1917, #292524)" }}>
      <div className="max-w-2xl mx-auto">
        <h1 className="text-2xl font-bold mb-8 text-white">特定商取引法に基づく表記</h1>
        <table className="w-full text-sm border-collapse">
          <tbody>
            {[
              ["販売業者", "ポッコリラボ"],
              ["運営責任者", "新美（請求があれば遅滞なく開示）"],
              ["所在地", "非公開（請求があれば遅滞なく開示します）"],
              ["電話番号", "非公開（請求があれば遅滞なく開示します）"],
              ["お問い合わせ", "X(Twitter) @levona_design へのDM"],
              ["サービス名", "読み仮名スプリント"],
              ["販売価格", "プレミアムプラン ¥480/月（税込）"],
              ["支払方法", "クレジットカード（オンライン決済サービス経由）"],
              ["支払時期", "申込時に即時決済。以降毎月自動更新"],
              ["サービス提供時期", "決済完了後即時"],
              ["返品・キャンセル", "デジタルコンテンツの性質上、返金は原則不可。ただし重大な不具合の場合は個別対応"],
              ["解約方法", "マイページまたはX(@levona_design)DMにて次回更新日前までにご連絡ください"],
              ["動作環境", "最新のChrome・Safari・Edge（スマートフォン対応）"],
            ].map(([label, value]) => (
              <tr key={label} className="border-b border-stone-700">
                <td className="py-3 pr-4 font-medium text-stone-300 w-40 align-top">{label}</td>
                <td className="py-3 text-stone-400">{value}</td>
              </tr>
            ))}
          </tbody>
        </table>
        <a href="/" className="text-red-400 text-sm mt-6 inline-block hover:underline">← トップへ戻る</a>
      </div>
    </div>
  );
}
