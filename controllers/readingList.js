const readingRouter = require('express').Router()
const { ReadingBlogs } = require('../models/index')
const middleware = require('../middleware/middleware')

readingRouter.post('/', middleware.tokenExtractor, async (req, res) => {
    const read_blog = await ReadingBlogs.create(req.body)
    res.json(read_blog)
})
module.exports = readingRouter