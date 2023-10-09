import { Field, ObjectType, Int } from '@nestjs/graphql';
import { Post } from '@prisma/client';
import { User } from '../../user/user.entity';
import { PostType } from '../../post/dto/post-type.dto';

@ObjectType()
export class Comment {
  @Field((type) => Int)
  id: number;

  @Field((type) => User)
  user: User;

  // Assuming Post model exists
  @Field((type) => PostType)
  post: Post;

  @Field()
  text: string;

  @Field()
  createdAt: Date;

  @Field()
  updatedAt: Date;
}
