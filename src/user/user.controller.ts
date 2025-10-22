import { Body, Controller, Post } from '@nestjs/common';
import { LoginDTO, RegisterDTO } from './user.dto';
import { UserService } from './user.service';

@Controller('users')
export class UserController {
  constructor(private userService: UserService) {}

  @Post('/register')
  async register(@Body() body: RegisterDTO) {
    const id = await this.userService.register(body);

    return { id };
  }

  @Post('/login')
  async login(@Body() body: LoginDTO) {
    const result = await this.userService.login(body);

    return result;
  }
}
