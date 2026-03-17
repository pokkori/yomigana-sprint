import { NextResponse } from "next/server";

export const dynamic = "force-dynamic";

const APP_ID = "yomigana";
const PAYJP_API = "https://api.pay.jp/v1";

function payjpAuth() {
  return "Basic " + Buffer.from(process.env.PAYJP_SECRET_KEY! + ":").toString("base64");
}

export async function POST(req: Request) {
  try {
    const { token } = await req.json();
    if (!token) return NextResponse.json({ error: "トークンがありません" }, { status: 400 });

    // 顧客作成
    const custRes = await fetch(`${PAYJP_API}/customers`, {
      method: "POST",
      headers: { Authorization: payjpAuth(), "Content-Type": "application/x-www-form-urlencoded" },
      body: new URLSearchParams({ card: token, description: `${APP_ID}-user` }),
    });
    const cust = await custRes.json();
    if (cust.error) return NextResponse.json({ error: cust.error.message }, { status: 400 });

    // サブスクリプション作成
    const subRes = await fetch(`${PAYJP_API}/subscriptions`, {
      method: "POST",
      headers: { Authorization: payjpAuth(), "Content-Type": "application/x-www-form-urlencoded" },
      body: new URLSearchParams({ customer: cust.id, plan: process.env.PAYJP_PLAN_STD! }),
    });
    const sub = await subRes.json();
    if (sub.error) return NextResponse.json({ error: sub.error.message }, { status: 400 });

    const res = NextResponse.json({ ok: true });
    res.cookies.set("premium", "1", { httpOnly: true, secure: true, maxAge: 60 * 60 * 24 * 365, path: "/" });
    res.cookies.set("payjp_sub_id", sub.id, { httpOnly: true, secure: true, maxAge: 60 * 60 * 24 * 365, path: "/" });
    return res;
  } catch {
    return NextResponse.json({ error: "サーバーエラー" }, { status: 500 });
  }
}
