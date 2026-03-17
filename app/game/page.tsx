import { cookies } from "next/headers";
import YomiganaGame from "@/components/YomiganaGame";

export const dynamic = "force-dynamic";

export default async function GamePage() {
  const cookieStore = await cookies();
  const isPremium = cookieStore.get("premium")?.value === "1";
  return <YomiganaGame isPremium={isPremium} />;
}
