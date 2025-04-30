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
  const cover = formData.get("cover") as File;
  let cover_url = ""; 

  const supabase = await createClient();

  if (cover) {
    const fileExt = cover.name.split('.').pop();
    const fileName = `${Date.now()}.${fileExt}`;
    //const filePath = `book-covers/${fileName}`;

    const { error: uploadError } = await supabase.storage
      .from('book-covers')
      .upload(fileName, cover, { upsert: false });

    if (uploadError) {
      console.error('Upload failed:', uploadError.message);

      cover_url = "https://kkrgkzyrpcfigdipnhuy.supabase.co/storage/v1/object/public/book-covers//no-cover.png"
     
    }

  //   // Get public URL
    const { data: publicUrlData } = supabase.storage
      .from('book-covers')
      .getPublicUrl(fileName);

    cover_url = publicUrlData.publicUrl;
  }

  
  const { error } = await supabase
    .from("books")
    .update({ title, author, status, rating, notes, cover_url })
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