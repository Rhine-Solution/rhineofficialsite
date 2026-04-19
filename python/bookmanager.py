# Rhine Book Manager - Python Advanced Demo
# Features: File I/O, JSON, datetime, exceptions, type hints


import json
import os
from datetime import datetime
from pathlib import Path


class BookManager:
    def __init__(self, filename: str = "books.json"):
        self.filename = filename
        self.books: list[dict] = []
        self.load_books()
    
    def load_books(self) -> None:
        if not os.path.exists(self.filename):
            print(f"No existing file found. Starting fresh.")
            return
        
        try:
            with open(self.filename, "r", encoding="utf-8") as f:
                self.books = json.load(f)
            print(f"Loaded {len(self.books)} books from {self.filename}")
        except json.JSONDecodeError as e:
            print(f"Error: Invalid JSON in file - {e}")
            self.books = []
        except Exception as e:
            print(f"Error loading file: {e}")
            self.books = []
    
    def save_books(self) -> None:
        try:
            with open(self.filename, "w", encoding="utf-8") as f:
                json.dump(self.books, f, indent=4, ensure_ascii=False)
            print(f"Saved {len(self.books)} books to {self.filename}")
        except Exception as e:
            print(f"Error saving file: {e}")
    
    def add_book(self) -> None:
        print("\n--- Add New Book ---")
        title = input("Title: ").strip()
        author = input("Author: ").strip()
        
        while True:
            try:
                year = input("Year (or Enter for unknown): ").strip()
                year = int(year) if year else None
                break
            except ValueError:
                print("Please enter a valid year.")
        
        genre = input("Genre (or Enter for unknown): ").strip() or None
        
        book = {
            "id": len(self.books) + 1,
            "title": title,
            "author": author,
            "year": year,
            "genre": genre,
            "added_at": datetime.now().isoformat()
        }
        
        self.books.append(book)
        print(f"Book '{title}' added successfully!")
    
    def search_books(self) -> None:
        print("\n--- Search Books ---")
        query = input("Search by title or author: ").strip().lower()
        
        if not query:
            print("Please enter a search term.")
            return
        
        results = [
            book for book in self.books
            if query in book.get("title", "").lower() 
            or query in book.get("author", "").lower()
        ]
        
        if results:
            print(f"\nFound {len(results)} book(s):")
            for book in results:
                print(f"  - {book['title']} by {book['author']} ({book.get('year', 'N/A')})")
        else:
            print("No books found matching your query.")
    
    def delete_book(self) -> None:
        print("\n--- Delete Book ---")
        
        if not self.books:
            print("No books to delete.")
            return
        
        try:
            book_id = int(input(f"Enter book ID (1-{len(self.books)}): "))
        except ValueError:
            print("Please enter a valid number.")
            return
        
        book = next((b for b in self.books if b["id"] == book_id), None)
        
        if book:
            confirm = input(f"Delete '{book['title']}'? (y/n): ").strip().lower()
            if confirm == "y":
                self.books = [b for b in self.books if b["id"] != book_id]
                print("Book deleted.")
        else:
            print("Book not found.")
    
    def show_stats(self) -> None:
        print("\n--- Library Statistics ---")
        print(f"Total books: {len(self.books)}")
        
        authors = set(book.get("author") for book in self.books if book.get("author"))
        print(f"Unique authors: {len(authors)}")
        
        genres = set(book.get("genre") for book in self.books if book.get("genre"))
        print(f"Unique genres: {len(genres)}")
        
        if self.books:
            latest = max(self.books, key=lambda b: b.get("added_at", ""))
            print(f"Last added: {latest.get('title')} at {latest.get('added_at', 'N/A')}")
    
    def list_books(self) -> None:
        print("\n--- Your Books ---")
        
        if not self.books:
            print("No books in library.")
            return
        
        for book in self.books:
            year = book.get("year", "N/A")
            genre = book.get("genre", "")
            genre_str = f" [{genre}]" if genre else ""
            print(f"{book['id']}. {book['title']} by {book['author']} ({year}){genre_str}")
    
    def run(self) -> None:
        print("=" * 50)
        print("  Rhine Book Manager")
        print("=" * 50)
        
        while True:
            print("\n--- Menu ---")
            print("1. Add Book")
            print("2. Search Books")
            print("3. Delete Book")
            print("4. List All Books")
            print("5. Statistics")
            print("6. Save & Exit")
            
            choice = input("\nSelect (1-6): ").strip()
            
            if choice == "1":
                self.add_book()
            elif choice == "2":
                self.search_books()
            elif choice == "3":
                self.delete_book()
            elif choice == "4":
                self.list_books()
            elif choice == "5":
                self.show_stats()
            elif choice == "6":
                self.save_books()
                print("Goodbye!")
                break
            else:
                print("Invalid choice. Please try again.")


if __name__ == "__main__":
    manager = BookManager()
    manager.run()