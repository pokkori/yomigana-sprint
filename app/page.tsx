import Link from "next/link";

const samples = [
  { kanji: "茨城", reading: "いばらき", level: "地名" },
  { kanji: "薔薇", reading: "ばら", level: "N2" },
  { kanji: "山葵", reading: "わさび", level: "N3" },
];

export default function HomePage() {
  return (
    <div className="min-h-screen bg-white">
      {/* ヒーロー */}
      <section className="bg-gradient-to-b from-red-600 to-red-500 text-white py-20 px-4 text-center">
        <p className="text-sm font-bold tracking-widest mb-3 opacity-80">難読漢字クイズ</p>
        <h1 className="text-4xl md:text-5xl font-bold mb-4 leading-tight">
          読み仮名スプリント
        </h1>
        <p className="text-lg md:text-xl mb-2 opacity-90">茨城・薔薇・山葵…読める？</p>
        <p className="text-sm opacity-75 mb-8">難読漢字・地名・人名 全3,000問以上</p>
        <Link href="/game"
          className="inline-block bg-white text-red-600 font-bold text-lg px-10 py-4 rounded-2xl shadow-lg hover:scale-105 transition-transform">
          無料で挑戦する（10問/日）
        </Link>
        <p className="text-xs mt-4 opacity-60">登録不要・クレジットカード不要</p>
      </section>

      {/* サンプル問題 */}
      <section className="py-16 px-4 max-w-lg mx-auto">
        <h2 className="text-2xl font-bold text-center mb-8">こんな問題が出ます</h2>
        <div className="space-y-4">
          {samples.map(q => (
            <div key={q.kanji} className="bg-gray-50 rounded-2xl p-5 flex items-center justify-between">
              <div>
                <span className="text-xs text-gray-400 uppercase">{q.level}</span>
                <p className="text-3xl font-bold">{q.kanji}</p>
              </div>
              <div className="text-right">
                <p className="text-gray-400 text-xs mb-1">読み方</p>
                <p className="text-xl font-bold text-red-600">{q.reading}</p>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* 料金 */}
      <section className="py-16 px-4 bg-gray-50">
        <div className="max-w-lg mx-auto">
          <h2 className="text-2xl font-bold text-center mb-8">料金プラン</h2>
          <div className="grid grid-cols-2 gap-4">
            <div className="bg-white rounded-2xl p-6 border-2 border-gray-200">
              <p className="font-bold text-lg mb-1">無料</p>
              <p className="text-3xl font-bold mb-4">¥0</p>
              <ul className="text-sm text-gray-600 space-y-2">
                <li>✓ 毎日10問</li>
                <li>✓ 難読漢字初級</li>
                <li>✓ 登録不要</li>
              </ul>
            </div>
            <div className="bg-red-600 text-white rounded-2xl p-6 border-2 border-red-600">
              <p className="font-bold text-lg mb-1">プレミアム</p>
              <p className="text-3xl font-bold mb-4">¥480<span className="text-sm font-normal">/月</span></p>
              <ul className="text-sm space-y-2">
                <li>✓ 全3,000問</li>
                <li>✓ 地名・人名・JLPT</li>
                <li>✓ 毎日無制限</li>
              </ul>
            </div>
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="py-16 px-4 text-center">
        <h2 className="text-2xl font-bold mb-4">まず無料で試してみよう</h2>
        <Link href="/game"
          className="inline-block bg-red-600 text-white font-bold text-lg px-10 py-4 rounded-2xl shadow hover:scale-105 transition-transform">
          10問チャレンジ →
        </Link>
      </section>

      <footer className="text-center text-xs text-gray-400 pb-8">
        © 2026 ポッコリラボ
      </footer>
    </div>
  );
}
