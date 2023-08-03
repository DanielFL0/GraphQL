import { v4 as uuidv4 } from 'uuid';
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
        published: true,
        author: '1'
    },
    {
        id: '2',
        title: 'Profiling GraphQL APIs',
        body: 'Learn how to measure the performance of your GraphQL API',
        published: true,
        author: '1'
    },
    {
        id: '3',
        title: 'Testing GraphQL APIs',
        body: 'Learn how to test your GraphQL APIs',
        published: true,
        author: '2'
    }
];

// Demo comment data
const comments = [
    {
        id: '1',
        text: 'Nice blog post',
        author: '1',
        post: '1'
    },
    {
        id: '2',
        text: 'Your writing style is amazing',
        author: '1',
        post: '2'
    },
    {
        id: '3',
        text: 'Nice information',
        author: '2',
        post: '2'
    },
    {
        id: '4',
        text: 'GraphQL is amazing',
        author: '3',
        post: '3'
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
        users(query: String): [User!]!
        post: Post!
        posts(query: String): [Post!]!
        comment: Comment!
        comments(query: String): [Comment!]!
    }
    type Mutation {
        createUser(name: String!, email: String!, age: Int): User!
        createPost(title: String!, body: String!, published: Boolean!, author: ID!): Post!
        createComment(text: String!, author: ID!, post: ID!): Comment!

    }
    type User {
        id: ID!
        name: String!
        email: String!
        age: Int
        posts: [Post!]!
        comments: [Comment!]!
    }
    type Post {
        id: ID!
        title: String!
        body: String!
        published: Boolean!
        author: User!
        comments: [Comment!]!
    }
    type Comment {
        id: ID!
        text: String!
        author: User!
        post: Post!
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
                const isTitleMatch =  post.title.toLowerCase().includes(args.query.toLowerCase());
                const isBodyMatch =  post.body.toLowerCase().includes(args.query.toLowerCase());
                return isTitleMatch || isBodyMatch;
            });
        },
        comment() {
            return comments[0];
        },
        comments(parent, args, ctx, info) {
            if (!args.query) {
                return comments;
            }
            return comments.filter((comment) => {
                const isIdMatch = (comment.id === args.query);
                const isTextMatch = comment.text.toLowerCase().includes(args.query.toLowerCase());
                return isIdMatch || isTextMatch;
            })
        }
    },
    Mutation: {
        createUser(parent, args, ctx, info) {
            const emailTaken = users.some((user) => {
                return user.email === args.email;
            });
            if (emailTaken) {
                throw new Error('Email taken');
            }
            const user = {
                id: uuidv4(),
                name: args.name,
                email: args.email,
                age: args.age
            };
            users.push(user);
            return user;
        },
        createPost(parent, args, ctx, info) {
            const userExists = users.some((user) => { 
                return user.id === args.author;
            });
            if (!userExists) {
                throw new Error('User not found');
            }
            const post = {
                id: uuidv4(),
                title: args.title,
                body: args.body,
                published: args.published,
                author: args.author
            };
            posts.push(post);
            return post;
        },
        createComment(parent, args, ctx, info) {
            const userExists = users.some((user) => {
                return user.id === args.author;
            });
            const postExists = posts.some((post) => {
                return post.id === args.post;
            });
            if (!userExists) {
                throw new Error('User not found');
            }
            if (!postExists) {
                throw new Error('Post not found');
            }
            const comment = {
                id: uuidv4(),
                text: args.text,
                author: args.author,
                post: args.post
            };
            comments.push(comment);
            return comment;
        }
    },
    User: {
        posts(parent, args, ctx, info) {
            return posts.filter((post) => {
                return post.author === parent.id;
            });
        },
        comments(parent, args, ctx, info) {
            return comments.filter((comment) => {
                return comment.author === parent.id;
            });
        }
    },
    Post: {
        author(parent, args, ctx, info) {
            return users.find((user) => {
                return user.id === parent.author;
            });
        },
        comments(parent, args, ctx, info) {
            return comments.filter((comment) => {
                return comment.post === parent.id;
            });
        }
    },
    Comment: {
        author(parent, args, ctx, info) {
            return users.find((user) => {
                return user.id === parent.author;
            });
        },
        post(parent, args, ctx, info) {
            return posts.find((post) => {
                return post.id === parent.post;
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