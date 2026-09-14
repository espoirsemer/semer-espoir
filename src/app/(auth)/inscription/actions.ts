"use server";

import { createClient } from "@/lib/supabase/server";

export async function signUp(_prevState: string | null, formData: FormData) {
  const email = formData.get("email") as string;
  const password = formData.get("password") as string;
  const fullName = formData.get("fullName") as string;

  const supabase = await createClient();
  const { error } = await supabase.auth.signUp({
    email,
    password,
    options: {
      data: { full_name: fullName },
      emailRedirectTo: `${process.env.NEXT_PUBLIC_SITE_URL}/espace-parent`,
    },
  });

  if (error) {
    return error.message;
  }

  return "success";
}
