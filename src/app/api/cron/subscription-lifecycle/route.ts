import { NextResponse } from "next/server";
import { createAdminClient } from "@/lib/supabase/server";
import {
  sendSubscriptionReminderEmail,
  sendSubscriptionExpiredEmail,
  sendSubscriptionSuspendedEmail,
} from "@/lib/subscription-emails";
import type { Profile } from "@/types/database.types";

const REMINDER_DAYS_BEFORE = 5;
const GRACE_DAYS_AFTER = 3;

type SubscriptionRow = Pick<
  Profile,
  | "id"
  | "full_name"
  | "subscription_tier"
  | "subscription_expires_at"
  | "subscription_reminder_sent_at"
  | "subscription_expired_sent_at"
>;

// Cycle de vie de l'abonnement mensuel : J-5 rappel, J0 e-mail d'expiration
// (accès encore actif), J+3 suspension de l'accès si toujours pas renouvelé.
// Chaque profil ne reçoit un e-mail donné qu'une fois par cycle grâce aux
// colonnes *_sent_at, remises à zéro par activateSubscription à chaque
// renouvellement.
export async function GET(request: Request) {
  const authHeader = request.headers.get("authorization");
  if (process.env.CRON_SECRET && authHeader !== `Bearer ${process.env.CRON_SECRET}`) {
    return NextResponse.json({ error: "unauthorized" }, { status: 401 });
  }

  const admin = createAdminClient();
  const now = new Date();

  const { data: plan } = await admin
    .from("subscription_plans")
    .select("payment_link")
    .eq("key", "tier_1")
    .single();
  const renewUrl =
    (plan as { payment_link: string | null } | null)?.payment_link ||
    `${process.env.NEXT_PUBLIC_SITE_URL}/#tarifs`;

  const { data: profiles, error } = await admin
    .from("profiles")
    .select(
      "id, full_name, subscription_tier, subscription_expires_at, subscription_reminder_sent_at, subscription_expired_sent_at",
    )
    .eq("role", "parent")
    .not("subscription_tier", "is", null)
    .not("subscription_expires_at", "is", null);

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }

  const list = (profiles as SubscriptionRow[] | null) ?? [];
  let reminders = 0;
  let expirations = 0;
  let suspensions = 0;

  for (const profile of list) {
    const expiresAt = new Date(profile.subscription_expires_at!);
    const reminderThreshold = new Date(expiresAt);
    reminderThreshold.setDate(reminderThreshold.getDate() - REMINDER_DAYS_BEFORE);
    const graceEnd = new Date(expiresAt);
    graceEnd.setDate(graceEnd.getDate() + GRACE_DAYS_AFTER);

    const { data: userData } = await admin.auth.admin.getUserById(profile.id);
    const email = userData?.user?.email;
    if (!email) continue;

    const update: Record<string, unknown> = {};

    if (now >= reminderThreshold && now < expiresAt && !profile.subscription_reminder_sent_at) {
      await sendSubscriptionReminderEmail({
        email,
        fullName: profile.full_name,
        expiresAt: profile.subscription_expires_at!,
        renewUrl,
      });
      update.subscription_reminder_sent_at = now.toISOString();
      reminders++;
    }

    if (now >= expiresAt && !profile.subscription_expired_sent_at) {
      await sendSubscriptionExpiredEmail({
        email,
        fullName: profile.full_name,
        expiresAt: profile.subscription_expires_at!,
        graceDays: GRACE_DAYS_AFTER,
        renewUrl,
      });
      update.subscription_expired_sent_at = now.toISOString();
      expirations++;
    }

    if (now >= graceEnd) {
      await sendSubscriptionSuspendedEmail({
        email,
        fullName: profile.full_name,
        renewUrl,
      });
      update.subscription_tier = null;
      update.subscription_expires_at = null;
      update.subscription_reminder_sent_at = null;
      update.subscription_expired_sent_at = null;
      suspensions++;
    }

    if (Object.keys(update).length > 0) {
      await admin.from("profiles").update(update).eq("id", profile.id);
    }
  }

  return NextResponse.json({ checked: list.length, reminders, expirations, suspensions });
}
