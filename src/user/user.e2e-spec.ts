import { INestApplication, ValidationPipe } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { TestingModule, Test } from '@nestjs/testing';
import { AppModule } from '../app.module';
import { App } from 'supertest/types';
import request from 'supertest';
import { PrismaClient } from '@prisma/client';

let app: INestApplication<App>;
const prisma = new PrismaClient();

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

describe('User API', () => {
  describe('POST /users/register', () => {
    it('should success', async () => {
      const res = await request(app.getHttpServer())
        .post('/users/register')
        .send({ username: 'usertest', password: 'testpassword' });

      expect(res.statusCode).toBe(201);

      await prisma.user.delete({ where: { username: 'usertest' } });
    });

    it('should return 400 when user with same username already exists', async () => {
      await request(app.getHttpServer())
        .post('/users/register')
        .send({ username: 'usertest', password: 'testpassword' });

      const res = await request(app.getHttpServer())
        .post('/users/register')
        .send({ username: 'usertest', password: 'testpassword' });

      expect(res.statusCode).toBe(400);

      await prisma.user.delete({ where: { username: 'usertest' } });
    });
  });

  describe('POST /users/login', () => {
    it('should success and return access token', async () => {
      await request(app.getHttpServer())
        .post('/users/register')
        .send({ username: 'usertest', password: 'testpassword' });

      const res = await request(app.getHttpServer())
        .post('/users/login')
        .send({ username: 'usertest', password: 'testpassword' });

      expect(res.statusCode).toBe(200);
      expect(res.body).toHaveProperty('accessToken');

      await prisma.user.delete({ where: { username: 'usertest' } });
    });

    it('should return error 400 when credentials are invalid', async () => {
      await request(app.getHttpServer())
        .post('/users/register')
        .send({ username: 'usertest', password: 'testpassword' });

      const res = await request(app.getHttpServer())
        .post('/users/login')
        .send({ username: 'usertest', password: 'wrongPassword' });

      expect(res.statusCode).toBe(400);
      await prisma.user.delete({ where: { username: 'usertest' } });
    });
  });
});
