const jwt = require('jsonwebtoken')
const loginRouter = require('express').Router()
const { User } = require('../models/index')
const bcrypt = require('bcrypt')

loginRouter.post('/', async (req, res) => {
    const body = req.body

    const user = await User.findOne({
        where: {
            username: body.username
        }
    })

    const passwordCorrect = user === null
        ? false
        : await bcrypt.compare(body.password, user.passwordHash)

    if(!(user && passwordCorrect)) {
        return res.status(401).json({ error: 'Invalid username or password' })
    }

    const userForToken = {
        username: user.username,
        id: user.id
    }

    const token = jwt.sign(
        userForToken,
        process.env.SECRET,
        { expiresIn: 60*60 }

    )

    res.status(200).send({ token, username: user.username, name: user.name })
})

module.exports = loginRouter