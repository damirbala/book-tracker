import { createClient } from "@/utils/supabase/server";
import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";

export async function updateBook(formData: FormData) {
  "use server";
  const id = formData.get("id") as string;
  const title = formData.get("title") as string;
  const author = formData.get("author") as string;
  const status = formData.get("status") as "reading" | "read";
  const rating = Number(formData.get("rating"));
  const notes = formData.get("notes") as string;

  const supabase = await createClient();
  const { error } = await supabase
    .from("books")
    .update({ title, author, status, rating, notes })
    .eq("id", id);

  if (error) {
    throw error;
  }

  revalidatePath("/books");
  redirect("/books");
}

export async function deleteBook(formData: FormData) {
  "use server";
  const id = formData.get("id") as string;

  const supabase = await createClient();
  const { error } = await supabase
    .from("books")
    .delete()
    .eq("id", id);

  if (error) {
    throw error;
  }

  revalidatePath("/books");
  redirect("/books");
}