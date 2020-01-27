const express = require('express')
const Series = require('../models/serie')

const jwt = require('jsonwebtoken')
const jwtSecret = 'abc123abc123abc123'

const router = express.Router()

router.use(async (req, res, next) => {
  const token = req.headers['x-access-token'] || req.body.token || req.query.token
  if (token) {
    try {
      jwt.verify(token, jwtSecret, (err, payload) => {
        if (err) {
          throw new Error(err)
        }
        next()
      })
    } catch (error) {
      res.send({ success: false })
    }
  } else {
    res.send({ success: false })
  }
})

router.get('/', async (req, res) => {
  const series = await Series.find({})
  res.send(series)
})

router.get('/:id', async (req, res) => {
  const serie = await Series.findById(req.params.id)
  res.send(serie)
})

router.post('/', async (req, res) => {
  try {
    const series = await Series.create(req.body)
    res.send(series)
  } catch (e) {
    res.send(Object.keys(e.errors))
  }
})

router.put('/:id', async (req, res) => {
  try {
    const result = await Series.findByIdAndUpdate(req.params.id, req.body)
    res.send(result)
  } catch (e) {
    res.send(Object.keys(e.errors))
  }
})

router.delete('/:id', async (req, res) => {
  try {
    const result = await Series.findByIdAndDelete(req.params.id)
    res.send(result)
  } catch (e) {
    res.send(Object.keys(e.errors))
  }
})

module.exports = router