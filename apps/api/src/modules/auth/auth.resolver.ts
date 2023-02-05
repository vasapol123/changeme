import { Args, Mutation, Resolver } from '@nestjs/graphql';
import AuthService from './auth.service';
import SignupInput from './input/signup.input';
import SignupOutput from './output/signup.output';

@Resolver()
export default class AuthResolver {
  constructor(private readonly authService: AuthService) {}

  @Mutation((returns) => SignupOutput)
  public async signupLocal(@Args('input') signupInput: SignupInput) {
    const tokens = this.authService.signupLocal(signupInput);

    return tokens;
  }
}
