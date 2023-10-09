import { Request } from 'express';
import { Args, Context, Mutation, Resolver } from '@nestjs/graphql';
import { LikeService } from './like.service';
import { LikeType } from './dto/like-type.dto';
import { UseGuards } from '@nestjs/common';
import { GraphqlAuthGuard } from '../auth/graphql-auth/graphql-auth.guard';

@Resolver()
export class LikeResolver {
  constructor(private readonly likeService: LikeService) {}

  @Mutation(() => LikeType)
  @UseGuards(GraphqlAuthGuard)
  async likePost(
    @Args('postId') postId: number,
    @Context() ctx: { req: Request },
  ) {
    return this.likeService.likePost({
      userUUID: ctx.req.user.sub,
      postId: postId,
    });
  }

  @Mutation(() => LikeType)
  @UseGuards(GraphqlAuthGuard)
  async unlikePost(
    @Args('postId') postId: number,
    @Context() ctx: { req: Request },
  ) {
    return this.likeService.unlikePost(postId, ctx.req.user.sub);
  }
}
