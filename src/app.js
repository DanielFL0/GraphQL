import { ApolloServer } from '@apollo/server';
import { startStandaloneServer } from '@apollo/server/standalone';

const typeDefinitions = `#graphql
  type Query {
    greeting: String
  }
`;

const resolvers = {
  Query: {
    greeting: () => {
      return 'Hello, World!';
    }
  }
};

const server = new ApolloServer({
  typeDefs: typeDefinitions,
  resolvers: resolvers
});

const info = await startStandaloneServer(server, {listen: {
  port: 9000
}});
console.log(`Server running at ${info.url}`);