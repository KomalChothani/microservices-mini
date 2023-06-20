const express = require('express')
const bodyParser = require('body-parser')

const cors = require('cors')
const app = express()

app.use(bodyParser.json())
app.use(cors())


/**
   posts: {
    'post-id': {
        id: 'post-id',
        title: 'Post Title',
        comments: [
            { id: 'comment-id', content: 'comment1' },
            { id: 'comment-id1', content: 'comment2' }
        ],
    },
    'post-id1': {
        id: 'post-id1',
        title: 'Post Title1',
        comments: [
            { id: 'comment-id2', content: 'comment3' },
            { id: 'comment-id3', content: 'comment4' }
        ],
    }
   }
 */
const posts = {}


// Provide full listing of posts + comments
app.get('/posts', (req, res) => {
    res.send(posts)
})

// Return the PostCreated & CommentCreated Event with data
app.post('/events', (req, res) => {
    const { type, data } = req.body

    if (type === 'PostCreated') {
        const { id, title } = data

        posts[id] = { id, title, comments: [] }
    }

    if (type === 'CommentCreated') {
        const { id, content, postId } = data

        const post = posts[postId]
        post.comments.push({ id, content })
    }

    console.log('posts', posts)
    res.send({})
})

app.listen(4002, () => {
    console.log('Listening on 4002')
})