const query = {
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
};

export { query as default };