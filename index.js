const express = require('express')
const mongoose = require('mongoose')
const bodyParser = require('body-parser')
const jwt = require('jsonwebtoken')
const cors = require('cors')

const User = require('./models/user')
const series = require('./routes/series')
const users = require('./routes/users')

const port = process.env.PORT || 3000
const mongo = process.env.MONGO || 'mongodb://localhost/minhas-series-rest'
const jwtSecret = 'abc123abc123abc123'

const app = express()

app.use(bodyParser.json())
app.use(cors({
  origin: (origin, callback) => {
    if (origin === 'http://server2:8080') {
      callback(null, true)
    } else {
      callback(new Error('origin not allowed'), false)
    }
  }
}))
app.use('/series', series)
app.use('/users', users)

const createInitialUser = async () => {
  const total = await User.countDocuments({})
  if(total === 0) {
    await User.create({
      username: 'rafael',
      password: '123456',
      roles: ['restrito', 'admin']
    })
    await User.create({
      username: 'rafael2',
      password: '123456',
      roles: ['restrito']
    })
  }
}

app.post('/auth', async (req, res) => {
  const user = req.body
  const userDb = await User.findOne({ username: user.username })
  if (userDb) {
    if (user.password === userDb.password) {
      const payload = {
        id: userDb.id,
        username: userDb.username,
        roles: userDb.roles
      }
      jwt.sign(payload, jwtSecret, (err, token) => {
        res.send({
          token,
          success: true
        })
      })
    } else {
      res.send({
        success: false,
        message: 'wrong credentials'
      })
    }
  } else {
    res.send({
      success: false,
      message: 'wrong credentials'
    })
  }
})

mongoose
  .connect(mongo, { useUnifiedTopology: true, useNewUrlParser:true, useFindAndModify: false })
  .then(async () => await createInitialUser())
  .then(() => app.listen(port, () => console.log('listening on', port)))