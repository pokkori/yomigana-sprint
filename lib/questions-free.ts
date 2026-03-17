export type Question = {
  kanji: string;
  correct: string;
  choices: string[];
  level: "N5" | "N4" | "N3" | "N2" | "N1" | "地名" | "人名";
  hint?: string;
};

export const freeQuestions: Question[] = [
  { kanji: "茨城", correct: "いばらき", choices: ["いばらぎ", "いばらき", "もばらき", "うばらき"], level: "地名", hint: "関東地方の県" },
  { kanji: "岐阜", correct: "ぎふ", choices: ["きふ", "ぎふ", "きぶ", "ぎぶ"], level: "地名", hint: "中部地方の県" },
  { kanji: "滋賀", correct: "しが", choices: ["しが", "じが", "しか", "じか"], level: "地名", hint: "琵琶湖がある県" },
  { kanji: "愛媛", correct: "えひめ", choices: ["あいひめ", "えひめ", "あいめ", "えいめ"], level: "地名", hint: "四国の県" },
  { kanji: "鳥取", correct: "とっとり", choices: ["とりとり", "とっとり", "とうとり", "とりどり"], level: "地名" },
  { kanji: "埼玉", correct: "さいたま", choices: ["さいたま", "さきたま", "さいだま", "さいやま"], level: "地名" },
  { kanji: "大阪", correct: "おおさか", choices: ["おおさか", "だいさか", "おおざか", "だいざか"], level: "地名" },
  { kanji: "神奈川", correct: "かながわ", choices: ["かながわ", "かみながわ", "しんながわ", "かみなかわ"], level: "地名" },
  { kanji: "鹿児島", correct: "かごしま", choices: ["かごしま", "しかごしま", "かじしま", "かごじま"], level: "地名" },
  { kanji: "沖縄", correct: "おきなわ", choices: ["おきなわ", "おきのわ", "おきなは", "うきなわ"], level: "地名" },
  { kanji: "山葵", correct: "わさび", choices: ["やまあい", "わさび", "さんき", "やまき"], level: "N3", hint: "緑色の薬味" },
  { kanji: "海豚", correct: "いるか", choices: ["うみぶた", "いるか", "かいとん", "うみとん"], level: "N3", hint: "海の哺乳類" },
  { kanji: "蒲公英", correct: "たんぽぽ", choices: ["かばこうえい", "たんぽぽ", "ほうおう", "ふくじゅそう"], level: "N3", hint: "春の黄色い花" },
  { kanji: "向日葵", correct: "ひまわり", choices: ["むかいびき", "ひがわり", "ひまわり", "こうじつき"], level: "N3", hint: "夏の花" },
  { kanji: "螺旋", correct: "らせん", choices: ["らせん", "うずまき", "かたつむり", "らかん"], level: "N2", hint: "くるくる巻いた形" },
  { kanji: "薔薇", correct: "ばら", choices: ["そうび", "ばら", "はな", "つばき"], level: "N2", hint: "棘がある花" },
  { kanji: "牡蠣", correct: "かき", choices: ["ぼだき", "かき", "まぼ", "おとこがい"], level: "N3", hint: "海の貝類" },
  { kanji: "紫陽花", correct: "あじさい", choices: ["しようか", "あじさい", "ふじ", "きく"], level: "N3", hint: "梅雨の花" },
  { kanji: "河豚", correct: "ふぐ", choices: ["かわぶた", "ふぐ", "かっぱ", "うなぎ"], level: "N3", hint: "毒を持つ魚" },
  { kanji: "蛍", correct: "ほたる", choices: ["けい", "かがり", "ほたる", "とんぼ"], level: "N3", hint: "夜に光る虫" },
];
