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
        title: String!
        price: Float!
        releaseYear: Int
        rating: Float
        inStock: Boolean!
    }
`;

// Resolvers
const resolvers = {
    Query: {
        title() {
            return 'Gaming PC I7 RTX 4090 64GB RAM';
        },
        price() {
            return 1299.99;
        },
        releaseYear() {
            return 2023;
        },
        rating() {
            return 9.5;
        },
        inStock() {
            return true;
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