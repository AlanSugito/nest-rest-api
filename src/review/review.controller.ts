import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  ParseIntPipe,
  Post,
  Put,
  Req,
} from '@nestjs/common';
import { ApiBearerAuth } from '@nestjs/swagger';
import { ReviewService } from './review.service';
import { CreateReviewDTO } from './review.dto';
import type { Request } from 'express';

@ApiBearerAuth()
@Controller('reviews')
export class ReviewController {
  constructor(private reviewService: ReviewService) {}

  @Post()
  async createReview(@Req() req: Request, @Body() body: CreateReviewDTO) {
    const userId = req.user.id;

    return await this.reviewService.createReview(userId, body);
  }

  @Get('/:bookId')
  async getReviewsByBookId(@Param('bookId', ParseIntPipe) bookId: number) {
    return await this.reviewService.getReviewsByBookId(bookId);
  }

  @Put('/:id')
  async editReview(
    @Param('id', ParseIntPipe) id: number,
    @Body() body: Partial<CreateReviewDTO>,
  ) {
    return await this.reviewService.editReview(id, body);
  }

  @Delete('/:id')
  async deleteReview(@Param('id', ParseIntPipe) id: number) {
    return await this.reviewService.deleteReview(id);
  }
}
