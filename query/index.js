const express = require('express')
const bodyParser = require('body-parser')
const cors = require('cors')
const axios = require('axios')

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

const handleEvent = (type, data) => {
    if (type === 'PostCreated') {
        const { id, title } = data

        posts[id] = { id, title, comments: [] }
    }

    if (type === 'CommentCreated') {
        const { id, content, postId, status } = data

        const post = posts[postId]
        post.comments.push({ id, content, status })
    }

    if (type === 'CommentUpdated') {
        const { id, content, postId, status } = data
        const post = posts[postId]
        const comment = post.comments.find(comment => comment.id === id)

        comment.status = status
        comment.content = content
    }
}

// Provide full listing of posts + comments
app.get('/posts', (req, res) => {
    res.send(posts)
})

// Return the PostCreated, CommentCreated & CommentUpdated Event with data
app.post('/events', (req, res) => {
    const { type, data } = req.body
    handleEvent(type, data)
    res.send({})
})

app.listen(4002, async () => {
    console.log('Listening on 4002')

    /** 
     * This is the process to deal with missing data. When we start the query service it gets the all data 
     * which store into the event-bus event store
     * 
    */
    const res = await axios.get('http://localhost:4005/events')

    for (let event of res.data) {
        console.log('Processing Event', event.type)

        handleEvent(event.type, event.data)
    }
})