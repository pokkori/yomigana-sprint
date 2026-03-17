import { NextResponse } from "next/server";
import { cookies } from "next/headers";

export const dynamic = "force-dynamic";

const PAYJP_API = "https://api.pay.jp/v1";

function payjpAuth() {
  return "Basic " + Buffer.from(process.env.PAYJP_SECRET_KEY! + ":").toString("base64");
}

export async function GET() {
  const cookieStore = await cookies();
  const payjpPremium = cookieStore.get("premium")?.value === "1";
  if (!payjpPremium) return NextResponse.json({ isPremium: false });

  const subId = cookieStore.get("payjp_sub_id")?.value;
  if (subId) {
    try {
      const res = await fetch(`${PAYJP_API}/subscriptions/${subId}`, {
        headers: { Authorization: payjpAuth() },
      });
      const data = await res.json();
      if (data.status !== "active" && data.status !== "trial") {
        const r = NextResponse.json({ isPremium: false });
        r.cookies.set("premium", "", { maxAge: 0, path: "/" });
        r.cookies.set("payjp_sub_id", "", { maxAge: 0, path: "/" });
        return r;
      }
    } catch { /* API障害時は維持 */ }
  }
  return NextResponse.json({ isPremium: true });
}
