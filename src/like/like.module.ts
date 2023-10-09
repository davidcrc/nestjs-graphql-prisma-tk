import { Module } from '@nestjs/common';
import { LikeService } from './like.service';
import { LikeResolver } from './like.resolver';
import { JwtService } from '@nestjs/jwt';
import { AuthService } from '../auth/auth.service';
import { ConfigService } from '@nestjs/config';

@Module({
  providers: [
    LikeService,
    LikeResolver,
    AuthService,
    JwtService,
    ConfigService,
  ],
})
export class LikeModule {}
