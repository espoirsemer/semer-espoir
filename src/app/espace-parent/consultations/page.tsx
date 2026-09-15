import Link from "next/link";
import { Clock } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { buttonVariants } from "@/components/ui/button";
import { requireProfile } from "@/lib/auth";
import { createClient } from "@/lib/supabase/server";
import type { Child, ConsultationSlot } from "@/types/database.types";
import { BookSlotDialog } from "./book-slot-dialog";
import { CancelBookingButton } from "./cancel-booking-button";

function formatSlot(slot: ConsultationSlot) {
  const start = new Date(slot.starts_at);
  const end = new Date(slot.ends_at);
  const date = start.toLocaleDateString("fr-FR", {
    weekday: "long",
    day: "numeric",
    month: "long",
  });
  const startTime = start.toLocaleTimeString("fr-FR", { hour: "2-digit", minute: "2-digit" });
  const endTime = end.toLocaleTimeString("fr-FR", { hour: "2-digit", minute: "2-digit" });
  return `${date}, ${startTime} – ${endTime}`;
}

export default async function ConsultationsPage() {
  const profile = await requireProfile();
  const canBook = profile.role === "admin" || ["tier_2", "tier_3"].includes(profile.subscription_tier ?? "");

  if (!canBook) {
    return (
      <div className="space-y-6">
        <div>
          <h1 className="text-2xl font-semibold">Consultations</h1>
          <p className="text-muted-foreground">
            Réservez un créneau pour échanger directement avec la spécialiste.
          </p>
        </div>
        <Card>
          <CardContent className="flex flex-wrap items-center justify-between gap-3 pt-6">
            <p className="text-sm text-muted-foreground">
              La réservation de consultations est réservée aux formules
              Guidance et VIP.
            </p>
            <Link href="/#tarifs" className={buttonVariants({ size: "sm" })}>
              Voir les formules
            </Link>
          </CardContent>
        </Card>
      </div>
    );
  }

  const supabase = await createClient();

  const [{ data: availableSlots }, { data: myBookings }, { data: children }] = await Promise.all([
    supabase.rpc("get_available_slots"),
    supabase
      .from("consultation_bookings")
      .select("*, slot:consultation_slots(*)")
      .eq("parent_id", profile.id),
    supabase.from("children").select("*").eq("parent_id", profile.id),
  ]);

  const slots = ((availableSlots as ConsultationSlot[] | null) ?? []).sort(
    (a, b) => new Date(a.starts_at).getTime() - new Date(b.starts_at).getTime(),
  );
  const bookings = (
    (myBookings as { id: string; notes: string | null; slot: ConsultationSlot | null }[] | null) ?? []
  )
    .filter((b) => b.slot)
    .sort((a, b) => new Date(a.slot!.starts_at).getTime() - new Date(b.slot!.starts_at).getTime());
  const childList = (children as Child[] | null) ?? [];

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-2xl font-semibold">Consultations</h1>
        <p className="text-muted-foreground">
          Réservez un créneau pour échanger directement avec la spécialiste.
        </p>
      </div>

      <div className="space-y-3">
        <h2 className="text-lg font-medium">Mes consultations</h2>
        {bookings.length === 0 ? (
          <p className="text-sm text-muted-foreground">
            Vous n&apos;avez pas encore de consultation programmée.
          </p>
        ) : (
          <div className="grid gap-3 sm:grid-cols-2">
            {bookings.map((booking) => (
              <Card key={booking.id}>
                <CardContent className="flex items-start justify-between gap-3 pt-6">
                  <div className="flex items-start gap-2.5">
                    <Clock className="mt-0.5 size-4 shrink-0 text-amber-600 dark:text-amber-400" />
                    <div>
                      <p className="text-sm font-medium">{formatSlot(booking.slot!)}</p>
                      {booking.notes && (
                        <p className="mt-1 text-sm text-muted-foreground">{booking.notes}</p>
                      )}
                    </div>
                  </div>
                  <CancelBookingButton bookingId={booking.id} />
                </CardContent>
              </Card>
            ))}
          </div>
        )}
      </div>

      <div className="space-y-3">
        <h2 className="text-lg font-medium">Créneaux disponibles</h2>
        {slots.length === 0 ? (
          <p className="text-sm text-muted-foreground">
            Aucun créneau disponible pour l&apos;instant — revenez bientôt.
          </p>
        ) : (
          <div className="grid gap-3 sm:grid-cols-2">
            {slots.map((slot) => (
              <Card key={slot.id}>
                <CardContent className="flex items-center justify-between gap-3 pt-6">
                  <div className="flex items-center gap-2.5">
                    <Clock className="size-4 text-amber-600 dark:text-amber-400" />
                    <p className="text-sm font-medium">{formatSlot(slot)}</p>
                  </div>
                  <BookSlotDialog slotId={slot.id} label={formatSlot(slot)} kids={childList} />
                </CardContent>
              </Card>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
