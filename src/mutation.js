import { v4 as uuidv4 } from 'uuid';

const mutation = {
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
};

export { mutation as default };