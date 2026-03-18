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
              <div style={{ display: "inline-block", background: "#16a34a", color: "#fff", fontSize: "10px", fontWeight: "700", padding: "2px 10px", borderRadius: "999px", marginBottom: "8px" }}>🛡️ 30日返金保証</div>
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

      {/* 感情フック */}
      <section className="py-12 px-6 max-w-3xl mx-auto">
        <h2 className="text-xl font-bold text-center text-gray-800 mb-6">こんな経験ありませんか？</h2>
        <div className="space-y-4">
          {[
            { icon: "😓", text: "小学生の漢字読みが苦手で、テストのたびに落ち込む..." },
            { icon: "😤", text: "市販のドリルは退屈で、すぐ飽きてしまう..." },
            { icon: "💭", text: "楽しく練習できる方法があれば、もっと続けられるのに..." },
          ].map((item, i) => (
            <div key={i} className="flex items-center gap-4 bg-red-50 border border-red-200 rounded-xl p-4">
              <span className="text-2xl">{item.icon}</span>
              <p className="text-gray-700 text-sm font-medium">{item.text}</p>
            </div>
          ))}
        </div>
        <div className="mt-6 bg-red-600 text-white rounded-2xl p-5 text-center">
          <p className="font-bold text-base mb-1">読み仮名スプリントがその悩みを解決します</p>
          <p className="text-red-100 text-sm">ゲーム感覚でスピード練習。楽しいから自然と続けられます。</p>
        </div>
      </section>

      {/* FAQ */}
      <section className="py-10 px-4 max-w-lg mx-auto">
        <h2 className="text-center text-lg font-bold mb-5" style={{ color: "#fca5a5" }}>よくある質問</h2>
        <div className="space-y-3">
          {[
            { q: "どのレベルから始められますか？", a: "小学1年生レベルから大学入試レベルまで対応。初めての方でも安心です。" },
            { q: "スコアは保存されますか？", a: "ブラウザのローカルストレージにハイスコアを保存します。" },
            { q: "スマホでも遊べますか？", a: "はい、スマートフォン・タブレットに完全対応しています。" },
            { q: "JLPT対策にも使えますか？", a: "N5〜N1レベルの漢字に対応しており、JLPT対策としてもご活用いただけます。" },
          ].map((faq, i) => (
            <div key={i} style={{ background: "rgba(220,38,38,0.08)", border: "1px solid rgba(220,38,38,0.2)", borderRadius: "12px", padding: "14px 16px" }}>
              <p style={{ color: "#fca5a5", fontWeight: "600", fontSize: "13px", marginBottom: "6px" }}>Q. {faq.q}</p>
              <p style={{ color: "rgba(252,165,165,0.7)", fontSize: "12px" }}>A. {faq.a}</p>
            </div>
          ))}
        </div>
        <div className="flex flex-col gap-2 mt-5">
          <a href="https://twitter.com/intent/tweet?text=%E8%AA%AD%E3%81%BF%E4%BB%AE%E5%90%8D%E3%82%B9%E3%83%97%E3%83%AA%E3%83%B3%E3%83%88%E3%81%A7%E9%9B%A3%E8%AA%AD%E6%BC%A2%E5%AD%97%E3%81%AB%E6%8C%91%E6%88%A6%E3%81%97%E3%81%9F%EF%BC%81%F0%9F%A5%8B%20%23%E8%AA%AD%E3%81%BF%E4%BB%AE%E5%90%8D%20%23%E9%9B%A3%E8%AA%AD%E6%BC%A2%E5%AD%97%20https%3A%2F%2Fyomigana-sprint.vercel.app" target="_blank" rel="noopener noreferrer"
            className="flex items-center justify-center gap-2 text-sm font-bold py-2.5 px-6 rounded-xl transition-colors w-full"
            style={{ background: "#18181b", color: "#fff" }}>
            <svg className="w-4 h-4 fill-current" viewBox="0 0 24 24"><path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-4.714-6.231-5.401 6.231H2.748l7.73-8.835L1.254 2.25H8.08l4.259 5.63zm-1.161 17.52h1.833L7.084 4.126H5.117z"/></svg>
            結果をXでシェア
          </a>
          <a
            href={`https://line.me/R/msg/text/?${encodeURIComponent("読み仮名スプリントで難読漢字に挑戦！🥋 あなたは何問読める？ https://yomigana-sprint.vercel.app")}`}
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center justify-center gap-2 text-sm font-bold py-2.5 px-6 rounded-xl transition-colors w-full"
            style={{ background: "#06C755", color: "#fff" }}>
            <svg viewBox="0 0 24 24" className="w-4 h-4 fill-current">
              <path d="M19.365 9.863c.349 0 .63.285.63.631 0 .345-.281.63-.63.63H17.61v1.125h1.755c.349 0 .63.283.63.63 0 .344-.281.629-.63.629h-2.386c-.345 0-.627-.285-.627-.629V8.108c0-.345.282-.63.627-.63h2.386c.349 0 .63.285.63.63 0 .349-.281.63-.63.63H17.61v1.125h1.755zm-3.855 3.016c0 .27-.174.51-.432.596-.064.021-.133.031-.199.031-.211 0-.391-.09-.51-.25l-2.443-3.317v2.94c0 .344-.279.629-.631.629-.346 0-.626-.285-.626-.629V8.108c0-.27.173-.51.43-.595.06-.023.136-.033.194-.033.195 0 .375.104.495.254l2.462 3.33V8.108c0-.345.282-.63.63-.63.345 0 .63.285.63.63v4.771zm-5.741 0c0 .344-.282.629-.631.629-.345 0-.627-.285-.627-.629V8.108c0-.345.282-.63.627-.63.349 0 .631.285.631.63v4.771zm-2.466.629H4.917c-.345 0-.63-.285-.63-.629V8.108c0-.345.285-.63.63-.63.348 0 .63.285.63.63v4.141h1.756c.348 0 .629.283.629.63 0 .344-.281.629-.629.629M24 10.314C24 4.943 18.615.572 12 .572S0 4.943 0 10.314c0 4.811 4.27 8.842 10.035 9.608.391.082.923.258 1.058.59.12.301.079.766.038 1.08l-.164 1.02c-.045.301-.24 1.186 1.049.645 1.291-.539 6.916-4.078 9.436-6.975C23.176 14.393 24 12.458 24 10.314"/>
            </svg>
            LINEで友達に送る
          </a>
        </div>
      </section>

      {/* ハンドメイドチャンネル アフィリエイト */}
      <section className="max-w-lg mx-auto px-4 pb-6">
        <div style={{ background: "rgba(6,78,59,0.3)", border: "1px solid rgba(16,185,129,0.35)", borderRadius: "16px", padding: "16px" }}>
          <p style={{ color: "#6ee7b7", fontWeight: "700", fontSize: "14px", marginBottom: "12px" }}>📚 日本語・国語が好きなら、日本文化を仕事に</p>
          <a
            href="https://px.a8.net/svt/ejp?a8mat=4AZIOF+8PRGKY+4V0U+BXB8Z"
            target="_blank"
            rel="noopener noreferrer sponsored"
            style={{ display: "flex", alignItems: "center", justifyContent: "space-between", background: "rgba(6,78,59,0.4)", border: "1px solid rgba(16,185,129,0.3)", borderRadius: "12px", padding: "12px 14px", textDecoration: "none" }}
          >
            <div>
              <div style={{ color: "#ecfdf5", fontWeight: "700", fontSize: "13px" }}>ハンドメイドチャンネル — 日本文化・和雑貨で副業</div>
              <div style={{ color: "rgba(110,231,183,0.65)", fontSize: "11px", marginTop: "2px" }}>¥5,000〜¥15,000 報酬 • 和文化・手芸・クラフトを仕事に</div>
            </div>
            <span style={{ color: "#6ee7b7", fontWeight: "700", fontSize: "11px", background: "rgba(6,78,59,0.5)", border: "1px solid rgba(16,185,129,0.4)", padding: "4px 8px", borderRadius: "999px", whiteSpace: "nowrap", marginLeft: "8px" }}>詳細を見る →</span>
          </a>
          <p style={{ color: "rgba(52,211,153,0.45)", fontSize: "11px", textAlign: "center", marginTop: "8px" }}>※ 広告・PR掲載</p>
        </div>
      </section>

      {/* もっと楽しむ3選 */}
      <section className="max-w-lg mx-auto px-4 py-8">
        <h2 className="text-center text-base font-bold mb-4" style={{ color: "#ef4444" }}>📚 もっと楽しむ3選</h2>
        <ol className="space-y-3">
          {[
            { icon: "🥇", title: "全難易度をクリアしよう", desc: "易・普通・難・超難の4段階を制覇してJLPT N1レベルの難読漢字を完全習得！" },
            { icon: "📣", title: "スコアをXでシェア", desc: "ゲームクリア後にXでスコア投稿。「難読漢字オタク認定」をもらおう！" },
            { icon: "📖", title: "毎日1ステージの脳トレ習慣", desc: "朝5分の漢字スプリントで記憶力・語彙力が着実にアップ。" },
          ].map((item, i) => (
            <li key={i} className="flex items-start gap-3"
              style={{ background: "rgba(239,68,68,0.06)", border: "1px solid rgba(239,68,68,0.15)", borderRadius: "12px", padding: "12px 14px" }}>
              <span style={{ fontSize: "22px", lineHeight: "1" }}>{item.icon}</span>
              <div>
                <div style={{ color: "#b91c1c", fontWeight: "700", fontSize: "13px" }}>{i + 1}. {item.title}</div>
                <div style={{ color: "rgba(120,60,60,0.8)", fontSize: "12px", marginTop: "2px" }}>{item.desc}</div>
              </div>
            </li>
          ))}
        </ol>
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
