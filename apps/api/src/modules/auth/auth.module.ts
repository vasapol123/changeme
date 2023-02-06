import { Module } from '@nestjs/common';
import { GqlAccessTokenGuard } from 'src/common/guards/access-token.guard';
import { TokensModule } from '../tokens/tokens.module';
import { UsersModule } from '../users/users.module';
import AuthResolver from './auth.resolver';
import AuthService from './auth.service';
import { AccessTokenStrategy } from './strategies/access-token.strategy';
import { RefreshTokenStrategy } from './strategies/refresh-token.strategy';

@Module({
  imports: [UsersModule, TokensModule],
  providers: [
    AuthResolver,
    AuthService,
    AccessTokenStrategy,
    RefreshTokenStrategy,
  ],
})
export class AuthModule {}
