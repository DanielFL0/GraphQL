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
    updateUser(parent, args, ctx, info) {
        const user = ctx.db.users.find((user) => {
            return user.id === args.id;
        });
        if (!user) {
            throw new Error('User not found');
        }
        if (typeof args.data.email === 'string') {
            const emailTaken = ctx.db.users.some((user) => {
                return user.email === args.data.email;
            });
            if (emailTaken) {
                throw new Error('Email taken');
            }
            user.email = args.data.email;
        }
        if (typeof args.data.name === 'string') {
            user.name = args.data.name;
        }
        if (typeof args.data.age !== 'undefined') {
            user.age = args.data.age;
        }
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
    updatePost(parent, args, ctx, info) {
        const post = ctx.db.posts.find((post) => {
            return post.id === args.id;
        });
        if (!post) {
            throw new Error('Post not found');
        }
        if (typeof args.data.title === 'string') {
            post.title = args.data.title;
        }
        if (typeof args.data.body === 'string') {
            post.body = args.data.body;
        }
        if (typeof args.data.published === 'boolean') {
            post.published = args.data.published;
        }
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
    updateComment(parent, args, ctx, info) {
        const comment = ctx.db.comments.find((comment) => {
            return comment.id === args.id;
        });
        if (!comment) {
            throw new Error('Comment not found');
        }
        if (typeof args.data.text === 'string') {
            comment.text = args.data.text;
        }
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