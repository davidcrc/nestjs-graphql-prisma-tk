import { ObjectType, Field, Int } from '@nestjs/graphql';
import { User } from '../../user/user.entity';
import { LikeType } from '../../like/like-type.dto';

@ObjectType()
export class PostType {
  @Field(() => Int)
  id: number;

  @Field()
  text: string;

  @Field()
  createdAt: Date;

  @Field()
  video: string;
  @Field(() => User)
  user?: User;

  @Field(() => [LikeType], { nullable: true })
  likes?: LikeType[];
}
