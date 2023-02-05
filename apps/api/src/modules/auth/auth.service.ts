import * as argon2 from 'argon2';
import { Injectable } from '@nestjs/common';
import TokensService from '../tokens/tokens.service';
import UserService from '../users/users.service';
import SignupInput from './input/signup.input';

@Injectable()
export default class AuthService {
  constructor(
    private readonly usersService: UserService,
    private readonly tokensService: TokensService,
  ) {}

  public async signupLocal(signupInput: SignupInput) {
    const hashedPassword = await argon2.hash(signupInput.password);

    const user = await this.usersService.createUser({
      email: signupInput.email,
      displayName: signupInput.displayName,
      hashedPassword,
    });

    const tokens = await this.tokensService.generateAuthTokens(
      user.id,
      user.email,
      user.displayName,
    );
    await this.tokensService.updateRefreshToken(
      user.id,
      tokens.jwtRefreshToken,
    );

    return tokens;
  }
}
