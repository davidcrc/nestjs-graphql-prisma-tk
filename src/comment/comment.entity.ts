import { Field, Int, ObjectType } from '@nestjs/graphql';
import { User } from '@/user/user.entity';
import { PostType } from '@/post/dto/post-type.dto';

@ObjectType()
export class Comment {
  @Field((type) => Int)
  id: number;

  @Field((type) => Int)
  userId: number;

  @Field((type) => Int)
  postId: number;

  @Field((type) => User)
  user: User;

  // Assuming Post model exists
  @Field((type) => PostType)
  post: PostType;

  @Field()
  text: string;

  @Field()
  createdAt: Date;

  @Field()
  updatedAt: Date;
}
