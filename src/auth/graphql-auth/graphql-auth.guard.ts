import {
  CanActivate,
  ExecutionContext,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { ConfigService } from '@nestjs/config';
import { Request, Response } from 'express';
import { AuthService } from '../auth.service';

@Injectable()
export class GraphqlAuthGuard implements CanActivate {
  constructor(
    private authService: AuthService,
    private jwtService: JwtService,
    private configService: ConfigService,
  ) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const gqlCtx = context.getArgByIndex(2);
    const request: Request = gqlCtx.req;
    const response: Response = gqlCtx.res;

    const token = this.extractTokenFromCookie(request);

    if (!token) {
      throw new UnauthorizedException();
    }

    try {
      const payload = await this.jwtService.verifyAsync(token, {
        secret: this.configService.get<string>('ACCESS_TOKEN_SECRET'),
      });
      console.log('PAYLOAD!', payload);
      request['user'] = payload;
    } catch (error) {
      console.log(error);
      // If token is expired, we could also check if there's a refresh token
      // and then refresh the access token here

      // If there's no refresh token, we throw an UnauthorizedException
      // and the user has to log in again
      if (request.cookies['refresh_token']) {
        this.authService.refreshToken(request, response);
      } else {
        throw new UnauthorizedException();
      }
    }

    return true;
  }

  private extractTokenFromCookie(request: Request): string | undefined {
    return request.cookies?.access_token;
  }
}
