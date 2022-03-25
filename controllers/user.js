const usersRouter = require('express').Router()
const { User, Blog, ReadingBlogs} = require('../models/index')
const bcrypt = require('bcrypt')
const middleware = require('../middleware/middleware')

const userFinder = async (req, res, next) => {
    req.user = await User.findByPk(req.params.id)

    next()
}

const adminCheck = async (req, res, next) => {
    const user = await User.findByPk(req.decodedToken.id)
    const userData = JSON.parse(JSON.stringify(user))
    
    if (!userData.admin) {
        return res.status(401).json({ error: 'Not authorized' })
    } else {
        req.admin = user
    }

    next()
}

usersRouter.get('/', async (req, res) => {
    const users = await User.findAll({
        include: [
            {
                model: Blog,
                attributes: { exclude: ['userId'] }
            }
        ],
    })
    res.json(users)
})

usersRouter.post('/', async (req, res) => {
    const body = req.body
    const saltRounds = 10

    if (body.password.length >= 3) {
        const passwordHash = await bcrypt.hash(body.password, saltRounds)

        const user = await User.create({ username: body.username, name: body.name, passwordHash })

        res.json(user)
    } else {
        res.status(400).json({ error: 'Passoword must be at least 3 characteres long' })
    }
})

usersRouter.get('/:id', async (req, res) => {
    const where = {
        user_id: req.params.id
    }

    console.log(req.query.reading)

    const user = await User.findByPk(req.params.id, {
        attributes: { exclude: [''] },
        include: [
            {
                model: Blog,
                attributes: { exclude: ['userId'] }
            },
            
            {
                model: Blog,
                as: 'reading',
                attributes: { exclude: ['userId'] },
                through: {
                    attributes: []
                },
                include: {
                    model: ReadingBlogs,
                    where,
                    attributes: ['read', 'id']
                }
            } 
        ]
    })

    /* Lazy loading, I tried to include another model but the docs do not say a thing about it 

    let readings = undefined
    if(req.query.reading) {
        readings = await user.getReading({
            joinTableAttributes: [],
            include: {
                model: ReadingBlogs,
                where,
                attributes: ['read', 'id']
            }
        })
    } */

    res.json(user)
})

usersRouter.put('/:id', middleware.tokenExtractor, adminCheck, userFinder, async (req, res) => {
    req.user.disabled = req.body.disabled
    await req.user.save()
    res.json(req.user)
})

module.exports = usersRouter