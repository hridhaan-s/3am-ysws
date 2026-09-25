ALTER TABLE "users" ADD COLUMN "banned_at" timestamp with time zone;
ALTER TABLE "users" ADD COLUMN "ban_reason" text;
CREATE INDEX "users_email_idx" ON "users" USING btree ("email");
