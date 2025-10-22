import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  ParseBoolPipe,
  ParseIntPipe,
  Post,
  Put,
  Query,
} from '@nestjs/common';
import { BookService } from './book.service';
import { CreateBookDTO } from './book.dto';
import { ApiBearerAuth } from '@nestjs/swagger';

@ApiBearerAuth()
@Controller('books')
export class BookController {
  constructor(private bookService: BookService) {}

  @Post()
  async createBook(@Body() body: CreateBookDTO) {
    return await this.bookService.createBook(body);
  }

  @Get()
  async getBooks() {
    return await this.bookService.getBooks();
  }

  @Get('/:id')
  async getBookById(
    @Param('id', ParseIntPipe) id: number,
    @Query('withReviews', ParseBoolPipe) withReviews: boolean = false,
  ) {
    return await this.bookService.getBookById(id, withReviews);
  }

  @Put('/:id')
  async editBook(
    @Param('id', ParseIntPipe) id: number,
    @Body() body: Partial<CreateBookDTO>,
  ) {
    return await this.bookService.editBook(id, body);
  }

  @Delete('/:id')
  async deleteBook(@Param('id', ParseIntPipe) id: number) {
    return await this.bookService.deleteBook(id);
  }
}
