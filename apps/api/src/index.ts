import cors from 'cors';
import http from 'http';
import path from 'path';
import express from 'express';
import bodyParser from 'body-parser';
import { ApolloServer } from '@apollo/server';
import { expressMiddleware } from '@apollo/server/express4';
import { ApolloServerPluginDrainHttpServer } from '@apollo/server/plugin/drainHttpServer';
import { loadSchema } from '@graphql-tools/load';
import { GraphQLFileLoader } from '@graphql-tools/graphql-file-loader';
import { addResolversToSchema } from '@graphql-tools/schema';

import config from './config/index';

async function bootstrap() {
  const app = express();
  const httpServer = http.createServer(app);

  const resolvers = {
    Query: {
      users: () => [{ name: 'me' }],
    },
  };

  const schema = await loadSchema(
    path.join(__dirname, './app/graphql/schema.graphql'),
    {
      loaders: [new GraphQLFileLoader()],
    },
  );

  const schemaWithResolvers = addResolversToSchema({ schema, resolvers });

  const server = new ApolloServer({
    schema: schemaWithResolvers,
    plugins: [ApolloServerPluginDrainHttpServer({ httpServer })],
  });
  await server.start();

  app.use(cors(), bodyParser.json(), expressMiddleware(server));

  await new Promise((resolve: any) =>
    httpServer.listen({ port: config.APP_PORT }, resolve),
  );
  console.log(`🚀 Server ready at http://localhost:${config.APP_PORT}`);
}

bootstrap();
