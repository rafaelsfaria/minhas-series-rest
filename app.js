const bodyParser = require('body-parser')
const jwt = require('jsonwebtoken')
const cors = require('cors')
const Yaml = require('yamljs')
const swaggerUi = require('swagger-ui-express')
const express = require('express')

const User = require('./models/user')
const series = require('./routes/series')
const users = require('./routes/users')

const jwtSecret = 'abc123abc123abc123'

const swaggerDoc = Yaml.load('./swagger.yaml')

const app = express()

app.use(bodyParser.json())
app.use(cors({
  origin: (origin, callback) => {
    // if (origin === 'http://server2:8080') {
      callback(null, true)
    // } else {
    //   callback(new Error('origin not allowed'), false)
    // }
  }
}))
app.use('/series', series)
app.use('/users', users)
app.use('/docs', swaggerUi.serve, swaggerUi.setup(swaggerDoc))
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

module.exports = app