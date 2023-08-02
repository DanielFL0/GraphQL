import { createSchema, createYoga } from 'graphql-yoga';
import { createServer } from 'http';

/*
 * Scalar Types
 * String
 * Boolean
 * Int
 * Float
 * ID
 */

// Type definitions (schema)
const typeDefinitions = `
    type Query {
        id: ID!
        name: String!
        age: Int!
        online: Boolean!
        currency: Float!
    }
`;

// Resolvers
const resolvers = {
    Query: {
        id() {
            return '1';
        },
        name() {
            return 'Dosan';
        },
        age() {
            return 24;
        },
        online() {
            return true;
        },
        currency() {
            return 1337.0
        }
    }
}

// Schema
const schema = createSchema({
    typeDefs: typeDefinitions,
    resolvers: resolvers
});

const yoga = createYoga({
    schema: schema
});

const server = createServer(yoga);

server.listen(4000, () => {
    console.info('Server is running on http://localhost:4000/graphql');
})