import { Field, ObjectType } from '@nestjs/graphql';
import { ErrorType } from './error.type';
import { User } from '../user.entity';

@ObjectType()
export class RegisterResponse {
  @Field(() => User, { nullable: true }) // Assuming User is another ObjectType you have
  user?: User;

  @Field(() => ErrorType, { nullable: true })
  error?: ErrorType;
}
