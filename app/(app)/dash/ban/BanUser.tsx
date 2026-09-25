"use client";

import { useState } from "react";

import { Button } from "@/components/ui/Button";
import styles from "./BanUser.module.css";

const REASONS = [
  ["fraud", "fraud"],
  ["ai_policy", "AI policy violation"],
  ["coc", "Code of Conduct violation"],
  ["custom", "custom reason"],
] as const;

export function BanUser() {
  const [identifier, setIdentifier] = useState("");
  const [reasonType, setReasonType] = useState<(typeof REASONS)[number][0]>("fraud");
  const [customReason, setCustomReason] = useState("");
  const [status, setStatus] = useState("");
  const [loading, setLoading] = useState(false);

  async function submit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setStatus("");
    setLoading(true);

    try {
      const response = await fetch("/api/admin/ban", {
        method: "POST",
        headers: { "content-type": "application/json" },
        body: JSON.stringify({ identifier, reasonType, customReason }),
      });
      const data = (await response.json()) as { message?: string };
      if (!response.ok) throw new Error(data.message ?? "could not ban user");
      setStatus(data.message ?? "user banned");
      setIdentifier("");
      setCustomReason("");
    } catch (error) {
      setStatus(error instanceof Error ? error.message : "could not ban user");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className={styles.wrap}>
      <form className={styles.form} onSubmit={submit}>
        <label>
          <span>email or Slack ID</span>
          <input value={identifier} onChange={(event) => setIdentifier(event.target.value)} placeholder="person@example.com or U123456" required />
        </label>

        <label>
          <span>reason</span>
          <select value={reasonType} onChange={(event) => setReasonType(event.target.value as typeof reasonType)}>
            {REASONS.map(([value, label]) => <option key={value} value={value}>{label}</option>)}
          </select>
        </label>

        {reasonType === "custom" ? (
          <label>
            <span>custom reason</span>
            <textarea value={customReason} onChange={(event) => setCustomReason(event.target.value)} placeholder="Explain the reason clearly and factually." required rows={5} />
          </label>
        ) : null}

        <Button variant="danger" type="submit" loading={loading} loadingLabel="banning…">ban user</Button>
      </form>
      {status ? <p className={styles.status}>{status}</p> : null}
    </div>
  );
}
