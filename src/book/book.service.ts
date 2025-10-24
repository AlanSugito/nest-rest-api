import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaClient } from '@prisma/client';
import { CreateBookDTO } from './book.dto';

@Injectable()
export class BookService {
  constructor(private prisma: PrismaClient) {}

  async createBook(data: CreateBookDTO) {
    const result = await this.prisma.book.create({ data });

    return result;
  }

  async getBooks() {
    return await this.prisma.book.findMany();
  }

  async getBookById(id: number, withReviews: boolean = false) {
    return await this.prisma.book.findUnique({
      where: { id },
      include: !withReviews
        ? undefined
        : {
            reviews: {
              include: { user: { select: { username: true } } },
            },
          },
    });
  }

  async editBook(id: number, data: Partial<CreateBookDTO>) {
    const book = await this.prisma.book.findUnique({ where: { id } });

    if (!book) throw new NotFoundException('no book to be updated');

    const result = await this.prisma.book.update({ where: { id }, data });

    return result;
  }

  async deleteBook(id: number) {
    const book = await this.prisma.book.findUnique({ where: { id } });

    if (!book) throw new NotFoundException('no book to be deleted');

    return await this.prisma.book.delete({ where: { id } });
  }
}
