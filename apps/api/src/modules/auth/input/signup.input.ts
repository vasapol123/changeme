import { InputType, Field } from '@nestjs/graphql';
import { IsEmail, IsNotEmpty, IsString } from 'class-validator';

@InputType()
export default class SignupInput {
  @IsEmail()
  @IsString()
  @IsNotEmpty()
  @Field((type) => String)
  email: string;

  @IsString()
  @IsNotEmpty()
  @Field((type) => String)
  displayName: string;

  @IsString()
  @IsNotEmpty()
  @Field((type) => String)
  password: string;
}
