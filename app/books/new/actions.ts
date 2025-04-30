import { createClient } from "@/utils/supabase/server";
import { url } from "inspector";
import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";

export async function createBook(formData: FormData) {
  "use server";

  const title = formData.get("title") as string;
  const author = formData.get("author") as string;
  const status = formData.get("status") as "reading" | "read";
  const rating = Number(formData.get("rating"));
  const notes = formData.get("notes") as string;
  const cover = formData.get("cover") as File;
  let cover_url = ""; 


  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

 
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


  const { error } = await supabase.from("books").insert([
    {
      title,
      author,
      status,
      rating,
      notes,
      user_id: user?.id,
      created_at: new Date().toISOString(),
      cover_url,
    },
  ]);

  if (error) {
    throw error;
  }

  revalidatePath("/books");
  redirect("/books");
}