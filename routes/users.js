const express = require('express')
const User = require('../models/user')

const jwt = require('jsonwebtoken')
const jwtSecret = 'abc123abc123abc123'

const router = express.Router()

router.use(async (req, res, next) => {
  const token = req.headers['x-access-token'] || req.body.token || req.query.token
  if (token) {
    try {
      jwt.verify(token, jwtSecret, {}, (err, obj) => {
        if (err) {
          throw new Error(err)
        }
        if (obj.roles.includes('admin')) {
          next()
        } else {
          throw new Error('not an admin')
        }
      })
    } catch (error) {
      res.send({ success: false })
    }
  } else {
    res.send({ success: false })
  }
})

router.get('/', async (req, res) => {
  const users = await User.find({})
  res.send(users)
})


module.exports = router