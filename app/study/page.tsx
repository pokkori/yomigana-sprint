import type { Metadata } from "next";
import Link from "next/link";

export const metadata: Metadata = {
  title: "難読漢字 完全ガイド｜読み方・覚え方・一覧 — 読み仮名スプリント",
  description: "薔薇・山葵・蒲公英・茨城など難読漢字の読み方と覚え方を完全解説。JLPT対策・地名・動植物名まで分野別に整理。読み仮名スプリントで楽しく練習しよう。",
  openGraph: {
    title: "難読漢字 完全ガイド｜読み方・覚え方・一覧",
    description: "薔薇・山葵・蒲公英・茨城など難読漢字の読み方と覚え方を完全解説。",
    url: "https://yomigana-sprint.vercel.app/study",
  },
};

const jsonLd = {
  "@context": "https://schema.org",
  "@type": "Article",
  "headline": "難読漢字 完全ガイド — 読み方・覚え方・分野別一覧",
  "description": "薔薇・山葵・蒲公英など難読漢字の読み方と覚え方を完全解説。JLPT対策・地名・食材・植物・動物まで分野別に整理。",
  "url": "https://yomigana-sprint.vercel.app/study",
  "publisher": { "@type": "Organization", "name": "ポッコリラボ" },
  "dateModified": "2026-03-20",
};

const CATEGORIES = [
  {
    title: "食材・料理",
    emoji: "",
    items: [
      { kanji: "山葵", reading: "わさび", note: "アブラナ科の植物。辛味成分・水辺で育つ。" },
      { kanji: "小豆", reading: "あずき", note: "マメ科の一年草。和菓子の原料として有名。" },
      { kanji: "牛蒡", reading: "ごぼう", note: "キク科の根菜。食物繊維が豊富。" },
      { kanji: "海苔", reading: "のり", note: "紅藻・緑藻・藍藻の総称。食用海藻。" },
      { kanji: "薩摩芋", reading: "さつまいも", note: "ヒルガオ科の根菜。「薩摩」は旧国名（鹿児島）。" },
      { kanji: "玉葱", reading: "たまねぎ", note: "ユリ科の野菜。「玉」は丸い形から。" },
      { kanji: "海老", reading: "えび", note: "節足動物・十脚目。「海の老人」という意味。" },
      { kanji: "烏賊", reading: "いか", note: "軟体動物頭足類。「烏（カラス）を欺く」が語源説。" },
    ],
  },
  {
    title: "植物・花",
    emoji: "",
    items: [
      { kanji: "薔薇", reading: "ばら", note: "バラ科の花。「薔」も「薇」も草冠に複雑な字。" },
      { kanji: "蒲公英", reading: "たんぽぽ", note: "キク科の多年草。3文字全てで「たんぽぽ」と読む。" },
      { kanji: "向日葵", reading: "ひまわり", note: "キク科の一年草。太陽に向いて咲くことから。" },
      { kanji: "紫陽花", reading: "あじさい", note: "アジサイ科の落葉低木。6月の花として有名。" },
      { kanji: "水仙", reading: "すいせん", note: "ヒガンバナ科の球根植物。早春に咲く白・黄の花。" },
      { kanji: "百合", reading: "ゆり", note: "ユリ科の多年草。「百」は「多くの」意味。" },
      { kanji: "椿", reading: "つばき", note: "ツバキ科の常緑樹。冬に赤い花を咲かせる。" },
      { kanji: "梔子", reading: "くちなし", note: "アカネ科の常緑低木。白い花と黄色い実が特徴。" },
    ],
  },
  {
    title: "動物",
    emoji: "",
    items: [
      { kanji: "海豚", reading: "いるか", note: "哺乳類・クジラ目。「海の豚」という漢字表記。" },
      { kanji: "鯱", reading: "しゃちほこ", note: "想像上の生物。名古屋城の金のシャチホコが有名。" },
      { kanji: "河馬", reading: "かば", note: "偶蹄目・カバ科の大型哺乳類。「河」の「馬」。" },
      { kanji: "驢馬", reading: "ろば", note: "ウマ科の哺乳動物。荷物を運ぶ動物として知られる。" },
      { kanji: "土竜", reading: "もぐら", note: "食虫目・モグラ科。「土の竜」という漢字。" },
      { kanji: "蟷螂", reading: "かまきり", note: "蟷螂目（カマキリ目）の昆虫。鎌状の前足が特徴。" },
      { kanji: "蜻蛉", reading: "とんぼ", note: "トンボ目の昆虫。秋の風物詩。" },
      { kanji: "螢", reading: "ほたる", note: "コウチュウ目の昆虫。夏に光る幻想的な虫。" },
    ],
  },
  {
    title: "地名",
    emoji: "",
    items: [
      { kanji: "茨城", reading: "いばらき", note: "関東地方の県。「茨（いばら）」という植物から。" },
      { kanji: "滋賀", reading: "しが", note: "近畿地方の県。琵琶湖を擁する内陸県。" },
      { kanji: "岐阜", reading: "ぎふ", note: "中部地方の県。織田信長が名付けたとされる。" },
      { kanji: "栃木", reading: "とちぎ", note: "関東地方の県。「栃の木」から。日光東照宮がある。" },
      { kanji: "埼玉", reading: "さいたま", note: "関東地方の県。「幸魂（さきたま）」が語源説。" },
      { kanji: "愛媛", reading: "えひめ", note: "四国地方の県。古事記の「愛比売（えひめ）」から。" },
      { kanji: "沖縄", reading: "おきなわ", note: "南西諸島の県。「沖の縄（長い島）」の意。" },
      { kanji: "大阪", reading: "おおさか", note: "近畿地方の府。江戸時代以前は「大坂」と書いた。" },
    ],
  },
  {
    title: "日常語・その他",
    emoji: "",
    items: [
      { kanji: "土産", reading: "みやげ", note: "旅行先などで買う贈り物。「土」の「産物」という意。" },
      { kanji: "雪崩", reading: "なだれ", note: "雪が斜面を崩れ落ちる自然現象。" },
      { kanji: "木綿", reading: "もめん", note: "ワタの繊維から作られる布地。「綿」の柔らかい素材。" },
      { kanji: "足袋", reading: "たび", note: "和服に合わせる先が分かれた靴下。" },
      { kanji: "煙草", reading: "たばこ", note: "タバコ属の植物・またはその葉を加工した嗜好品。" },
      { kanji: "浴衣", reading: "ゆかた", note: "夏に着る薄手の和服。「湯帷子（ゆかたびら）」が語源。" },
      { kanji: "五月雨", reading: "さみだれ", note: "梅雨の雨。「五月（さつき）の雨（さめ）」が語源。" },
      { kanji: "時雨", reading: "しぐれ", note: "晩秋から冬にかけて降ったり止んだりする雨。" },
    ],
  },
];

export default function StudyPage() {
  return (
    <div className="min-h-screen" style={{ background: "linear-gradient(160deg, #1c1917, #292524, #1c1917)" }}>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }} />

      {/* Nav */}
      <nav className="border-b px-6 py-4 sticky top-0 z-10" style={{ borderColor: "rgba(220,38,38,0.3)", background: "rgba(28,25,23,0.95)" }}>
        <div className="max-w-3xl mx-auto flex items-center justify-between">
          <Link href="/" className="font-bold text-sm" style={{ color: "#fca5a5" }}>← 読み仮名スプリント</Link>
          <Link href="/game"
            className="text-xs font-bold px-4 py-2 rounded-full"
            style={{ background: "linear-gradient(135deg, #dc2626, #991b1b)", color: "#fff" }}>
            今すぐ練習する →
          </Link>
        </div>
      </nav>

      {/* Hero */}
      <section className="py-14 px-4 text-center" style={{ borderBottom: "1px solid rgba(220,38,38,0.2)" }}>
        <div className="max-w-2xl mx-auto">
          <span className="inline-block text-xs font-bold px-4 py-1.5 rounded-full mb-4"
            style={{ background: "rgba(220,38,38,0.25)", color: "#fca5a5", border: "1px solid rgba(220,38,38,0.5)" }}>
            難読漢字 学習ガイド
          </span>
          <h1 className="text-3xl font-black mb-4 leading-tight" style={{ color: "#fff" }}>
            難読漢字 完全ガイド
          </h1>
          <p className="text-sm mb-6" style={{ color: "rgba(252,165,165,0.7)" }}>
            薔薇・山葵・蒲公英・茨城…なぜこんな読み方？由来・覚え方まで徹底解説
          </p>
          <div className="flex flex-wrap justify-center gap-2 mb-6">
            <span className="text-xs px-3 py-1 rounded-full" style={{ background: "rgba(220,38,38,0.15)", color: "rgba(252,165,165,0.8)", border: "1px solid rgba(220,38,38,0.3)" }}>食材・料理</span>
            <span className="text-xs px-3 py-1 rounded-full" style={{ background: "rgba(220,38,38,0.15)", color: "rgba(252,165,165,0.8)", border: "1px solid rgba(220,38,38,0.3)" }}>植物・花</span>
            <span className="text-xs px-3 py-1 rounded-full" style={{ background: "rgba(220,38,38,0.15)", color: "rgba(252,165,165,0.8)", border: "1px solid rgba(220,38,38,0.3)" }}>動物</span>
            <span className="text-xs px-3 py-1 rounded-full" style={{ background: "rgba(220,38,38,0.15)", color: "rgba(252,165,165,0.8)", border: "1px solid rgba(220,38,38,0.3)" }}>地名</span>
            <span className="text-xs px-3 py-1 rounded-full" style={{ background: "rgba(220,38,38,0.15)", color: "rgba(252,165,165,0.8)", border: "1px solid rgba(220,38,38,0.3)" }}>日常語</span>
          </div>
          <Link href="/game"
            className="inline-block font-black py-3 px-8 rounded-xl text-sm active:scale-95 transition-transform"
            style={{ background: "linear-gradient(135deg, #dc2626, #991b1b)", color: "#fff" }}>
            これを全部読めるか挑戦する →
          </Link>
        </div>
      </section>

      {/* 難読漢字一覧 */}
      <div className="max-w-3xl mx-auto px-4 py-8">
        {CATEGORIES.map((cat) => (
          <section key={cat.title} className="mb-12">
            <h2 className="text-xl font-black mb-6 flex items-center gap-2" style={{ color: "#fca5a5" }}>
              <span>{cat.emoji}</span>
              <span>{cat.title}の難読漢字</span>
            </h2>
            <div className="space-y-3">
              {cat.items.map((item) => (
                <div key={item.kanji} className="rounded-2xl p-4"
                  style={{ background: "rgba(68,64,60,0.4)", border: "1px solid rgba(220,38,38,0.2)" }}>
                  <div className="flex items-center justify-between mb-2">
                    <div className="flex items-center gap-3">
                      <span className="text-3xl font-black" style={{ color: "#fff" }}>{item.kanji}</span>
                      <span className="text-lg font-bold" style={{ color: "#fca5a5" }}>→ {item.reading}</span>
                    </div>
                  </div>
                  <p className="text-xs leading-relaxed" style={{ color: "rgba(252,165,165,0.65)" }}>{item.note}</p>
                </div>
              ))}
            </div>
            <div className="mt-5 text-center">
              <Link href="/game"
                className="inline-block font-black py-2.5 px-6 rounded-xl text-xs active:scale-95 transition-transform"
                style={{ background: "linear-gradient(135deg, #dc2626, #991b1b)", color: "#fff" }}>
                {cat.title}の漢字をゲームで練習する →
              </Link>
            </div>
          </section>
        ))}

        {/* 覚え方のコツ */}
        <section className="mb-12">
          <h2 className="text-xl font-black mb-6" style={{ color: "#fca5a5" }}>難読漢字の覚え方 4つのコツ</h2>
          <div className="space-y-4">
            {[
              {
                no: "1",
                title: "語源・由来から覚える",
                content: "「薔薇（ばら）」の「薔」「薇」は草冠＋複雑な字の組み合わせ。由来を知ると記憶に定着しやすい。「土産（みやげ）」は旅先の「土地の産物（みやげ）」が語源。意味と読みをセットで覚えよう。",
              },
              {
                no: "2",
                title: "分野別にまとめて覚える",
                content: "「食材」「植物」「動物」「地名」など分野別にグループ化すると覚えやすい。同じカテゴリに属する漢字は読み方のパターンが似ていることが多い。",
              },
              {
                no: "3",
                title: "毎日少しずつ繰り返す",
                content: "人間の記憶は「繰り返し」で定着する。1日10問を継続するほうが、1日100問を週1回やるより効果的。読み仮名スプリントの「毎日10問チャレンジ」はこの原理を活用している。",
              },
              {
                no: "4",
                title: "間違えた漢字を重点的に復習",
                content: "間違えた漢字こそ重要な学習機会。読み仮名スプリントでは不正解の漢字が自動的に「苦手リスト」に追加される。苦手克服モードで集中的に復習しよう。",
              },
            ].map((tip) => (
              <div key={tip.no} className="rounded-2xl p-5"
                style={{ background: "rgba(68,64,60,0.4)", border: "1px solid rgba(220,38,38,0.25)" }}>
                <div className="flex items-start gap-3">
                  <div className="w-8 h-8 rounded-full flex items-center justify-center font-black text-sm shrink-0"
                    style={{ background: "linear-gradient(135deg, #dc2626, #991b1b)", color: "#fff" }}>
                    {tip.no}
                  </div>
                  <div>
                    <h3 className="font-bold text-sm mb-2" style={{ color: "#fca5a5" }}>{tip.title}</h3>
                    <p className="text-xs leading-relaxed" style={{ color: "rgba(252,165,165,0.7)" }}>{tip.content}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* 効果的な練習方法 */}
        <section className="mb-12 rounded-2xl p-6"
          style={{ background: "rgba(220,38,38,0.08)", border: "1px solid rgba(220,38,38,0.25)" }}>
          <h2 className="text-lg font-black mb-4" style={{ color: "#fca5a5" }}>読み仮名スプリントで効果的に練習する方法</h2>
          <div className="space-y-3">
            {[
              { icon: "️", tip: "毎朝5分、ゲーム感覚で練習する（継続が鍵）" },
              { icon: "", tip: "段位システムを目標に：初段→三段→名人の順番で上達" },
              { icon: "", tip: "タイムアタックモードで「素早く読む」反射神経を鍛える" },
              { icon: "", tip: "苦手克服リストで弱点の漢字を集中的に復習する" },
              { icon: "", tip: "スコアをXでシェアして友達と競い合う（競争心が学習効果を高める）" },
            ].map((item, i) => (
              <div key={i} className="flex items-center gap-3 text-sm" style={{ color: "rgba(252,165,165,0.8)" }}>
                <span>{item.icon}</span>
                <span>{item.tip}</span>
              </div>
            ))}
          </div>
          <div className="mt-5 text-center">
            <Link href="/game"
              className="inline-block font-black py-3 px-8 rounded-xl text-sm active:scale-95 transition-transform"
              style={{ background: "linear-gradient(135deg, #dc2626, #991b1b)", color: "#fff" }}>
              今すぐ練習を始める（無料）→
            </Link>
          </div>
        </section>
      </div>

      <footer className="text-center text-xs pb-8" style={{ color: "rgba(120,113,108,0.6)", borderTop: "1px solid rgba(120,113,108,0.2)", paddingTop: "24px" }}>
        <Link href="/" className="underline hover:opacity-70">読み仮名スプリント トップ</Link>
        {" | "}
        <Link href="/game" className="underline hover:opacity-70">今すぐプレイ</Link>
        {" | "}
        <Link href="/legal" className="underline hover:opacity-70">特定商取引法</Link>
        {" | "}
        <Link href="/privacy" className="underline hover:opacity-70">プライバシーポリシー</Link>
      </footer>
    </div>
  );
}
