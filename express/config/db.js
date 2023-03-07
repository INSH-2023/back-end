if (process.env.NODE_ENV !== 'production') { 
    require('dotenv').config(); 
} 

const {Sequelize, DataTypes} = require('sequelize')

const sequelize = new Sequelize(
    process.env.MYSQLDB_DATABASE||'moral_it_device',
    process.env.MYSQLDB_USER||'root',
    process.env.MYSQLDB_PASSWORD||'Moral122022', {
    host: process.env.MYSQLDB_HOST||'localhost',
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
connection.problems = require('../models/Problems')(sequelize, DataTypes)
connection.solutions = require('../models/Solution/Solutions')(sequelize, DataTypes)
connection.steps= require('../models/Solution/Steps')(sequelize, DataTypes)

connection.solutions.hasMany(connection.steps, {
    foreignKey: 'solutionId',
    as: 'steps'
})

connection.solutions.belongsTo(connection.solutions, {
    foreignKey: 'solutionId',
    as: 'solution'
})

connection.sequelize.sync({ force: false })
.then(() => {
    console.log('yes re-sync done!')
})

module.exports = connection