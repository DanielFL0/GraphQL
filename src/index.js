import { createSchema, createYoga } from 'graphql-yoga';
import { createServer } from 'http';

// Demo user data
const users = [
    {
        id: '1',
        name: 'Dosan',
        email: 'josedanielsaldana@gmail.com'
    },
    {
        id: '2',
        name: 'Jeb',
        email: 'jeb@gmail.com'
    },
    {
        id: '3',
        name: 'Notch',
        email: 'notch@gmail.com'
    },
];

// Demo post data
const posts = [
    {
        id: '1',
        title: 'Building a GraphQL compiler',
        body: 'Learn how to lex and parse GraphQL',
        published: true
    },
    {
        id: '2',
        title: 'Profiling GraphQL APIs',
        body: 'Learn how to measure the performance of your GraphQL API',
        published: true
    },
    {
        id: '3',
        title: 'Testing GraphQL APIs',
        body: 'Learn how to test your GraphQL APIs',
        published: true
    }
];

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
        add(numbers: [Float!]!): Float!
        grades: [Int!]!
        user: User!
        users(query: String!): [User!]!
        post: Post!
        posts(query: String!): [Post!]!
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
            if (args.numbers.length === 0) {
                return 0;
            }
            return args.numbers.reduce((idx, cur) => {
                return idx + cur;
            });
        },
        grades(parent, args, ctx, info) {
            return [99, 80, 93];
        },
        user() {
            return users[0];
        },
        users(parent, args, ctx, info) {
            if (!args.query) {
                return users;
            }
            return users.filter((user) => {
                return user.name.toLowerCase().includes(args.query.toLowerCase());
            });
        },
        post() {
            return posts[0];
        },
        posts(parent, args, ctx, info) {
            if (!args.query) {
                return posts;
            }
            return posts.filter((post) => {
                return post.title.toLowerCase().includes(args.query.toLowerCase());
            });
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