import Link from "next/link";
import { createClient as createServerClient } from "@/utils/supabase/server";
import { redirect } from "next/navigation";
import { updateBook, deleteBook } from "./actions";

interface Book {
  id: string;
  title: string;
  author: string;
  status: "reading" | "read";
  rating: number;
  notes: string;
  user_id: string;
  created_at: string;

}

interface PageProps {
  params: { id: string };
}

export default async function EditBookPage({
  params,
}: PageProps) {
  const supabase = await createServerClient();
  const {
    data: { session },
  } = await supabase.auth.getSession();
  if (!session) redirect("/sign-in");

  const { data: book, error } = await supabase
    .from("books")
    .select("*")
    .eq("id", params.id)
    .single();

  if (error || !book) {
    redirect("/books");
  }

  return (
    <div className="container mx-auto p-4">
      <h1 className="text-2xl font-bold mb-4">Edit Book</h1>
      <form action={updateBook} encType="multipart/form-data" className="space-y-4 max-w-lg">
        <input type="hidden" name="id" value={book.id} />
        <div>
          <label htmlFor="title" className="block font-medium">Title</label>
          <input
            type="text"
            name="title"
            id="title"
            defaultValue={book.title}
            required
            className="w-full border rounded px-2 py-1"
          />
        </div>
        <div>
          <label htmlFor="author" className="block font-medium">Author</label>
          <input
            type="text"
            name="author"
            id="author"
            defaultValue={book.author}
            required
            className="w-full border rounded px-2 py-1"
          />
        </div>
        <div>
          <label htmlFor="status" className="block font-medium">Status</label>
          <select
            name="status"
            id="status"
            defaultValue={book.status}
            className="w-full border rounded px-2 py-1"
          >
            <option value="reading">Reading</option>
            <option value="read">Completed</option>
          </select>
        </div>
        <div>
          <label htmlFor="rating" className="block font-medium">Rating</label>
          <input
            type="number"
            name="rating"
            id="rating"
            defaultValue={book.rating}
            min="1"
            max="5"
            className="w-full border rounded px-2 py-1"
          />
        </div>
        <div>
          <label htmlFor="notes" className="block font-medium">Notes</label>
          <textarea
            name="notes"
            id="notes"
            rows={4}
            defaultValue={book.notes}
            className="w-full border rounded px-2 py-1"
          />
        </div>
        <div>
          <label htmlFor="cover" className="block font-medium">Cover</label>
          <input type="file" name="cover" id="cover" required
            className="w-full border rounded px-2 py-1" />
        </div>
          
        <div className="flex items-center space-x-2">
          <button
            type="submit"
            className="bg-green-600 text-white px-4 py-2 rounded hover:bg-green-700"
          >
            Save Changes
          </button>
          <button
            formAction={deleteBook}
            type="submit"
            className="bg-red-600 text-white px-4 py-2 rounded hover:bg-red-700"
          >
            Delete Book
          </button>
          <Link href="/books" className="text-gray-600 underline">
            Cancel
          </Link>
        </div>
      </form>
    </div>
  );
}