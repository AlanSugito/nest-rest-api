/* eslint-disable @typescript-eslint/no-unsafe-member-access */
import { INestApplication, ValidationPipe } from '@nestjs/common';
import { Test, TestingModule } from '@nestjs/testing';
import request from 'supertest';
import { App } from 'supertest/types';
import { JwtService } from '@nestjs/jwt';
import { AppModule } from '../app.module';

describe('Book API', () => {
  let app: INestApplication<App>;

  beforeEach(async () => {
    const moduleFixture: TestingModule = await Test.createTestingModule({
      imports: [AppModule],
      providers: [JwtService],
    }).compile();

    app = moduleFixture.createNestApplication();
    app.useGlobalPipes(new ValidationPipe());
    await app.init();
  });

  afterAll(async () => await app.close());

  const token = new JwtService().sign(
    { id: 1 },
    { secret: process.env.JWT_SECRET },
  );

  const createTestBook = async () => {
    const res = await request(app.getHttpServer())
      .post('/books')
      .set('Authorization', `Bearer ${token}`)
      .send({ title: 'testTitle', author: 'testAuthor', year: 2025 });

    return res.body as { id: number };
  };

  const deleteTestBook = async (id: number) => {
    await request(app.getHttpServer())
      .delete(`/books/${id}`)
      .set('Authorization', `Bearer ${token}`);
  };

  describe('POST /books', () => {
    it('should success', async () => {
      const res = await request(app.getHttpServer())
        .post('/books')
        .set('Authorization', `Bearer ${token}`)
        .send({ title: 'testTitle', author: 'testAuthor', year: 2025 });

      expect(res.statusCode).toBe(201);
      expect(res.body).toHaveProperty('id');

      //hapus data yang baru dibuat

      await deleteTestBook(res.body.id as number);
    });

    it('should return 400 validation error', async () => {
      const res = await request(app.getHttpServer())
        .post('/books')
        .set('Authorization', `Bearer ${token}`)
        .send({ author: 'testAuthor', year: 2025 });

      expect(res.statusCode).toBe(400);
    });

    it('should return 401 when no token provided', async () => {
      const res = await request(app.getHttpServer())
        .post('/books')
        .send({ title: 'testTitle', author: 'testAuthor', year: 2025 });

      expect(res.statusCode).toBe(401);
    });
  });

  describe('GET /books', () => {
    it('should success', async () => {
      //buat 1 data buku
      const book = await createTestBook();

      const res = await request(app.getHttpServer())
        .get('/books')
        .set('Authorization', `Bearer ${token}`);

      expect(res.statusCode).toBe(200);
      expect(res.body).toHaveLength(1);

      //hapus data buku
      await deleteTestBook(book.id);
    });

    it('should return 401 when no token provided', async () => {
      const res = await request(app.getHttpServer()).get('/books');

      expect(res.statusCode).toBe(401);
    });
  });

  describe('GET /books/:id', () => {
    it('should success return book detail without reviews', async () => {
      const book = await createTestBook();

      const res = await request(app.getHttpServer())
        .get(`/books/${book.id}?withReviews=false`)
        .set('Authorization', `Bearer ${token}`);

      expect(res.statusCode).toBe(200);
      expect(res.body).toHaveProperty('id');
      expect(res.body).toHaveProperty('author');
      expect(res.body).toHaveProperty('title');
      expect(res.body).toHaveProperty('year');

      await deleteTestBook(book.id);
    });

    it('should success return book detail with reviews', async () => {
      const book = await createTestBook();

      const res = await request(app.getHttpServer())
        .get(`/books/${book.id}?withReviews=true`)
        .set('Authorization', `Bearer ${token}`);

      expect(res.statusCode).toBe(200);
      expect(res.body).toHaveProperty('id');
      expect(res.body).toHaveProperty('author');
      expect(res.body).toHaveProperty('title');
      expect(res.body).toHaveProperty('year');
      expect(res.body).toHaveProperty('reviews');

      await deleteTestBook(book.id);
    });

    it('should return 404 when book not found', async () => {
      const res = await request(app.getHttpServer())
        .get('/books/999999?withReviews=false')
        .set('Authorization', `Bearer ${token}`);

      expect(res.statusCode).toBe(404);
    });

    it('should return 401 when no token provided', async () => {
      const res = await request(app.getHttpServer()).get(
        '/books/1?withReviews=false',
      );

      expect(res.statusCode).toBe(401);
    });
  });

  describe('PUT /books/:id', () => {
    it('should success', async () => {
      const book = await createTestBook();

      const res = await request(app.getHttpServer())
        .put(`/books/${book.id}`)
        .set('Authorization', `Bearer ${token}`)
        .send({ title: 'editedTitle', author: '', year: 100 });

      expect(res.statusCode).toBe(200);

      const editedResponse = await request(app.getHttpServer())
        .get(`/books/${book.id}?withReviews=false`)
        .set('Authorization', `Bearer ${token}`);

      expect(editedResponse.body).toHaveProperty('title', 'editedTitle');

      await deleteTestBook(book.id);
    });

    it('should return 400 validation error', async () => {
      const res = await request(app.getHttpServer())
        .put(`/books/1`)
        .set('Authorization', `Bearer ${token}`)
        .send({ title: 1313131 });

      expect(res.statusCode).toBe(400);
    });

    it('should return 401 when no token provided', async () => {
      const res = await request(app.getHttpServer()).put('/books/1');

      expect(res.statusCode).toBe(401);
    });
  });

  describe('DELETE /books/:id', () => {
    it('should success', async () => {
      const book = await createTestBook();

      const res = await request(app.getHttpServer())
        .delete(`/books/${book.id}`)
        .set('Authorization', `Bearer ${token}`);

      expect(res.statusCode).toBe(200);

      const deletedRes = await request(app.getHttpServer())
        .get(`/books/${book.id}?withReviews=false`)
        .set('Authorization', `Bearer ${token}`);

      expect(deletedRes.statusCode).toBe(404);
    });

    it('should return 401 when no token provided', async () => {
      const res = await request(app.getHttpServer()).delete('/books/1');

      expect(res.statusCode).toBe(401);
    });
  });
});
