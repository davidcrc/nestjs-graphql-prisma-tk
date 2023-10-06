import { Field, ObjectType } from '@nestjs/graphql';
import { PostType } from './post-type.dto';

@ObjectType()
export class PostDetails extends PostType {
  @Field(() => [Number], { nullable: true })
  otherPostIds?: number[];
}
