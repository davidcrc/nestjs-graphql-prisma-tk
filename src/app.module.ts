import { Module } from '@nestjs/common';
import { PrismaModule } from '../prisma/prisma.module';
import { GraphQLModule } from '@nestjs/graphql';
import { ApolloDriver, ApolloDriverConfig } from '@nestjs/apollo';
import { ConfigModule } from '@nestjs/config';
import { join } from 'path';
import { AuthModule } from './auth/auth.module';
import { UserModule } from './user/user.module';
import { PostService } from './post/post.service';
import { PostModule } from './post/post.module';
import { LikeModule } from './like/like.module';

@Module({
  imports: [
    GraphQLModule.forRoot<ApolloDriverConfig>({
      driver: ApolloDriver,
      autoSchemaFile: join(process.cwd(), 'src/schema.gql'),
      sortSchema: true,
      playground: true,
      context: ({ req, res }) => ({ req, res }),
    }),
    ConfigModule.forRoot({}),
    PrismaModule,
    AuthModule,
    UserModule,
    PostModule,
    LikeModule,
  ],
  controllers: [],
  providers: [PostService],
})
export class AppModule {}
