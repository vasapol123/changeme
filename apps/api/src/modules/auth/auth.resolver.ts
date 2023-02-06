import { Args, Mutation, Resolver, Query } from '@nestjs/graphql';
import { Public } from '../../common/decorator/public.decorator';
import AuthService from './auth.service';
import SignupInput from './input/signup.input';
import SignupOutput from './output/signup.output';

@Resolver()
export default class AuthResolver {
  constructor(private readonly authService: AuthService) {}

  @Query((returns) => String)
  public protectedRoute() {
    return 'Authorized user!';
  }

  @Public()
  @Mutation((returns) => SignupOutput)
  public async signupLocal(@Args('input') signupInput: SignupInput) {
    const tokens = this.authService.signupLocal(signupInput);

    return tokens;
  }
}
