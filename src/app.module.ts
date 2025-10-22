import { Module } from '@nestjs/common';
import { UserModule } from './user/user.module';
import { BookModule } from './book/book.module';
import { ReviewModule } from './review/review.module';

@Module({
  imports: [UserModule, BookModule, ReviewModule],
})
export class AppModule {}
