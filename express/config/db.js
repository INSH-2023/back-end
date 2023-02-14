if (process.env.NODE_ENV !== 'production') { 
    require('dotenv').config(); 
} 

const {Sequelize, DataTypes} = require('sequelize')

const sequelize = new Sequelize(
    process.env.MYSQL_DATABASE,
    process.env.MYSQL_USER,
    process.env.MYSQL_PASSWORD, {
        host: process.env.MYSQL_HOST,
        dialect: 'mysql',
        operatorsAliases: false,
        pool: {
            max: 5,
            min: 0,
            acquire: 30000,
            idle: 10000
        }
    }
)

sequelize.authenticate()
.then(() => {
    console.log('MySQL successfully connected!')
}).catch(err => {
    console.log('Error connect = ' + err)
})

const connection = {}

connection.Sequelize = Sequelize
connection.sequelize = sequelize

connection.users = require('../models/Users')(sequelize, DataTypes)
connection.requests = require('../models/Requests')(sequelize, DataTypes)
connection.items = require('../models/Items')(sequelize, DataTypes)

connection.sequelize.sync({ force: false })
.then(() => {
    console.log('yes re-sync done!')
})

module.exports = connection