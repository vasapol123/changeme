import cors from 'cors';
import http from 'http';
import express from 'express';
import bodyParser from 'body-parser';
import { ApolloServer } from '@apollo/server';
import { expressMiddleware } from '@apollo/server/express4';
import { ApolloServerPluginDrainHttpServer } from '@apollo/server/plugin/drainHttpServer';
import config from './config/index';

async function bootstrap() {
  const app = express();
  const httpServer = http.createServer(app);

  // The GraphQL schema
  const typeDefs = `#graphql
    type Query {
      hello: String
    }
  `;

  // A map of functions which return data for the schema.
  const resolvers = {
    Query: {
      hello: () => 'world',
    },
  };

  const server = new ApolloServer({
    typeDefs,
    resolvers,
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
