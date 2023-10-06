import { Args, Context, Int, Mutation, Query, Resolver } from '@nestjs/graphql';
import { PostService } from './post.service';
import { PostType } from './dto/post-type.dto';
import * as GraphQLUpload from 'graphql-upload/GraphQLUpload.js';
import { Request } from 'express';
import { PostDetails } from './dto/post-details-type.dto';
import { UseGuards } from '@nestjs/common';
import { GraphqlAuthGuard } from '../auth/graphql-auth/graphql-auth.guard';

@Resolver()
export class PostResolver {
  constructor(private readonly postService: PostService) {}

  @UseGuards(GraphqlAuthGuard) //TODO: test it
  @Mutation(() => PostType)
  async createPost(
    @Context() context: { req: Request },
    @Args({ name: 'video', type: () => GraphQLUpload }) video: any,
    @Args('text') text: string,
  ) {
    const userUUID = context.req.user.sub;

    // Save the video and get its path
    const videoPath = await this.postService.saveVideo(video);

    // Create the post
    const postData = {
      text,
      video: videoPath,
      userUUID,
    };

    return await this.postService.createPost(postData);
  }

  @Query(() => PostDetails)
  async getPostById(@Args('id') id: number) {
    return await this.postService.getPostById(id);
  }

  @Query(() => [PostType])
  async getPosts(
    @Args('skip', { type: () => Int, defaultValue: 0 }) skip: number,
    @Args('take', { type: () => Int, defaultValue: 1 }) take: number,
  ): Promise<PostType[]> {
    console.log('skip!', skip, 'take!', take);
    return await this.postService.getPosts(skip, take);
  }

  @Mutation(() => PostType)
  async deletePost(@Args('id') id: number) {
    return await this.postService.deletePost(id);
  }

  @Query(() => [PostType])
  async getPostsByUserId(@Args('userUUID') userUUID: string) {
    return await this.postService.getPostsByUserId(userUUID);
  }
}
