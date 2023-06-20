const express = require('express')

const bodyParser = require('body-parser')

// Generate random id
const { randomBytes } = require('crypto')
const cors = require('cors')
const axios = require('axios')

const app = express()

/**
 * bodyParser.json() is a middleware provided by the body-parser package. It parses the JSON data in the request body and attaches it to the req.body property.
 */
app.use(bodyParser.json());

/**
 * If we are not adding cors here, then the client (runs on port 3000) which request server (runs on port 4000)
 * Then the request becomes failed because of the cors issue  
 */
app.use(cors())

/** 
 * For now we store posts in "in-memory". So, on app restart the previously saved post will be gone
*/
const posts = {}

app.get('/posts', (req, res) => {
    res.send(posts)
})

app.post('/posts', async (req, res) => {
    const id = randomBytes(4).toString('hex');

    const { title } = req.body;

    // Store information (title) into the posts
    posts[id] = {
        id, title
    }

    // Async operation
    await axios.post('http://localhost:4005/events', {
        type: 'PostCreated',
        data: {
            id, title
        }
    })

    res.status(201).send(posts[id])
})

app.post('/events', (req, res) => {
    console.log('Received Event', req.body.type)

    res.send({})
})

/** Express application listen on port 4000 */
app.listen(4000, () => {
    console.log('Listening on 4000')
})