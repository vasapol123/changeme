import { ObjectType, Field } from '@nestjs/graphql';

@ObjectType()
export default class SignupOutput {
  @Field((type) => String)
  jwtAccessToken: string;

  @Field((type) => String)
  jwtRefreshToken: string;
}
