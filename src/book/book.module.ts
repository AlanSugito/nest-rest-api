import { MiddlewareConsumer, Module, NestModule } from '@nestjs/common';
import { BookController } from './book.controller';
import { BookService } from './book.service';
import { PrismaClient } from '@prisma/client';
import { AuthMiddleware } from '../common/middlewares/auth.middleware';

@Module({
  controllers: [BookController],
  providers: [BookService, PrismaClient],
})
export class BookModule implements NestModule {
  configure(consumer: MiddlewareConsumer) {
    consumer.apply(AuthMiddleware).forRoutes(BookController);
  }
}
