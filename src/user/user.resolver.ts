import { Args, Context, Mutation, Query, Resolver } from '@nestjs/graphql';
import { UserService } from './user.service';
import { AuthService } from '@/auth/auth.service';
import { RegisterResponse } from './dto/register-type.dto';
import { RegisterDto } from '../auth/dto/register.dto';
import { Response, Request } from 'express';
import { BadRequestException, UseFilters, UseGuards } from '@nestjs/common';
import { LoginDto } from '@/auth/dto/login.dto';
import { LoginResponse } from './dto/login-type.dto';
import { GraphQLErrorFilter } from '@/filters/custom-exception.filter';
import { User } from './user.entity';
import * as GraphQLUpload from 'graphql-upload/GraphQLUpload.js';
import { GraphqlAuthGuard } from '@/auth/graphql-auth/graphql-auth.guard';
import { join } from 'path';
import { createWriteStream } from 'fs';
import { v4 as uuidv4 } from 'uuid';

@Resolver('User')
export class UserResolver {
  constructor(
    private readonly authService: AuthService,
    private readonly userService: UserService,
  ) {}

  private async storeImageAndGetURL(file: GraphQLUpload): Promise<string> {
    const { createReadStream, filename } = await file;
    const fileData = await file;
    console.log('fileData!', fileData);

    const uniqueFilename = `${uuidv4()}_${filename}`;
    const imagePath = join(process.cwd(), 'public', uniqueFilename);
    const imageUrl = `${process.env.BACKEND_URL}/${uniqueFilename}`;
    const readStream = createReadStream();
    readStream.pipe(createWriteStream(imagePath));

    return imageUrl; // Return the appropriate URL where the file can be accessed
  }

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

  @UseGuards(GraphqlAuthGuard)
  @Mutation(() => User)
  async updateUserProfile(
    @Context()
    context: { req: Request },
    @Args('fullname', { type: () => String, nullable: true }) fullname?: string,
    @Args('bio', { type: () => String, nullable: true }) bio?: string,
    @Args('image', { type: () => GraphQLUpload, nullable: true })
    image?: GraphQLUpload,
  ) {
    console.log('image!', image, 'fullname!', fullname, 'bio!', bio);

    let imageUrl;
    if (image) {
      imageUrl = await this.storeImageAndGetURL(image);
    }

    return this.userService.updateProfile(context.req.user.sub, {
      fullname,
      bio,
      image: imageUrl,
    });
  }
}
