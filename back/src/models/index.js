const { Sequelize } = require('sequelize');
const process = require('process');
const env = process.env.NODE_ENV || 'development';
const config = require(__dirname + '/../../config/database.js')[env];

const sequelize = new Sequelize(config.database, config.username, config.password, config);

sequelize.authenticate()
    .then(() => console.log('Database connected!'))
    .catch(err => console.error('Database connection error:', err));

module.exports = sequelize;
