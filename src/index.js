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
        hello: String!
        name: String!
        location: String!
        bio: String!
    }
`;

// Resolvers
const resolvers = {
    Query: {
        hello() {
            return 'Hello, World!';
        },
        name() {
            return 'Dosan';
        },
        location() {
            return 'Monterrey, Nuevo Leon';
        },
        bio() {
            return 'Software Engineer @ Softtek | Problem solving';
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