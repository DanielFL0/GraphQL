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

const db = {
    users,
    posts,
    comments
};

export { db as default};