import { ApiProperty } from '@nestjs/swagger';
import { IsDefined, IsString } from 'class-validator';

export class RegisterDTO {
  @ApiProperty({ required: true })
  @IsDefined()
  @IsString()
  username: string;

  @ApiProperty({ required: true })
  @IsDefined()
  @IsString()
  password: string;
}

export class LoginDTO extends RegisterDTO {}
