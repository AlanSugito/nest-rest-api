import { BadRequestException, Injectable } from '@nestjs/common';
import { PrismaClient } from '@prisma/client';
import { LoginDTO, RegisterDTO } from './user.dto';
import bcrypt from 'bcrypt';
import { JwtService } from '@nestjs/jwt';

@Injectable()
export class UserService {
  constructor(
    private prisma: PrismaClient,
    private jwt: JwtService,
  ) {}

  async register(data: RegisterDTO) {
    const user = await this.prisma.user.findFirst({
      where: { username: data.username },
    });

    if (user) throw new BadRequestException('username already in use!');

    const saltRounds = 10;

    data.password = await bcrypt.hash(data.password, saltRounds);

    const { id } = await this.prisma.user.create({ data });

    return id;
  }

  async login({ username, password }: LoginDTO) {
    const user = await this.prisma.user.findFirst({ where: { username } });

    if (!user) throw new BadRequestException('invalid username or password');

    if (!bcrypt.compareSync(password, user.password))
      throw new BadRequestException('invalid username or password');

    const accessToken = this.jwt.sign(
      { id: user.id },
      { expiresIn: '30 Days' },
    );

    return { accessToken };
  }
}
