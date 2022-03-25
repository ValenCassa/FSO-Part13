
const Blog = require('./Blog')
const User = require('./Users')
const ReadingBlogs = require ('./Reading')


User.hasMany(Blog)
Blog.belongsTo(User)

User.belongsToMany(Blog, { through: ReadingBlogs, as: 'reading' })
Blog.belongsToMany(User, { through: ReadingBlogs, as: 'users_reading' })

Blog.hasMany(ReadingBlogs)
ReadingBlogs.belongsTo(Blog)

module.exports = {
    User,
    Blog,
    ReadingBlogs
}