import { ApiProperty } from '@nestjs/swagger';
import { IsDefined, IsNumber, IsString } from 'class-validator';

export class CreateBookDTO {
  @ApiProperty({ required: true })
  @IsDefined()
  @IsString()
  title: string;

  @IsDefined()
  @IsString()
  @ApiProperty({ required: true })
  author: string;

  @IsDefined()
  @IsNumber()
  @ApiProperty({ required: true })
  year: number;
}
