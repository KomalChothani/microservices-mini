const express = require('express')
const bodyParser = require('body-parser')
const axios = require('axios')

const app = express()
app.use(bodyParser.json())


/** 
 * Store all incoming events here (Event store)
 * 
 * This is a best approach to deal with missing events
 * 
 * Note: In real world project the event storing process is very difficult. Here provide only small example on how we can handle the missing event
 */
const events = []


app.post('/events', (req, res) => {
    const event = req.body

    events.push(event)

    // Here the catch part is needed if you've 15+ node version 
    axios.post('http://localhost:4000/events', event).catch((err) => console.log(err.message))
    axios.post('http://localhost:4001/events', event).catch((err) => console.log(err.message))
    axios.post('http://localhost:4002/events', event).catch((err) => console.log(err.message))
    axios.post('http://localhost:4003/events', event).catch((err) => console.log(err.message))

    res.send({ status: 'OK' })
})

app.get('/events', (req, res) => {
    res.send(events)
})

/** Express application listen on port 4005 */
app.listen(4005, () => {
    console.log('Listening on 4005')
})
