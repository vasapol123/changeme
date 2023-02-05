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
    }),
    ConfigModule.forRoot({
      isGlobal: true,
      envFilePath: '.env',
    }),
    AuthModule,
    PrismaModule,
  ],
  providers: [AppResolver, AppService],
})
export class AppModule {}
