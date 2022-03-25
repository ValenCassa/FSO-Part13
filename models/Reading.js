const { Model, DataTypes } = require('sequelize')
const { sequelize } = require('../utils/db')

class ReadingBlogs extends Model {}

ReadingBlogs.init({
    id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true
    },
    user_id: {
        type: DataTypes.INTEGER,
        allowNull: true,
        references: { model: 'users', key: 'id' }
    },
    blog_id: {
        type: DataTypes.INTEGER,
        allowNull: true,
        references: { model: 'blogs', key: 'id' }
    },
    read: {
        type: DataTypes.BOOLEAN,
        defaultValue: false
    }
}, {
    sequelize,
    underscored: true,
    timestamps: false,
    modelName: 'reading_blog'
})

module.exports = ReadingBlogs