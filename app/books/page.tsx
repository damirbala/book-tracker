import { createClient as createServerClient } from "@/utils/supabase/server";
import { redirect } from "next/navigation";
import BookList from "@/components/BookList";

// Define the Book interface here or import it if defined elsewhere
interface Book {
  id: string;
  title: string;
  author: string;
  // Add other fields as needed based on your GUIDE.md or schema
  status?: "reading" | "read";
  rating?: number;
  notes?: string;
  created_at?: string;
  user_id?: string;
}


export default async function BooksPage() {
  const supabase = await createServerClient();

  const {
    data: { session },
  } = await supabase.auth.getSession();

  if (!session) {
    // Redirect to the sign-in page within the auth-pages group
    redirect("/sign-in");
  }

  // Fetch real books from Supabase
  const { data: booksData, error } = await supabase
    .from("books")
    .select("*")
    .order("created_at", { ascending: false });

  if (error) {
    console.error("Error fetching books:", error);
  }

  // Ensure books is always an array
  const books: Book[] = booksData ?? [];

  return (
    <div className="container mx-auto p-4">
      <h1 className="text-2xl font-bold mb-4">My Books</h1>
      {/* Render BookList or a message if no books */}
      {books && books.length > 0 ? (
         <BookList books={books} />
      ) : (
        <p>No books found. Add your first book!</p>
      )}
      {/* Add a link/button to navigate to the 'new book' page later */}
      {/* <Link href="/books/new">Add New Book</Link> */}
    </div>
  );
}