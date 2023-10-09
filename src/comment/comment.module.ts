import { Module } from '@nestjs/common';
import { CommentService } from './comment.service';
import { CommentResolver } from './comment.resolver';
import { AuthService } from '@/auth/auth.service';
import { JwtService } from '@nestjs/jwt';
import { ConfigService } from '@nestjs/config';

@Module({
  providers: [
    CommentService,
    CommentResolver,
    AuthService,
    JwtService,
    ConfigService,
  ],
})
export class CommentModule {}
