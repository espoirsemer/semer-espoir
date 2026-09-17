import Link from "next/link";
import { Clock, UserRound } from "lucide-react";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import { requireAdmin } from "@/lib/auth";
import { createClient } from "@/lib/supabase/server";
import { getAuthorNames } from "@/lib/get-author-names";
import type { ConsultationBooking, ConsultationSlot, SpecialistMessage } from "@/types/database.types";
import { SlotForm } from "./slot-form";
import { DeleteSlotButton } from "./delete-slot-button";
import { ApproveBookingButton } from "./approve-booking-button";
import { ConsultationNotifier } from "@/components/consultations/consultation-notifier";

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
  const admin = await requireAdmin();
  const supabase = await createClient();

  const [{ data: slots }, { data: bookings }, { data: messages }] = await Promise.all([
    supabase
      .from("consultation_slots")
      .select("*")
      .gt("starts_at", new Date().toISOString())
      .order("starts_at"),
    supabase.from("consultation_bookings").select("*"),
    supabase.from("specialist_messages").select("*").order("created_at", { ascending: false }),
  ]);

  const slotList = (slots as ConsultationSlot[] | null) ?? [];
  const bookingList = (bookings as ConsultationBooking[] | null) ?? [];
  const bookingBySlot = new Map(bookingList.map((b) => [b.slot_id, b]));
  const pendingCount = bookingList.filter((b) => b.status === "pending").length;

  const messageList = (messages as SpecialistMessage[] | null) ?? [];
  const lastMessageByParent = new Map<string, SpecialistMessage>();
  for (const m of messageList) {
    if (!lastMessageByParent.has(m.parent_id)) {
      lastMessageByParent.set(m.parent_id, m);
    }
  }
  const confirmedParentIds = new Set(
    bookingList.filter((b) => b.status === "confirmed").map((b) => b.parent_id),
  );
  const withoutThread = [...confirmedParentIds].filter((id) => !lastMessageByParent.has(id));

  const names = await getAuthorNames(supabase, [
    ...new Set([...bookingList.map((b) => b.parent_id), ...lastMessageByParent.keys(), ...withoutThread]),
  ]);

  const threads = [...lastMessageByParent.entries()].sort(
    (a, b) => new Date(b[1].created_at).getTime() - new Date(a[1].created_at).getTime(),
  );

  return (
    <div className="space-y-8">
      <ConsultationNotifier profileId={admin.id} role="admin" />
      <div>
        <h1 className="text-2xl font-semibold">Consultations</h1>
        <p className="text-muted-foreground">
          Publiez des créneaux, approuvez les demandes, échangez avec les parents.
        </p>
      </div>

      <Tabs defaultValue="rendez-vous">
        <TabsList>
          <TabsTrigger value="rendez-vous">
            Rendez-vous
            {pendingCount > 0 && (
              <Badge variant="secondary" className="ml-1">
                {pendingCount}
              </Badge>
            )}
          </TabsTrigger>
          <TabsTrigger value="messagerie">Messagerie</TabsTrigger>
        </TabsList>

        <TabsContent value="rendez-vous" className="space-y-8 pt-4">
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
                            <div className="ml-6 flex flex-wrap items-center gap-1.5 text-sm text-muted-foreground">
                              <UserRound className="size-3.5" />
                              {names.get(booking.parent_id) ?? "Parent"}
                              <Badge variant={booking.status === "confirmed" ? "default" : "secondary"}>
                                {booking.status === "confirmed" ? "Confirmé" : "En attente"}
                              </Badge>
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
                        <div className="flex items-center gap-1">
                          {booking && booking.status === "pending" && (
                            <ApproveBookingButton bookingId={booking.id} />
                          )}
                          <DeleteSlotButton slotId={slot.id} />
                        </div>
                      </CardContent>
                    </Card>
                  );
                })}
              </div>
            )}
          </div>
        </TabsContent>

        <TabsContent value="messagerie" className="space-y-8 pt-4">
          <div className="space-y-3">
            <h2 className="text-lg font-medium">Conversations</h2>
            {threads.length === 0 ? (
              <p className="text-sm text-muted-foreground">Aucun message pour l&apos;instant.</p>
            ) : (
              <div className="divide-y divide-border/60 rounded-lg border border-border/60 bg-background">
                {threads.map(([parentId, last]) => (
                  <Link
                    key={parentId}
                    href={`/admin/consultations/messagerie/${parentId}`}
                    className="flex items-center gap-3 px-4 py-3 hover:bg-accent"
                  >
                    <span className="flex size-9 shrink-0 items-center justify-center rounded-full bg-muted text-muted-foreground">
                      <UserRound className="size-4" />
                    </span>
                    <div className="min-w-0 flex-1">
                      <p className="font-medium">{names.get(parentId) ?? "Parent"}</p>
                      <p className="truncate text-sm text-muted-foreground">{last.body}</p>
                    </div>
                  </Link>
                ))}
              </div>
            )}
          </div>

          {withoutThread.length > 0 && (
            <div className="space-y-3">
              <h2 className="text-lg font-medium">
                Parents confirmés, sans conversation
              </h2>
              <div className="flex flex-wrap gap-2">
                {withoutThread.map((parentId) => (
                  <Link key={parentId} href={`/admin/consultations/messagerie/${parentId}`}>
                    <Card className="transition-colors hover:bg-accent">
                      <CardContent className="flex items-center gap-2 px-4 py-2.5">
                        <UserRound className="size-4 text-muted-foreground" />
                        <span className="text-sm">{names.get(parentId) ?? "Parent"}</span>
                      </CardContent>
                    </Card>
                  </Link>
                ))}
              </div>
            </div>
          )}
        </TabsContent>
      </Tabs>
    </div>
  );
}
