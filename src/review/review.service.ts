import { Injectable } from '@nestjs/common';
import { PrismaClient } from '@prisma/client';
import { CreateReviewDTO } from './review.dto';

@Injectable()
export class ReviewService {
  constructor(private prisma: PrismaClient) {}

  async createReview(userId: number, data: CreateReviewDTO) {
    return await this.prisma.review.create({
      data: { ...data, userId },
      select: { id: true },
    });
  }

  async getReviewsByBookId(bookId: number) {
    return await this.prisma.review.findMany({
      where: { bookId },
      omit: { bookId: true },
    });
  }

  async editReview(id: number, data: Partial<CreateReviewDTO>) {
    return await this.prisma.review.update({
      where: { id },
      select: { id: true },
      data,
    });
  }

  async deleteReview(id: number) {
    return await this.prisma.review.delete({
      where: { id },
      select: { id: true },
    });
  }
}
