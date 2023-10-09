import { InputType, Field } from '@nestjs/graphql';

@InputType()
export class CommentCreateInput {
  @Field()
  text: string;
}
