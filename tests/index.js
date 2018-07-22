const { describe, it, after } = require('mocha');
require('../src/app');

const {
  get, wait, expect, post, del
} = require('chakram');

const apiUrl = 'http://127.0.0.1:3003';

describe('Books', () => {
  after(() => {
    process.exit(0);
  });

  it('should return books', () => {
    const response = get(`${apiUrl}/api/v1/books`);
    expect(response).to.have.status(200);
    expect(response).to.have.header('content-type', /json/);
    expect(response).to.comprise.of.json([{
      id: 1,
      description: 'Book1',
      ISBN: 154878,
      numPages: 410,
      coverImage: '0.jpg',
      genre: 'Comics',
      rates: [{
        comment: 'Excellent',
        value: 5,
        user: {
          id: 1, userName: 'sam', password: '123', firstName: 'Sam', avatar: '1.png', lastName: 'Michael'
        }
      }],
      authors: [{
        id: 1, firstName: 'J. K.', lastName: 'Rowling', country: 'Britain'
      }]
    }, {
      id: 2,
      description: 'Book2',
      ISBN: 154848,
      numPages: 840,
      coverImage: '1.jpg',
      genre: 'Health',
      rates: [{
        comment: 'Good',
        value: 3,
        user: {
          id: 2, userName: 'joel', password: '123', firstName: 'Joel', avatar: '2.png', lastName: 'Cash'
        }
      }],
      authors: [{
        id: 2, firstName: 'Suzanne', lastName: 'Collins', country: 'Usa'
      }]
    }, {
      id: 3,
      description: 'Book3',
      ISBN: 174848,
      numPages: 486,
      coverImage: '2.jpg',
      genre: 'Fantasy',
      rates: [],
      authors: [{
        id: 1, firstName: 'J. K.', lastName: 'Rowling', country: 'Britain'
      }, {
        id: 2, firstName: 'Suzanne', lastName: 'Collins', country: 'Usa'
      }]
    }]);
    return wait();
  });

  it('should return book by id', () => {
    const response = get(`${apiUrl}/api/v1/book/1`);
    expect(response).to.have.status(200);
    expect(response).to.have.header('content-type', /json/);
    expect(response).to.comprise.of.json({
      id: 1,
      description: 'Book1',
      ISBN: 154878,
      numPages: 410,
      coverImage: '0.jpg',
      genre: 'Comics',
      rates: [{
        comment: 'Excellent',
        value: 5,
        user: {
          id: 1, userName: 'sam', password: '123', firstName: 'Sam', avatar: '1.png', lastName: 'Michael'
        }
      }],
      authors: [{
        id: 1, firstName: 'J. K.', lastName: 'Rowling', country: 'Britain'
      }]
    });
    return wait();
  });

  it('should return books by rate', () => {
    const response = get(`${apiUrl}/api/v1/books/byRate/3`);
    expect(response).to.have.status(200);
    expect(response).to.have.header('content-type', /json/);
    expect(response).to.comprise.of.json([{
      id: 1, description: 'Book1', ISBN: 154878, numPages: 410, coverImage: '0.jpg', genre: 'Comics', avg_rate: '5.0000'
    }, {
      id: 2, description: 'Book2', ISBN: 154848, numPages: 840, coverImage: '1.jpg', genre: 'Health', avg_rate: '3.0000'
    }]);
    return wait();
  });

  it('should return books by author', () => {
    const response = get(`${apiUrl}/api/v1/books/byAuthor/Rowling`);
    expect(response).to.have.status(200);
    expect(response).to.have.header('content-type', /json/);
    expect(response).to.comprise.of.json([{
      id: 1, description: 'Book1', ISBN: 154878, numPages: 410, coverImage: '0.jpg', genre: 'Comics'
    }, {
      id: 3, description: 'Book3', ISBN: 174848, numPages: 486, coverImage: '2.jpg', genre: 'Fantasy'
    }]);
    return wait();
  });

  it('should return authors by rate', () => {
    const response = get(`${apiUrl}/api/v1/authors/byRate/3`);
    expect(response).to.have.status(200);
    expect(response).to.have.header('content-type', /json/);
    expect(response).to.comprise.of.json([{
      id: 1, firstName: 'J. K.', lastName: 'Rowling', country: 'Britain'
    }, {
      id: 2, firstName: 'Suzanne', lastName: 'Collins', country: 'Usa'
    }]);
    return wait();
  });

  it('should rate book', () => {
    const response = post(`${apiUrl}/api/v1/book/rate`, {
      value: 5, bookId: 2, userId: 3, comment: 'Fine'
    }, { 'content-type': 'application/x-www-form-urlencoded' });
    expect(response).to.have.status(200);
    expect(response).to.have.header('content-type', /json/);
    expect(response).to.comprise.of.json({
      book_id: 2, user_id: 3, value: 5, comment: 'Fine'
    });
    return wait();
  });

  it('should create book', () => {
    const response = post(`${apiUrl}/api/v1/book/add`, {
      description: 'Test book', genre: 'Comics', ISBN: '234234234', numPages: 303, coverImage: 'http:\\url.jpg'
    }, { 'content-type': 'application/x-www-form-urlencoded' });
    expect(response).to.have.status(200);
    expect(response).to.have.header('content-type', /json/);
    expect(response).to.comprise.of.json([{
      id: 4, description: 'Test book', genre: 'Comics', ISBN: '234234234', numPages: 303, coverImage: 'http:\\url.jpg'
    }, true]);
    return wait();
  });

  it('should delete book', () => {
    const response = del(`${apiUrl}/api/v1/book/delete/3`);
    expect(response).to.have.status(200);
    expect(response).to.have.header('content-type', /json/);
    expect(response).to.comprise.of.json({
      id: 3, description: 'Book3', ISBN: 174848, numPages: 486, coverImage: '2.jpg', genre: 'Fantasy'
    });
    return wait();
  });

  it('should delete user', () => {
    const response = del(`${apiUrl}/api/v1/user/delete/sam`);
    expect(response).to.have.status(200);
    expect(response).to.have.header('content-type', /json/);
    expect(response).to.comprise.of.json({
      id: 1, userName: 'sam', password: '123', firstName: 'Sam', avatar: '1.png', lastName: 'Michael'
    });
    return wait();
  });

  it('should register user', () => {
    const response = post(`${apiUrl}/api/v1/user/registerOrUpdate`, {
      userName: 'test_user', password: '123', avatar: 'avatar.jpg', firstName: 'Test', lastName: 'User'
    }, { 'content-type': 'application/x-www-form-urlencoded' });
    expect(response).to.have.status(200);
    expect(response).to.have.header('content-type', /json/);
    expect(response).to.comprise.of.json({
      id: 4, userName: 'test_user', password: '123', avatar: 'avatar.jpg', firstName: 'Test', lastName: 'User'
    });
    return wait();
  });
});
