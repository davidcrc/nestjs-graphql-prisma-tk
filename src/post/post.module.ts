import { Module } from '@nestjs/common';
import { PostService } from './post.service';
import { PostResolver } from './post.resolver';
import { JwtService } from '@nestjs/jwt';
import { ConfigService } from '@nestjs/config';
import { AuthService } from '@/auth/auth.service';

@Module({
  providers: [
    AuthService,
    PostService,
    PostResolver,
    JwtService,
    ConfigService,
  ],
})
export class PostModule {}
