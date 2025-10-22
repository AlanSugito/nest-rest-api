import { MiddlewareConsumer, Module, NestModule } from '@nestjs/common';
import { AuthMiddleware } from 'src/common/middlewares/auth.middleware';
import { ReviewController } from './review.controller';
import { ReviewService } from './review.service';
import { PrismaClient } from '@prisma/client';

@Module({
  controllers: [ReviewController],
  providers: [ReviewService, PrismaClient],
})
export class ReviewModule implements NestModule {
  configure(consumer: MiddlewareConsumer) {
    consumer.apply(AuthMiddleware).forRoutes(ReviewController);
  }
}
