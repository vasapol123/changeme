import { Module } from '@nestjs/common';
import { TokensModule } from '../tokens/tokens.module';
import { UsersModule } from '../users/users.module';
import AuthResolver from './auth.resolver';
import AuthService from './auth.service';

@Module({
  imports: [UsersModule, TokensModule],
  providers: [AuthResolver, AuthService],
})
export class AuthModule {}
