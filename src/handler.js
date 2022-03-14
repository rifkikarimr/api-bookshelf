const books = require('./book.js');
const { nanoid } = require('nanoid');
const { fail } = require('assert');

const addBookHandler = (request, h) => {
    const { name, year, author, summary, publisher, pageCount, readPage, reading } = request.payload;
    const id = nanoid(16);
    const finished = false;
    const insertedAt = new Date().toISOString();
    const updatedAt = insertedAt;

    if(name == null){
        const response = h.response({
            status: 'fail',
            message: 'Gagal menambahkan buku. Mohon isi nama buku',
        });
        response.code(400);
        return response;
    }

    if(readPage > pageCount) {
        const response = h.response({
            status: 'fail',
            message: 'Gagal menambahkan buku. readPage tidak boleh lebih besar dari pageCount',
            delete: id,
        });
        response.code(400);
        return response;
    }

    else {
        const newBook = {
            id,
            name, 
            year,
            author,
            summary,
            publisher,
            pageCount,
            readPage,
            finished,
            reading,
            insertedAt,
            updatedAt,
        };
        books.push(newBook);
        const isSuccess = books.filter((books) => books.id === id).length > 0;
        
        if(isSuccess) {
            const response = h.response({
                status: 'success', 
                message: 'Buku berhasil ditambahkan',
                data: {
                    bookId: id,
                }
            });
            response.code(201);
            return response;
        }

        const response = h.response({
            status: 'error',
            message: 'Buku gagal ditambahkan',
        });
        response.code(500);
        return response;
    
    }



};

const getAllBookHandler = (request, h) => {
    const response = h.response({
        status: 'success',
        data: {
            books: books.map((book) => ({
                id: book.id,
                name: book.name,
                publisher: book.publisher,
            })),
        },
    });
    response.code(200);
    return response
};

const getBookByIdHandler = (request, h) => {
    const { bookId } = request.params;
    const book = books.filter((d) => d.id === bookId)[0];

    if (book !== undefined) {
        return {
            status: 'success',
            data: {
                book
            },
        };
    }

    const response = h.response({
        status: 'fail',
        message: 'Buku tidak ditemukan',
    });
    response.code(404);
    return response;
};

const editBookByIdHandler = (request, h) => {
    const { bookId } = request.params;

    const { name, year, author, summary, publisher, pageCount, readPage, reading } = request.payload;

    const updatedAt = new Date().toISOString();

    if(name == null){
        const response = h.response({
            status: 'fail',
            message: 'Gagal memperbarui buku. Mohon isi nama buku'
        });
        response.code(400);
        return response;
    }

    else if(readPage > pageCount){
        const response = h.response({
            status: 'fail',
            message: 'Gagal memperbarui buku. readPage tidak boleh lebih besar dari pageCount',
        });
        response.code(400);
        return response;
    }

    const index = books.findIndex((book) => book.id === bookId);

    if(index !== -1){
        books[index] = {
            ...books[index],
            name, 
            year, 
            author,
            summary,
            publisher,
            pageCount,
            readPage,
            reading,
            updatedAt
        };

        const response = h.response({
            status: 'success',
            message: 'Buku berhasil diperbarui'
        });
        response.code(200);
        return response;
    }
    const response = h.response({
        status: 'fail',
        message: 'Gagal memperbarui buku. Id tidak ditemukan'
    });
    response.code(404);
    return response;
};

const deleteBookByIdHandler = (request, h) => {
    const { bookId } = request.params;
    const index = books.findIndex((book) => book.id === bookId);

    if (index !== -1) {
        books.splice(index, 1);
        const response = h.response({
            status: 'success',
            message: 'Buku berhasil dihapus'
        });
        response.code(200);
        return response;
    }
    else {
        const response = h.response({
            status: 'fail',
            message: 'Buku gagal dihapus. Id tidak ditemukan'
        });
        response.code(404);
        return response;
    }
};



module.exports = { addBookHandler, getAllBookHandler, getBookByIdHandler, editBookByIdHandler, deleteBookByIdHandler };