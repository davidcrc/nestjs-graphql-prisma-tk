import {
  BadRequestException,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { PrismaService } from '../../prisma/prisma.service';
import { ConfigService } from '@nestjs/config';
import * as bcrypt from 'bcrypt';
import { Response, Request } from 'express';
import { User } from '@prisma/client';
import { LoginDto } from './dto/login.dto';
import { RegisterDto } from './dto/register.dto';

@Injectable()
export class AuthService {
  constructor(
    private readonly jwtService: JwtService,
    private readonly prisma: PrismaService,
    private readonly configService: ConfigService,
  ) {}

  private signToken({
    payload,
    expiration,
    expiresIn,
    tokenType,
  }: {
    payload: any;
    expiration?: number;
    expiresIn?: string | number;
    tokenType: 'ACCESS_TOKEN_SECRET' | 'REFRESH_TOKEN_SECRET';
  }) {
    return this.jwtService.sign(
      { ...payload, ...(expiration && { exp: expiration }) },
      {
        secret: this.configService.get<string>(tokenType),
        ...(expiresIn && { expiresIn }),
      },
    );
  }

  private async issueTokens(user: User, response: Response) {
    const payload = { username: user.fullname, sub: user.uuid };

    const accessToken = this.signToken({
      payload,
      expiresIn: '550sec', // TODO: this should be 150sec
      tokenType: 'ACCESS_TOKEN_SECRET',
    });

    const refreshToken = this.signToken({
      payload,
      expiresIn: '7d',
      tokenType: 'REFRESH_TOKEN_SECRET',
    });

    response.cookie('access_token', accessToken, { httpOnly: true });
    response.cookie('refresh_token', refreshToken, {
      httpOnly: true,
    });

    return { user };
  }

  private async hashPassword(password: string) {
    const saltOrRounds = 15;

    const hashedPassword = await bcrypt.hash(password, saltOrRounds);

    return hashedPassword;
  }

  private async comparePasswords(password: string, hash: string) {
    return await bcrypt.compare(password, hash);
  }

  private async validateUser(loginDto: LoginDto): Promise<User> | null {
    const user = await this.prisma.user.findUnique({
      where: { email: loginDto.email },
    });

    const isMatch = await this.comparePasswords(
      loginDto.password,
      user.password,
    );

    return user && isMatch ? user : null;
  }

  async refreshToken(req: Request, res: Response): Promise<string> {
    const refreshToken = req.cookies['refresh_token'];

    if (!refreshToken) {
      throw new UnauthorizedException('Refresh token not found');
    }

    let payload;
    try {
      payload = this.jwtService.verify(refreshToken, {
        secret: this.configService.get<string>('REFRESH_TOKEN_SECRET'),
      });
    } catch (error) {
      throw new UnauthorizedException('Invalid or expired refresh token');
    }

    const userExists = await this.prisma.user.findUnique({
      where: { uuid: payload.sub },
    });

    if (!userExists) {
      throw new BadRequestException('User no longer exists');
    }

    const expiresIn = 15000; // seconds
    const expiration = Math.floor(Date.now() / 1000) + expiresIn;

    const accessToken = this.signToken({
      payload,
      expiration,
      tokenType: 'ACCESS_TOKEN_SECRET',
    });

    res.cookie('access_token', accessToken, { httpOnly: true });

    return accessToken;
  }

  async register(registerDto: RegisterDto, response: Response) {
    // console.log('registerDto!!!', registerDto);
    const existingUser = await this.prisma.user.findUnique({
      where: { email: registerDto.email },
    });

    if (existingUser) {
      throw new BadRequestException({ email: 'Email already in use' });
    }

    const hashedPassword = await this.hashPassword(registerDto.password);

    const user = await this.prisma.user.create({
      data: {
        fullname: registerDto.fullname,
        password: hashedPassword,
        email: registerDto.email,
      },
    });

    console.log('user!!!', user);

    return this.issueTokens(user, response); // Issue tokens on registration
  }

  async login(loginDto: LoginDto, response: Response) {
    const user = await this.validateUser(loginDto);

    if (!user) {
      throw new BadRequestException({
        invalidCredentials: 'Invalid credentials',
      });
    }

    return this.issueTokens(user, response); // Issue tokens on login
  }

  async logout(response: Response) {
    response.clearCookie('access_token');
    response.clearCookie('refresh_token');

    return 'Successfully logged out';
  }
}
