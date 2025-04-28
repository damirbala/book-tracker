import Link from "next/link";

interface Book {
  id: string;
  title: string;
  author: string;
  status?: "reading" | "read";
  rating?: number;
  notes?: string;
  created_at?: string;
  user_id?: string;
}

interface BookListProps {
  books: Book[];
}

export default function BookList({ books }: BookListProps) {
  return (
    <ul className="space-y-2">
      {books.map((book) => (
        <li key={book.id} className="p-2 border rounded hover:bg-gray-50">
          <Link href={`/books/${book.id}`}>
            <span className="font-semibold">{book.title}</span> by{" "}
            <span className="italic">{book.author}</span>
          </Link>
        </li>
      ))}
    </ul>
  );
}