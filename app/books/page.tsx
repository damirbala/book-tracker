import { createClient as createServerClient } from "@/utils/supabase/server";
import { redirect } from "next/navigation";
import Link from "next/link";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import { Card, CardHeader, CardTitle, CardContent, CardFooter } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";

// Define the Book interface here or import it if defined elsewhere
interface Book {
  id: string;
  title: string;
  author: string;
  // Add other fields as needed based on your GUIDE.md or schema
  status?: "reading" | "completed" ;
  rating?: number;
  notes?: string;
  created_at?: string;
  user_id?: string;
  cover_url?: string;
}

export default async function BooksPage() {
  const supabase = await createServerClient();

  const {
    data: { session },
  } = await supabase.auth.getSession();

  if (!session) {
    redirect("/sign-in");
  }

  const { data: booksData, error } = await supabase
    .from("books")
    .select("*")
    .order("created_at", { ascending: false });

  if (error) {
    console.error("Error fetching books:", error);
  }

  const books: Book[] = booksData ?? [];

  return (
    <div className="container mx-auto p-4">
      <div className="flex items-center justify-between mb-4">
        <h1 className="text-2xl font-bold">My Books</h1>
        <Link href="/books/new">
          <Button className="bg-green-500 hover:bg-green-600 text-white">
            Add New Book
          </Button>
        </Link>
      </div>
      <Tabs defaultValue="bookshelf" className="mb-4">
        <TabsList>
          <TabsTrigger value="bookshelf">Bookshelf</TabsTrigger>
        </TabsList>
        <TabsContent value="bookshelf">
          {books && books.length > 0 ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
              {books.map((book) => (
                <Link key={book.id} href={`/books/${book.id}`}>
                  <Card className="hover:shadow-md hover:bg-gray-100 transition-shadow">
                    <CardHeader>
                      
                      {book.cover_url && (
                      <img src={book.cover_url} alt={`${book.title} cover`}
                      className="w-full h-48 object-cover"/> 
                        )}
                    </CardHeader>
                    <CardTitle>{book.title}</CardTitle>
                    <CardContent>
                      <span>{book.author}</span>
                      <Badge variant={book.status === "reading" ? "secondary" : "default"}>
                        {book.status ?? "Not started"}
                      </Badge>
                    </CardContent>
                    <CardFooter>
                      <Badge variant="outline">
                        {book.rating ? "⭐".repeat(book.rating) : "Not yet rated"}
                      </Badge>
                    </CardFooter>
                  </Card>
                </Link>
              ))}
            </div>
          ) : (
            <p>No books found. Add your first book!</p>
          )}
         
        </TabsContent>
      </Tabs>
    </div>
  );
}