const { DataTypes } = require('sequelize')

module.exports = {
    up: async ({ context: querytInterface }) => {
        await querytInterface.addColumn('users', 'disabled', {
            type: DataTypes.BOOLEAN,
            allowNull: false,
            defaultValue: false
        }),
        await querytInterface.addColumn('users', 'admin', {
            type: DataTypes.BOOLEAN,
            allowNull: false,
            defaultValue: false
        })
    },
    down: async({ context: querytInterface }) => {
        await querytInterface.removeColumn('users', 'disabled')
        await querytInterface.removeColumn('users', 'disabled')
    }
}