import Link from "next/link";
import { redirect } from "next/navigation";
import { createBook } from "./actions";
import { createClient } from "@/utils/supabase/server";

export default async function NewBookPage() {
  // Protect route: ensure user is signed in
  const supabase = await createClient();
  const {
    data: { session },
  } = await supabase.auth.getSession();
  if (!session) redirect("/sign-in");

  return (
    <div className="container mx-auto p-4">
      <h1 className="text-2xl font-bold mb-4">Add New Book</h1>
      <form action={createBook} className="space-y-4 max-w-lg">
        <div>
          <label htmlFor="title" className="block font-medium">Title</label>
          <input
            type="text"
            name="title"
            id="title"
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
            required
            className="w-full border rounded px-2 py-1"
          />
        </div>
        <div>
          <label htmlFor="status" className="block font-medium">Status</label>
          <select
            name="status"
            id="status"
            defaultValue="reading"
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
            className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
          >
            Add Book
          </button>
          <Link href="/books" className="text-gray-600 underline">
            Cancel
          </Link>
        </div>
      </form>
    </div>
  );
}