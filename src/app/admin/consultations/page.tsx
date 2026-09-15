import { Clock, UserRound } from "lucide-react";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { createClient } from "@/lib/supabase/server";
import { getAuthorNames } from "@/lib/get-author-names";
import type { ConsultationBooking, ConsultationSlot } from "@/types/database.types";
import { SlotForm } from "./slot-form";
import { DeleteSlotButton } from "./delete-slot-button";

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

export default async function AdminConsultationsPage() {
  const supabase = await createClient();

  const [{ data: slots }, { data: bookings }] = await Promise.all([
    supabase
      .from("consultation_slots")
      .select("*")
      .gt("starts_at", new Date().toISOString())
      .order("starts_at"),
    supabase.from("consultation_bookings").select("*"),
  ]);

  const slotList = (slots as ConsultationSlot[] | null) ?? [];
  const bookingList = (bookings as ConsultationBooking[] | null) ?? [];
  const bookingBySlot = new Map(bookingList.map((b) => [b.slot_id, b]));
  const names = await getAuthorNames(supabase, bookingList.map((b) => b.parent_id));

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-2xl font-semibold">Consultations</h1>
        <p className="text-muted-foreground">
          Publiez des créneaux, suivez les réservations des parents.
        </p>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Ajouter un créneau</CardTitle>
        </CardHeader>
        <div className="px-6 pb-6">
          <SlotForm />
        </div>
      </Card>

      <div className="space-y-3">
        <h2 className="text-lg font-medium">Créneaux à venir ({slotList.length})</h2>
        {slotList.length === 0 ? (
          <p className="text-sm text-muted-foreground">Aucun créneau publié pour l&apos;instant.</p>
        ) : (
          <div className="grid gap-3 sm:grid-cols-2">
            {slotList.map((slot) => {
              const booking = bookingBySlot.get(slot.id);
              return (
                <Card key={slot.id}>
                  <CardContent className="flex items-start justify-between gap-3 pt-6">
                    <div className="space-y-1.5">
                      <div className="flex items-center gap-2">
                        <Clock className="size-4 text-amber-600 dark:text-amber-400" />
                        <p className="text-sm font-medium">{formatSlot(slot)}</p>
                      </div>
                      {booking ? (
                        <div className="ml-6 flex items-center gap-1.5 text-sm text-muted-foreground">
                          <UserRound className="size-3.5" />
                          {names.get(booking.parent_id) ?? "Parent"}
                          {booking.notes && (
                            <span className="italic">— {booking.notes}</span>
                          )}
                        </div>
                      ) : (
                        <Badge variant="secondary" className="ml-6">
                          Disponible
                        </Badge>
                      )}
                    </div>
                    <DeleteSlotButton slotId={slot.id} />
                  </CardContent>
                </Card>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
}
