import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaClient } from '@prisma/client';
import { CreateReviewDTO } from './review.dto';

@Injectable()
export class ReviewService {
  constructor(private prisma: PrismaClient) {}

  async createReview(userId: number, data: CreateReviewDTO) {
    const book = await this.prisma.book.findUnique({
      where: { id: data.bookId },
    });

    if (!book) throw new NotFoundException('no book found');

    return await this.prisma.review.create({
      data: { bookId: data.bookId, content: data.content, userId },
      select: { id: true },
    });
  }

  async getReviewsByBookId(bookId: number) {
    const book = await this.prisma.book.findUnique({ where: { id: bookId } });

    if (!book) throw new NotFoundException('no book found');

    return await this.prisma.review.findMany({
      where: { bookId },
      omit: { bookId: true },
    });
  }

  async editReview(id: number, data: Partial<CreateReviewDTO>) {
    const review = await this.prisma.review.findUnique({ where: { id } });

    if (!review) throw new NotFoundException('no review to be updated');

    return await this.prisma.review.update({
      where: { id },
      select: { id: true },
      data,
    });
  }

  async deleteReview(id: number) {
    const review = await this.prisma.review.findUnique({ where: { id } });

    if (!review) throw new NotFoundException('no review to be deleted');

    return await this.prisma.review.delete({
      where: { id },
      select: { id: true },
    });
  }
}
