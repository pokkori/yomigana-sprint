import { NextResponse } from "next/server";
import { cookies } from "next/headers";

export const dynamic = "force-dynamic";

const PAYJP_API = "https://api.pay.jp/v1";

function payjpAuth() {
  return "Basic " + Buffer.from(process.env.PAYJP_SECRET_KEY! + ":").toString("base64");
}

export async function GET() {
  const cookieStore = await cookies();
  const subId = cookieStore.get("payjp_sub_id")?.value;
  if (!subId) return NextResponse.json({ isPremium: false });

  try {
    const res = await fetch(`${PAYJP_API}/subscriptions/${subId}`, {
      headers: { Authorization: payjpAuth() },
    });
    const data = await res.json();
    const active = data.status === "active" || data.status === "trial";
    if (!active) {
      const r = NextResponse.json({ isPremium: false });
      r.cookies.set("premium", "", { maxAge: 0, path: "/" });
      r.cookies.set("payjp_sub_id", "", { maxAge: 0, path: "/" });
      return r;
    }
    return NextResponse.json({ isPremium: true });
  } catch {
    return NextResponse.json({ isPremium: true }); // API障害時は維持
  }
}
