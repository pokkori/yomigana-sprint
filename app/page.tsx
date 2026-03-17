import Link from "next/link";
import Image from "next/image";

const samples = [
  { kanji: "茨城", reading: "いばらき", level: "地名" },
  { kanji: "薔薇", reading: "ばら", level: "N2" },
  { kanji: "山葵", reading: "わさび", level: "N3" },
];

export default function HomePage() {
  return (
    <div className="min-h-screen" style={{ background: "linear-gradient(160deg, #1c1917, #292524, #1c1917)" }}>
      {/* ヒーロー — 道場テーマ */}
      <section className="relative text-white py-20 px-4 text-center overflow-hidden"
        style={{ background: "linear-gradient(180deg, #44403c 0%, #292524 100%)", borderBottom: "2px solid rgba(220,38,38,0.4)" }}>
        {/* 背景装飾 */}
        <div className="absolute inset-0 pointer-events-none" style={{
          backgroundImage: "repeating-linear-gradient(0deg, transparent, transparent 48px, rgba(220,38,38,0.05) 48px, rgba(220,38,38,0.05) 50px)",
        }} />
        <div className="relative z-10">
          <div className="flex justify-center mb-4">
            <Image src="/mascot.png" alt="道場マスコット" width={88} height={88} className="rounded-full shadow-2xl"
              style={{ border: "3px solid rgba(220,38,38,0.6)", boxShadow: "0 0 30px rgba(220,38,38,0.4)" }} />
          </div>
          <span className="inline-block px-4 py-1.5 rounded-full text-xs font-bold tracking-widest mb-4"
            style={{ background: "rgba(220,38,38,0.25)", color: "#fca5a5", border: "1px solid rgba(220,38,38,0.5)" }}>
            難読漢字 道場
          </span>
          <h1 className="text-4xl md:text-5xl font-black mb-4 leading-tight" style={{ color: "#fff", textShadow: "0 0 20px rgba(220,38,38,0.6)" }}>
            読み仮名スプリント
          </h1>
          <p className="text-lg md:text-xl mb-2 font-bold" style={{ color: "#fca5a5" }}>茨城・薔薇・山葵…読める？</p>
          <p className="text-sm mb-3" style={{ color: "rgba(252,165,165,0.65)" }}>難読漢字・地名・人名 全3,000問以上</p>
          <p className="text-sm font-bold mb-8" style={{ color: "#fbbf24" }}>
            🥋 連続正解で段位が上がる！名人を目指せ
          </p>
          <Link href="/game"
            className="inline-block font-black text-xl px-12 py-4 rounded-2xl shadow-xl transition-all hover:scale-105 active:scale-95"
            style={{
              background: "linear-gradient(135deg, #dc2626, #991b1b)",
              color: "#fff",
              boxShadow: "0 0 40px rgba(220,38,38,0.5), 0 8px 24px rgba(0,0,0,0.4)",
            }}>
            道場に入門する（無料）
          </Link>
          <p className="text-xs mt-4" style={{ color: "rgba(252,165,165,0.45)" }}>登録不要・クレジットカード不要</p>
        </div>
      </section>

      {/* 段位プレビュー */}
      <section className="py-12 px-4">
        <div className="max-w-lg mx-auto">
          <h2 className="text-center text-lg font-black mb-6" style={{ color: "#fca5a5" }}>段位システム</h2>
          <div className="grid grid-cols-3 gap-3">
            {[
              { badge: "🥋", rank: "初段", condition: "3問正解" },
              { badge: "⚔️", rank: "三段", condition: "7問正解" },
              { badge: "👑", rank: "名人", condition: "全問正解" },
            ].map((r) => (
              <div key={r.rank} className="rounded-2xl p-4 text-center"
                style={{ background: "rgba(220,38,38,0.1)", border: "1px solid rgba(220,38,38,0.3)" }}>
                <div className="text-3xl mb-1">{r.badge}</div>
                <div className="font-black text-sm" style={{ color: "#fca5a5" }}>{r.rank}</div>
                <div className="text-xs mt-1" style={{ color: "rgba(252,165,165,0.55)" }}>{r.condition}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* サンプル問題 */}
      <section className="py-10 px-4">
        <div className="max-w-lg mx-auto">
          <h2 className="text-xl font-black text-center mb-6" style={{ color: "#e7e5e4" }}>こんな問題が出ます</h2>
          <div className="space-y-3">
            {samples.map(q => (
              <div key={q.kanji} className="rounded-2xl p-5 flex items-center justify-between"
                style={{ background: "rgba(68,64,60,0.6)", border: "1px solid rgba(220,38,38,0.2)" }}>
                <div>
                  <span className="text-xs tracking-widest uppercase" style={{ color: "rgba(220,38,38,0.7)" }}>{q.level}</span>
                  <p className="text-3xl font-black" style={{ color: "#fff" }}>{q.kanji}</p>
                </div>
                <div className="text-right">
                  <p className="text-xs mb-1" style={{ color: "rgba(252,165,165,0.5)" }}>読み方</p>
                  <p className="text-xl font-black" style={{ color: "#fca5a5" }}>{q.reading}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* 料金 */}
      <section className="py-12 px-4" style={{ background: "rgba(0,0,0,0.3)" }}>
        <div className="max-w-lg mx-auto">
          <h2 className="text-xl font-black text-center mb-6" style={{ color: "#e7e5e4" }}>料金プラン</h2>
          <div className="grid grid-cols-2 gap-4">
            <div className="rounded-2xl p-6"
              style={{ background: "rgba(68,64,60,0.5)", border: "1px solid rgba(120,113,108,0.4)" }}>
              <p className="font-black text-base mb-1" style={{ color: "#d6d3d1" }}>無料</p>
              <p className="text-3xl font-black mb-4" style={{ color: "#fff" }}>¥0</p>
              <ul className="text-sm space-y-2" style={{ color: "#a8a29e" }}>
                <li>✓ 毎日10問</li>
                <li>✓ 難読漢字初級</li>
                <li>✓ 登録不要</li>
              </ul>
            </div>
            <div className="rounded-2xl p-6"
              style={{ background: "linear-gradient(135deg, rgba(220,38,38,0.3), rgba(153,27,27,0.3))", border: "2px solid rgba(220,38,38,0.5)" }}>
              <p className="font-black text-base mb-1" style={{ color: "#fca5a5" }}>プレミアム</p>
              <p className="text-3xl font-black mb-4" style={{ color: "#fff" }}>¥480<span className="text-sm font-normal" style={{ color: "#fca5a5" }}>/月</span></p>
              <ul className="text-sm space-y-2" style={{ color: "#fcd5d5" }}>
                <li>✓ 全3,000問</li>
                <li>✓ 地名・人名・JLPT</li>
                <li>✓ 毎日無制限</li>
              </ul>
            </div>
          </div>
        </div>
      </section>

      {/* SNSシェア訴求 */}
      <section className="py-12 px-4 text-center"
        style={{ background: "linear-gradient(180deg, rgba(220,38,38,0.15), rgba(220,38,38,0.05))" }}>
        <h2 className="text-xl font-black mb-2" style={{ color: "#fca5a5" }}>友達は何問読める？</h2>
        <p className="text-sm mb-6" style={{ color: "rgba(252,165,165,0.6)" }}>結果をXでシェアして漢字力を自慢しよう</p>
        <div className="rounded-2xl p-4 max-w-sm mx-auto mb-6"
          style={{ background: "rgba(220,38,38,0.1)", border: "1px solid rgba(220,38,38,0.2)" }}>
          <p className="font-bold mb-1 text-sm" style={{ color: "#fca5a5" }}>投稿イメージ</p>
          <p className="text-xs leading-relaxed" style={{ color: "rgba(252,165,165,0.7)" }}>
            「【読み仮名スプリント】10問中8問正解！段位: 三段⚔️<br />
            薔薇・茨城・山葵…全部読める？<br />
            → yomigana-sprint.vercel.app #難読漢字 #漢字クイズ」
          </p>
        </div>
        <Link href="/game"
          className="inline-block font-black text-lg px-10 py-4 rounded-2xl shadow transition-all hover:scale-105 active:scale-95"
          style={{ background: "linear-gradient(135deg, #dc2626, #991b1b)", color: "#fff" }}>
          挑戦してシェアする →
        </Link>
      </section>

      {/* CTA */}
      <section className="py-14 px-4 text-center">
        <h2 className="text-2xl font-black mb-4" style={{ color: "#e7e5e4" }}>まず無料で試してみよう</h2>
        <Link href="/game"
          className="inline-block font-black text-lg px-12 py-4 rounded-2xl shadow-xl transition-all hover:scale-105 active:scale-95"
          style={{
            background: "linear-gradient(135deg, #dc2626, #991b1b)",
            color: "#fff",
            boxShadow: "0 0 30px rgba(220,38,38,0.4)",
          }}>
          10問チャレンジ →
        </Link>
      </section>

      <footer className="text-center text-xs pb-8" style={{ color: "rgba(120,113,108,0.6)" }}>
        <p>© 2026 ポッコリラボ</p>
        <div className="flex justify-center gap-4 mt-1">
          <a href="/legal" className="underline hover:opacity-70">特定商取引法</a>
          <a href="/privacy" className="underline hover:opacity-70">プライバシーポリシー</a>
          <a href="/terms" className="underline hover:opacity-70">利用規約</a>
        </div>
        <p className="mt-1">
          <a href="https://twitter.com/levona_design" className="underline hover:opacity-70">お問い合わせ: X @levona_design</a>
        </p>
      </footer>
    </div>
  );
}
