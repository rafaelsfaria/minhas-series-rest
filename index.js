const mongoose = require('mongoose')

const User = require('./models/user')
const app = require('./app')

const port = process.env.PORT || 3000
const mongo = process.env.MONGO || 'mongodb://localhost/minhas-series-rest'

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


mongoose
  .connect(mongo, { useUnifiedTopology: true, useNewUrlParser:true, useFindAndModify: false })
  .then(async () => await createInitialUser())
  .then(() => app.listen(port, () => console.log('listening on', port)))