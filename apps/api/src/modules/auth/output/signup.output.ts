import { ObjectType, Field } from '@nestjs/graphql';
import { AuthTokens } from '@shared/types';

@ObjectType()
export default class SignupOutput implements AuthTokens {
  @Field((type) => String)
  jwtAccessToken: string;

  @Field((type) => String)
  jwtRefreshToken: string;
}
