import Link from "next/link";
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from "@/components/ui/card";
import { buttonVariants } from "@/components/ui/button";
import { requireProfile } from "@/lib/auth";
import { createClient } from "@/lib/supabase/server";
import { getAuthorNames } from "@/lib/get-author-names";
import type { SpecialistMessage } from "@/types/database.types";
import { MessageForm } from "./message-form";

export default async function MessagerieSpecialistePage() {
  const profile = await requireProfile();
  const supabase = await createClient();

  const { data: bookings } = await supabase
    .from("consultation_bookings")
    .select("id")
    .eq("parent_id", profile.id)
    .limit(1);

  const hasBooking = (bookings?.length ?? 0) > 0;

  if (!hasBooking) {
    return (
      <div className="space-y-6">
        <div>
          <h1 className="text-2xl font-semibold">Messagerie</h1>
          <p className="text-muted-foreground">
            Échangez directement avec la spécialiste.
          </p>
        </div>
        <Card>
          <CardHeader>
            <CardTitle>Réservez d&apos;abord un rendez-vous</CardTitle>
            <CardDescription>
              La messagerie avec la spécialiste s&apos;ouvre une fois que vous
              avez réservé une consultation.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <Link
              href="/espace-parent/consultations"
              className={buttonVariants({ variant: "outline" })}
            >
              Réserver une consultation
            </Link>
          </CardContent>
        </Card>
      </div>
    );
  }

  const { data: messages } = await supabase
    .from("specialist_messages")
    .select("*")
    .eq("parent_id", profile.id)
    .order("created_at");

  const messageList = (messages as SpecialistMessage[] | null) ?? [];
  const adminIds = [...new Set(messageList.filter((m) => m.sender_id !== profile.id).map((m) => m.sender_id))];
  const names = await getAuthorNames(supabase, adminIds);

  return (
    <div className="flex h-full flex-col space-y-6">
      <div>
        <h1 className="text-2xl font-semibold">Messagerie</h1>
        <p className="text-muted-foreground">Échangez directement avec la spécialiste.</p>
      </div>

      <div className="flex-1 space-y-3 rounded-lg border border-border/60 bg-background p-4">
        {messageList.length === 0 && (
          <p className="text-sm text-muted-foreground">
            Aucun message pour l&apos;instant — écrivez le premier.
          </p>
        )}
        {messageList.map((message) => {
          const isMine = message.sender_id === profile.id;
          return (
            <div key={message.id} className={`flex ${isMine ? "justify-end" : "justify-start"}`}>
              <div
                className={`max-w-sm rounded-2xl px-4 py-2 text-sm ${
                  isMine ? "bg-amber-600 text-white" : "bg-muted text-foreground"
                }`}
              >
                {!isMine && (
                  <p className="mb-0.5 text-xs font-medium text-amber-700 dark:text-amber-400">
                    {names.get(message.sender_id) ?? "La spécialiste"}
                  </p>
                )}
                <p className="whitespace-pre-wrap">{message.body}</p>
                <p className={`mt-1 text-xs ${isMine ? "text-amber-100" : "text-muted-foreground"}`}>
                  {new Date(message.created_at).toLocaleString("fr-FR", {
                    day: "2-digit",
                    month: "2-digit",
                    hour: "2-digit",
                    minute: "2-digit",
                  })}
                </p>
              </div>
            </div>
          );
        })}
      </div>

      <MessageForm />
    </div>
  );
}
