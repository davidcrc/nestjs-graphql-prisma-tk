import { Module } from '@nestjs/common';
import { UserService } from './user.service';
import { UserResolver } from './user.resolver';
import { AuthService } from '../auth/auth.service';
import { JwtService } from '@nestjs/jwt';
import { ConfigService } from '@nestjs/config';

@Module({
  providers: [
    JwtService,
    UserService,
    UserResolver,
    AuthService,
    ConfigService,
  ],
})
export class UserModule {}
