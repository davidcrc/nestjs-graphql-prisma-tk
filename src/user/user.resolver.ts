import { Args, Context, Mutation, Query, Resolver } from '@nestjs/graphql';
import { UserService } from './user.service';
import { AuthService } from '@/auth/auth.service';
import { RegisterResponse } from './dto/register-type.dto';
import { RegisterDto } from '../auth/dto/register.dto';
import { Response, Request } from 'express';
import { BadRequestException, UseFilters } from '@nestjs/common';
import { LoginDto } from '@/auth/dto/login.dto';
import { LoginResponse } from './dto/login-type.dto';
import { GraphQLErrorFilter } from '@/filters/custom-exception.filter';
import { User } from './user.entity';

@Resolver('User')
export class UserResolver {
  constructor(
    private readonly authService: AuthService,
    private readonly userService: UserService,
  ) {}

  @UseFilters(GraphQLErrorFilter)
  @Mutation(() => RegisterResponse)
  async register(
    @Args('registerInput') registerDto: RegisterDto,
    @Context() context: { res: Response },
  ): Promise<RegisterResponse> {
    if (registerDto.password !== registerDto.confirmPassword) {
      throw new BadRequestException({
        confirmPassword: 'Password and confirm password are not the same.',
      });
    }

    const { user } = await this.authService.register(registerDto, context.res);

    console.log('user!', user);

    return { user };
  }

  @Mutation(() => LoginResponse)
  async login(
    @Args('loginInput') loginDto: LoginDto,
    @Context() context: { res: Response },
  ) {
    return this.authService.login(loginDto, context.res);
  }

  @Mutation(() => String)
  async logout(@Context() context: { res: Response }) {
    return this.authService.logout(context.res);
  }

  @Query(() => String)
  getProtectedData() {
    return 'This is protected data';
  }

  @Mutation(() => String)
  async refreshToken(@Context() context: { req: Request; res: Response }) {
    try {
      return this.authService.refreshToken(context.req, context.res);
    } catch (error) {
      throw new BadRequestException(error.message);
    }
  }

  @Query(() => [User])
  getUsers() {
    return this.userService.getUsers();
  }
}
