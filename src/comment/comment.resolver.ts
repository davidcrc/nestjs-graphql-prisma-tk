import { UseGuards } from '@nestjs/common';
import { Args, Context, Mutation, Query, Resolver } from '@nestjs/graphql';
import { CommentService } from './comment.service';
import { Comment } from './comment.entity';
import { Request } from 'express';
import { GraphqlAuthGuard } from '../auth/graphql-auth/graphql-auth.guard';

@Resolver()
export class CommentResolver {
  constructor(private readonly commentService: CommentService) {}

  @Query(() => [Comment])
  async getCommentsByPostId(@Args('postId') postId: number) {
    return this.commentService.getCommentsByPostId(postId);
  }
  @UseGuards(GraphqlAuthGuard)
  @Mutation(() => Comment)
  createComment(
    @Args('postId') postId: number,
    @Args('text') text: string,
    @Context() ctx: { req: Request },
  ) {
    return this.commentService.createComment({
      text: text,
      user: { connect: { uuid: ctx.req.user.sub } },
      post: { connect: { id: postId } },
    });
  }
  // @UseGuards(GraphqlAuthGuard)
  @Mutation(() => Comment)
  deleteComment(@Args('id') id: number, @Context() ctx: { req: Request }) {
    return this.commentService.deleteComment(id, ctx.req.user.sub);
  }
}
