import { ApiProperty } from '@nestjs/swagger';
import { IsDefined, IsNumber, IsString, Min } from 'class-validator';

export class CreateReviewDTO {
  @ApiProperty({ required: true })
  @IsDefined()
  @IsNumber()
  @Min(1)
  bookId: number;

  @ApiProperty({ required: true })
  @IsDefined()
  @IsString()
  content: string;
}
