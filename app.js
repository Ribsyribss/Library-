// Book Class: Represents a Book -> every time we create a book it is going to instantiate a book object 
class Book {
    constructor(title, author, isbn, pages, read) {
        this.title = title;
        this.author = author;
        this.isbn = isbn;
        this.pages = pages;
        this.read = read
    }
}

// UI Class: Handle UI Tasks (anything in the UI Interface: Add, Remove, Alert)
class UI {
    static displayBooks() {
        const books = Store.getBooks();
        books.forEach((book) => UI.addBookToList(book));
    }
    static addBookToList(book) {
        const list = document.querySelector('#book-list');

        const row = document.createElement('tr');
        row.innerHTML = `
            <td>${book.title}</td>
            <td>${book.author}</td>
            <td>${book.isbn}</td>
            <td>${book.pages}</td>
            <td>${book.read}</td>
            <td><a href="#" class="btn btn-danger btn-sm delete">X</a></td>
        `;

        list.appendChild(row);
    }
    static deleteBook(el) {
        if(el.classList.contains('delete')) {
            el.parentElement.parentElement.remove();
        }
    }
    // Creating div from scratch in js 
    static showAlert(message, className) {
        const div = document.createElement('div');
        div.className = `alert alert-${className}`;
        div.appendChild(document.createTextNode(message)); // = putting text inside of the div 
        const container = document.querySelector('.container');
        const form = document.querySelector('#book-form');
        container.insertBefore(div, form); // Insert div before the form 
        // Goes away in 2 sec 
        setTimeout(() => document.querySelector('.alert').remove(), 2000);
    }
    static clearFields() {
        document.querySelector('#title').value = '';
        document.querySelector('#author').value = '';
        document.querySelector('#isbn').value = '';
        document.querySelector('#pages').value = '';
        document.querySelector('#read').value = '';
    }
}



// Store Class: Handles Storage (Local storage: within the browser) 
class Store { //stores key value pairs 
    static getBooks() {
        let books;
        if(localStorage.getItem('books') === null) {
            books = [];
        } else {
            books = JSON.parse(localStorage.getItem('books')); //JSON.parse makes it a string so it is accessible 
        }
        return books;
    }

    static addBook(book) {
        const books = Store.getBooks(); 
        books.push(book);
        localStorage.setItem('books', JSON.stringify(books));

    }

    static removeBook(isbn) { //Using ISBN to remove books as it is a unique for each book
        const books = Store.getBooks();
        books.forEach((book, index) => {
            if(book.isbn === isbn) {
                books.splice(index, 1);
            }
        });

        localStorage.setItem('books', JSON.stringify(books));
    }
}

// Event: Display Books 
document.addEventListener('DOMContentLoaded', UI.displayBooks);

// Event: Add a Book 
document.querySelector('#book-form').addEventListener('submit', (e) => 
    {
        // Prevent Actual submit 
        e.preventDefault();

        // Get form values
        const title = document.querySelector('#title').value;
        const author = document.querySelector('#author').value;
        const isbn = document.querySelector('#isbn').value;
        const pages = document.querySelector('#pages').value;
        const read = document.querySelector('#read').value;

        // Validate 
        if(title === '' || author === '' || isbn === '' || pages === '' || read === '') {
            UI.showAlert('Please fill in all fields', 'danger');
        } else {
        // Instantiate Book 
        const book = new Book(title, author, isbn, pages, read);

        // Add Book to UI
        UI.addBookToList(book);

        // Add book to Store
        Store.addBook(book);

        // Success message 
        UI.showAlert('Book Added', 'success');

        // Method to Clear Fields 
        UI.clearFields();
    }
});

// Event: Remove a Book -> Event Propagation, targeted the actual list and if it contains 'delete' we remove the parent^2
document.querySelector('#book-list').addEventListener('click', (e) => {
    // Remove book from UI
    UI.deleteBook(e.target)

    // Remove book from store 
    Store.removeBook
    (e.target.parentElement.parentElement.textContent);

    // Book removed message 
    UI.showAlert('Book Removed', 'success');
});