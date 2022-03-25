const blogsRouter = require('express').Router()
const { Blog, User } = require('../models/index')
const middleware = require('../middleware/middleware')
const { Op } = require('@sequelize/core')

const blogFinder = async (req, res, next) => {
    req.blog = await Blog.findByPk(req.params.id, {
        attributes: { exclude: ['read'] },
        include: [
            {
                model: User,
                as: 'users_reading',
                attributes: { exclude: ['passowordHash'] },
                through: {
                    attributes: []
                }
            }
        ]
    })
    next()
}

const userFinder = async (req, res, next) => {
    const user = await User.findByPk(req.decodedToken.id)
    const userData = JSON.parse(JSON.stringify(user))
    
    if (userData.disabled) {
        return res.status(401).json({ error: 'User disabled' })
    } else {
        req.user = user
    }

    next()
}

blogsRouter.get('/', async (req, res) => {
    const where = {}

    if (req.query.search) {
        where.title = {
            [Op.substring]: req.query.search
        }
    }

    const blogs = await Blog.findAll({
        order: [
            ['likes', 'DESC']
        ],
        attributes: { exclude: ['userId', 'read'] },
        include: {
            model: User,
            attributes: ['name', 'username']
        },
        where, 
    })
    
    res.json(blogs)
})

blogsRouter.post('/', middleware.tokenExtractor, userFinder, async (req, res) => {

    const user = req.user
    const blog = await Blog.create({ ...req.body, userId: user.id })

    res.json(blog)

})

blogsRouter.get('/:id', blogFinder, async (req, res) => {
    res.json(req.blog)
})

blogsRouter.delete('/:id', blogFinder, middleware.tokenExtractor, userFinder, async (req, res) => {
    if (req.blog.userId === req.decodedToken.id || req.user.admin) {  
        await req.blog.destroy()
    }

    res.status(204).end()
})

blogsRouter.put('/:id', blogFinder, middleware.tokenExtractor, userFinder, async (req, res) => {

    if (req.blog.userId === req.decodedToken.id) {
        req.blog.likes = req.body.likes
        await req.blog.save()
        res.json(req.blog)
    } else {
        res.status(400).json({ error: 'Users do not match' })
    } 

})

module.exports = blogsRouter