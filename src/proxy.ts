import { NextResponse, type NextRequest } from "next/server";
import { updateSession } from "@/lib/supabase/proxy";

// Next.js 16 renomme `middleware.ts` en `proxy.ts` (voir AGENTS.md).
export async function proxy(request: NextRequest) {
  if (!process.env.NEXT_PUBLIC_SUPABASE_URL || !process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY) {
    console.warn(
      "[proxy] NEXT_PUBLIC_SUPABASE_URL / ANON_KEY manquants : session non vérifiée. " +
        "Copiez .env.local.example vers .env.local et renseignez votre projet Supabase.",
    );
    return NextResponse.next();
  }

  return await updateSession(request);
}

export const config = {
  matcher: [
    "/((?!_next/static|_next/image|favicon.ico|.*\\.(?:svg|png|jpg|jpeg|gif|webp)$).*)",
  ],
};
