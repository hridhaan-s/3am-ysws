import type { Metadata } from "next";
import { notFound } from "next/navigation";

import { AppShell } from "@/components/app/AppShell";
import { requireOrganizer } from "@/lib/auth/organizer";
import { BanUser } from "./BanUser";

export const metadata: Metadata = { title: "ban users" };
export const dynamic = "force-dynamic";

export default async function BanAdminPage() {
  if (!(await requireOrganizer())) notFound();

  return (
    <AppShell title="ban users">
      <BanUser />
    </AppShell>
  );
}
