import { createClient } from "@/utils/supabase/server";
import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";

export async function createBook(formData: FormData) {
  "use server";

  const title = formData.get("title") as string;
  const author = formData.get("author") as string;
  const status = formData.get("status") as "reading" | "read";
  const rating = Number(formData.get("rating"));
  const notes = formData.get("notes") as string;

  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  const { error } = await supabase.from("books").insert([
    {
      title,
      author,
      status,
      rating,
      notes,
      user_id: user?.id,
      created_at: new Date().toISOString(),
    },
  ]);

  if (error) {
    throw error;
  }

  revalidatePath("/books");
  redirect("/books");
}