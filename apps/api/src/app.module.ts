import path from 'path';
import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { GraphQLModule } from '@nestjs/graphql';
import { ApolloDriver, ApolloDriverConfig } from '@nestjs/apollo';
import { ApolloServerPluginLandingPageLocalDefault } from 'apollo-server-core';
import { AppResolver } from './app.resolver';
import { AppService } from './app.service';
import { AuthModule } from './modules/auth/auth.module';
import PrismaModule from './modules/prisma/prisma.module';
import { GqlAccessTokenGuard } from './common/guards/access-token.guard';
import { APP_GUARD } from '@nestjs/core';

@Module({
  imports: [
    GraphQLModule.forRoot<ApolloDriverConfig>({
      driver: ApolloDriver,
      playground: false,
      sortSchema: true,
      autoSchemaFile: path.join(process.cwd(), '__generated__/schema.gql'),
      plugins: [ApolloServerPluginLandingPageLocalDefault()],
      buildSchemaOptions: {
        dateScalarMode: 'isoDate',
      },
      context: ({ req }) => ({ req }),
    }),
    ConfigModule.forRoot({
      isGlobal: true,
      envFilePath: '.env',
    }),
    AuthModule,
    PrismaModule,
  ],
  providers: [
    {
      provide: APP_GUARD,
      useClass: GqlAccessTokenGuard,
    },
    AppResolver,
    AppService,
  ],
})
export class AppModule {}
