const subscription = {
    post: {
        subscribe(parent, args, ctx, info) {
            return ctx.pubsub.subscribe('post');
        },
        resolve: payload => payload
    },
    comment: {
        subscribe(parent, args, ctx, info) {
            const post = ctx.db.posts.find((post) => {
                return post.id === args.id && post.published;
            });
            if (!post) {
                throw new Error('Post not found');
            }
            return ctx.pubsub.subscribe(`comment ${post.id}`);
        },
        resolve: payload => payload
    }
};

export { subscription as default };