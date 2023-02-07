import * as argon2 from 'argon2';
import { Injectable } from '@nestjs/common';
import { AuthTokens } from '@shared/types';
import TokensService from '../tokens/tokens.service';
import UserService from '../users/users.service';
import SignupInput from './input/signup.input';
@Injectable()
export default class AuthService {
  /**
   * @constructor
   * @param { UserService } usersService
   * @param { TokensService } tokensService
   */
  constructor(
    private readonly usersService: UserService,
    private readonly tokensService: TokensService,
  ) {}

  /**
   * @param { SignupInput } signupInput
   * @returns { Promise<AuthTokens> } returns access and refresh tokens
   */
  public async signupLocal(signupInput: SignupInput): Promise<AuthTokens> {
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
