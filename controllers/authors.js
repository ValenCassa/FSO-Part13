const authorsRouter = require('express').Router()
const { sequelize } = require('../models/Blog')
const { Blog } = require('../models/index')


authorsRouter.get('/', async (req, res) => {
    const authors = await Blog.findAll({
        attributes: [
            'author',
            [sequelize.fn('COUNT', sequelize.col('author')), 'blogs'],
            [sequelize.fn('SUM', sequelize.col('likes')), 'likes']
        ],
        group: 'author',
        order: [
            ['likes', 'DESC']
        ]
    })

    res.json(authors)
})

module.exports = authorsRouter