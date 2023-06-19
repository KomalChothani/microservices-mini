const express = require('express')

const bodyParser = require('body-parser')
const { randomBytes } = require('crypto')
const cors = require('cors')
const axios = require('axios')

const app = express()
app.use(bodyParser.json())
app.use(cors())

/**
 * For now we store commentsByPostId in "in-memory". So, on app restart the previously saved comments will be gone
 * 
 * commentByPostId: 
       {
            ['post-id1']: 
                [
                    { 
                        id: 'comment-id1,
                        content: 'great post,
                    },
                      { 
                        id: 'comment-id2,
                        content: 'neat post,
                    }
                ],
            ['post-id2']: 
                [
                    { 
                        id: 'comment-id3,
                        content: 'Informative post,
                    },
                      { 
                        id: 'comment-id4,
                        content: 'Good post,
                    }
                ]  
        }
*/
const commentsByPostId = {}

app.get('/posts/:id/comments', (req, res) => {
    res.send(commentsByPostId[req.params.id] || [])
})

app.post('/posts/:id/comments', async (req, res) => {
    const commentId = randomBytes(4).toString('hex')
    const { content } = req.body

    /**
     * Verify that post id is already present in commentsByPostId. if yes return comments array else return [] array
     */
    const comments = commentsByPostId[req.params.id] || []

    /** 
     * Push the comments
     * 
     * In this approach we store the status of comment
    */
    comments.push({ id: commentId, content, status: 'pending' })

    commentsByPostId[req.params.id] = comments

    // Send the comment data to Query service
    await axios.post('http://localhost:4005/events', {
        type: 'CommentCreated',
        data: {
            id: commentId,
            content,
            postId: req.params.id,
            status: 'pending'
        }
    })

    res.status(201).send(comments)
})

/**
 * Handle the commentModerated event (Moderation Service ----> Comments Service)
 */
app.post('/events', async (req, res) => {
    console.log('Event Received ---> Comments', req.body.type)

    const { type, data } = req.body

    if (type === 'CommentModerated') {
        const { postId, id, status, content } = data

        console.log('postId ---> CommentModerated', postId)
        
        const comments = commentsByPostId[postId]
        console.log('comments ---> CommentModerated', comments)
        const comment = comments.find(comment => comment.id === id)
        
        console.log('comment in ---> comments', comment)
        comment.status = status

        /** Send it to the query service */
        await axios.post('http://localhost:4005/events', {
            type: 'CommentUpdated',
            data: {
                id, content, postId, status
            }
        })
    }

    res.send({})
})

app.listen(4001, () => {
    console.log('Listening on 4001')
})
