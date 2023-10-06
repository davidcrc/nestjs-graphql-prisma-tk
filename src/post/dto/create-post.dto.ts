import { InputType, Field } from '@nestjs/graphql';
import { IsNotEmpty, IsString } from 'class-validator';

@InputType()
export class CreatePostDto {
  @Field()
  @IsString()
  userUUID: string;

  @Field()
  @IsString()
  @IsNotEmpty()
  text: string;

  @Field({ nullable: true })
  @IsString()
  @IsNotEmpty()
  video?: string;
}
