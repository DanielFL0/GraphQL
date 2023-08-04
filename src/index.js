import { createSchema, createYoga } from 'graphql-yoga';
import { createServer } from 'http';

import db from './db.js';
import query from './query.js';
import mutation from './mutation.js';
import user from './user.js';
import post from './post.js';
import comment from './comment.js';

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
        updateUser(id: ID!, data: UpdateUserInput): User!
        deleteUser(id: ID!): User!
        createPost(data: CreatePostInput): Post!
        updatePost(id: ID!, data: UpdatePostInput): Post!
        deletePost(id: ID!): Post!
        createComment(data: CreateCommentInput): Comment!
        updateComment(id: ID!, data: UpdateCommentInput): Comment!
        deleteComment(id: ID!): Comment!
    }
    input CreateUserInput {
        name: String!
        email: String!
        age: Int
    }
    input UpdateUserInput{
        name: String
        email: String
        age: Int
    }
    input CreatePostInput {
        title: String!
        body: String!
        published: Boolean!
        author: ID!
    }
    input UpdatePostInput {
        title: String
        body: String
        published: Boolean
        author: ID
    }
    input CreateCommentInput {
        text: String!
        author: ID!
        post: ID!
    }
    input UpdateCommentInput {
        text: String
        author: ID
        post: ID
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

// Schema
const schema = createSchema({
    typeDefs: typeDefinitions,
    resolvers: {
        Query: query,
        Mutation: mutation,
        User: user,
        Post: post,
        Comment: comment
    }
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