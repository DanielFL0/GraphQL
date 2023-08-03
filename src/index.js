import { v4 as uuidv4 } from 'uuid';
import { createSchema, createYoga } from 'graphql-yoga';
import { createServer } from 'http';

import db from './db.js';

/*
 * Scalar Types
 * String
 * Boolean
 * Int
 * Float
 * ID
 */

// Type definitions
const typeDefinitions = `
    type Query {
        users(query: String): [User!]!
        posts(query: String): [Post!]!
        comments(query: String): [Comment!]!
    }
    type Mutation {
        createUser(data: CreateUserInput): User!
        deleteUser(id: ID!): User!
        createPost(data: CreatePostInput): Post!
        deletePost(id: ID!): Post!
        createComment(data: CreateCommentInput): Comment!
        deleteComment(id: ID!): Comment!
    }
    input CreateUserInput {
        name: String!
        email: String!
        age: Int
    }
    input CreatePostInput {
        title: String!
        body: String!
        published: Boolean!
        author: ID!
    }
    input CreateCommentInput {
        text: String!
        author: ID!
        post: ID!
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
        users(parent, args, ctx, info) {
            if (!args.query) {
                return ctx.db.users;
            }
            return ctx.db.users.filter((user) => {
                return user.name.toLowerCase().includes(args.query.toLowerCase());
            });
        },
        posts(parent, args, ctx, info) {
            if (!args.query) {
                return ctx.db.posts;
            }
            return ctx.db.posts.filter((post) => {
                const isTitleMatch =  post.title.toLowerCase().includes(args.query.toLowerCase());
                const isBodyMatch =  post.body.toLowerCase().includes(args.query.toLowerCase());
                return isTitleMatch || isBodyMatch;
            });
        },
        comments(parent, args, ctx, info) {
            if (!args.query) {
                return ctx.db.comments;
            }
            return ctx.db.comments.filter((comment) => {
                const isIdMatch = (comment.id === args.query);
                const isTextMatch = comment.text.toLowerCase().includes(args.query.toLowerCase());
                return isIdMatch || isTextMatch;
            })
        }
    },
    Mutation: {
        createUser(parent, args, ctx, info) {
            const emailTaken = ctx.db.users.some((user) => {
                return user.email === args.data.email;
            });
            if (emailTaken) {
                throw new Error('Email taken');
            }
            const user = {
                id: uuidv4(),
                name: args.data.name,
                email: args.data.email,
                age: args.data.age
                /*
                 * id: uuidv4(),
                 * ...args
                 */
            };
            ctx.db.users.push(user);
            return user;
        },
        deleteUser(parent, args, ctx, info) {
            const userIndex = ctx.db.users.findIndex((user) => {
                return user.id === args.id;
            });
            if (userIndex === -1) {
                throw new Error('User not found');
            }
            const deletedUsers = ctx.db.users.splice(userIndex, 1);
            posts = ctx.db.posts.filter((post) => {
                const match = post.author === args.id;
                if (match) {
                    comments = comments.filter((comment) => {
                        return comment.post !== post.id;
                    });
                }
                return !match;
            });
            comments = ctx.db.comments.filter((comment) => {
                return comment.author !== args.id;
            });
            return deletedUsers[0];
        },
        createPost(parent, args, ctx, info) {
            const userExists = ctx.db.users.some((user) => { 
                return user.id === args.data.author;
            });
            if (!userExists) {
                throw new Error('User not found');
            }
            const post = {
                id: uuidv4(),
                title: args.data.title,
                body: args.data.body,
                published: args.data.published,
                author: args.data.author
                /*
                 * id: uuidv4(),
                 * ...args
                 */
            };
            ctx.db.posts.push(post);
            return post;
        },
        deletePost(parent, args, ctx, info) {
            const postIndex = ctx.db.posts.findIndex((post) => {
                return post.id === args.id;
            });
            if (postIndex === -1) {
                throw new Error('Post not found');
            }
            const deletedPosts = ctx.db.posts.splice(postIndex, 1);
            comments = ctx.db.comments.filter((comment) => {
                const match = comment.post === args.id;
                return !match;
            });
            return deletedPosts[0];
        },
        createComment(parent, args, ctx, info) {
            const userExists = ctx.db.users.some((user) => {
                return user.id === args.data.author;
            });
            const postExists = ctx.db.posts.some((post) => {
                return post.id === args.data.post && post.published;
            });
            if (!userExists) {
                throw new Error('User not found');
            }
            if (!postExists) {
                throw new Error('Post not found');
            }
            const comment = {
                id: uuidv4(),
                text: args.data.text,
                author: args.data.author,
                post: args.data.post
                /*
                 * id: uuidv4(),
                 * ...args
                 */
            };
            ctx.db.comments.push(comment);
            return comment;
        },
        deleteComment(parent, args, ctx, info) {
            const commentIndex = ctx.db.comments.findIndex((comment) => {
                return comment.id === args.id;
            });
            if (commentIndex === -1) {
                throw new Error('Comment not found');
            }
            const deletedComments = ctx.db.comments.splice(commentIndex, 1);
            return deletedComments[0];
        }
    },
    User: {
        posts(parent, args, ctx, info) {
            return ctx.db.posts.filter((post) => {
                return post.author === parent.id;
            });
        },
        comments(parent, args, ctx, info) {
            return ctx.db.comments.filter((comment) => {
                return comment.author === parent.id;
            });
        }
    },
    Post: {
        author(parent, args, ctx, info) {
            return ctx.db.users.find((user) => {
                return user.id === parent.author;
            });
        },
        comments(parent, args, ctx, info) {
            return ctx.db.comments.filter((comment) => {
                return comment.post === parent.id;
            });
        }
    },
    Comment: {
        author(parent, args, ctx, info) {
            return ctx.db.users.find((user) => {
                return user.id === parent.author;
            });
        },
        post(parent, args, ctx, info) {
            return ctx.db.posts.find((post) => {
                return post.id === parent.post;
            });
        }
    }
};

// Schema
const schema = createSchema({
    typeDefs: typeDefinitions,
    resolvers: resolvers,
});

const yoga = createYoga({
    schema: schema,
    context: {
        db: db
    }
});

const server = createServer(yoga);

server.listen(4000, () => {
    console.info('Server is running on http://localhost:4000/graphql');
})