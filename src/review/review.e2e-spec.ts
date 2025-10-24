/* eslint-disable @typescript-eslint/no-unsafe-member-access */
/* eslint-disable @typescript-eslint/no-unsafe-assignment */
import { INestApplication, ValidationPipe } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { Test, TestingModule } from '@nestjs/testing';
import { AppModule } from '../app.module';
import { App } from 'supertest/types';
import request from 'supertest';

describe('Review API', () => {
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

  let token: string;

  beforeEach(async () => {
    const credentials = { username: 'username', password: 'pwsswd' };

    try {
      await request(app.getHttpServer())
        .post('/users/register')
        .send(credentials);
    } catch (error) {
      console.log(error);
      return;
    }

    const { body } = await request(app.getHttpServer())
      .post('/users/login')
      .send(credentials);
    token = body.accessToken as string;
  });

  afterAll(async () => await app.close());

  const createTestBook = async () => {
    const res = await request(app.getHttpServer())
      .post('/books')
      .set('Authorization', `Bearer ${token}`)
      .send({ title: 'testTitle', author: 'testAuthor', year: 2025 });

    return res.body as { id: number };
  };

  const createTestBookReview = async (bookId: number) => {
    const { body } = await request(app.getHttpServer())
      .post('/reviews')
      .set('Authorization', `Bearer ${token}`)
      .send({ bookId, content: 'testContent' });

    return body as { id: number };
  };

  const deleteTestBook = async (id: number) => {
    await request(app.getHttpServer())
      .delete(`/books/${id}`)
      .set('Authorization', `Bearer ${token}`);
  };

  describe('POST /reviews', () => {
    it('should success', async () => {
      const book = await createTestBook();

      const res = await request(app.getHttpServer())
        .post('/reviews')
        .set('Authorization', `Bearer ${token}`)
        .send({ bookId: book.id, content: 'testContent' });

      expect(res.statusCode).toBe(201);

      await deleteTestBook(book.id);
    });

    it('should return 400 validation error', async () => {
      const book = await createTestBook();

      const res = await request(app.getHttpServer())
        .post('/reviews')
        .set('Authorization', `Bearer ${token}`)
        .send({ content: 'testContent' });

      expect(res.statusCode).toBe(400);

      await deleteTestBook(book.id);
    });

    it('should return 404 when no book to be reviewed found', async () => {
      const res = await request(app.getHttpServer())
        .post('/reviews')
        .set('Authorization', `Bearer ${token}`)
        .send({ bookId: 99999, content: 'testContent' });

      expect(res.statusCode).toBe(404);
    });

    it('should return 401 when no token provided', async () => {
      const res = await request(app.getHttpServer()).post('/reviews');

      expect(res.statusCode).toBe(401);
    });
  });

  describe('GET /reviews/:bookId', () => {
    it('should success', async () => {
      const book = await createTestBook();
      await createTestBookReview(book.id);

      const res = await request(app.getHttpServer())
        .get(`/reviews/${book.id}`)
        .set('Authorization', `Bearer ${token}`);

      expect(res.statusCode).toBe(200);
      expect(res.body).toHaveLength(1);

      await deleteTestBook(book.id);
    });

    it('should return 404 when requested book is not found', async () => {
      const res = await request(app.getHttpServer())
        .get(`/reviews/9999`)
        .set('Authorization', `Bearer ${token}`);

      expect(res.statusCode).toBe(404);
    });

    it('should return 401 when no token provided', async () => {
      const res = await request(app.getHttpServer()).get('/reviews/1');

      expect(res.statusCode).toBe(401);
    });
  });

  describe('PUT /reviews/:id', () => {
    it('should success', async () => {
      const book = await createTestBook();
      const review = await createTestBookReview(book.id);

      const res = await request(app.getHttpServer())
        .put(`/reviews/${review.id}`)
        .set('Authorization', `Bearer ${token}`)
        .send({ content: 'editedContent' });

      expect(res.statusCode).toBe(200);

      //get updated data
      const { body } = await request(app.getHttpServer())
        .get(`/reviews/${book.id}`)
        .set('Authorization', `Bearer ${token}`);

      const [newReview] = body;
      expect(newReview.content).toBe('editedContent');

      await deleteTestBook(book.id);
    });

    it('should return 404 when no requested review can be updated', async () => {
      const res = await request(app.getHttpServer())
        .put(`/reviews/999999`)
        .set('Authorization', `Bearer ${token}`)
        .send({ content: 'editedContent' });

      expect(res.statusCode).toBe(404);
    });

    it('should return 401 when no token provided', async () => {
      const res = await request(app.getHttpServer()).put('/reviews/1');

      expect(res.statusCode).toBe(401);
    });
  });

  describe('DELETE /reviews/:id', () => {
    it('should success', async () => {
      const book = await createTestBook();
      const review = await createTestBookReview(book.id);

      const res = await request(app.getHttpServer())
        .delete(`/reviews/${review.id}`)
        .set('Authorization', `Bearer ${token}`);

      expect(res.statusCode).toBe(200);

      //get updated data
      const { body } = await request(app.getHttpServer())
        .get(`/reviews/${book.id}`)
        .set('Authorization', `Bearer ${token}`);

      expect(body).toHaveLength(0);

      await deleteTestBook(book.id);
    });

    it('should return 404 when no review can be deleted', async () => {
      const res = await request(app.getHttpServer())
        .delete(`/reviews/9999`)
        .set('Authorization', `Bearer ${token}`);

      expect(res.statusCode).toBe(404);
    });

    it('should return 401 when no token provided', async () => {
      const res = await request(app.getHttpServer()).delete('/reviews/1');

      expect(res.statusCode).toBe(401);
    });
  });
});
