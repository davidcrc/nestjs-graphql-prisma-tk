import { Field, InputType } from '@nestjs/graphql';

@InputType()
export class LikeCreateInput {
  @Field()
  postId: number;

  @Field()
  userUUID: string;
}
