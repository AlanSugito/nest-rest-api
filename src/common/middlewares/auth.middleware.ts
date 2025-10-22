import {
  Injectable,
  NestMiddleware,
  UnauthorizedException,
} from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { NextFunction, Request, Response } from 'express';

@Injectable()
export class AuthMiddleware implements NestMiddleware {
  constructor(private jwt: JwtService) {}

  async use(req: Request, _: Response, next: NextFunction) {
    const token = this.extractTokenFromHeader(req);

    if (!token) throw new UnauthorizedException();

    try {
      const payload = await this.jwt.verifyAsync<{ id: number }>(token, {
        secret: process.env.JWT_SECRET,
      });

      req.user = payload;
    } catch {
      throw new UnauthorizedException();
    }

    return next();
  }

  private extractTokenFromHeader(request: Request) {
    const [type, token] = request.headers.authorization?.split(' ') ?? [];
    return type === 'Bearer' ? token : undefined;
  }
}
