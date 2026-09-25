import { eq } from "drizzle-orm";
import type { Metadata } from "next";
import { redirect } from "next/navigation";

import { getSession } from "@/lib/auth/session";
import { getDb } from "@/lib/db";
import { users } from "@/lib/db/schema";

import styles from "./page.module.css";

export const metadata: Metadata = { title: "account suspended" };
export const dynamic = "force-dynamic";

export default async function BanPage() {
  const session = await getSession();
  const row = session
    ? (await getDb().select({ bannedAt: users.bannedAt, banReason: users.banReason }).from(users).where(eq(users.sub, session.sub)).limit(1))[0]
    : null;

  if (!row?.bannedAt) redirect("/dash");

  return (
    <main className={styles.page}>
      <section className={styles.card}>
        <div className={styles.icon} aria-hidden="true">❌</div>
        <p className={styles.kicker}>3am account notice</p>
        <h1>you have been banned</h1>
        <p className={styles.reason}>{row.banReason ?? "Your account has been suspended."}</p>
        <p className={styles.help}>
          If you believe this is incorrect, contact <a href="mailto:hi@hridhaan.me">hi@hridhaan.me</a> or <a href="mailto:seba@hackclub.com">seba@hackclub.com</a>.
        </p>
      </section>
    </main>
  );
}
