import { Module } from '@nestjs/common';
import { UserService } from './user.service';

import { UserController } from './user.controller';
import { JwtModule } from '@nestjs/jwt';
import { PrismaClient } from '@prisma/client';

@Module({
  imports: [
    JwtModule.register({ global: true, secret: process.env.JWT_SECRET }),
  ],
  providers: [UserService, PrismaClient],
  controllers: [UserController],
})
export class UserModule {}
