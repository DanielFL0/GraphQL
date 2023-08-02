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
        greeting(name: String, position: String): String!
        add(x: Int!, y: Int!): Int!
        grades: [Int!]!
        me: User!
        post: Post!
    }

    type User {
        id: ID!
        name: String!
        email: String!
        age: Int
    }

    type Post {
        id: ID!
        title: String!
        body: String!
        published: Boolean!
    }
`;

// Resolvers
const resolvers = {
    Query: {
        greeting(parent, args, ctx, info) {
            console.log(args);
            if (args.name) {
                return `Hello, ${args.name}! You're my favorite ${args.position}`;
            } else {
                return 'Hello!';
            }
        },
        add(parent, args, ctx, info) {
            return args.x + args.y;
        },
        grades(parent, args, ctx, info) {
            return [99, 80, 93];
        },
        me() {
            return {
                id: '1',
                name: 'Dosan',
                email: 'josedanielsaldana@gmail.com',
                age: 24
            };
        },
        post() {
            return {
                id: '1',
                title: 'Hacking GraphQL',
                body: 'Experimental GraphQL',
                published: true
            };
        }
    }
};

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